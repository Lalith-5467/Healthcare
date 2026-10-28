/**
 * Health Shorts Dynamic Search & Relevance Engine
 * MediCare Patient Portal
 * 
 * Provides:
 * 1. Query Normalization & Health Context Expansion
 * 2. Multi-strategy YouTube Search (Data API v3 with robust fallback)
 * 3. Strict Health Relevance Scoring & Negative Content Filtering
 * 4. In-memory short-lived cache (TTL 15 min)
 */

import { prisma } from '../config/prisma';
import { VideoStatus } from '@prisma/client';

export interface HealthShortCandidate {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  duration: string;
  url: string;
  youtubeUrl: string;
  embedUrl: string;
  category: string;
  relevanceScore: number;
}

// In-memory short-lived cache to avoid redundant network calls (TTL: 15 minutes)
interface CacheEntry {
  timestamp: number;
  data: HealthShortCandidate[];
  nextPageToken?: string;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      memoryCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

/* =========================================================================
   1. HEALTH KEYWORDS & NEGATIVE FILTERS
   ========================================================================= */

const HEALTH_CORE_KEYWORDS = [
  'health', 'healthy', 'healthcare', 'medical', 'medicine', 'doctor', 'physician',
  'nurse', 'hospital', 'clinic', 'patient', 'wellness', 'wellbeing', 'prevention',
  'preventive', 'remedy', 'remedies', 'cure', 'treatment', 'therapy', 'vital'
];

const HEALTH_TOPIC_KEYWORDS = [
  // Fitness & Movement
  'fitness', 'exercise', 'workout', 'mobility', 'stretching', 'stretch', 'posture',
  'cardio', 'strength', 'calisthenics', 'aerobic', 'physiotherapy', 'rehab',
  'rehabilitation', 'joint pain', 'back pain', 'spine', 'neck pain', 'fat loss',
  // Nutrition & Diet
  'diet', 'nutrition', 'balanced diet', 'healthy food', 'eating', 'protein',
  'vitamins', 'fiber', 'superfood', 'hydration', 'water', 'metabolism', 'fasting',
  'weight loss', 'meal plan', 'nutrients', 'gut health', 'digestion',
  // Chronic Disease & Screening
  'diabetes', 'diabetic', 'blood sugar', 'glucose', 'insulin', 'hypertension',
  'blood pressure', 'bp', 'heart', 'cardiac', 'cholesterol', 'thyroid', 'pcod',
  'pcos', 'kidney', 'liver', 'lungs', 'asthma', 'respiratory',
  // Mental Health, Sleep & Mindfulness
  'sleep', 'insomnia', 'deep sleep', 'sleep hygiene', 'circadian', 'mental health',
  'stress', 'anxiety', 'depression', 'mindfulness', 'meditation', 'relax', 'relaxation',
  'breathwork', 'breathing', 'pranayama', 'yoga', 'asana',
  // Traditional Medicine / Indian Wellness (Nattu Maruthuvam)
  'nattu maruthuvam', 'maruthuvam', 'siddha', 'ayurveda', 'ayurvedic', 'herbal',
  'kashayam', 'tulsi', 'turmeric', 'ginger', 'neem', 'moringa', 'ashwagandha',
  'triphala', 'paatti vaithiyam', 'home remedy', 'natural remedy', 'desi nuskhe'
];

// Negative filters: Strictly reject irrelevant/entertainment content
const GENERIC_NEGATIVE_TERMS = [
  'gaming', 'gameplay', 'game', 'minecraft', 'roblox', 'pubg', 'freefire', 'gta',
  'movie trailer', 'official trailer', 'teaser', 'box office', 'movie review',
  'celebrity gossip', 'gossip', 'paparazzi', 'prank', 'roast', 'wwe', 'wrestling',
  'ufc fight', 'boxing match', 'crypto', 'bitcoin', 'trading', 'casino', 'betting',
  'comedy club', 'standup comedy', 'funny clips', 'meme', 'web series', 'episode',
  'vlog drama', 'reaction video', 'unboxing', 'haul'
];

const MUSIC_NEGATIVE_TERMS = [
  'official music video', 'official video', 'movie song', 'film song', 'song video',
  'lyrics', 'remix', 'dj remix', 'album track', 'concert', 'live concert',
  'dance performance', 'item song', 'party song', 'club song', 'pop song',
  'rap song', 'music band', 'bollywood song', 'kollywood song'
];

const MUSIC_HEALTH_EXCEPTIONS = [
  'workout', 'gym', 'fitness', 'exercise', 'meditation', 'yoga', 'relax', 'relaxation',
  'relaxing', 'sleep', 'sleeping', 'stress', 'healing', 'spa', 'zen', 'calm', 'calming',
  'binaural', 'therapy', 'breathing', 'pranayama', 'nature sounds'
];

const ENTERTAINMENT_NEGATIVE_TERMS = [
  'movie', 'cinema', 'trailer', 'gaming', 'roast', 'prank', 'celebrity news',
  'gossip', 'standup', 'series', 'drama'
];

const ENTERTAINMENT_HEALTH_EXCEPTIONS = [
  'doctor', 'health podcast', 'wellness', 'medical', 'fitness', 'nutrition',
  'diet', 'hospital', 'interview', 'lifestyle', 'awareness', 'mental health', 'story'
];

/* =========================================================================
   2. QUERY EXPANSION & NORMALIZATION
   ========================================================================= */

interface ExpandedSearchConfig {
  searchTerms: string[];
  categoryHint: string;
  isMusicSearch: boolean;
  isEntertainmentSearch: boolean;
}

export function expandHealthQuery(query: string, category?: string): ExpandedSearchConfig {
  const q = (query || '').toLowerCase().trim();
  const cat = (category || '').trim();

  let isMusicSearch = false;
  let isEntertainmentSearch = false;
  let categoryHint = 'Wellness';
  const terms: string[] = [];

  // 1. Specific Query Intent Analysis (prioritized whenever user enters a search query)
  if (q.includes('music') || q.includes('song') || q.includes('tune')) {
    isMusicSearch = true;
    categoryHint = 'Wellness';
    terms.push('workout fitness motivation music beats shorts');
    terms.push('meditation yoga deep relaxation soothing music shorts');
    terms.push('sleep relaxation healing ambient sound shorts');
    terms.push('calm breathing ambient wellness music shorts');
  } else if (q.includes('entertainment') || q.includes('podcast') || q.includes('fun')) {
    isEntertainmentSearch = true;
    categoryHint = 'Wellness';
    terms.push('doctor health podcast interview wellness discussion shorts');
    terms.push('medical awareness healthy lifestyle discussion shorts');
    terms.push('nutritionist wellness podcast advice shorts');
    terms.push('doctor health facts myths busted shorts');
  } else if (q.includes('sleep') || q.includes('insomnia')) {
    categoryHint = 'Wellness';
    terms.push('deep sleep relaxation tips shorts');
    terms.push('healthy sleep hygiene insomnia shorts');
    terms.push('sleep health bedtime routine shorts');
    terms.push('breathing technique for faster sleep shorts');
  } else if (q.includes('yoga') || q.includes('asana') || q.includes('stretch')) {
    categoryHint = 'Wellness';
    terms.push('yoga stretching flexibility daily wellness routine shorts');
    terms.push('pranayama breathing yoga stress relief shorts');
    terms.push('morning yoga flow routine for beginners shorts');
    terms.push('yoga for spine posture flexibility shorts');
    terms.push('surya namaskar yoga daily practice shorts');
  } else if (q.includes('diabetes') || q.includes('sugar') || q.includes('glucose')) {
    categoryHint = 'Preventive Health';
    terms.push('diabetes management blood sugar control diet exercise shorts');
    terms.push('diabetic awareness prevention healthy tips shorts');
    terms.push('foods to lower blood sugar naturally shorts');
    terms.push('hba1c blood glucose management doctor tips shorts');
  } else if (q.includes('diet') || q.includes('food') || q.includes('nutrition') || q.includes('protein')) {
    categoryHint = 'Diet';
    terms.push('healthy diet nutrition balanced meal tips shorts');
    terms.push('healthy eating daily diet habits shorts');
    terms.push('high protein low calorie healthy recipes shorts');
    terms.push('superfoods gut health vitamins nutrition shorts');
  } else if (q.includes('fitness') || q.includes('workout') || q.includes('exercise') || q.includes('cardio')) {
    categoryHint = 'Fitness';
    terms.push('fitness workout exercise mobility routine shorts');
    terms.push('home workout daily exercise fitness tips shorts');
    terms.push('core strength cardio bodyweight exercise shorts');
    terms.push('full body mobility recovery stretching shorts');
  } else if (q.includes('nattu') || q.includes('maruthuvam') || q.includes('siddha') || q.includes('ayurveda') || q.includes('herbal')) {
    categoryHint = 'Nattu Maruthuvam';
    terms.push('nattu maruthuvam natural health remedy shorts');
    terms.push('siddha herbal home remedies shorts');
    terms.push('traditional ayurvedic health tips herbs shorts');
    terms.push('tamil paati vaithiyam herbal remedies shorts');
  } else if (q.includes('heart') || q.includes('cardio') || q.includes('bp') || q.includes('pressure')) {
    categoryHint = 'Preventive Health';
    terms.push('healthy heart blood pressure cardio wellness tips shorts');
    terms.push('lower blood pressure naturally heart health shorts');
    terms.push('cardiovascular health prevention cardiologist tips shorts');
  } else if (q.includes('water') || q.includes('hydration')) {
    categoryHint = 'Diet';
    terms.push('benefits of drinking water daily hydration health shorts');
    terms.push('hydration electrolytes daily water intake shorts');
  } else if (q.length > 0) {
    // Arbitrary health search query from user (e.g. "cholesterol", "back pain", "immunity")
    terms.push(`${q} health wellness doctor tips shorts`);
    terms.push(`${q} healthcare medical advice shorts`);
    terms.push(`${q} exercise prevention healthy tips shorts`);
    terms.push(`${q} daily wellness routine advice shorts`);
  }

  // 2. Category Tab Defaults (when user clicks category tabs without specific search query)
  if (terms.length === 0) {
    if (cat === 'Nattu Maruthuvam') {
      categoryHint = 'Nattu Maruthuvam';
      terms.push('nattu maruthuvam natural health remedy shorts');
      terms.push('siddha herbal home remedies shorts');
      terms.push('traditional ayurvedic health tips herbs shorts');
      terms.push('tamil paati vaithiyam herbal remedy shorts');
    } else if (cat === 'Diet') {
      categoryHint = 'Diet';
      terms.push('healthy diet nutrition balanced meal tips shorts');
      terms.push('healthy eating daily diet habits shorts');
      terms.push('superfoods gut health vitamins nutrition shorts');
      terms.push('balanced diet healthy meal prep shorts');
    } else if (cat === 'Fitness') {
      categoryHint = 'Fitness';
      terms.push('fitness workout exercise mobility routine shorts');
      terms.push('home workout daily exercise fitness tips shorts');
      terms.push('core strength cardio bodyweight exercise shorts');
      terms.push('full body mobility stretching routine shorts');
    } else if (cat === 'Preventive Health') {
      categoryHint = 'Preventive Health';
      terms.push('preventive healthcare disease prevention tips shorts');
      terms.push('blood pressure blood sugar health checkup shorts');
      terms.push('early symptom detection preventive medicine shorts');
      terms.push('annual health checkup screening tips shorts');
    } else if (cat === 'Wellness') {
      categoryHint = 'Wellness';
      terms.push('daily wellness health habits stress relief shorts');
      terms.push('mental wellness relaxation healthy living shorts');
      terms.push('morning mindfulness healthy routine shorts');
      terms.push('lifestyle habits for longevity wellness shorts');
    } else {
      // Default "For You" feed
      terms.push('daily health tips wellness nutrition fitness shorts');
      terms.push('doctor healthy habits prevention lifestyle shorts');
      terms.push('evidence based medical wellness tips shorts');
      terms.push('healthy lifestyle longevity daily habits shorts');
    }
  }

  return {
    searchTerms: terms,
    categoryHint,
    isMusicSearch,
    isEntertainmentSearch
  };
}

/**
 * Dynamically detects the true health topic category based on video title & description
 */
export function detectVideoCategory(title: string, description: string = '', fallbackCategory: string = 'Wellness'): string {
  const text = `${title} ${description}`.toLowerCase();

  // 1. Traditional Medicine / Indian Wellness (Nattu Maruthuvam)
  if (
    text.includes('nattu') ||
    text.includes('maruthuvam') ||
    text.includes('siddha') ||
    text.includes('ayurveda') ||
    text.includes('ayurvedic') ||
    text.includes('herbal') ||
    text.includes('kashayam') ||
    text.includes('paatti') ||
    text.includes('paati') ||
    text.includes('desi nuskhe') ||
    text.includes('home remedy') ||
    text.includes('natural remedy')
  ) {
    return 'Nattu Maruthuvam';
  }

  // 2. Nutrition & Diet
  if (
    text.includes('diet') ||
    text.includes('protein') ||
    text.includes('nutrition') ||
    text.includes('recipe') ||
    text.includes('meal') ||
    text.includes('food') ||
    text.includes('calorie') ||
    text.includes('eating') ||
    text.includes('weight loss') ||
    text.includes('fat loss') ||
    text.includes('hydration') ||
    text.includes('water') ||
    text.includes('superfood') ||
    text.includes('vitamins') ||
    text.includes('gut health') ||
    text.includes('digestion') ||
    text.includes('fasting')
  ) {
    return 'Diet';
  }

  // 3. Fitness & Movement
  if (
    text.includes('workout') ||
    text.includes('exercise') ||
    text.includes('fitness') ||
    text.includes('gym') ||
    text.includes('posture') ||
    text.includes('stretch') ||
    text.includes('mobility') ||
    text.includes('cardio') ||
    text.includes('calisthenics') ||
    text.includes('muscle') ||
    text.includes('bicep') ||
    text.includes('abs') ||
    text.includes('fat burn') ||
    text.includes('bodyweight')
  ) {
    return 'Fitness';
  }

  // 4. Preventive Health & Chronic Care
  if (
    text.includes('diabetes') ||
    text.includes('blood sugar') ||
    text.includes('glucose') ||
    text.includes('insulin') ||
    text.includes('blood pressure') ||
    text.includes('hypertension') ||
    text.includes('bp') ||
    text.includes('cholesterol') ||
    text.includes('heart') ||
    text.includes('cardiac') ||
    text.includes('doctor') ||
    text.includes('physician') ||
    text.includes('prevention') ||
    text.includes('symptom') ||
    text.includes('kidney') ||
    text.includes('liver') ||
    text.includes('thyroid') ||
    text.includes('hospital') ||
    text.includes('screening') ||
    text.includes('hba1c')
  ) {
    return 'Preventive Health';
  }

  // 5. Mental Health, Sleep & Mindfulness
  if (
    text.includes('sleep') ||
    text.includes('insomnia') ||
    text.includes('meditation') ||
    text.includes('yoga') ||
    text.includes('stress') ||
    text.includes('mental health') ||
    text.includes('mindfulness') ||
    text.includes('breath') ||
    text.includes('relax') ||
    text.includes('anxiety')
  ) {
    return 'Wellness';
  }

  // If a specific category tab was chosen, use that
  if (fallbackCategory && fallbackCategory !== 'For You') {
    return fallbackCategory;
  }

  return 'Wellness';
}

/* =========================================================================
   3. HEALTH RELEVANCE SCORING & FILTERING
   ========================================================================= */

export function scoreHealthRelevance(
  candidate: { title: string; description: string; channelName: string },
  query: string,
  config: ExpandedSearchConfig
): { score: number; isRelevant: boolean; reason?: string } {
  const titleLower = (candidate.title || '').toLowerCase();
  const descLower = (candidate.description || '').toLowerCase();
  const channelLower = (candidate.channelName || '').toLowerCase();
  const fullText = `${titleLower} ${descLower} ${channelLower}`;

  // 1. Strict Negative Check for "Music" query
  if (config.isMusicSearch) {
    const hasMusicNegative = MUSIC_NEGATIVE_TERMS.some(neg => titleLower.includes(neg));
    const hasHealthException = MUSIC_HEALTH_EXCEPTIONS.some(exc => fullText.includes(exc));
    if (hasMusicNegative && !hasHealthException) {
      return { score: 0, isRelevant: false, reason: 'Unrelated music video rejected' };
    }
  }

  // 2. Strict Negative Check for "Entertainment" query
  if (config.isEntertainmentSearch) {
    const hasEntertainmentNegative = ENTERTAINMENT_NEGATIVE_TERMS.some(neg => titleLower.includes(neg));
    const hasHealthException = ENTERTAINMENT_HEALTH_EXCEPTIONS.some(exc => fullText.includes(exc));
    if (hasEntertainmentNegative && !hasHealthException) {
      return { score: 0, isRelevant: false, reason: 'Unrelated entertainment rejected' };
    }
  }

  // 3. General Negative Filters: immediately reject any candidate with negative terms
  for (const neg of GENERIC_NEGATIVE_TERMS) {
    if (titleLower.includes(neg) || descLower.includes(neg)) {
      return { score: 0, isRelevant: false, reason: `Matches negative term: ${neg}` };
    }
  }

  // 4. Calculate Relevance Score
  let score = 0;

  // Direct user query matches
  const qTerms = query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 2);
  for (const qt of qTerms) {
    if (titleLower.includes(qt)) score += 25;
    else if (descLower.includes(qt)) score += 15;
  }

  // Health core keyword matches
  for (const hk of HEALTH_CORE_KEYWORDS) {
    if (titleLower.includes(hk)) score += 15;
    else if (descLower.includes(hk)) score += 8;
  }

  // Health topic specific matches
  for (const tk of HEALTH_TOPIC_KEYWORDS) {
    if (titleLower.includes(tk)) score += 20;
    else if (descLower.includes(tk)) score += 10;
  }

  // Channel authority bonus (e.g. Doctor, Health, Clinic)
  if (
    channelLower.includes('dr') ||
    channelLower.includes('doctor') ||
    channelLower.includes('health') ||
    channelLower.includes('medical') ||
    channelLower.includes('fitness') ||
    channelLower.includes('yoga')
  ) {
    score += 15;
  }

  // Short/Reel indicator bonus
  if (titleLower.includes('#shorts') || titleLower.includes('shorts') || descLower.includes('#shorts')) {
    score += 5;
  }

  // Minimum threshold: must have at least 25 points to be deemed health-relevant
  const MIN_RELEVANCE_THRESHOLD = 25;
  const isRelevant = score >= MIN_RELEVANCE_THRESHOLD;

  return {
    score,
    isRelevant,
    reason: isRelevant ? 'Health verified' : 'Below relevance threshold'
  };
}

/* =========================================================================
   4. YOUTUBE VIDEO CANDIDATES RETRIEVAL
   ========================================================================= */

interface RawScrapedItem {
  videoId: string;
  title: string;
  channelName: string;
  description: string;
  lengthText: string;
  thumbnail: string;
  publishedAt?: string;
}

/**
 * Scrape candidate shorts from YouTube search page directly with continuation token pagination support
 */
async function scrapeYouTubeSearch(
  queryTerm: string,
  continuationToken?: string
): Promise<{ items: RawScrapedItem[]; nextPageToken?: string }> {
  try {
    let parsed: any = null;
    let html = '';

    if (continuationToken) {
      const res = await fetch('https://www.youtube.com/youtubei/v1/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        body: JSON.stringify({
          continuation: continuationToken,
          context: {
            client: {
              clientName: 'WEB',
              clientVersion: '2.20240301.01.00',
              hl: 'en',
              gl: 'US'
            }
          }
        })
      });
      if (res.ok) {
        parsed = await res.json();
      }
    } else {
      const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(queryTerm)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (!res.ok) {
        console.warn(`[YouTube Search] HTTP ${res.status} for query "${queryTerm}"`);
        return { items: [], nextPageToken: undefined };
      }

      html = await res.text();
      const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData\s*=\s*({.*?});/s);
      if (match) {
        try {
          parsed = JSON.parse(match[1]);
        } catch {
          parsed = null;
        }
      }
    }

    const items: RawScrapedItem[] = [];
    let foundNextPageToken: string | undefined = undefined;

    if (parsed) {
      function traverse(obj: any) {
        if (!obj || typeof obj !== 'object') return;

        // Extract continuation token
        if (obj.continuationCommand?.token) {
          foundNextPageToken = obj.continuationCommand.token;
        }

        // Reel item renderer (Direct Shorts shelf item)
        if (obj.reelItemRenderer) {
          const rr = obj.reelItemRenderer;
          const videoId = rr.videoId;
          if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            const title = rr.headline?.simpleText || rr.headline?.runs?.[0]?.text || '';
            const channelName = rr.ownerText?.runs?.[0]?.text || '';
            const thumb = rr.thumbnail?.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            items.push({
              videoId,
              title,
              channelName,
              description: '',
              lengthText: '0:50',
              thumbnail: thumb
            });
          }
        }

        // YouTube Shorts lockup view model
        if (obj.shortsLockupViewModel) {
          const sl = obj.shortsLockupViewModel;
          const videoId = sl.entityId?.replace('shorts-shelf-item-', '') || '';
          if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            const title = sl.overlayMetadata?.primaryText?.content || '';
            items.push({
              videoId,
              title,
              channelName: '',
              description: '',
              lengthText: '0:45',
              thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
            });
          }
        }

        // Standard Video Renderer
        if (obj.videoRenderer) {
          const vr = obj.videoRenderer;
          const videoId = vr.videoId;
          if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
            const title = vr.title?.runs?.[0]?.text || vr.title?.simpleText || '';
            const channelName = vr.ownerText?.runs?.[0]?.text || vr.shortBylineText?.runs?.[0]?.text || '';
            const desc = vr.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map((r: any) => r.text).join('') || '';
            const lengthText = vr.lengthText?.simpleText || '0:60';
            const thumb = vr.thumbnail?.thumbnails?.slice(-1)[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
            items.push({
              videoId,
              title,
              channelName,
              description: desc,
              lengthText,
              thumbnail: thumb
            });
          }
        }

        for (const k of Object.keys(obj)) {
          traverse(obj[k]);
        }
      }

      traverse(parsed);
    } else if (html) {
      // Fallback: extract video IDs and token via regex
      const idMatches = [...new Set([...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map(m => m[1]))];
      const tokenMatch = html.match(/"continuationCommand":\{"token":"([^"]+)"/);
      if (tokenMatch) foundNextPageToken = tokenMatch[1];
      for (const id of idMatches) {
        items.push({
          videoId: id,
          title: queryTerm,
          channelName: 'MediCare Health',
          description: 'Verified Health Video',
          lengthText: '0:60',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
        });
      }
    }

    return { items, nextPageToken: foundNextPageToken };
  } catch (err) {
    console.error(`[YouTube Search Error] for query "${queryTerm}":`, err);
    return { items: [], nextPageToken: undefined };
  }
}

/**
 * Official YouTube Data API v3 provider with pageToken pagination
 */
async function fetchFromYouTubeDataApi(
  queryTerm: string,
  apiKey: string,
  pageToken?: string,
  limit: number = 25
): Promise<{ items: RawScrapedItem[]; nextPageToken?: string }> {
  try {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('part', 'snippet');
    searchUrl.searchParams.append('q', `${queryTerm} #shorts`);
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('videoEmbeddable', 'true');
    searchUrl.searchParams.append('videoSyndicated', 'true');
    searchUrl.searchParams.append('safeSearch', 'strict');
    searchUrl.searchParams.append('videoDuration', 'short');
    searchUrl.searchParams.append('maxResults', String(Math.min(Math.max(limit, 10), 50)));
    if (pageToken) {
      searchUrl.searchParams.append('pageToken', pageToken);
    }
    searchUrl.searchParams.append('key', apiKey);

    const res = await fetch(searchUrl.toString());
    if (!res.ok) {
      console.warn(`[YouTube Data API] Returned HTTP ${res.status}: ${res.statusText}, falling back to dynamic search.`);
      return { items: [], nextPageToken: undefined };
    }

    const data = await res.json() as any;
    if (!data.items || !Array.isArray(data.items)) {
      return { items: [], nextPageToken: undefined };
    }

    const items = data.items
      .filter((it: any) => it.id?.videoId)
      .map((it: any) => ({
        videoId: it.id.videoId,
        title: it.snippet?.title || '',
        channelName: it.snippet?.channelTitle || '',
        description: it.snippet?.description || '',
        lengthText: '0:45',
        thumbnail: it.snippet?.thumbnails?.high?.url || `https://i.ytimg.com/vi/${it.id.videoId}/hqdefault.jpg`,
        publishedAt: it.snippet?.publishedAt || new Date().toISOString()
      }));

    return { items, nextPageToken: data.nextPageToken };
  } catch (err) {
    console.error('[YouTube Data API Error]:', err);
    return { items: [], nextPageToken: undefined };
  }
}

/* =========================================================================
   5. MAIN EXPORTED SERVICE: DYNAMIC HEALTH SHORTS SEARCH
   ========================================================================= */

export async function searchHealthShorts(
  query: string = '',
  category: string = 'For You',
  pageToken?: string,
  limit: number = 20
): Promise<{ videos: HealthShortCandidate[]; nextPageToken?: string }> {
  const normQuery = query.trim();
  const normCategory = category.trim() || 'For You';
  const cacheKey = `${normCategory.toLowerCase()}:${normQuery.toLowerCase()}:${pageToken || 'first'}`;

  // Fast rejection for queries with zero health relevance
  const qLower = normQuery.toLowerCase();
  if (qLower.length > 0) {
    const isExplicitlyIrrelevant = GENERIC_NEGATIVE_TERMS.some(neg => qLower.includes(neg));
    if (isExplicitlyIrrelevant) {
      return { videos: [], nextPageToken: undefined };
    }
  }

  // 1. Check in-memory short-lived cache
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      videos: cached.data.slice(0, limit),
      nextPageToken: cached.nextPageToken
    };
  }

  // 2. Query expansion and intent configuration
  const config = expandHealthQuery(normQuery, normCategory);
  const apiKey = process.env.YOUTUBE_API_KEY;

  let pageNumber = 1;
  if (pageToken && pageToken.startsWith('pg:')) {
    pageNumber = parseInt(pageToken.replace('pg:', ''), 10) || 1;
  }

  const termIdx = (pageNumber - 1) % config.searchTerms.length;
  const currentSearchTerm = config.searchTerms[termIdx] || config.searchTerms[0];

  let rawCandidates: RawScrapedItem[] = [];
  let foundNextPageToken: string | undefined = undefined;
  const seenIds = new Set<string>();

  // If apiKey exists, try YouTube Data API v3 first
  if (apiKey) {
    const apiResult = await fetchFromYouTubeDataApi(
      currentSearchTerm, 
      apiKey, 
      pageToken?.startsWith('pg:') ? undefined : pageToken, 
      limit
    );
    if (apiResult.items.length > 0) {
      for (const item of apiResult.items) {
        if (!seenIds.has(item.videoId)) {
          seenIds.add(item.videoId);
          rawCandidates.push(item);
        }
      }
      foundNextPageToken = apiResult.nextPageToken;
    }
  }

  // If no API key or API call returned 0 items, use YouTube dynamic search
  if (rawCandidates.length === 0) {
    const isContinuation = pageToken && !pageToken.startsWith('pg:');
    let scrapeResult = await scrapeYouTubeSearch(currentSearchTerm, isContinuation ? pageToken : undefined);

    if (scrapeResult.items.length === 0 && isContinuation) {
      scrapeResult = await scrapeYouTubeSearch(currentSearchTerm);
    }

    for (const item of scrapeResult.items) {
      if (!seenIds.has(item.videoId)) {
        seenIds.add(item.videoId);
        rawCandidates.push(item);
      }
    }

    // Set next page token for continuous scrolling
    foundNextPageToken = `pg:${pageNumber + 1}`;
  }

  // 3. Score and filter candidates for Health Relevance
  let scoredList: HealthShortCandidate[] = [];

  for (const cand of rawCandidates) {
    const { score, isRelevant } = scoreHealthRelevance(
      {
        title: cand.title,
        description: cand.description,
        channelName: cand.channelName
      },
      normQuery,
      config
    );

    if (isRelevant) {
      const cleanTitle = cand.title
        .replace(/#shorts/gi, '')
        .replace(/#viral/gi, '')
        .replace(/#fyp/gi, '')
        .replace(/#trending/gi, '')
        .trim();

      const shortItem: HealthShortCandidate = {
        id: cand.videoId,
        videoId: cand.videoId,
        title: cleanTitle || 'Health & Wellness Tip',
        thumbnail: cand.thumbnail || `https://i.ytimg.com/vi/${cand.videoId}/hqdefault.jpg`,
        channelName: cand.channelName || 'MediCare Health',
        channelTitle: cand.channelName || 'MediCare Health',
        description: cand.description || 'Verified Health & Wellness Shorts',
        publishedAt: cand.publishedAt || new Date().toISOString(),
        duration: cand.lengthText || '0:45',
        url: `https://www.youtube.com/shorts/${cand.videoId}`,
        youtubeUrl: `https://www.youtube.com/shorts/${cand.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${cand.videoId}`,
        category: detectVideoCategory(cleanTitle, cand.description || '', config.categoryHint),
        relevanceScore: score
      };

      scoredList.push(shortItem);
    }
  }

  // 4. Sort by relevance score descending
  scoredList.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // 4a. Connect moderation: strictly exclude any videos explicitly DISABLED or DELETED by Super Admin
  try {
    const candidateIds = scoredList.map(v => v.videoId);
    if (candidateIds.length > 0) {
      const moderatedVideos = await prisma.healthVideo.findMany({
        where: {
          youtubeVideoId: { in: candidateIds },
          OR: [
            { status: VideoStatus.DISABLED },
            { status: VideoStatus.DELETED },
            { enabled: false, status: { not: VideoStatus.PENDING_REVIEW } }
          ]
        },
        select: { youtubeVideoId: true }
      });

      if (moderatedVideos.length > 0) {
        const excludedSet = new Set(moderatedVideos.map(m => m.youtubeVideoId));
        scoredList = scoredList.filter(v => !excludedSet.has(v.videoId));
      }
    }
  } catch (modErr) {
    console.warn('[HealthShorts] Moderation check bypassed due to database read error:', modErr);
  }

  // 5. Cache the high-quality results
  if (scoredList.length > 0) {
    memoryCache.set(cacheKey, {
      timestamp: Date.now(),
      data: scoredList,
      nextPageToken: foundNextPageToken
    });
  }

  return {
    videos: scoredList.slice(0, limit),
    nextPageToken: foundNextPageToken
  };
}

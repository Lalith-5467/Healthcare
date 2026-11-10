import { Request, Response } from 'express';
import { searchHealthShorts } from '../services/healthShorts.service';

/**
 * GET /api/health-shorts/search?q=fitness&category=Fitness&pageToken=...&limit=20
 * Dynamic Health Shorts Search Endpoint with Pagination
 */
export const searchHealthShortsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawQuery = typeof req.query.q === 'string' ? req.query.q : '';
    const rawCategory = typeof req.query.category === 'string' ? req.query.category : 'For You';
    const rawPageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken.trim() : undefined;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);

    // Sanitize query to prevent injection or abuse (max 100 characters)
    const sanitizedQuery = rawQuery.replace(/[<>{}\\]/g, '').slice(0, 100).trim();
    const sanitizedCategory = rawCategory.replace(/[<>{}\\]/g, '').slice(0, 50).trim();

    const result = await searchHealthShorts(sanitizedQuery, sanitizedCategory, rawPageToken, limit);

    res.status(200).json({
      success: true,
      query: sanitizedQuery,
      category: sanitizedCategory,
      count: result.videos.length,
      nextPageToken: result.nextPageToken,
      videos: result.videos
    });
  } catch (error) {
    console.error('[Health Shorts Search Controller Error]:', error);
    res.status(200).json({
      success: false,
      message: 'Health Shorts are temporarily unavailable. Please try again.',
      videos: []
    });
  }
};

const NON_HEALTH_TERMS = [
  'song', 'songs', 'movie', 'film', 'gana', 'status', 'lyrics', 'game', 'gaming', 'roblox',
  'trailer', 'pubg', 'dance', 'comedy', 'clip', 'drama', 'serials', 'episode', 'bhojpuri',
  'ringtone', 'dj', 'remix', 'chalisa', 'aarti', 'bhajan', 'cricket', 'football', 'fan',
  'pump', 'machine', 'gun', 'car', 'bike', 'motor', 'phone', 'unboxing', 'laptop', 'hack',
  'fight', 'wrestling', 'prank', 'box office', 'review', 'vlog', 'viral'
];

const HEALTH_CORE_STEMS = [
  'health', 'medic', 'doctor', 'patient', 'wellness', 'cure', 'remed', 'treat', 'therap',
  'fit', 'exercis', 'workout', 'diet', 'nutri', 'protein', 'weight', 'fat',
  'diabet', 'sugar', 'insulin', 'blood', 'bp', 'heart', 'cardiac', 'kidney',
  'liver', 'lung', 'pain', 'joint', 'spine', 'back', 'neck', 'knee', 'stomach', 'gut',
  'digest', 'breath', 'pranayam', 'yoga', 'asana', 'sleep', 'stress', 'mind', 'relax',
  'ayurved', 'siddha', 'nattu', 'maruthuvam', 'kashayam', 'herb', 'acupressure',
  'pressure point', 'symptom', 'eye', 'hair', 'skin', 'thyroid', 'cholesterol', 'vitamin',
  'immune', 'immunity', 'belly', 'posture', 'stretch', 'calorie', 'cleanse', 'detox',
  'cardio', 'mobility', 'acidity', 'constipation', 'headache', 'migraine', 'healing'
];

const isStrictlyHealthRelated = (term: string): boolean => {
  const t = term.toLowerCase().trim();
  if (!t || t.length < 3) return false;
  for (const nh of NON_HEALTH_TERMS) {
    if (t.includes(nh)) return false;
  }
  return HEALTH_CORE_STEMS.some(stem => t.includes(stem));
};

/**
 * GET /api/health-shorts/suggest?q=hand+pressure
 * YouTube Suggest Queries Endpoint for Real-time Search Autocomplete (Strict Health-Only)
 */
export const getHealthShortsSuggestionsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!rawQuery) {
      res.status(200).json({ success: true, suggestions: [] });
      return;
    }

    const sanitized = rawQuery.replace(/[<>{}\\]/g, '').slice(0, 60);

    // Fetch both direct query and health-scoped query to guarantee only medical/wellness results
    const urls = [
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(sanitized)}`,
      `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(sanitized + ' health')}`
    ];

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const fetchPromises = urls.map(url => 
      fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }).then(r => r.ok ? r.json() : null).catch(() => null)
    );

    const results = await Promise.all(fetchPromises);
    clearTimeout(timeout);

    const rawCandidates: string[] = [];
    results.forEach((data: any) => {
      if (Array.isArray(data?.[1])) {
        rawCandidates.push(...data[1]);
      }
    });

    // Strictly filter out any songs, movies, machines, games, and irrelevant YouTube searches
    const healthOnly = rawCandidates
      .filter(term => typeof term === 'string' && isStrictlyHealthRelated(term))
      .map(term => term.trim());

    const uniqueSuggestions = Array.from(new Set(healthOnly)).slice(0, 10);

    res.status(200).json({
      success: true,
      query: sanitized,
      suggestions: uniqueSuggestions
    });
  } catch (error) {
    res.status(200).json({ success: true, suggestions: [] });
  }
};

/**
 * GET /api/health-shorts/feed?category=Wellness&pageToken=...&limit=20
 * Dynamic Category Feed Endpoint with Pagination
 */
export const getHealthShortsFeedController = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawCategory = typeof req.query.category === 'string' ? req.query.category : 'For You';
    const rawPageToken = typeof req.query.pageToken === 'string' ? req.query.pageToken.trim() : undefined;
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 50);
    const sanitizedCategory = rawCategory.replace(/[<>{}\\]/g, '').slice(0, 50).trim();

    const result = await searchHealthShorts('', sanitizedCategory, rawPageToken, limit);

    res.status(200).json({
      success: true,
      category: sanitizedCategory,
      count: result.videos.length,
      nextPageToken: result.nextPageToken,
      videos: result.videos
    });
  } catch (error) {
    console.error('[Health Shorts Feed Controller Error]:', error);
    res.status(200).json({
      success: false,
      message: 'Health Shorts are temporarily unavailable. Please try again.',
      videos: []
    });
  }
};

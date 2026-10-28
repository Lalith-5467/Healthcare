import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Search, 
  ExternalLink, 
  AlertCircle,
  Check,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { healthShortsApi, type DynamicHealthShort } from '../../services/healthShortsApi';

export interface HealthShortsViewProps {
  onClose: () => void;
  patientHealthInfo?: string;
  initialVideoId?: string;
}

const CATEGORIES = [
  'For You',
  'Nattu Maruthuvam',
  'Diet',
  'Wellness',
  'Fitness',
  'Preventive Health'
] as const;

type CategoryTab = (typeof CATEGORIES)[number];

const getCategoryIcon = (category: string) => {
  if (category === 'Nattu Maruthuvam') return '🌿';
  if (category === 'Diet') return '🥗';
  if (category === 'Fitness') return '🏃';
  if (category === 'Preventive Health') return '🩺';
  return '💧';
};

const resolveVideoCategory = (video: DynamicHealthShort): string => {
  const text = `${video.title} ${video.description || ''}`.toLowerCase();
  if (
    text.includes('nattu') ||
    text.includes('maruthuvam') ||
    text.includes('siddha') ||
    text.includes('ayurveda') ||
    text.includes('ayurvedic') ||
    text.includes('herbal') ||
    text.includes('kashayam') ||
    text.includes('paatti') ||
    text.includes('paati')
  ) {
    return 'Nattu Maruthuvam';
  }
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
    text.includes('water')
  ) {
    return 'Diet';
  }
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
    text.includes('abs')
  ) {
    return 'Fitness';
  }
  if (
    text.includes('diabetes') ||
    text.includes('sugar') ||
    text.includes('glucose') ||
    text.includes('insulin') ||
    text.includes('blood pressure') ||
    text.includes('hypertension') ||
    text.includes('bp') ||
    text.includes('cholesterol') ||
    text.includes('heart') ||
    text.includes('cardiac') ||
    text.includes('doctor') ||
    text.includes('prevention') ||
    text.includes('symptom')
  ) {
    return 'Preventive Health';
  }
  if (
    text.includes('sleep') ||
    text.includes('meditation') ||
    text.includes('yoga') ||
    text.includes('stress') ||
    text.includes('mindfulness') ||
    text.includes('breath')
  ) {
    return 'Wellness';
  }
  if (video.category && video.category !== 'For You') {
    return video.category;
  }
  return 'Wellness';
};

const getDeterministicSocialCount = (id: string, multiplier: number, offset: number) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  return (Math.abs(hash) % multiplier) + offset;
};

export const HealthShortsView: React.FC<HealthShortsViewProps> = ({ 
  onClose, 
  initialVideoId 
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('For You');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [copiedToast, setCopiedToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tapFeedback, setTapFeedback] = useState<{ type: 'play' | 'pause'; id: number } | null>(null);

  // Dynamic API State & Pagination
  const [videos, setVideos] = useState<DynamicHealthShort[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Window width tracking for responsive layout calculation
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounce search query input (400ms delay) to avoid hammering the search endpoint
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Dynamically fetch health shorts when category or debounced query changes
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setSearchError(null);
    setNextPageToken(undefined);
    setHasMore(true);

    healthShortsApi.searchShorts(debouncedQuery, selectedCategory, undefined, 20)
      .then((data) => {
        if (isCancelled) return;
        const fetchedVideos = data.videos || [];
        setVideos(fetchedVideos);
        setNextPageToken(data.nextPageToken);
        setHasMore(Boolean(data.nextPageToken && fetchedVideos.length > 0));
        setIsLoading(false);

        // Check if initialVideoId is in results
        if (initialVideoId && fetchedVideos.some(v => v.id === initialVideoId)) {
          const idx = fetchedVideos.findIndex(v => v.id === initialVideoId);
          setActiveVideoIndex(idx);
          setTimeout(() => {
            videoItemRefs.current[idx]?.scrollIntoView({ behavior: 'auto', block: 'start' });
          }, 60);
        } else {
          setActiveVideoIndex(0);
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('[HealthShortsView Dynamic Fetch Error]:', err);
        setSearchError('Health Shorts are temporarily unavailable. Please try again.');
        setVideos([]);
        setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, selectedCategory, initialVideoId]);

  // Infinite Scroll: Load more videos using nextPageToken
  const loadMoreVideos = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore || !nextPageToken) return;

    setIsLoadingMore(true);
    try {
      const res = await healthShortsApi.searchShorts(debouncedQuery, selectedCategory, nextPageToken, 20);
      const newItems = res.videos || [];
      if (newItems.length > 0) {
        setVideos(prev => {
          const seen = new Set(prev.map(v => v.id));
          const additions = newItems.filter(v => !seen.has(v.id));
          return [...prev, ...additions];
        });
      }
      setNextPageToken(res.nextPageToken);
      setHasMore(Boolean(res.nextPageToken && newItems.length > 0));
    } catch (err) {
      console.error('[HealthShortsView Load More Error]:', err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, nextPageToken, debouncedQuery, selectedCategory]);

  // Mobile detection for full-screen mode on smaller devices (< 640px)
  const isMobileMode = windowWidth < 640;

  // Proximity trigger: when user scrolls near the end of the loaded list, fetch next page
  useEffect(() => {
    if (videos.length > 0 && activeVideoIndex >= videos.length - 2 && hasMore && !isLoadingMore) {
      loadMoreVideos();
    }
  }, [activeVideoIndex, videos.length, hasMore, isLoadingMore, loadMoreVideos]);

  // Scroll listener on container for continuous infinite scroll
  const handleContainerScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container || isLoadingMore || !hasMore) return;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 350) {
      loadMoreVideos();
    }
  }, [isLoadingMore, hasMore, loadMoreVideos]);

  // Ensure active index stays within bounds when filtering changes
  useEffect(() => {
    if (activeVideoIndex >= videos.length) {
      setActiveVideoIndex(0);
    }
  }, [videos.length, activeVideoIndex]);

  // Observer to track which short is currently centered/snapped in view
  useEffect(() => {
    const container = containerRef.current;
    if (!container || videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let targetIdx = -1;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(idx)) {
              targetIdx = idx;
            }
          }
        });

        if (targetIdx !== -1 && targetIdx !== activeVideoIndex && maxRatio >= 0.35) {
          setActiveVideoIndex(targetIdx);
          setIsPlaying(true);
        }
      },
      {
        root: container,
        threshold: [0.2, 0.35, 0.6, 0.8],
      }
    );

    videoItemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [videos, activeVideoIndex]);

  // Keyboard navigation (ArrowUp/Down for smooth scrolling to next/prev short)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (activeVideoIndex < videos.length - 1) {
          const nextIdx = activeVideoIndex + 1;
          videoItemRefs.current[nextIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeVideoIndex > 0) {
          const prevIdx = activeVideoIndex - 1;
          videoItemRefs.current[prevIdx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        handleTogglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideoIndex, videos.length, isPlaying]);

  // Mouse wheel vertical snap scrolling on desktop (prevents outer page scrolling)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (isScrolling) return;

      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0 && activeVideoIndex < videos.length - 1) {
          isScrolling = true;
          videoItemRefs.current[activeVideoIndex + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { isScrolling = false; }, 400);
        } else if (e.deltaY < 0 && activeVideoIndex > 0) {
          isScrolling = true;
          videoItemRefs.current[activeVideoIndex - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => { isScrolling = false; }, 400);
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeVideoIndex, videos.length]);

  // Progress simulation for active video
  useEffect(() => {
    setProgress(0);
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeVideoIndex, isPlaying]);

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    setTapFeedback({ type: nextState ? 'play' : 'pause', id: Date.now() });
    setTimeout(() => setTapFeedback(null), 600);

    if (iframeRef.current && iframeRef.current.contentWindow) {
      const cmd = nextState ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd }), '*');
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const cmd = nextMuted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd }), '*');
    }
  };

  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = (video: DynamicHealthShort, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `https://www.youtube.com/shorts/${video.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      }).catch(() => {});
    }
  };

  const handleCategorySelect = (cat: CategoryTab) => {
    setSelectedCategory(cat);
    setActiveVideoIndex(0);
    setIsPlaying(true);
    setNextPageToken(undefined);
    setHasMore(true);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setActiveVideoIndex(0);
    setIsPlaying(true);
    setNextPageToken(undefined);
    setHasMore(true);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('For You');
    setSearchQuery('');
    setDebouncedQuery('');
    setActiveVideoIndex(0);
    setIsPlaying(true);
    setNextPageToken(undefined);
    setHasMore(true);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const t_disclaimer = language === 'ta'
    ? 'கல்விக்கான ஆரோக்கிய உள்ளடக்கம் மட்டுமே. பாரம்பரிய மூலிகை நடைமுறைகளுக்கு உங்கள் மருத்துவரின் ஆலோசனையைப் பெறவும்.'
    : 'Educational wellness content only. Traditional home remedies are complementary — always consult your primary physician.';

  const t_watchOnYouTube = language === 'ta' ? 'YouTube-ல் பார்க்கவும்' : 'Watch on YouTube';

  return (
    <>
      {/* SHORTS VIEWER REGION (DEDICATED RIGHT-SIDE PANEL SIBLING ON DESKTOP, FULL-SCREEN ON MOBILE) */}
      <motion.aside
        key="shorts-panel"
        aria-label="Health Shorts Panel"
        initial={isMobileMode ? { x: '100%' } : { width: 0, opacity: 0 }}
        animate={isMobileMode ? { x: 0 } : { width: 400, opacity: 1 }}
        exit={isMobileMode ? { x: '100%' } : { width: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={
          isMobileMode
            ? "fixed inset-0 z-50 h-screen w-full bg-slate-950 flex flex-col overflow-hidden select-none"
            : "shrink-0 h-screen bg-slate-950 flex flex-col border-l border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden select-none relative z-20"
        }
        style={{
          width: isMobileMode ? '100vw' : '400px',
          minWidth: isMobileMode ? '100vw' : '380px',
          maxWidth: isMobileMode ? '100vw' : '420px',
        }}
      >
        <div className="w-[400px] max-w-full h-full flex flex-col overflow-hidden shrink-0">
        {/* =========================================================================
            1. CLEAN COMPACT SHORTS HEADER
            ========================================================================= */}
        <div className="px-3 py-2.5 bg-white dark:bg-[#0f172a] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0 text-slate-900 dark:text-white transition-colors">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Back"
              aria-label="Back to dashboard"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                Health Shorts
              </h3>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate leading-tight mt-0.5">
                Dynamic medical & wellness engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                showSearch 
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Search Health Shorts"
              aria-label="Search Shorts"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
              title="Close Shorts Panel"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SEARCH BAR (TOGGLED) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search fitness, diabetes, diet, yoga..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => handleSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            2. CATEGORY NAVIGATION (SINGLE HORIZONTALLY SCROLLABLE ROW - NO WRAP)
            ========================================================================= */}
        <div className="px-3.5 py-2 bg-slate-50/90 dark:bg-[#0b1120] border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 w-max">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 dark:bg-[#00a896] text-white shadow-xs shadow-teal-600/30 ring-1 ring-teal-500/40'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            3. VERTICAL SCROLLABLE FEED (CSS SCROLL SNAP - PHONE CARD ORIENTATION)
            ========================================================================= */}
        <div 
          ref={containerRef}
          onScroll={handleContainerScroll}
          className="flex-1 min-h-0 overflow-y-auto scroll-smooth snap-y snap-mandatory hide-scrollbar bg-slate-950 relative overscroll-contain"
          style={{
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {isLoading ? (
            /* LOADING STATE */
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div className="space-y-3.5 max-w-xs flex flex-col items-center">
                <Loader2 className="w-9 h-9 text-teal-400 animate-spin" />
                <p className="text-sm font-bold text-white">Searching relevant health shorts...</p>
                <p className="text-xs text-slate-400">Filtering for MediCare healthcare standards</p>
              </div>
            </div>
          ) : searchError ? (
            /* ERROR MESSAGE */
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div className="space-y-3.5 max-w-xs flex flex-col items-center">
                <AlertCircle className="w-10 h-10 text-amber-400" />
                <p className="text-sm font-bold text-slate-200">{searchError}</p>
                <button
                  type="button"
                  onClick={() => handleCategorySelect(selectedCategory)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-500 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            </div>
          ) : videos.length === 0 ? (
            /* NO RESULTS STATE */
            <div className="h-full flex items-center justify-center p-6 text-center">
              <div className="space-y-3.5 max-w-xs flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <AlertCircle className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">No relevant health videos found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Quality and clinical relevance are strictly prioritized. Random or unrelated videos are filtered out.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 text-white hover:bg-teal-500 transition-colors cursor-pointer shadow-md"
                >
                  Try another health topic
                </button>
              </div>
            </div>
          ) : (
            videos.map((video, index) => {
              const isActive = index === activeVideoIndex;
              const isLiked = !!likedMap[video.id];
              const isSaved = !!savedMap[video.id];
              const likesCount = getDeterministicSocialCount(video.id, 5000, 1500);
              const commentsCount = getDeterministicSocialCount(video.id, 400, 60);

              const resolvedCategory = resolveVideoCategory(video);

              return (
                <div
                  key={video.id}
                  ref={(el) => {
                    videoItemRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="w-full h-full snap-start snap-always shrink-0 flex items-center justify-center p-1 sm:p-1.5 relative overflow-hidden"
                  style={{
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    height: '100%',
                  }}
                >
                  {/* PHONE-LIKE PORTRAIT CARD (~9:16 RATIO, HORIZONTALLY & VERTICALLY CENTERED, FILLS VIEWPORT) */}
                  <div className="relative h-full w-auto max-w-full aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800/80 bg-black shadow-2xl flex items-center justify-center">
                    
                    {/* VIDEO CONTAINER (CLICK/TAP TO TOGGLE PLAY/PAUSE) */}
                    <div 
                      className="w-full h-full relative overflow-hidden flex items-center justify-center cursor-pointer"
                      onClick={handleTogglePlay}
                    >
                      {/* CLEAN HIGH-RES STANDBY POSTER & SEAMLESS BACKDROP */}
                      <div className="absolute inset-0 bg-slate-900 pointer-events-none">
                        <img 
                          src={video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover opacity-85"
                          loading={isActive ? "eager" : "lazy"}
                        />
                        {!isActive && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/25 text-white shadow-lg">
                              <Play className="w-6 h-6 translate-x-0.5 fill-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <iframe
                          ref={iframeRef}
                          className="w-full h-full object-cover pointer-events-none relative z-10"
                          src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&autoplay=1&loop=1&controls=0&modestbranding=1&rel=0&playsinline=1&mute=${muted ? '1' : '0'}&playlist=${video.id}&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`}
                          title={video.title}
                          loading="eager"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}

                      {/* SUBTLE PAUSED OVERLAY (WHEN VIDEO IS PAUSED) */}
                      {!isPlaying && isActive && (
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px] flex items-center justify-center z-20 pointer-events-none transition-opacity">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-2xl">
                            <Play className="w-7 h-7 translate-x-0.5 fill-white" />
                          </div>
                        </div>
                      )}

                      {/* TEMPORARY PLAY/PAUSE TAP INDICATOR BADGE */}
                      <AnimatePresence>
                        {tapFeedback && isActive && (
                          <motion.div
                            key={tapFeedback.id}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none"
                          >
                            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                              {tapFeedback.type === 'play' ? (
                                <Play className="w-6 h-6 translate-x-0.5 fill-white" />
                              ) : (
                                <Pause className="w-6 h-6 fill-white" />
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* TOP-RIGHT MUTE BUTTON OVERLAYING VIDEO */}
                    <div className="absolute top-3 right-3 z-30 pointer-events-auto">
                      <button
                        type="button"
                        onClick={handleToggleMute}
                        className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer shadow-md"
                        title={muted ? 'Unmute' : 'Mute'}
                        aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
                      >
                        {muted ? (
                          <VolumeX className="w-4 h-4 text-white" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>

                    {/* =========================================================================
                        COMPACT RIGHT-SIDE SOCIAL ACTIONS (Like, Comment, Share, Save)
                        ========================================================================= */}
                    <div className="absolute bottom-16 right-2.5 sm:right-3 z-30 flex flex-col items-center gap-3 pointer-events-auto">
                      {/* LIKE */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleLike(video.id, e)}
                        className="flex flex-col items-center gap-0.5 group cursor-pointer"
                        title="Like Short"
                      >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md flex items-center justify-center border transition-all ${
                          isLiked 
                            ? 'bg-rose-500/30 border-rose-500/50 text-rose-400 scale-105 shadow-rose-500/20' 
                            : 'bg-black/50 border-white/20 text-white hover:bg-black/70 hover:scale-105'
                        }`}>
                          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {isLiked ? (likesCount + 1).toLocaleString() : likesCount.toLocaleString()}
                        </span>
                      </button>

                      {/* COMMENT */}
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 transition-all">
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow">
                          {commentsCount}
                        </span>
                      </div>

                      {/* SHARE */}
                      <button
                        type="button"
                        onClick={(e) => handleShare(video, e)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer"
                        title="Share Short"
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 transition-all">
                          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow">Share</span>
                      </button>

                      {/* SAVE */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(video.id, e)}
                        className="flex flex-col items-center gap-0.5 cursor-pointer"
                        title="Save Short"
                      >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md border transition-all flex items-center justify-center ${
                          isSaved
                            ? 'bg-amber-500/30 border-amber-500/50 text-amber-400 scale-105 shadow-amber-500/20'
                            : 'bg-black/50 border-white/20 text-white hover:bg-black/70 hover:scale-105'
                        }`}>
                          <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
                        </div>
                        <span className="text-[10px] font-bold text-white drop-shadow">Save</span>
                      </button>
                    </div>

                    {/* =========================================================================
                        VIDEO INFO OVERLAY (BOTTOM PORTION - OVERLAYING VIDEO)
                        ========================================================================= */}
                    <div className="absolute bottom-0 left-0 right-14 p-3.5 pt-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 pointer-events-none text-left">
                      {/* Video Title */}
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-md">
                        {video.title}
                      </h4>

                      {/* Short Description */}
                      {video.description && (
                        <p className="text-[11px] text-slate-200 font-normal line-clamp-2 leading-relaxed mt-1">
                          {video.description}
                        </p>
                      )}

                      {/* Channel Row with Avatar, Verified Badge, and Category Tag */}
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-xs">
                            🌿
                          </div>
                          <span className="text-[11px] font-bold text-white">
                            {video.channelName}
                          </span>
                          <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-black shrink-0">
                            ✓
                          </span>
                        </div>

                        {/* ACCURATE CATEGORY TAG IN BOTTOM INFO BAR */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold">
                          <span>{getCategoryIcon(resolvedCategory)}</span>
                          <span>{resolvedCategory}</span>
                        </div>
                      </div>

                      {resolvedCategory === 'Nattu Maruthuvam' && (
                        <div className="mt-1.5 p-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-[9px] text-amber-200/90 leading-tight line-clamp-1">
                          ⚠️ {t_disclaimer}
                        </div>
                      )}

                      <div className="mt-1.5 flex items-center justify-between">
                        <a
                          href={video.url || `https://www.youtube.com/shorts/${video.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white transition-colors pointer-events-auto"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{t_watchOnYouTube}</span>
                        </a>

                        <span className="text-[10px] font-mono text-slate-400">
                          {video.duration}
                        </span>
                      </div>
                    </div>

                    {/* PROGRESS BAR */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 pointer-events-none">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-100 ease-linear"
                        style={{ width: `${isActive ? progress : 0}%` }}
                      />
                    </div>

                  </div>
                </div>
              );
            })
          )}

          {/* SENTRY / INLINE PROFESSIONAL LOADER FOR INFINITE SCROLL */}
          {isLoadingMore && (
            <div className="w-full py-4 shrink-0 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-teal-400 text-xs font-semibold shadow-lg backdrop-blur-md">
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Loading more shorts...</span>
              </div>
            </div>
          )}
        </div>

        {/* LINK COPIED TOAST */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-teal-500/40 text-teal-300 text-xs font-bold flex items-center gap-1.5 shadow-xl"
            >
              <Check className="w-3.5 h-3.5 text-teal-400" />
              <span>Link copied to clipboard</span>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </motion.aside>

      {/* SUBTLE SCROLLBAR STYLING - HIDES LARGE UGLY BROWSER SCROLLBARS */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  );
};

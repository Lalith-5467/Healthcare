import React, { useState, useEffect } from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { healthShortsApi, type DynamicHealthShort } from '../../services/healthShortsApi';

export interface HealthShortsCardProps {
  onOpenShorts: (videoId?: string) => void;
}

const getCategoryTheme = (category: string) => {
  if (category === 'Nattu Maruthuvam') {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200/80 dark:border-emerald-800/60',
    };
  }
  if (category === 'Diet') {
    return {
      bg: 'bg-orange-50 dark:bg-orange-950/50',
      text: 'text-orange-700 dark:text-orange-300',
      border: 'border-orange-200/80 dark:border-orange-800/60',
    };
  }
  if (category === 'Fitness') {
    return {
      bg: 'bg-teal-50 dark:bg-teal-950/50',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200/80 dark:border-teal-800/60',
    };
  }
  if (category === 'Preventive Health') {
    return {
      bg: 'bg-sky-50 dark:bg-sky-950/50',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200/80 dark:border-sky-800/60',
    };
  }
  return {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200/80 dark:border-purple-800/60',
  };
};

export const HealthShortsCard: React.FC<HealthShortsCardProps> = ({ onOpenShorts }) => {
  const [shorts, setShorts] = useState<DynamicHealthShort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    healthShortsApi.getCategoryFeed('For You', 4)
      .then((data) => {
        if (isMounted) {
          setShorts(data.slice(0, 4));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('[HealthShortsCard load error]:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full bg-white dark:bg-slate-900 rounded-[24px] sm:rounded-[28px] border border-teal-300/60 dark:border-teal-800/60 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-shadow duration-300"
      aria-label="Health Shorts Section"
    >
      {/* HEADER ROW */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* GREEN/TEAL ROUNDED-SQUARE PLAY ICON */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#00a896] dark:bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-500/20">
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
                Health Shorts
              </h3>
              <span className="px-2 py-0.5 bg-[#00a896] text-white text-[10px] font-black uppercase tracking-wider rounded-full">
                LIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal mt-1 truncate">
              Dynamic wellness bites curated for your health
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: VIEW ALL LINK */}
        <button
          type="button"
          onClick={() => onOpenShorts()}
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 SHORTS CARDS HORIZONTALLY IN ONE ROW */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {loading ? (
          // SKELETON PLACEHOLDERS WHILE FETCHING DYNAMIC SHORTS
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex flex-col animate-pulse">
              <div className="w-full aspect-[4/3] rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="mt-3 w-16 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="mt-2 w-3/4 h-4 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          ))
        ) : shorts.length === 0 ? (
          <div className="col-span-full py-8 text-center text-xs text-slate-400">
            No health shorts currently available. Click "View All" to explore topics.
          </div>
        ) : (
          shorts.map((short) => {
            const theme = getCategoryTheme(short.category);
            return (
              <div
                key={short.id}
                onClick={() => onOpenShorts(short.id)}
                className="group cursor-pointer flex flex-col"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenShorts(short.id);
                  }
                }}
              >
                {/* THUMBNAIL WITH PLAY BUTTON AND DURATION BADGE */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* CENTERED PLAY BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-black/55 backdrop-blur-xs flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-black/70 transition-all shadow-md">
                      <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* DURATION BADGE AT BOTTOM-RIGHT */}
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold font-mono tracking-tight pointer-events-none">
                    {short.duration}
                  </div>
                </div>

                {/* CATEGORY PILL BELOW THUMBNAIL */}
                <div className="mt-2.5 self-start">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.bg} ${theme.text} ${theme.border}`}
                  >
                    {short.category}
                  </span>
                </div>

                {/* TITLE BELOW CATEGORY */}
                <h4 className="mt-1.5 font-bold text-slate-900 dark:text-white text-sm leading-tight group-hover:text-[#00a896] dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                  {short.title}
                </h4>
              </div>
            );
          })
        )}
      </div>
    </motion.section>
  );
};

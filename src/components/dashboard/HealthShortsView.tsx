import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, MessageCircle, Share2, Volume2, VolumeX, Loader2, AlertCircle, ExternalLink, Play } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

interface HealthShortsViewProps {
  onClose: () => void;
  patientHealthInfo?: string;
}

interface VideoMetadata {
  id: string;
  title: string;
  channelTitle: string;
  category: string;
  icon: string;
  duration: number;
}

const FALLBACK_VIDEOS: VideoMetadata[] = [
  { id: 'xhqI5Mt-gc8', title: 'Benefits of Drinking Water Daily', channelTitle: 'Health Coach', category: 'Hydration', icon: '💧', duration: 10 },
  { id: 'dzHlPszxGM0', title: 'Why You Need More Water', channelTitle: 'Wellness Daily', category: 'Hydration', icon: '💧', duration: 10 },
  { id: 'THuKHYzfeYc', title: 'Hydration Health Tips', channelTitle: 'Doctor Tips', category: 'Hydration', icon: '💧', duration: 10 },
  { id: 'UNH1wmBkBCQ', title: 'Healthy Sleep Tips', channelTitle: 'Sleep Foundation', category: 'Sleep Health', icon: '🌙', duration: 10 },
  { id: 'jge1zsyI-Yk', title: 'How to Sleep Better', channelTitle: 'Wellness Daily', category: 'Sleep Health', icon: '🌙', duration: 10 },
  { id: 'Ao1tzPTm-40', title: 'Morning Exercise Routine', channelTitle: 'Fitness Pro', category: 'Fitness', icon: '🏃', duration: 10 },
  { id: '4eBEAsMGLFA', title: 'Healthy Food Diet', channelTitle: 'Nutrition Expert', category: 'Nutrition', icon: '🥗', duration: 10 },
  { id: 'SNOknWXvIL4', title: 'Nutrition Basics', channelTitle: 'Health Coach', category: 'Nutrition', icon: '🥗', duration: 10 },
  { id: '1v6R_46lQ7g', title: 'Balanced Diet Guide', channelTitle: 'Doctor Tips', category: 'Nutrition', icon: '🥗', duration: 10 },
  { id: 'p706o40Qz8Q', title: 'Quick Morning Stretches', channelTitle: 'Fitness Pro', category: 'Fitness', icon: '🏃', duration: 10 },
];

const deriveCategoryAndIcon = (title: string = '') => {
  const lower = title.toLowerCase();
  if (lower.includes('water') || lower.includes('hydration') || lower.includes('drink')) {
    return { category: 'Hydration', icon: '💧' };
  }
  if (lower.includes('sleep') || lower.includes('rest') || lower.includes('routine')) {
    return { category: 'Sleep Health', icon: '🌙' };
  }
  if (lower.includes('exercise') || lower.includes('stretch') || lower.includes('workout') || lower.includes('active')) {
    return { category: 'Fitness', icon: '🏃' };
  }
  return { category: 'Nutrition & Diet', icon: '🥗' };
};

export const HealthShortsView: React.FC<HealthShortsViewProps> = ({ onClose }) => {
  const [muted, setMuted] = useState(true);
  const [videos, setVideos] = useState<VideoMetadata[]>(FALLBACK_VIDEOS);
  const [loading, setLoading] = useState(false); // Instant mount: start immediately with curated videos without spinning delay
  const [error, setError] = useState<string | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const { language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // Background fetch of latest videos
  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      try {
        const response = await api.get('/health-videos') as any;
        const videoList = response.data?.videos || response.videos || (Array.isArray(response) ? response : []);
        if (isMounted) {
          if (videoList && Array.isArray(videoList) && videoList.length > 0) {
            const mapped = videoList.map((v: any) => {
              const derived = deriveCategoryAndIcon(v.title);
              return {
                id: v.id || v.youtubeVideoId,
                title: v.title,
                channelTitle: v.channelTitle || v.channelName || 'Health Expert',
                category: v.category || derived.category,
                icon: v.icon || derived.icon,
                duration: v.duration || v.durationSeconds || 10,
              };
            });
            setVideos(mapped);
          }
        }
      } catch (err: any) {
        console.warn('Silent fallback to cached shorts:', err);
      }
    };
    fetchVideos();
    return () => { isMounted = false; };
  }, [language]);

  // Observer to track which short is currently centered in viewport
  useEffect(() => {
    if (videos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveVideoIndex(index);
            const iframe = iframeRefs.current[index];
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
            }
          } else {
            const index = Number(entry.target.getAttribute('data-index'));
            const iframe = iframeRefs.current[index];
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = containerRef.current?.querySelectorAll('.video-container');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [videos.length]);

  // Update mute state for all active iframes when toggled
  useEffect(() => {
    iframeRefs.current.forEach(iframe => {
      if (iframe && iframe.contentWindow) {
        const cmd = muted ? 'mute' : 'unMute';
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: cmd }), '*');
      }
    });
  }, [muted]);

  const t_disclaimer = language === 'ta' 
    ? "கல்விக்கான ஆரோக்கிய உள்ளடக்கம் மட்டுமே. பாரம்பரிய நடைமுறைகள் அனைவருக்கும் பொருந்தாது. உங்கள் மருத்துவரின் ஆலோசனையைப் பின்பற்றவும்." 
    : "Educational wellness content only. Traditional practices may not be suitable for everyone. Follow your doctor's medical advice.";

  const t_watchOnYouTube = language === 'ta' ? "YouTube-ல் பார்க்கவும்" : "Watch on YouTube";
  const t_empty = language === 'ta' ? "தற்போது பொருத்தமான சுகாதார குறும்படங்கள் கிடைக்கவில்லை." : "No suitable short health videos are available right now.";

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer border border-white/10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Mute toggle */}
      {videos.length > 0 && !loading && !error && (
        <button 
          onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
          className="absolute top-6 left-6 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer border border-white/10"
        >
          {muted ? <VolumeX className="w-6 h-6 text-amber-400" /> : <Volume2 className="w-6 h-6 text-emerald-400" />}
        </button>
      )}

      <div className="flex-1 h-full flex justify-center items-center relative">
        
        {loading && (
          <div className="flex flex-col items-center gap-4 text-cyan-500">
            <Loader2 className="w-12 h-12 animate-spin" />
            <p className="text-sm font-bold animate-pulse text-white">Loading Health Shorts...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center gap-4 text-rose-400 p-6 text-center max-w-sm bg-zinc-900 rounded-3xl border border-zinc-800">
            <AlertCircle className="w-12 h-12" />
            <p className="text-sm font-bold text-white">{error}</p>
            <button onClick={onClose} className="px-6 py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white hover:bg-zinc-700 mt-2">Close</button>
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="flex flex-col items-center gap-4 text-slate-400 p-6 text-center max-w-sm">
            <AlertCircle className="w-12 h-12" />
            <p className="text-sm font-bold">{t_empty}</p>
            <button onClick={onClose} className="px-6 py-2 bg-zinc-800 rounded-xl text-xs font-bold text-white hover:bg-zinc-700 mt-2">Go Back</button>
          </div>
        )}

        {/* Scroll Container */}
        {!loading && !error && videos.length > 0 && (
          <div ref={containerRef} className="w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative bg-black">
            
            {/* Educational Banner */}
            <div className="absolute top-20 left-4 right-4 z-40 text-center pointer-events-none">
              <div className="inline-block px-4 py-1.5 bg-black/60 border border-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                <p className="text-[11px] font-bold text-white/90">
                  {language === 'ta' 
                    ? '✨ உங்கள் சிகிச்சைத் திட்டத்திற்கேற்ப தனிப்பயனாக்கப்பட்டது' 
                    : '✨ Personalized for your care plan'}
                </p>
              </div>
            </div>

            {videos.map((video, index) => {
              // VIRTUAL WINDOWING: Only mount iframe for active video ± 1 neighbor
              const isNearActive = Math.abs(index - activeVideoIndex) <= 1;

              return (
                <div 
                  key={video.id + index} 
                  data-index={index}
                  className="video-container w-full h-full snap-start snap-always relative flex justify-center items-center bg-black overflow-hidden"
                >
                  {isNearActive ? (
                    /* Active/Neighboring YouTube Player — Mounted Lazy & Ultra-Fast */
                    <iframe 
                      ref={el => { iframeRefs.current[index] = el; }}
                      className="w-[170%] h-[170%] max-w-none pointer-events-none object-cover transition-opacity duration-300"
                      src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&autoplay=${index === activeVideoIndex ? 1 : 0}&loop=1&controls=0&modestbranding=1&rel=0&playsinline=1&mute=${muted ? '1' : '0'}&playlist=${video.id}`}
                      title={video.title}
                      loading="lazy"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    /* Lightweight Poster Placeholder for far-away items — 0 Network Overhead */
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 overflow-hidden">
                      <img 
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`} 
                        alt={video.title} 
                        className="w-full h-full object-cover opacity-50 filter blur-[1px] scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <Play className="w-6 h-6 text-white/80 translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Touch/Click Overlay */}
                  <div 
                    className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-auto cursor-pointer" 
                    onClick={() => setMuted(!muted)}
                  >
                    
                    {/* Overlay Text */}
                    <div className="absolute bottom-12 left-4 right-16">
                      <h3 className="text-lg font-black mb-1 line-clamp-2 text-white drop-shadow-md">{video.title}</h3>
                      <p className="text-xs font-bold text-cyan-400 mb-3 drop-shadow">@{video.channelTitle}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1.5 bg-black/40 border border-white/10 backdrop-blur-md rounded-xl text-xs font-bold flex items-center gap-1">
                          {video.icon} {video.category}
                        </span>
                      </div>

                      {(video.category === "Nattu Maruthuvam" || video.category === "Natural Herbs") && (
                        <div className="p-3 bg-amber-900/40 border border-amber-500/30 rounded-xl backdrop-blur-md">
                          <p className="text-[10px] font-bold text-amber-200/90 leading-tight">
                            ⚠️ {t_disclaimer}
                          </p>
                        </div>
                      )}

                      {/* Watch on YouTube Link */}
                      <a 
                        href={`https://www.youtube.com/shorts/${video.id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-bold text-white/70 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> {t_watchOnYouTube}
                      </a>
                    </div>

                    {/* Engagement Buttons (Right Side) */}
                    <div className="absolute bottom-16 right-4 flex flex-col gap-6 items-center">
                      <div className="flex flex-col items-center gap-1">
                        <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10">
                          <Heart className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1">
                        <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center gap-1">
                        <button className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition-colors border border-white/10">
                          <Share2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

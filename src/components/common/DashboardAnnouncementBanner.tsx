import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertTriangle, CheckCircle2, X, Sparkles } from 'lucide-react';
import { useSiteConfig } from '../../context/ConfigContext';

interface DashboardAnnouncementBannerProps {
  role: 'patient' | 'doctor' | 'nurse' | 'caregiver' | 'pharmacist' | 'insurance' | 'admin' | 'superAdmin';
  className?: string;
}

export const DashboardAnnouncementBanner: React.FC<DashboardAnnouncementBannerProps> = ({ role, className = '' }) => {
  const [dismissed, setDismissed] = useState(false);
  let announcementConfig: any = null;

  try {
    const siteConfig = useSiteConfig();
    announcementConfig = siteConfig.dashboards?.[role]?.announcement;
  } catch {}

  if (!announcementConfig || !announcementConfig.enabled || !announcementConfig.message || dismissed) {
    return null;
  }

  // Date range verification if dates are configured
  if (announcementConfig.startDate) {
    const start = new Date(announcementConfig.startDate).getTime();
    if (!isNaN(start) && Date.now() < start) return null;
  }
  if (announcementConfig.endDate) {
    const end = new Date(announcementConfig.endDate).getTime();
    if (!isNaN(end) && Date.now() > end) return null;
  }

  const { title, message, type = 'info', priority } = announcementConfig;

  const bgStyles = type === 'alert'
    ? 'from-rose-500/15 via-rose-500/10 to-transparent border-rose-500/30 text-rose-950 dark:text-rose-200'
    : type === 'warning'
    ? 'from-amber-500/15 via-amber-500/10 to-transparent border-amber-500/30 text-amber-950 dark:text-amber-200'
    : type === 'success'
    ? 'from-emerald-500/15 via-emerald-500/10 to-transparent border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
    : 'from-blue-500/15 via-cyan-500/10 to-transparent border-blue-500/30 text-blue-950 dark:text-cyan-200';

  const iconColor = type === 'alert'
    ? 'text-rose-500'
    : type === 'warning'
    ? 'text-amber-500'
    : type === 'success'
    ? 'text-emerald-500'
    : 'text-cyan-500';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r border backdrop-blur-md shadow-xs flex items-center justify-between gap-3 mb-4 select-none ${bgStyles} ${className}`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-white/40 dark:bg-slate-800/60 flex items-center justify-center shrink-0 shadow-xs">
            {type === 'alert' ? (
              <AlertTriangle className={`w-4 h-4 ${iconColor}`} />
            ) : type === 'warning' ? (
              <AlertTriangle className={`w-4 h-4 ${iconColor}`} />
            ) : type === 'success' ? (
              <CheckCircle2 className={`w-4 h-4 ${iconColor}`} />
            ) : (
              <Sparkles className={`w-4 h-4 ${iconColor}`} />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {title && (
                <p className="text-xs font-black uppercase tracking-wider leading-snug">
                  {title}
                </p>
              )}
              {priority === 'urgent' && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-xs font-semibold leading-relaxed opacity-90 truncate sm:whitespace-normal">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Trash2, Info, X } from 'lucide-react';

export type AdminToastType = 'success' | 'delete' | 'error' | 'info';

export interface AdminToastProps {
  message: string | null;
  type?: AdminToastType;
  title?: string;
  duration?: number;
  onClose: () => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({
  message,
  type = 'success',
  title,
  duration = 4000,
  onClose,
}) => {
  // Auto detect if this is a deletion notification
  const isDelete = type === 'delete' || (message ? /deleted|removed|purged|revoked/i.test(message) : false);
  const resolvedType: AdminToastType = isDelete ? 'delete' : type;

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const config = {
    delete: {
      accentBorder: 'border-l-4 border-l-rose-500',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-800/60',
      icon: Trash2,
      defaultTitle: 'Record Removed',
    },
    success: {
      accentBorder: 'border-l-4 border-l-[#00a896]',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/60 text-[#00796b] dark:text-teal-300 border border-teal-200/80 dark:border-teal-800/60',
      icon: CheckCircle2,
      defaultTitle: 'Action Completed',
    },
    error: {
      accentBorder: 'border-l-4 border-l-red-600',
      badgeBg: 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200/80 dark:border-red-800/60',
      icon: AlertCircle,
      defaultTitle: 'Operation Failed',
    },
    info: {
      accentBorder: 'border-l-4 border-l-sky-500',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/60',
      icon: Info,
      defaultTitle: 'System Notification',
    },
  }[resolvedType];

  const Icon = config.icon;
  const resolvedTitle = title || config.defaultTitle;

  return (
    <AnimatePresence>
      {/* Positioned directly under the executive header, centered horizontally */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[94%] sm:w-auto sm:min-w-[420px] sm:max-w-xl pointer-events-none select-none">
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className={`pointer-events-auto select-auto w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-950/20 dark:shadow-black/70 border border-slate-200/90 dark:border-slate-800 p-4 sm:px-5 sm:py-4 flex items-center justify-between gap-4 ${config.accentBorder}`}
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${config.badgeBg}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>

            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {resolvedTitle}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  Just now
                </span>
              </div>

              <p className="text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-300 mt-0.5 leading-snug truncate sm:whitespace-normal">
                {message}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

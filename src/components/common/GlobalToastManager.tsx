import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X, 
  BellRing,
  ExternalLink
} from 'lucide-react';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

// Global dispatcher helper that any file can call
export const showGlobalToast = (
  message: string, 
  type: 'success' | 'info' | 'warning' | 'error' = 'success',
  title?: string,
  actionLabel?: string,
  onAction?: () => void
) => {
  const event = new CustomEvent('medicare_toast_event', {
    detail: {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      message,
      type,
      title: title || (type === 'success' ? 'Success' : type === 'warning' ? 'Alert' : type === 'error' ? 'Error' : 'Notification'),
      duration: 4000,
      actionLabel,
      onAction
    }
  });
  window.dispatchEvent(event);
};

export const GlobalToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastItem>;
      if (customEvent.detail) {
        const newToast = customEvent.detail;
        if (
          newToast.message &&
          (newToast.message.includes('insufficient permissions') ||
            newToast.message.includes('Required: [ADMIN'))
        ) {
          return; // Suppress permission warning noise
        }

        setToasts((prev) => {
          // Prevent multiple identical notifications from stacking on screen
          const isDuplicate = prev.some(
            (t) => t.message === newToast.message && t.type === newToast.type
          );
          if (isDuplicate) {
            return prev;
          }
          return [newToast, ...prev.slice(0, 2)]; // Neatly stack max 3 notifications
        });

        // Auto remove without visual progress bar
        setTimeout(() => {
          removeToast(newToast.id);
        }, newToast.duration || 4000);
      }
    };

    window.addEventListener('medicare_toast_event', handleToastEvent);
    return () => window.removeEventListener('medicare_toast_event', handleToastEvent);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyles = (type: ToastItem['type'] = 'success') => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-500',
          bg: 'bg-white dark:bg-slate-900 border-emerald-500/30',
          badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
          ring: 'ring-emerald-500/10',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          bg: 'bg-white dark:bg-slate-900 border-amber-500/30',
          badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
          ring: 'ring-amber-500/10',
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-rose-500',
          bg: 'bg-white dark:bg-slate-900 border-rose-500/30',
          badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
          ring: 'ring-rose-500/10',
        };
      case 'info':
      default:
        return {
          icon: BellRing,
          iconColor: 'text-[#00a896] dark:text-cyan-400',
          bg: 'bg-white dark:bg-slate-900 border-[#00a896]/30',
          badgeBg: 'bg-teal-500/10 text-[#00a896] dark:text-cyan-400',
          ring: 'ring-teal-500/10',
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
      className="z-[99999] flex flex-col items-center gap-2.5 w-[calc(100%-2rem)] max-w-md sm:max-w-lg pointer-events-none select-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          const Icon = style.icon;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className={`pointer-events-auto w-full relative overflow-hidden rounded-2xl p-4 shadow-2xl border ${style.bg} ${style.ring} ring-1 backdrop-blur-xl transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${style.badgeBg}`}>
                  <Icon className={`w-5 h-5 ${style.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h5 className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                      {toast.title || 'Notification'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeToast(toast.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                      title="Dismiss"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {toast.message}
                  </p>

                  {toast.actionLabel && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (toast.onAction) toast.onAction();
                          removeToast(toast.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-black text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer"
                      >
                        <span>{toast.actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X, 
  BellRing,
  ExternalLink,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export interface AccessRequestToastMeta {
  isAccessRequest?: boolean;
  doctorName?: string;
  doctorSpeciality?: string;
  doctorHospital?: string;
  purpose?: string;
  permissionScope?: string[];
  requestedAt?: string;
  requestId?: string;
  isPersistent?: boolean;
  onReview?: () => void;
  onDismiss?: () => void;
}

export interface ToastItem extends AccessRequestToastMeta {
  id: string;
  eventKey?: string;
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
  eventKey?: string,
  actionLabel?: string,
  onAction?: () => void,
  meta?: AccessRequestToastMeta & { duration?: number }
) => {
  let resolvedTitle = title;
  let resolvedMessage = message;

  // Gracefully handle combined title and message containing a newline
  if (!resolvedTitle && message && message.includes('\n')) {
    const lines = message.split('\n');
    if (lines[0].trim()) {
      resolvedTitle = lines[0].trim();
      resolvedMessage = lines.slice(1).join('\n').trim();
    }
  }

  const defaultTitle = 
    type === 'success' ? 'Success' : 
    type === 'warning' ? 'Alert' : 
    type === 'error' ? 'Error' : 
    'Notification';

  let isDoctor = false;
  try {
    const rawUser = localStorage.getItem('app_user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      isDoctor = (parsed?.role || '').toLowerCase() === 'doctor';
    }
  } catch {}

  // Detect if this is an access request notification intended for patient consent
  // Doctors are the requesters, never the consent-granter; they must NEVER receive patient consent toasts
  const isAccessRequest = !isDoctor && Boolean(
    meta?.isAccessRequest ||
    (resolvedTitle && /access request/i.test(resolvedTitle) && !/approved|rejected|declined|sent|success/i.test(resolvedTitle)) ||
    (resolvedMessage && /requested access to your health records/i.test(resolvedMessage))
  );

  let parsedDoctorName = meta?.doctorName;
  let parsedSpeciality = meta?.doctorSpeciality;
  let parsedHospital = meta?.doctorHospital;
  let parsedPurpose = meta?.purpose;

  if (isAccessRequest && !parsedDoctorName && resolvedMessage) {
    const match = resolvedMessage.match(/^([^(]+?)\s*\((.*?)\s+at\s+(.*?)\)\s+has requested access to your health records for\s+(.*?)\.?$/i);
    if (match) {
      parsedDoctorName = match[1].trim();
      parsedSpeciality = match[2].trim();
      parsedHospital = match[3].trim();
      parsedPurpose = match[4].trim();
    }
  }

  if (parsedDoctorName && !/^dr\.?\s+/i.test(parsedDoctorName.trim())) {
    parsedDoctorName = `Dr. ${parsedDoctorName.trim()}`;
  }

  const isPersistent = isAccessRequest ? (meta?.isPersistent !== false) : Boolean(meta?.isPersistent);

  const event = new CustomEvent('medicare_toast_event', {
    detail: {
      id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      eventKey,
      message: resolvedMessage,
      type: isAccessRequest ? 'info' : type,
      title: resolvedTitle || (isAccessRequest ? 'Medical Record Access Request' : defaultTitle),
      duration: meta?.duration || (isPersistent ? 0 : 3500),
      actionLabel: actionLabel || (isAccessRequest ? 'Review Request' : undefined),
      onAction,
      isAccessRequest,
      doctorName: parsedDoctorName,
      doctorSpeciality: parsedSpeciality,
      doctorHospital: parsedHospital,
      purpose: parsedPurpose || 'Patient Consultation',
      permissionScope: meta?.permissionScope || ['Vitals', 'Medical Records', 'Prescriptions', 'Lab Reports'],
      requestedAt: meta?.requestedAt || new Date().toISOString(),
      requestId: meta?.requestId,
      isPersistent,
      onReview: meta?.onReview || onAction,
      onDismiss: meta?.onDismiss
    } as ToastItem
  });
  window.dispatchEvent(event);
};

export interface GlobalToastManagerProps {
  currentPage?: string;
}

export const GlobalToastManager: React.FC<GlobalToastManagerProps> = ({ currentPage }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const recentEventsRef = React.useRef<Map<string, number>>(new Map());
  const isAccessModalOpenRef = React.useRef(false);

  // Clear any pending clinical access requests if user is not on the dashboard (e.g. on landing page)
  useEffect(() => {
    if (currentPage && currentPage !== 'dashboard') {
      setToasts((prev) => prev.filter((t) => !t.isAccessRequest));
    }
  }, [currentPage]);

  useEffect(() => {
    const handleDismissAccessToasts = () => {
      setToasts((prev) => prev.filter((t) => !t.isAccessRequest));
    };

    const handleModalState = (e: Event) => {
      const custom = e as CustomEvent<{ isOpen: boolean }>;
      if (custom.detail?.isOpen) {
        isAccessModalOpenRef.current = true;
        setToasts((prev) => prev.filter((t) => !t.isAccessRequest));
      } else {
        isAccessModalOpenRef.current = false;
      }
    };

    const handleOpenModal = () => {
      isAccessModalOpenRef.current = true;
      setToasts((prev) => prev.filter((t) => !t.isAccessRequest));
    };

    window.addEventListener('dismiss_access_request_toasts', handleDismissAccessToasts);
    window.addEventListener('open_access_requests_modal', handleOpenModal);
    window.addEventListener('access_modal_state', handleModalState);

    const handleClearAll = () => {
      setToasts([]);
    };
    window.addEventListener('clear_all_toasts', handleClearAll);

    return () => {
      window.removeEventListener('dismiss_access_request_toasts', handleDismissAccessToasts);
      window.removeEventListener('open_access_requests_modal', handleOpenModal);
      window.removeEventListener('access_modal_state', handleModalState);
      window.removeEventListener('clear_all_toasts', handleClearAll);
    };
  }, []);

  // Immediately clear any toasts when entering login or register pages
  useEffect(() => {
    if (currentPage === 'login' || currentPage === 'register') {
      setToasts([]);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastItem>;
      if (customEvent.detail) {
        const newToast = customEvent.detail;

        // Suppress toasts completely on login and register pages
        if (currentPage === 'login' || currentPage === 'register') {
          return;
        }

        if (
          newToast.message &&
          (newToast.message.includes('insufficient permissions') ||
            newToast.message.includes('Required: [ADMIN') ||
            /Selected\s+.*\s+module/i.test(newToast.message) ||
            /Switched\s+to\s+/i.test(newToast.message) ||
            /தொகுதி\s+தேர்ந்தெடுக்கப்பட்டது/i.test(newToast.message) ||
            /தொகுதிக்கு\s+மாற்றப்பட்டது/i.test(newToast.message))
        ) {
          return; // Suppress permission warning noise and navigation/module-selection toasts
        }

        // Suppress clinical access request toasts completely when not on the dashboard (e.g. Landing Page)
        if (newToast.isAccessRequest && currentPage && currentPage !== 'dashboard') {
          return;
        }

        // If the access request modal is already open, do not spawn an overlapping toast on top
        if (newToast.isAccessRequest && isAccessModalOpenRef.current) {
          return;
        }

        const now = Date.now();

        // Evict event entries older than 8 seconds
        for (const [key, timestamp] of recentEventsRef.current.entries()) {
          if (now - timestamp > 8000) {
            recentEventsRef.current.delete(key);
          }
        }

        // Determine unique identity for this toast event
        let eventKey = newToast.eventKey;
        if (!eventKey) {
          // Normalize common order status update patterns: "Order #abcde moved to PREPARING"
          const match = newToast.message.match(/order\s*#?([a-zA-Z0-9]+).*?(preparing|accepted|ready|out[_\s]for[_\s]delivery|delivered|dispensed|completed|declined|cancelled)/i);
          if (match) {
            const orderId = match[1].toLowerCase();
            const status = match[2].toLowerCase().replace(/[\s_]+/g, '');
            eventKey = `order-${orderId}-${status}`;
          }
        }

        // Suppress duplicate non-access-request events within 6 seconds
        if (eventKey && !newToast.isAccessRequest) {
          const lastTime = recentEventsRef.current.get(eventKey);
          if (lastTime && now - lastTime < 6000) {
            return;
          }
          recentEventsRef.current.set(eventKey, now);
        }

        setToasts((prev) => {
          if (newToast.isAccessRequest) {
            // Strictly replace any existing access-request toasts so there is ONLY ever ONE active prompt
            const otherToasts = prev.filter((t) => !t.isAccessRequest);
            return [newToast, ...otherToasts.slice(0, 1)];
          }

          // Prevent duplicate access-request toasts with identical message or requestId
          const isDuplicate = prev.some(
            (t) => (t.requestId && newToast.requestId && t.requestId === newToast.requestId) ||
                   (t.message === newToast.message && t.type === newToast.type) ||
                   (eventKey && t.eventKey === eventKey)
          );
          if (isDuplicate) {
            return prev;
          }
          // Allow up to 2 stacked toasts without overlapping
          return [newToast, ...prev.slice(0, 1)];
        });

        // Auto remove non-persistent toasts or access request toasts with duration
        const toastDuration = newToast.duration ?? (newToast.isAccessRequest ? 15000 : newToast.isPersistent ? 0 : 3500);
        if (toastDuration > 0) {
          setTimeout(() => {
            removeToast(newToast.id);
          }, toastDuration);
        }
      }
    };

    window.addEventListener('medicare_toast_event', handleToastEvent);
    return () => window.removeEventListener('medicare_toast_event', handleToastEvent);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastStyles = (type: ToastItem['type'] = 'success', isAccess = false) => {
    if (isAccess) {
      return {
        icon: Stethoscope,
        iconColor: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-white/95 dark:bg-slate-900/95',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50',
        accentBorder: 'border-l-4 border-l-amber-500 shadow-amber-500/10',
      };
    }
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle2,
          iconColor: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-white dark:bg-slate-900',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50',
          accentBorder: 'border-l-4 border-l-emerald-500',
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-white dark:bg-slate-900',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/50',
          accentBorder: 'border-l-4 border-l-amber-500',
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: 'text-rose-600 dark:text-rose-400',
          bg: 'bg-white dark:bg-slate-900',
          badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/50',
          accentBorder: 'border-l-4 border-l-rose-500',
        };
      case 'info':
      default:
        return {
          icon: BellRing,
          iconColor: 'text-[#00a896] dark:text-teal-400',
          bg: 'bg-white dark:bg-slate-900',
          badgeBg: 'bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/50',
          accentBorder: 'border-l-4 border-l-[#00a896]',
        };
    }
  };

  return (
    <div
      aria-live="polite"
      role="region"
      aria-label="Notifications"
      className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-[99999] flex flex-col items-center gap-3 w-full max-w-[460px] px-4 pointer-events-none select-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type, toast.isAccessRequest);
          const Icon = style.icon;

          if (toast.isAccessRequest) {
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -16 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`pointer-events-auto select-auto w-full relative overflow-hidden rounded-2xl p-4 sm:p-5 shadow-2xl shadow-slate-900/15 dark:shadow-black/60 border border-amber-300/80 dark:border-amber-700/60 ${style.bg} ${style.accentBorder} backdrop-blur-md transition-all`}
              >
                <div className="space-y-3">
                  {/* Top Bar with Icon, Title, and Dismiss 'X' */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${style.badgeBg}`}>
                        <Icon className={`w-4 h-4 ${style.iconColor}`} />
                      </div>
                      <div>
                        <h5 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                          {toast.title || 'Medical Record Access Request'}
                        </h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 font-sans uppercase tracking-wider">
                            Requires Your Consent
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (toast.onDismiss) toast.onDismiss();
                        removeToast(toast.id);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 -mr-1 -mt-1"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Doctor & Request Details Box */}
                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1.5 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-[13px]">
                        {toast.doctorName || 'Attending Doctor'}
                      </span>
                      {toast.requestedAt && (
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                          {new Date(toast.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    {(toast.doctorSpeciality || toast.doctorHospital) && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        {[toast.doctorSpeciality, toast.doctorHospital].filter(Boolean).join(' • ')}
                      </p>
                    )}

                    {toast.purpose && (
                      <div className="pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-bold">Purpose:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{toast.purpose}</span>
                      </div>
                    )}

                    {toast.permissionScope && toast.permissionScope.length > 0 && (
                      <div className="pt-1">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                          Requested Record Permissions:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {toast.permissionScope.map((scope) => (
                            <span
                              key={scope}
                              className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-[10px] border border-teal-200/80 dark:border-teal-800/60"
                            >
                              ✓ {scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions: Review Request & Dismiss */}
                  <div className="flex items-center gap-2 pt-0.5 font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        removeToast(toast.id);
                        setToasts((prev) => prev.filter((t) => !t.isAccessRequest));
                        if (toast.onReview) {
                          toast.onReview();
                        } else if (toast.onAction) {
                          toast.onAction();
                        } else {
                          window.dispatchEvent(new CustomEvent('open_access_requests_modal'));
                        }
                      }}
                      className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Review Request</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (toast.onDismiss) toast.onDismiss();
                        removeToast(toast.id);
                      }}
                      className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={`pointer-events-auto select-auto w-full relative overflow-hidden rounded-2xl p-4 sm:p-5 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 ${style.bg} ${style.accentBorder} backdrop-blur-md transition-all`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${style.badgeBg}`}>
                  <Icon className={`w-4.5 h-4.5 ${style.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {toast.title || 'Notification'}
                    </h5>
                    <button
                      type="button"
                      onClick={() => removeToast(toast.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 -mr-1 -mt-1"
                      title="Dismiss"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-[13px] font-normal text-slate-600 dark:text-slate-300 leading-relaxed mt-1 whitespace-pre-line">
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
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00a896] dark:text-teal-400 hover:underline cursor-pointer"
                      >
                        <span>{toast.actionLabel}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
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


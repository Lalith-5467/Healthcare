import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  Truck, 
  CheckSquare, 
  Activity, 
  FileText, 
  AlertCircle, 
  X, 
  ChevronRight,
  User,
  Sparkles,
  Clock
} from 'lucide-react';
import { useCaregiverWorkflow, type CaregiverNotification, type CaregiverNotificationType } from '../../utils/caregiverWorkflowStorage';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedName } from '../../utils/caregiverDataTranslator';

interface CaregiverNotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (routeId: string) => void;
}

export const CaregiverNotificationPopover: React.FC<CaregiverNotificationPopoverProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { t } = useLanguage();
  const { 
    activeWard, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useCaregiverWorkflow();

  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  // 1. Filter notifications strictly belonging to the active dependent
  const dependentNotifications = notifications.filter(n => n.dependentId === activeWard.id);

  // 2. Tab filter
  const displayedNotifications = dependentNotifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  });

  const unreadCount = dependentNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: CaregiverNotificationType) => {
    switch (type) {
      case 'Appointment Reminder':
      case 'Appointment Status':
        return { icon: Calendar, bg: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800' };
      case 'Nurse Booking':
        return { icon: Truck, bg: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800' };
      case 'Care Task':
        return { icon: CheckSquare, bg: 'bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800' };
      case 'Vital Alert':
        return { icon: Activity, bg: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' };
      case 'ABHA Update':
        return { icon: FileText, bg: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
      default:
        return { icon: Bell, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  const handleNotificationClick = (n: CaregiverNotification) => {
    markNotificationRead(n.id);
    onClose();
    if (n.relatedRoute) {
      onNavigate(n.relatedRoute);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] overflow-hidden" onClick={onClose}>
        <div className="absolute top-16 right-4 sm:right-8 w-full max-w-sm sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* POPOVER HEADER */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    {t('caregiver.notif.title', 'Caregiver Notifications')}
                  </h3>
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-teal-500" />
                  <span>{getLocalizedName(activeWard.name, t)}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead(activeWard.id)}
                    className="text-[10px] font-black text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    title={t('caregiver.notif.mark_all_read', 'Mark all as read')}
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{t('caregiver.notif.mark_all_read', 'Mark all read')}</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FILTER TABS */}
            <div className="px-4 py-2 bg-white dark:bg-[#0b1120] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex gap-1.5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t('caregiver.notif.filter_all', 'All')} ({dependentNotifications.length})
                </button>
                <button
                  onClick={() => setActiveTab('unread')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'unread'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t('caregiver.notif.filter_unread', 'Unread')} ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full">
                  {unreadCount} {t('caregiver.notif.new', 'new')}
                </span>
              )}
            </div>

            {/* NOTIFICATION LIST */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 space-y-1">
              {displayedNotifications.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-cyan-900/20 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {t('caregiver.notif.empty_title', 'No new notifications')}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-xs">
                    {t('caregiver.notif.empty_sub', "You're all caught up for this dependent.")}
                  </p>
                </div>
              ) : (
                displayedNotifications.map((n) => {
                  const { icon: IconComp, bg } = getNotificationIcon(n.type);

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer flex items-start gap-3 relative border ${
                        !n.read 
                          ? 'bg-teal-50/40 border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/30' 
                          : 'bg-white border-transparent hover:bg-slate-50 dark:bg-[#0b1120] dark:hover:bg-slate-900/50'
                      }`}
                    >
                      {/* TYPE ICON */}
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                        <IconComp className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {n.type}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.timestamp}
                          </span>
                        </div>
                        <h4 className={`text-xs font-black mt-0.5 truncate ${!n.read ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-700 dark:text-slate-300'}`}>
                          {n.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                          {n.message}
                        </p>
                      </div>

                      {/* UNREAD DOT */}
                      {!n.read && (
                        <div className="absolute right-3 top-4 w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* POPOVER FOOTER */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-400">
                {dependentNotifications.length} {t('caregiver.notif.total_notifs', 'total notifications')}
              </span>
              <button
                onClick={() => {
                  onClose();
                  onNavigate('dashboard');
                }}
                className="font-black text-teal-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>{t('caregiver.notif.view_dashboard', 'View Command Center')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

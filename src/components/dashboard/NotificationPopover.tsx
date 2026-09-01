import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Pill, 
  Calendar, 
  Video, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink,
  X
} from 'lucide-react';
import type { NotificationLog } from '../reminders/remindersData';
import { INITIAL_NOTIFICATIONS } from '../reminders/remindersData';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNotifications: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onNavigateToNotifications
}) => {
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadNotifications = () => {
    const saved = localStorage.getItem('user_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const saveNotifications = (newNotifs: NotificationLog[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('user_notifications', JSON.stringify(newNotifs));
    // Dispatch custom event to notify other components (like RemindersView)
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleMarkRead = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotifications(updated);
  };

  const handleClearAll = () => {
    saveNotifications([]);
  };

  const handleRemoveSingle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
  };

  const filteredNotifs = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Medication':
        return <Pill className="w-4 h-4 text-amber-500" />;
      case 'Appointment':
        return <Calendar className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />;
      case 'Video Consultation':
      case 'Consultation':
        return <Video className="w-4 h-4 text-cyan-500" />;
      case 'Pharmacy':
        return <Truck className="w-4 h-4 text-purple-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-emerald-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-14 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden font-sans text-xs"
      >
        {/* POPOVER HEADER */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">Notifications</h3>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTROLS & TAB FILTER */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100/50 dark:bg-slate-950/50 font-mono">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer font-sans ${
                filter === 'all'
                  ? 'bg-[#00a896] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer font-sans ${
                filter === 'unread'
                  ? 'bg-[#00a896] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                title="Mark all as read"
                className="p-1.5 rounded-lg text-[#00a896] dark:text-cyan-400 hover:bg-teal-500/10 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                title="Clear all"
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
          {filteredNotifs.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-teal-500/40 mx-auto" />
              <p className="text-slate-600 dark:text-slate-400 font-bold">No notifications to show</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400">You're all up to date with your health updates.</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                  notif.isRead
                    ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    : 'bg-teal-500/5 dark:bg-teal-500/10 hover:bg-teal-500/10 dark:hover:bg-teal-500/15'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                  {getCategoryIcon(notif.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`font-extrabold truncate text-xs ${
                      notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'
                    }`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 shrink-0">{notif.timeAgo}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                    {notif.description}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-1 shrink-0">
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#00a896] dark:bg-cyan-400 animate-pulse" />
                  )}
                  <button
                    onClick={(e) => handleRemoveSingle(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER BUTTON */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-center">
          <button
            onClick={() => {
              onClose();
              onNavigateToNotifications();
            }}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#00a896] hover:text-white dark:hover:bg-[#00a896] text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View All Notifications & Reminders</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

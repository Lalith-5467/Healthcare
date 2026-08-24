import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  Clock,
  Pill,
  Calendar,
  Package,
  Video,
  ShieldCheck,
  Zap,
  ExternalLink,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { INITIAL_NOTIFICATIONS, NotificationLog } from '../reminders/remindersData';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onShowToast: (msg: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowToast,
}) => {
  const [notifications, setNotifications] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('user_notifications_log');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important'>('all');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('user_notifications_log', JSON.stringify(notifications));
  }, [notifications]);

  // Real-Time Notification Simulation Engine
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate an incoming real-time health alert after initial load
      const liveAlerts = [
        {
          title: '⚡ Real-Time Alert: Medication Due',
          description: 'Amoxicillin 500mg (Post-Dinner) is scheduled right now.',
          category: 'Medication' as const,
          relatedModule: 'medicines'
        },
        {
          title: '⚡ Real-Time Update: Lab Test Uploaded',
          description: 'CBC Blood Report from Apollo Hospital has been scanned & indexed.',
          category: 'System' as const,
          relatedModule: 'records'
        },
        {
          title: '⚡ Real-Time Reminder: Upcoming Consult',
          description: 'Dr. Priya Sharma is ready for your video consultation in 15 mins.',
          category: 'Consultation' as const,
          relatedModule: 'consultation'
        }
      ];

      const chosen = liveAlerts[Math.floor(Math.random() * liveAlerts.length)];
      const newNotif: NotificationLog = {
        id: `NOTIF-${Date.now().toString().slice(-5)}`,
        title: chosen.title,
        description: chosen.description,
        category: chosen.category,
        timeAgo: 'Just now',
        date: 'Today',
        isRead: false,
        relatedModule: chosen.relatedModule as any
      };

      setNotifications((prev) => {
        // Avoid duplicate insertion
        if (prev.some((n) => n.title === newNotif.title)) return prev;
        return [newNotif, ...prev];
      });
      onShowToast(`🔔 ${chosen.title}`);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    if (activeTab === 'important') return n.category === 'Medication' || n.category === 'Appointment';
    return true;
  });

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onShowToast('✓ All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    onShowToast('Cleared all notifications');
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleSimulateLiveNotification = () => {
    const sampleTitles = [
      { title: '⚡ Heart Rate Sync Complete', desc: 'Average resting pulse 72 BPM verified by Apple Health.', cat: 'System' as const },
      { title: '⚡ Pharmacy Delivery Update', desc: 'Rx Order RX-2026-00482 delivered to your doorstep.', cat: 'Pharmacy' as const },
      { title: '⚡ Prescription Renewal Alert', desc: 'Metformin 500mg prescription will expire in 3 days.', cat: 'Medication' as const }
    ];
    const item = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];

    const newNotif: NotificationLog = {
      id: `NOTIF-${Date.now().toString().slice(-5)}`,
      title: item.title,
      description: item.desc,
      category: item.cat,
      timeAgo: 'Just now',
      date: 'Today',
      isRead: false
    };

    setNotifications((prev) => [newNotif, ...prev]);
    onShowToast(`🔔 Real-Time Notification Triggered!`);
  };

  const getCategoryIcon = (cat: NotificationLog['category']) => {
    switch (cat) {
      case 'Medication':
        return <Pill className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Appointment':
        return <Calendar className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />;
      case 'Pharmacy':
        return <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Consultation':
        return <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-14 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-slate-900 dark:text-white"
      >
        {/* TOP HEADER */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400 border border-teal-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Real-Time Notifications</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                {unreadCount > 0 ? `${unreadCount} unread health alerts` : 'All alerts up to date'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSimulateLiveNotification}
              className="p-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-[#00a896] dark:text-cyan-400 border border-teal-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              title="Simulate Real-Time Live Notification"
            >
              <Zap className="w-3 h-3 animate-pulse" />
              <span>Simulate</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                title="Clear all notifications"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* TAB FILTER BADGES */}
        <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-[11px] font-mono font-bold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#00a896] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({notifications.length})
          </button>

          <button
            onClick={() => setActiveTab('unread')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'unread'
                ? 'bg-[#00a896] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Unread ({unreadCount})
          </button>

          <button
            onClick={() => setActiveTab('important')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer ${
              activeTab === 'important'
                ? 'bg-[#00a896] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Important
          </button>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.relatedModule) {
                    onNavigate(n.relatedModule);
                    onClose();
                  }
                }}
                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group ${
                  n.isRead
                    ? 'bg-white dark:bg-slate-900 opacity-80 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    : 'bg-teal-500/5 dark:bg-teal-500/10 hover:bg-teal-500/10 dark:hover:bg-teal-500/15'
                }`}
              >
                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-extrabold'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.timeAgo}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
                    {n.description}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-[#00a896] dark:text-cyan-400 font-bold">
                      {n.category}
                    </span>

                    <button
                      onClick={(e) => handleToggleRead(n.id, e)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold cursor-pointer underline"
                    >
                      {n.isRead ? 'Mark unread' : 'Mark read'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center space-y-2 text-slate-500 dark:text-slate-400 font-medium">
              <CheckCircle2 className="w-8 h-8 mx-auto text-[#00a896]" />
              <p className="text-xs">No notifications found in this view.</p>
            </div>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center font-sans">
          <button
            onClick={() => {
              onNavigate('reminders');
              onClose();
            }}
            className="text-xs font-extrabold text-[#00a896] dark:text-cyan-400 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <span>View All Reminders & Notification Logs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

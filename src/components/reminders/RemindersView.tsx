import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Bell,
  Pill,
  Calendar as CalendarIcon,
  Video,
  Settings,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { ReminderItem, NotificationLog, NotificationSettingsState } from './remindersData';
import {
  INITIAL_REMINDERS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_SETTINGS
} from './remindersData';
import { CreateReminderModal } from './CreateReminderModal';
import { RemindersFilterDrawer } from './RemindersFilterDrawer';
import type { RemindersFilterState } from './RemindersFilterDrawer';
import { ReminderDetailsDrawer } from './ReminderDetailsDrawer';
import { SnoozeModal } from './SnoozeModal';
import { NotificationSettingsDrawer } from './NotificationSettingsDrawer';
import { ConfirmClearHistoryModal } from './ConfirmClearHistoryModal';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface RemindersViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  const [_loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STATE & LOCALSTORAGE PERSISTENCE
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettingsState>(DEFAULT_NOTIFICATION_SETTINGS);

  // VIEW SWITCHER: 'list' | 'timeline' | 'calendar'
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'calendar'>('list');

  // SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<RemindersFilterState>({
    category: 'All',
    status: 'All',
    sortBy: 'Time'
  });

  // MODAL STATES
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<ReminderItem | NotificationLog | null>(null);
  const [snoozeTarget, setSnoozeTarget] = useState<ReminderItem | null>(null);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false);

  // Load from localStorage on mount & simulate short skeleton
  useEffect(() => {
    const savedReminders = localStorage.getItem('user_reminders');
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {
        console.error(e);
      }
    }
    const savedNotifs = localStorage.getItem('user_notifications');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {
        console.error(e);
      }
    }
    const savedSetts = localStorage.getItem('user_notification_settings');
    if (savedSetts) {
      try {
        setSettings(JSON.parse(savedSetts));
      } catch (e) {
        console.error(e);
      }
    }
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveRemindersState = (newReminders: ReminderItem[]) => {
    setReminders(newReminders);
    localStorage.setItem('user_reminders', JSON.stringify(newReminders));
  };

  const saveNotificationsState = (newNotifs: NotificationLog[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('user_notifications', JSON.stringify(newNotifs));
  };

  const saveSettingsState = (newSetts: NotificationSettingsState) => {
    setSettings(newSetts);
    localStorage.setItem('user_notification_settings', JSON.stringify(newSetts));
  };

  // METRICS
  const todayRemindersCount = reminders.filter((r) => r.date === '24 Aug 2026' || r.status === 'Upcoming').length;
  const upcomingRemindersCount = reminders.filter((r) => r.status === 'Upcoming').length;
  const completedRemindersCount = reminders.filter((r) => r.status === 'Completed').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // REMINDER ACTIONS
  const handleMarkComplete = (id: string, title: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = reminders.map((r) => {
      if (r.id === id) {
        return { ...r, status: 'Completed' as const, completedTime: nowTime };
      }
      return r;
    });
    saveRemindersState(updated);
    showToast(`✓ Marked ${title} as completed at ${nowTime}`);
  };

  const handleSnoozeConfirm = (id: string, mins: number) => {
    const updated = reminders.map((r) => {
      if (r.id === id) {
        return { ...r, status: 'Snoozed' as const, snoozedUntil: `${mins}m later` };
      }
      return r;
    });
    saveRemindersState(updated);
    showToast(`Snoozed reminder for ${mins} minutes`);
  };

  const handleSaveNewReminder = (newRem: Partial<ReminderItem>) => {
    const created: ReminderItem = {
      id: newRem.id || `REM-${Date.now().toString().slice(-4)}`,
      title: newRem.title || 'New Reminder',
      category: newRem.category || 'General',
      description: newRem.description || 'Health activity reminder',
      date: newRem.date || '24 Aug 2026',
      time: newRem.time || '12:30 PM',
      repeat: newRem.repeat || 'Daily',
      timing: newRem.timing || 'At scheduled time',
      status: 'Upcoming',
      priority: newRem.priority || 'Normal',
      relatedModule: newRem.relatedModule
    };

    const updated = [created, ...reminders];
    saveRemindersState(updated);
    showToast(`✓ Reminder created successfully`);
  };

  // NOTIFICATION ACTIONS
  const handleMarkNotifRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveNotificationsState(updated);
  };

  const handleMarkAllNotifsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    saveNotificationsState(updated);
    showToast('✓ All notifications marked as read');
  };

  const handleConfirmClearHistory = () => {
    saveNotificationsState([]);
    setClearHistoryOpen(false);
    showToast('✓ Notification history cleared');
  };

  const handleSaveSettings = (updated: NotificationSettingsState) => {
    saveSettingsState(updated);
    showToast('✓ Notification settings saved');
  };

  // ICON HELPER
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Medicine':
        return <Pill className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Appointment':
        return <CalendarIcon className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />;
      case 'Video Consultation':
        return <Video className="w-4 h-4 text-[#00a896] dark:text-teal-400" />;
      default:
        return <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  // FILTERED REMINDERS
  const filteredReminders = reminders.filter((r) => {
    if (filters.category !== 'All' && r.category !== filters.category) return false;
    if (filters.status !== 'All' && r.status !== filters.status) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16 font-sans">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#00a896] text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-teal-300/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Reminders & Notifications"
        subtitle="Stay updated with your medicines, appointments and health activities."
        badgeText="Smart Alert Hub"
        badgeIcon={<Bell className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => setSettingsDrawerOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Settings className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
              <span>Notification Settings</span>
            </button>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Reminder</span>
            </button>
          </div>
        }
      />

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Today</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{todayRemindersCount}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Scheduled</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Upcoming</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-teal-400 border border-teal-500/20">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00a896] dark:text-teal-400">{upcomingRemindersCount}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Completed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">{completedRemindersCount}</span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold font-sans">Done</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 border border-purple-200 dark:border-purple-500/30 p-4 sm:p-5 rounded-3xl space-y-2 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400">Unread</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 dark:text-purple-300">{unreadNotifsCount}</span>
            <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold font-sans">New alerts</span>
          </div>
        </div>
      </div>

      {/* 3. VIEW SWITCHER & SEARCH / FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 p-4 rounded-3xl shadow-xl">
        {/* VIEW MODE TABS */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto font-mono">
          {[
            { id: 'list', label: 'List View' },
            { id: 'timeline', label: 'Notification Timeline' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans ${
                viewMode === tab.id
                  ? 'bg-[#00a896] text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH & FILTER */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reminders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
            />
          </div>
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA BASED ON VIEW MODE */}

      {/* VIEW MODE 1: LIST VIEW */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* TODAY'S REMINDERS (LEFT 6 COLS) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Today's Reminders</h3>
              <span className="text-[10px] font-mono font-bold text-[#00a896] dark:text-cyan-400 bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                24 Aug 2026
              </span>
            </div>

            <div className="space-y-3">
              {filteredReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-2xl space-y-3 transition-all group shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
                        {getCategoryIcon(rem.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-cyan-300 transition-colors">
                          {rem.title}
                        </h4>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{rem.category} • {rem.description}</span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      rem.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : rem.status === 'Snoozed'
                        ? 'bg-teal-500/15 text-teal-700 dark:text-cyan-300 border border-teal-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}>
                      {rem.status === 'Completed' ? `✓ Done at ${rem.completedTime || '08:02 AM'}` : rem.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="font-mono font-bold text-[#00a896] dark:text-cyan-300">{rem.time}</span>

                    {rem.status !== 'Completed' && (
                      <div className="flex items-center gap-2 font-sans">
                        <button
                          onClick={() => setSnoozeTarget(rem)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[10px] font-bold cursor-pointer"
                        >
                          Snooze
                        </button>
                        <button
                          onClick={() => handleMarkComplete(rem.id, rem.title)}
                          className="px-3 py-1 rounded-lg bg-[#00a896] hover:bg-[#00897b] text-white text-[10px] font-extrabold cursor-pointer shadow-sm"
                        >
                          Mark as Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING REMINDERS (RIGHT 6 COLS) */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Upcoming & Scheduled</h3>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">Chronological</span>
            </div>

            <div className="space-y-4 font-mono">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 block border-b border-slate-200 dark:border-slate-800 pb-1">
                Tomorrow • 25 Aug 2026
              </span>

              <div className="space-y-2.5 font-sans">
                {reminders.filter((r) => r.date === '25 Aug 2026' || r.date === '26 Aug 2026').map((r) => (
                  <div key={r.id} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {getCategoryIcon(r.category)}
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{r.title}</h4>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">{r.date} at {r.time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setDetailTarget(r)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[#00a896] dark:text-cyan-300 text-[10px] font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-mono"
                    >
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Notification Stream Timeline</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Chronological log of alerts & system updates</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllNotifsRead}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 text-xs font-bold border border-slate-300 dark:border-slate-700 cursor-pointer shadow-sm"
              >
                Mark All as Read
              </button>
              <button
                onClick={() => setClearHistoryOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/30 cursor-pointer"
              >
                Clear History
              </button>
            </div>
          </div>

          {/* NOTIFICATION LOGS LIST */}
          <div className="space-y-3 font-mono">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkNotifRead(notif.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 font-sans ${
                  notif.isRead
                    ? 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                    : 'bg-teal-500/10 dark:bg-teal-500/10 border-teal-500/30 ring-1 ring-teal-500/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{notif.title}</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 font-medium">{notif.message}</p>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 block">{notif.timestamp}</span>
                  </div>
                </div>

                {!notif.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00a896] dark:bg-cyan-400 animate-pulse shrink-0 mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS & DRAWERS */}
      <CreateReminderModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleSaveNewReminder}
      />

      <RemindersFilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(updated) => setFilters(updated)}
      />

      <ReminderDetailsDrawer
        item={detailTarget}
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        onDismiss={handleDismissReminder}
      />

      <SnoozeModal
        reminder={snoozeTarget}
        isOpen={!!snoozeTarget}
        onClose={() => setSnoozeTarget(null)}
        onConfirmSnooze={handleSnoozeConfirm}
      />

      <NotificationSettingsDrawer
        isOpen={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <ConfirmClearHistoryModal
        isOpen={clearHistoryOpen}
        onClose={() => setClearHistoryOpen(false)}
        onConfirmClear={handleConfirmClearHistory}
      />
    </div>
  );
};

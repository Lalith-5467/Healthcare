import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Pill, Calendar as CalendarIcon, Video, Settings, Plus, Search, Filter,
  CheckCircle2, Clock, ChevronLeft, ChevronRight, Edit2, Trash2, CalendarDays, Activity, Briefcase, User, MoreHorizontal, AlertCircle
} from 'lucide-react';
import type { ReminderItem, NotificationLog, NotificationSettingsState } from './remindersData';
import {
  INITIAL_REMINDERS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_SETTINGS
} from './remindersData';
import {
  updateReminderFollowUpStatus,
  getReminders as getStoredReminders,
  getNotifications as getStoredNotifications
} from '../../utils/healthWorkflowStorage';
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
  initialViewMode?: 'list' | 'timeline' | 'calendar';
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  user: _user,
  onNavigate: _onNavigate,
  initialViewMode = 'list'
}) => {
  const [_loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STATE & LOCALSTORAGE PERSISTENCE
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettingsState>(DEFAULT_NOTIFICATION_SETTINGS);

  // VIEW SWITCHER
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'calendar'>(initialViewMode);

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<RemindersFilterState>({
    category: 'All',
    status: 'All',
    sortBy: 'Time'
  });

  const [editingReminder, setEditingReminder] = useState<ReminderItem | null>(null);

  // MODAL STATES
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState<ReminderItem | NotificationLog | null>(null);
  const [snoozeTarget, setSnoozeTarget] = useState<ReminderItem | null>(null);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [clearHistoryOpen, setClearHistoryOpen] = useState(false);

  const loadAllData = () => {
    const loadedReminders = getStoredReminders();
    if (loadedReminders && loadedReminders.length > 0) {
      setReminders(loadedReminders);
    }
    const loadedNotifs = getStoredNotifications();
    if (loadedNotifs && loadedNotifs.length > 0) {
      setNotifications(loadedNotifs);
    }
    const savedSetts = localStorage.getItem('user_notification_settings');
    if (savedSetts) {
      try {
        setSettings(JSON.parse(savedSetts));
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadAllData();
    const handleUpdate = () => loadAllData();
    window.addEventListener('notifications_updated', handleUpdate);
    window.addEventListener('health_workflow_updated', handleUpdate);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => {
      window.removeEventListener('notifications_updated', handleUpdate);
      window.removeEventListener('health_workflow_updated', handleUpdate);
      clearTimeout(timer);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const saveRemindersState = (newReminders: ReminderItem[]) => {
    setReminders(newReminders);
    localStorage.setItem('user_reminders', JSON.stringify(newReminders));
    window.dispatchEvent(new Event('notifications_updated'));
    window.dispatchEvent(new Event('health_workflow_updated'));
  };

  const saveNotificationsState = (newNotifs: NotificationLog[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('user_notifications', JSON.stringify(newNotifs));
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const saveSettingsState = (newSetts: NotificationSettingsState) => {
    setSettings(newSetts);
    localStorage.setItem('user_notification_settings', JSON.stringify(newSetts));
  };

  // ACCEPT & DECLINE DOCTOR FOLLOW-UPS
  const handleAcceptFollowUp = (id: string) => {
    updateReminderFollowUpStatus(id, 'Accepted');
    loadAllData();
    showToast('✓ Appointment Accepted! Follow-up confirmed with doctor.');
  };

  const handleDeclineFollowUp = (id: string) => {
    updateReminderFollowUpStatus(id, 'Declined');
    loadAllData();
    showToast('✕ Appointment Declined.');
  };

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
    showToast(`✓ Marked ${title} as completed`);
  };

  const handleDeleteReminder = (id: string, title: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveRemindersState(updated);
    showToast(`Deleted ${title}`);
  };

  const handleDismissReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveRemindersState(updated);
    setDetailTarget(null);
    showToast('Reminder dismissed');
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
    if (editingReminder) {
      const updated = reminders.map(r => r.id === newRem.id ? { ...r, ...newRem } as ReminderItem : r);
      saveRemindersState(updated);
      showToast('Reminder updated successfully');
      setEditingReminder(null);
    } else {
      const fullRem = { 
        id: `REM-${Date.now().toString().slice(-4)}`,
        title: newRem.title || 'New Reminder',
        category: newRem.category || 'General',
        description: newRem.description || 'Health activity reminder',
        date: newRem.date || '24 Aug 2026',
        time: newRem.time || '12:30 PM',
        repeat: newRem.repeat || 'Daily',
        timing: newRem.timing || 'At scheduled time',
        status: 'Upcoming',
        priority: newRem.priority || 'Normal',
        ...newRem 
      } as ReminderItem;
      const updated = [fullRem, ...reminders];
      saveRemindersState(updated);
      showToast('Reminder created successfully');
    }
  };

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

  // METRICS & COMPUTED DATA
  const todayDateStr = '24 Aug 2026'; // Hardcoded for this mockup
  const totalReminders = reminders.length;
  const todayRemindersCount = reminders.filter((r) => r.date === todayDateStr).length;
  const upcomingRemindersCount = reminders.filter((r) => r.status === 'Upcoming' && r.date !== todayDateStr).length;
  const completedRemindersCount = reminders.filter((r) => r.status === 'Completed').length;

  const filteredReminders = reminders.filter((r) => {
    if (filters.category !== 'All' && r.category !== filters.category) return false;
    if (filters.status !== 'All' && r.status !== filters.status) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const todaysReminders = filteredReminders.filter(r => r.date === todayDateStr).sort((a,b) => a.time.localeCompare(b.time));
  const futureReminders = filteredReminders.filter(r => r.date !== todayDateStr).sort((a,b) => a.date.localeCompare(b.date));

  // Determine "Next Reminder" (first upcoming today)
  const nextReminder = todaysReminders.find(r => r.status === 'Upcoming');

  // ICON HELPER
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Medication':
        return { icon: Pill, bg: 'bg-amber-100/50', text: 'text-amber-600', border: 'border-amber-200' };
      case 'Appointment':
        return { icon: CalendarIcon, bg: 'bg-teal-100/50', text: 'text-teal-600', border: 'border-teal-200' };
      case 'Pharmacy':
        return { icon: Briefcase, bg: 'bg-blue-100/50', text: 'text-blue-600', border: 'border-blue-200' };
      case 'Consultation':
        return { icon: Video, bg: 'bg-purple-100/50', text: 'text-purple-600', border: 'border-purple-200' };
      default:
        return { icon: Activity, bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' };
    }
  };

  // CALENDAR LOGIC
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 7, 1)); // Default: August 2026

  const nextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  const prevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));

  const daysInMonth = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();
  const startDayOfWeek = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1).getDay(); // 0 = Sunday
  
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - startDayOfWeek + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const getDayReminders = (dayNum: number) => {
    const monthStr = calendarDate.toLocaleString('en-US', { month: 'short' });
    const formattedDate = `${dayNum.toString().padStart(2, '0')} ${monthStr} ${calendarDate.getFullYear()}`;
    return reminders.filter(r => r.date === formattedDate);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20 font-sans bg-slate-50/50 rounded-[2.5rem] p-2 sm:p-6 -mx-2 sm:-mx-6">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden bg-white/70 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-200/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/30 to-cyan-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-pink-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 shadow-sm text-teal-600">
                <Bell className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Reminders & Notifications</h1>
            </div>
            <p className="text-slate-500 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
              Stay organized and never miss an important health reminder. Manage your medications, appointments, and wellness tasks in one place.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSettingsDrawerOpen(true)}
              className="px-5 py-3.5 rounded-2xl font-bold text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={() => { setEditingReminder(null); setCreateModalOpen(true); }}
              className="px-6 py-3.5 rounded-2xl font-extrabold text-sm text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Reminders', value: totalReminders, icon: CalendarDays, color: 'text-blue-600', hoverBg: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white' },
          { label: 'Today', value: todayRemindersCount, icon: Clock, color: 'text-teal-600', hoverBg: 'bg-gradient-to-br from-teal-100 via-teal-50 to-white' },
          { label: 'Upcoming', value: upcomingRemindersCount, icon: Activity, color: 'text-purple-600', hoverBg: 'bg-gradient-to-br from-purple-100 via-purple-50 to-white' },
          { label: 'Completed', value: completedRemindersCount, icon: CheckCircle2, color: 'text-emerald-600', hoverBg: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-white' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative p-6 rounded-3xl bg-white border border-white/80 shadow-xl shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between h-32 cursor-pointer group overflow-hidden"
          >
            {/* Hover Background overlay */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${stat.hoverBg}`} />
            
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-white/50 ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="relative z-10 text-3xl font-extrabold text-slate-900 group-hover:text-slate-800 transition-colors">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* 3. NEXT REMINDER HIGHLIGHT */}
      {nextReminder && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          {/* Subtle abstract background element */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-40 -bottom-20 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 shrink-0">
              <AlertCircle className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1 block">Next Reminder</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{nextReminder.title}</h2>
              <p className="text-slate-500 text-sm font-medium">
                Today · {nextReminder.time} <span className="mx-2 text-slate-300">•</span> <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">In 42 minutes</span>
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button 
              onClick={() => setDetailTarget(nextReminder)}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              Details
            </button>
            <button 
              onClick={() => handleMarkComplete(nextReminder.id, nextReminder.title)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-extrabold text-sm text-white bg-teal-500 hover:bg-teal-400 shadow-lg shadow-teal-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Done</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. MAIN LAYOUT (2 COLUMNS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TODAY'S REMINDERS */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">Today's Schedule</h3>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              {todayDateStr}
            </span>
          </div>

          {todaysReminders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center shadow-lg shadow-slate-200/30">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10 text-slate-300" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">All caught up!</h4>
              <p className="text-sm text-slate-500 mb-6">You have no more reminders scheduled for today.</p>
              <button 
                onClick={() => { setEditingReminder(null); setCreateModalOpen(true); }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
              >
                + Create Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysReminders.map((rem) => {
                const badge = getCategoryBadge(rem.category);
                const Icon = badge.icon;
                const isCompleted = rem.status === 'Completed';

                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={rem.id} 
                    className={`group bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 border hover:-translate-y-0.5 ${
                      isCompleted ? 'border-slate-100 opacity-60 bg-slate-50' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <button 
                        onClick={() => !isCompleted && handleMarkComplete(rem.id, rem.title)}
                        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer border-2 shadow-sm ${
                          isCompleted 
                            ? 'bg-teal-500 border-teal-500 text-white shadow-teal-500/30 scale-95' 
                            : 'bg-slate-50 border-slate-200 hover:border-teal-400 hover:bg-teal-50 hover:scale-110 hover:shadow-md hover:shadow-teal-500/20'
                        }`}
                      >
                        <CheckCircle2 className={`w-5 h-5 transition-all duration-300 ${isCompleted ? 'text-white' : 'text-teal-400 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100'}`} />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className={`text-sm font-extrabold truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {rem.title}
                          </h4>
                          {rem.sourcePrescriptionId ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20">
                              Scheduled
                            </span>
                          ) : rem.status === 'Completed' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              Completed
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                              Upcoming
                            </span>
                          )}
                          {rem.priority === 'High Priority' && !isCompleted && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border} flex items-center gap-1`}>
                            <Icon className="w-3 h-3" />
                            {rem.category}
                          </span>
                          {rem.sourcePrescriptionId && (
                            <span className="text-[10px] font-mono text-[#00a896] dark:text-cyan-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                              Rx: {rem.sourcePrescriptionId}
                            </span>
                          )}
                          <span>•</span>
                          <span className="truncate">{rem.description}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-between sm:justify-end pl-10 sm:pl-0 flex-wrap">
                      <span className={`text-sm font-bold font-mono ${isCompleted ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                        {rem.time}
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingReminder(rem); setCreateModalOpen(true); }}
                          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit reminder"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteReminder(rem.id, rem.title)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Delete reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CALENDAR */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">Calendar</h3>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/30">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-extrabold text-slate-900">
                {calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={nextMonth} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-[10px] font-bold text-slate-400 py-1">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2 gap-x-1">
              {calendarDays.map((dayNum, idx) => {
                if (!dayNum) return <div key={idx} className="h-8" />;
                
                const isToday = dayNum === 24 && calendarDate.getMonth() === 7 && calendarDate.getFullYear() === 2026;
                const dayReminders = getDayReminders(dayNum);
                const hasReminders = dayReminders.length > 0;

                return (
                  <div key={idx} className="relative flex justify-center group cursor-pointer">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isToday 
                        ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 group-hover:bg-teal-400' 
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}>
                      {dayNum}
                    </div>
                    {hasReminders && !isToday && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-teal-400" />
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-100">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-3">
                 <div className="w-2 h-2 rounded-full bg-teal-400" />
                 <span>Days with reminders</span>
               </div>
               <button 
                 onClick={() => setFilterDrawerOpen(true)}
                 className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
               >
                 Filter Calendar View
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. UPCOMING REMINDERS TIMELINE */}
      <div className="space-y-6 pt-8">
        <h3 className="text-xl font-extrabold text-slate-900">Upcoming Reminders</h3>
        
        {futureReminders.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-bold text-slate-500">No upcoming reminders scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureReminders.map(rem => {
              const badge = getCategoryBadge(rem.category);
              const Icon = badge.icon;
              return (
                <div key={rem.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md shadow-slate-200/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${badge.bg} ${badge.text} ${badge.border} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{rem.title}</h4>
                        {rem.sourcePrescriptionId ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20">
                            Scheduled
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">
                        {rem.date} • {rem.time} {rem.sourcePrescriptionId ? `• Rx: ${rem.sourcePrescriptionId}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => setDetailTarget(rem)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-[#00a896] dark:text-cyan-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => { setEditingReminder(rem); setCreateModalOpen(true); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit reminder"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteReminder(rem.id, rem.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS & DRAWERS */}
      <CreateReminderModal
        isOpen={createModalOpen}
        onClose={() => { setCreateModalOpen(false); setEditingReminder(null); }}
        onSaveReminder={handleSaveNewReminder}
        initialData={editingReminder}
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
        onNavigateModule={(mod) => _onNavigate(mod)}
        onDismiss={handleDismissReminder}
        onAcceptFollowUp={handleAcceptFollowUp}
        onDeclineFollowUp={handleDeclineFollowUp}
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
        onUpdateSettings={handleSaveSettings}
        onShowToast={showToast}
      />

      <ConfirmClearHistoryModal
        isOpen={clearHistoryOpen}
        onClose={() => setClearHistoryOpen(false)}
        onConfirmClear={handleConfirmClearHistory}
      />
    </div>
  );
};

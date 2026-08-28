import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Pill, Calendar as CalendarIcon, Video, Settings,
  CheckCircle2, Clock, ChevronLeft, ChevronRight, Edit2, Trash2, CalendarDays, Activity, Briefcase, AlertCircle, X, RefreshCw
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

const addMinutesToTimeStr = (timeStr: string, minutes: number): string => {
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return timeStr;
  let hours = parseInt(match[1], 10);
  const mins = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  
  let newHours = date.getHours();
  const newMins = date.getMinutes();
  const newAmpm = newHours >= 12 ? 'PM' : 'AM';
  
  newHours = newHours % 12;
  if (newHours === 0) newHours = 12;
  
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')} ${newAmpm}`;
};

const formatFullDate = (dStr: string) => {
  const months: Record<string, string> = {
    Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June',
    Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December'
  };
  const parts = dStr.split(' ');
  if (parts.length === 3) {
    const monthPart = parts[1];
    const monthFull = months[monthPart] || monthPart;
    return `${parts[0]} ${monthFull} ${parts[2]}`;
  }
  return dStr;
};

const getCardTitle = (item: ReminderItem) => {
  if (item.category === 'Appointment') {
    return `Doctor Follow-up — ${item.doctorName || 'Dr. Arun Kumar'}`;
  }
  return item.title;
};

const getPastCardTitle = (rem: ReminderItem) => {
  if (rem.status === 'Declined' || rem.followUpStatus === 'Declined') {
    return `Doctor Follow-up — ${rem.doctorName || 'Dr. Arun Kumar'}`;
  }
  if (rem.status === 'Completed' && rem.category === 'Appointment') {
    return 'Follow-up Appointment';
  }
  if (rem.status === 'Cancelled' && rem.category === 'Appointment') {
    return `Cancelled Doctor Follow-up — ${rem.doctorName || 'Dr. Arun Kumar'}`;
  }
  return rem.title;
};

const getTomorrowDateStr = (dateStr: string): string => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthIdx = months.indexOf(parts[1]);
      const year = parseInt(parts[2], 10);
      if (day > 0 && monthIdx >= 0 && year > 0) {
        const d = new Date(year, monthIdx, day);
        d.setDate(d.getDate() + 1);
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      d.setDate(d.getDate() + 1);
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

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
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [declineConfirmTarget, setDeclineConfirmTarget] = useState<ReminderItem | null>(null);

  const loadAllData = () => {
    const loadedReminders = getStoredReminders();
    setReminders(loadedReminders);

    const loadedNotifs = getStoredNotifications();
    setNotifications(loadedNotifs);

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
    setTimeout(() => setToastMessage(null), 3500);
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

  const handleAcceptFollowUp = async (id: string) => {
    if (confirmingId) return; // Prevent duplicate clicks
    setConfirmingId(id);
    // Mimic quick api/loading latency
    await new Promise((r) => setTimeout(r, 600));

    try {
      const target = reminders.find(r => r.id === id);
      if (!target) {
        throw new Error('Appointment not found');
      }
      const docName = target.doctorName || 'Dr. Arun Kumar';

      // 1. Update in local storage
      updateReminderFollowUpStatus(id, 'Accepted');
      
      // 2. Reload state
      loadAllData();
      setDetailTarget(null);

      showToast('Appointment confirmed\nYour appointment has been confirmed and a reminder has been added to your schedule.');
    } catch (e) {
      showToast(`Unable to confirm appointment\nPlease try again.`);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleDeclineFollowUp = (id: string) => {
    const req = reminders.find(r => r.id === id);
    if (req) {
      setDeclineConfirmTarget(req);
    }
  };

  const handleDeclineFollowUpConfirm = (id: string) => {
    try {
      // 1. Update in local storage
      updateReminderFollowUpStatus(id, 'Declined');
      
      // 2. Reload state
      loadAllData();
      setDetailTarget(null);
      setDeclineConfirmTarget(null);

      showToast('Appointment declined\nThe appointment request has been declined.');
    } catch (e) {
      showToast(`Unable to decline appointment\nPlease try again.`);
    }
  };

  const handleSnoozeConfirm = (id: string, mins: number) => {
    const target = reminders.find(r => r.id === id);
    if (!target) return;

    let newTime = target.time;
    let newDate = target.date;
    let toastMessageText = '';

    if (mins === 1440) {
      newDate = getTomorrowDateStr(target.date);
      toastMessageText = `Reminder snoozed\nReminder moved to tomorrow.`;
    } else {
      newTime = addMinutesToTimeStr(target.time, mins);
      toastMessageText = `Reminder snoozed\nReminder moved to ${newTime}.`;
    }

    const updated = reminders.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          time: newTime,
          date: newDate,
          status: 'Snoozed' as const
        };
      }
      return r;
    });

    saveRemindersState(updated);
    showToast(toastMessageText);
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
  const todayDateStr = '24 Aug 2026'; // Hardcoded today's date

  // Filter out pending, declined, completed, and cancelled reminders to get active ones
  const activeReminders = reminders.filter(r => r && 
    r.status !== 'Pending' && 
    r.followUpStatus !== 'Pending' && 
    r.status !== 'Declined' && 
    r.followUpStatus !== 'Declined' && 
    r.status !== 'Completed' && 
    r.status !== 'Cancelled'
  );
  const totalRemindersCount = activeReminders.length;
  const todayRemindersCount = activeReminders.filter((r) => r && r.date === todayDateStr).length;
  const upcomingRemindersCount = activeReminders.filter((r) => r && r.date !== todayDateStr).length;
  const completedRemindersCount = reminders.filter((r) => r && r.status === 'Completed').length;

  const filteredReminders = reminders.filter((r) => {
    if (!r) return false;
    if (filters.category !== 'All' && r.category !== filters.category) return false;
    if (filters.status !== 'All' && r.status !== filters.status) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const title = r.title || '';
      const desc = r.description || '';
      if (!title.toLowerCase().includes(q) && !desc.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Today's Schedule - active/confirmed only
  const todaysReminders = filteredReminders.filter(r => r && 
    r.date === todayDateStr && 
    r.status !== 'Completed' && 
    r.status !== 'Cancelled' && 
    r.status !== 'Pending' && 
    r.followUpStatus !== 'Pending' && 
    r.status !== 'Declined' && 
    r.followUpStatus !== 'Declined'
  ).sort((a,b) => (a.time || '').localeCompare(b.time || ''));
  
  // Future Confirmed Reminders - active/confirmed only
  const futureReminders = filteredReminders.filter(r => r && 
    r.date !== todayDateStr && 
    r.status !== 'Completed' && 
    r.status !== 'Cancelled' && 
    r.status !== 'Pending' && 
    r.followUpStatus !== 'Pending' && 
    r.status !== 'Declined' && 
    r.followUpStatus !== 'Declined'
  ).sort((a,b) => (a.date || '').localeCompare(b.date || ''));

  // Completed & History Reminders
  const completedAndHistoryReminders = reminders.filter(r => r && (
    r.status === 'Completed' || 
    r.status === 'Cancelled' || 
    r.status === 'Declined' || 
    r.followUpStatus === 'Declined'
  ));

  // Pending Appointment Requests
  const pendingRequests = reminders.filter(r => r && (r.status === 'Pending' || r.followUpStatus === 'Pending'));

  // Determine "Next Reminder" (first upcoming today)
  const nextReminder = todaysReminders.find(r => r.status === 'Upcoming' || r.status === 'Snoozed');

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
        return { icon: Activity, bg: 'bg-slate-100', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800' };
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
    const formattedDate1 = `${dayNum.toString().padStart(2, '0')} ${monthStr} ${calendarDate.getFullYear()}`;
    const formattedDate2 = `${dayNum} ${monthStr} ${calendarDate.getFullYear()}`;
    return reminders.filter(r => {
      if (!r) return false;
      const onThisDate = (r.date === formattedDate1 || r.date === formattedDate2);
      if (!onThisDate) return false;
      
      // Show only Confirmed or Completed items; hide Pending, Declined, and Cancelled events
      const isConfirmed = r.status === 'Confirmed' || r.status === 'Upcoming' || r.status === 'Snoozed' || r.status === 'Due Now' || r.followUpStatus === 'Accepted';
      const isCompleted = r.status === 'Completed';
      return isConfirmed || isCompleted;
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20 font-sans bg-slate-50/50 dark:bg-transparent rounded-[2.5rem] p-2 sm:p-6 -mx-2 sm:-mx-6">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-slate-700 whitespace-pre-line"
          >
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700 shadow-2xl shadow-slate-200/40 dark:shadow-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/30 to-cyan-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/20 to-pink-300/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/40 dark:to-cyan-900/40 border border-teal-100 dark:border-teal-800 shadow-sm text-teal-600 dark:text-teal-400">
                <Bell className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reminders & Notifications</h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
              Stay organized and never miss an important health reminder. Your medications, pharmacy updates, and accepted follow-ups are automatically updated here.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSettingsDrawerOpen(true)}
              className="px-5 py-3.5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:bg-slate-950 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Reminders', value: totalRemindersCount, icon: CalendarDays, color: 'text-blue-600', hoverBg: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white' },
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
            className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-white/80 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 flex flex-col justify-between h-32 cursor-pointer group overflow-hidden"
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${stat.hoverBg}`} />
            
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{stat.label}</span>
              <div className={`p-2 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm border border-white/50 ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="relative z-10 text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-slate-800 transition-colors">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* 3. NEXT REMINDER HIGHLIGHT */}
      {nextReminder && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-40 -bottom-20 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 shrink-0">
              <AlertCircle className="w-8 h-8 text-teal-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1 block">Next Reminder</span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{nextReminder.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Today · {nextReminder.time} <span className="mx-2 text-slate-300">•</span> <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">Scheduled Time</span>
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <button 
              onClick={() => setDetailTarget(nextReminder)}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
            >
              Details
            </button>
            <button 
              onClick={() => handleMarkComplete(nextReminder.id, nextReminder.title)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-extrabold text-sm text-white bg-teal-500 hover:bg-teal-400 shadow-lg shadow-teal-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Done</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. MAIN LAYOUT (2 COLUMNS) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: TODAY'S SCHEDULE */}
        <div className="xl:col-span-8 space-y-6">

          {/* APPOINTMENT REQUESTS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">Appointment Requests</h3>
                {pendingRequests.length > 0 && (
                  <span className="px-2 py-0.5 text-xs font-black bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20 font-mono">
                    {pendingRequests.length} Pending
                  </span>
                )}
              </div>
            </div>

            {pendingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    layoutId={`request-card-${req.id}`}
                    className="p-5 rounded-3xl bg-amber-500/[0.03] border border-amber-500/20 shadow-md shadow-amber-500/5 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-mono">
                          Appointment Request
                        </span>
                        <span className="text-slate-500 text-[10px] font-bold font-mono">
                          {req.id}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                        {req.doctorName || 'Dr. R. S. Raman, MD (Internal Medicine)'}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {req.clinicName || 'Apollo Multispeciality Hospital, Chennai'}
                      </p>

                      <p className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/40 dark:border-slate-700/50 rounded-xl px-3 py-2 inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{req.date} • {req.time}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-dashed border-amber-500/10">
                      <button
                        type="button"
                        disabled={confirmingId === req.id}
                        onClick={() => handleAcceptFollowUp(req.id)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-black text-white bg-teal-500 hover:bg-teal-400 disabled:bg-teal-500/50 shadow-sm disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {confirmingId === req.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Confirming...</span>
                          </>
                        ) : (
                          <span>Accept</span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeclineFollowUp(req.id)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 transition-colors cursor-pointer"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() => setDetailTarget(req)}
                        className="py-2 px-3 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">No pending appointment requests</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">New appointment requests from doctors will appear here.</p>
                </div>
              </div>
            )}
          </div>

          {/* TODAY'S SCHEDULE SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Today's Schedule</h3>
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-500/20">
                {todayDateStr}
              </span>
            </div>

            {todaysReminders.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center shadow-lg shadow-slate-200/30 dark:shadow-none">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
                  <CalendarDays className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">No appointments scheduled for today</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
                  Your confirmed appointments and reminders for today will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysReminders.map((rem) => {
                  const badge = getCategoryBadge(rem.category);
                  const Icon = badge.icon;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={rem.id} 
                      className="group bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-350 hover:shadow-xl hover:shadow-slate-200/40 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className={`p-2.5 rounded-xl border ${badge.bg} ${badge.text} ${badge.border} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug break-words">
                              {getCardTitle(rem)}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20 font-mono font-mono">
                              Confirmed
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex-wrap font-sans">
                            <span>Today • {rem.time}</span>
                            <span>•</span>
                            <span className="break-words">{rem.description}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end pl-14 sm:pl-0 flex-wrap">
                        <button
                          onClick={() => setDetailTarget(rem)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-[#00a896] dark:text-cyan-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setSnoozeTarget(rem)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-655 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                        >
                          Snooze
                        </button>
                        <button
                          onClick={() => handleMarkComplete(rem.id, rem.title)}
                          className="p-2 rounded-xl text-teal-650 hover:bg-teal-50 transition-colors cursor-pointer"
                          title="Complete Activity"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CALENDAR */}
        <div className="xl:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Calendar</h3>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/30 dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                {calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:bg-slate-950 transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={nextMonth} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:bg-slate-950 transition-colors cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
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
                  <div 
                    key={idx} 
                    onClick={() => hasReminders && setDetailTarget(dayReminders[0])}
                    className="relative flex justify-center group cursor-pointer"
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isToday 
                        ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30 group-hover:bg-teal-400' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100'
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
            
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/60">
               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
                 <div className="w-2 h-2 rounded-full bg-teal-400" />
                 <span>Days with reminders</span>
               </div>
               <button 
                 onClick={() => setFilterDrawerOpen(true)}
                 className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
               >
                 Filter Calendar View
               </button>
             </div>
           </div>
         </div>
       </div>

      {/* 5. UPCOMING REMINDERS SECTION */}
      <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Upcoming Reminders</h3>
        
        {futureReminders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-md">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-3 mx-auto text-slate-400 dark:text-slate-500">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">No upcoming reminders</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your future confirmed appointments and reminders will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {futureReminders.map(rem => {
              const badge = getCategoryBadge(rem.category);
              const Icon = badge.icon;
              return (
                <div key={rem.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:-translate-y-0.5 transition-transform duration-300">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2.5 rounded-xl border ${badge.bg} ${badge.text} ${badge.border} shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug break-words">{getCardTitle(rem)}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20 font-mono font-mono font-mono">
                          Confirmed
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 font-sans">
                        {formatFullDate(rem.date)} • {rem.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => setDetailTarget(rem)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-[#00a896] dark:text-cyan-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => setSnoozeTarget(rem)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      Snooze
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. COMPLETED & HISTORY SECTION */}
      <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Completed & Past History</h3>

        {completedAndHistoryReminders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-md">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-3 mx-auto text-slate-400 dark:text-slate-500">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">No completed appointments yet</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Completed appointments will appear here after your visits.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAndHistoryReminders.map(rem => {
              const badge = getCategoryBadge(rem.category);
              const Icon = badge.icon;
              const isDeclined = rem.status === 'Declined' || rem.followUpStatus === 'Declined';
              const isCompleted = rem.status === 'Completed';
              const isCancelled = rem.status === 'Cancelled';

              return (
                <div key={rem.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/60 opacity-75 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-400 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-slate-700 leading-snug break-words">{getPastCardTitle(rem)}</h4>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-mono font-mono">
                            Completed
                          </span>
                        )}
                        {isDeclined && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 border border-rose-500/20 font-mono font-mono">
                            Declined
                          </span>
                        )}
                        {isCancelled && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 font-mono">
                            Cancelled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate font-sans">
                        {rem.date} • {rem.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                    <button 
                      onClick={() => setDetailTarget(rem)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-400 bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      View
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
        onSnoozeReminder={(id) => {
          const rem = reminders.find(r => r.id === id);
          if (rem) {
            setDetailTarget(null);
            setSnoozeTarget(rem);
          }
        }}
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

      {/* Decline Appointment Confirmation Dialog */}
      <AnimatePresence>
        {declineConfirmTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setDeclineConfirmTarget(null)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center font-sans"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-500/25">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Decline appointment?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                Are you sure you want to decline this appointment request?
              </p>
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeclineConfirmTarget(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeclineFollowUpConfirm(declineConfirmTarget.id)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-rose-500 hover:bg-rose-600 shadow-md transition-colors cursor-pointer"
                >
                  Decline Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

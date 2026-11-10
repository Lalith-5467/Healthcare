import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Sparkles, User, Settings, LogOut, Home } from 'lucide-react';
import { getGreeting } from '../../utils/greeting';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationPopover } from './NotificationPopover';
import { notificationApi } from '../../services/dhrApis';
import { healthShareApi } from '../../services/healthShareApi';
import { socketService } from '../../services/socketService';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardHeaderProps {
  userName?: string;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onNavigateHome?: () => void;
  onNavigate?: (id: string) => void;
  onLogout?: () => void;
  isShortsOpen?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Patient',
  onOpenNotifications,
  onOpenProfile,
  onNavigateHome,
  onNavigate,
  onLogout,
  isShortsOpen = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { language, setLanguage, t } = useLanguage();

  const [currentDateTime, setCurrentDateTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = currentDateTime.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const timeStr = currentDateTime.toLocaleTimeString(language === 'ta' ? 'ta-IN' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const checkUnreadCount = async () => {
    try {
      const [res, reqs] = await Promise.all([
        notificationApi.getNotifications().catch(() => null),
        healthShareApi.getPatientRequests().catch(() => null),
      ]);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const unreadNotifIds = new Set<string>();
      list.filter((n: any) => !n.isRead).forEach((n: any) => unreadNotifIds.add(n.id));

      const pendingReqs = Array.isArray(reqs) ? reqs.filter((r: any) => r.status === 'PENDING') : [];
      pendingReqs.forEach((r: any) => unreadNotifIds.add(r.id));

      try {
        const localRaw = localStorage.getItem('medicare_notifications');
        if (localRaw) {
          const localList = JSON.parse(localRaw);
          if (Array.isArray(localList)) {
            localList.forEach((ln: any) => {
              if (!ln.isRead && !ln.read) {
                unreadNotifIds.add(ln.id || `${ln.title}-${ln.message}`);
              }
            });
          }
        }
      } catch {}

      setUnreadCount(unreadNotifIds.size);
    } catch {
      // keep current or fail gracefully
    }
  };

  useEffect(() => {
    checkUnreadCount();
    const handleUpdate = () => checkUnreadCount();
    window.addEventListener('notifications_updated', handleUpdate);

    // Real-time socket notification listener
    const unsubscribeSocket = socketService.subscribeToNotifications(() => {
      checkUnreadCount();
    });

    const unsubscribeHealth = socketService.subscribeToHealthShareEvents(() => {
      checkUnreadCount();
    });

    return () => {
      window.removeEventListener('notifications_updated', handleUpdate);
      unsubscribeSocket();
      unsubscribeHealth();
    };
  }, [userName]);

  const handleTogglePopover = () => {
    const next = !popoverOpen;
    setPopoverOpen(next);
    checkUnreadCount();
  };

  const handleNavigateToNotifications = () => {
    setPopoverOpen(false);
    checkUnreadCount();
    if (onOpenNotifications) {
      onOpenNotifications();
    }
  };

  const effectiveDisplayName = React.useMemo(() => {
    const isDoctorOrStaff = (name?: string): boolean => {
      if (!name) return false;
      const lower = name.toLowerCase().trim();
      return (
        lower === 'patient' ||
        lower === 'ananya sharma' ||
        lower === 'ananya' ||
        lower.startsWith('dr.') ||
        lower.startsWith('dr ') ||
        lower.includes('doctor') ||
        lower.includes('arjun') ||
        lower.includes('pharmacist') ||
        lower.includes('r.ph') ||
        lower.includes('suresh nair') ||
        lower.includes('nurse') ||
        lower.includes('admin') ||
        lower.includes('caregiver')
      );
    };

    if (userName && !isDoctorOrStaff(userName)) {
      return userName.trim().split(' ')[0];
    }
    try {
      const custom = localStorage.getItem('patient_user_name');
      if (custom && custom.trim() && !isDoctorOrStaff(custom)) {
        return custom.trim().split(' ')[0];
      }
      const patientUser = localStorage.getItem('patient_user');
      if (patientUser) {
        const parsed = JSON.parse(patientUser);
        if (parsed?.name && !isDoctorOrStaff(parsed.name)) {
          return parsed.name.trim().split(' ')[0];
        }
      }
      const prof = localStorage.getItem('user_profile_data');
      if (prof) {
        const parsed = JSON.parse(prof);
        if (parsed?.name && !isDoctorOrStaff(parsed.name)) {
          return parsed.name.trim().split(' ')[0];
        }
      }
      const appUser = localStorage.getItem('app_user');
      if (appUser) {
        const parsed = JSON.parse(appUser);
        if (parsed?.name && !isDoctorOrStaff(parsed.name)) {
          return parsed.name.trim().split(' ')[0];
        }
      }
    } catch {}
    return 'Patient';
  }, [userName]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col ${
        isShortsOpen 
          ? '2xl:flex-row 2xl:items-center flex-wrap' 
          : 'lg:flex-row lg:items-center'
      } justify-between gap-4 pb-4 border-b border-slate-200/90 dark:border-slate-800/80 relative`}
    >
      {/* LEFT GREETING */}
      <div className="space-y-1.5 min-w-0 sm:min-w-[280px]">
        {/* LINE 1: Welcome heading */}
        <h1 className="text-xl sm:text-2xl xl:text-3xl font-black text-slate-900 dark:text-white tracking-tight whitespace-normal sm:whitespace-nowrap">
          {t('overview.welcome', 'Welcome back')}, {effectiveDisplayName}! 👋
        </h1>

        {/* LINE 2: Day/date and current time with PATIENT PORTAL badge beside it */}
        <div className="flex items-center gap-3 sm:gap-3.5 flex-wrap">
          <p className="text-xs sm:text-sm font-semibold text-[#00a896] dark:text-cyan-300 font-mono whitespace-nowrap flex items-center">
            <span>{dateStr}</span>
            <span className="mx-2 text-slate-400 dark:text-slate-500 font-normal">•</span>
            <span>{timeStr}</span>
          </p>
          <span className="px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-black uppercase bg-gradient-to-r from-[#00a896]/20 to-cyan-500/20 text-[#00a896] dark:text-cyan-300 rounded-full border border-teal-500/30 inline-flex items-center gap-1.5 shadow-sm font-mono shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
            <span>{t('nav.patient_portal', 'Patient Portal')}</span>
          </span>
        </div>

        {/* LINE 3: Health overview subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xl">
          {t('overview.subtitle', 'Here is your comprehensive health overview for today.')}
        </p>
      </div>

      {/* RIGHT SEARCH, THEME TOGGLE, NOTIFICATIONS & PROFILE */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-end xl:self-auto w-full xl:w-auto relative shrink-0 flex-wrap sm:flex-nowrap">
        {/* SEARCH BAR */}
        <div className="relative flex-1 sm:w-56 lg:w-64 xl:w-72 max-w-xs sm:max-w-none">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00a896] dark:text-cyan-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('header.search_placeholder', 'Search records, doctors, medicines...')}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-[#00a896] dark:focus:border-cyan-500 focus:ring-1 focus:ring-teal-500/30 shadow-inner transition-all font-sans"
          />
        </div>

        {/* LANGUAGE TOGGLE */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-inner shrink-0">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${language === 'en' ? 'bg-white dark:bg-slate-800 text-[#00a896] dark:text-cyan-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ta')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${language === 'ta' ? 'bg-white dark:bg-slate-800 text-[#00a896] dark:text-cyan-400 shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            தமிழ்
          </button>
        </div>

        {/* DARK / LIGHT MODE THEME TOGGLE BUTTON */}
        <div className="flex items-center shrink-0">
          <ThemeToggle />
        </div>

        {/* NOTIFICATION BUTTON & POPOVER */}
        <div className="relative shrink-0 flex items-center">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTogglePopover}
            className="relative p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer flex items-center justify-center"
            title={t('header.notifications', 'Notifications')}
          >
            <Bell className="w-4 h-4 text-[#00a896] dark:text-cyan-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-950 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </motion.button>

          <NotificationPopover
            isOpen={popoverOpen}
            onClose={() => {
              setPopoverOpen(false);
              checkUnreadCount();
            }}
            onNavigateToNotifications={handleNavigateToNotifications}
            onNavigateTab={onNavigate}
          />
        </div>

        {/* PROFILE AVATAR */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenProfile}
          className="flex items-center gap-2 py-1 px-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800/90 transition-all shadow-md cursor-pointer shrink-0"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
            alt={effectiveDisplayName}
            className="w-7 h-7 rounded-xl object-cover ring-2 ring-teal-500/40"
          />
          <div className="hidden sm:flex flex-col text-left min-w-0">
            <span className="text-xs font-black text-slate-900 dark:text-white leading-tight truncate">{effectiveDisplayName}</span>
            <span className="text-[10px] font-extrabold text-[#00a896] dark:text-cyan-300 leading-tight font-mono truncate">{t('header.patient_profile', 'Patient Profile')}</span>
          </div>
        </motion.button>

        {/* LOGOUT BUTTON */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setUnreadCount(0);
            if (onLogout) onLogout();
          }}
          className="relative p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-rose-500 dark:text-rose-400 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-600 transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0"
          title={t('header.logout', 'Logout')}
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.header>
  );
};

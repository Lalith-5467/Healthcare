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
  X,
  ShieldCheck,
  Volume2,
  Stethoscope,
  Check
} from 'lucide-react';
import type { NotificationLog } from '../reminders/remindersData';
import { notificationApi } from '../../services/dhrApis';
import { healthShareApi, type AccessRequestItem } from '../../services/healthShareApi';
import { socketService } from '../../services/socketService';
import { notificationVoiceService } from '../../services/notificationVoiceService';
import { useLanguage } from '../../context/LanguageContext';
import { PatientAccessRequestsModal } from './PatientAccessRequestsModal';
import { updateInsuranceClaimStatus, getStoredInsuranceRecords } from '../../utils/insuranceWorkflowStorage';
import { showGlobalToast } from '../common/GlobalToastManager';

const formatTimeAgo = (dateStr?: string) => {
  if (!dateStr) return 'Just now';
  const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToNotifications: () => void;
  role?: string;
  onNavigateToPatient360?: (patientId?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onNavigateToNotifications,
  role,
  onNavigateToPatient360,
  onNavigateTab,
}) => {
  const { language, t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequestItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  const getLocalizedNotifText = (rawTitle: string, rawDesc: string) => {
    if (language !== 'ta') return { title: rawTitle, description: rawDesc };

    let title = rawTitle;
    let description = rawDesc;

    if (rawTitle.includes('Medication Scheduled') || rawTitle.includes('Amoxicillin')) {
      title = t('notif.medication_scheduled_title', rawTitle);
      description = t('notif.medication_scheduled_msg', rawDesc);
    } else if (rawTitle.includes('Tele-Consultation') || rawTitle.includes('Consultation Confirmed')) {
      title = t('notif.tele_consultation_title', rawTitle);
      description = t('notif.tele_consultation_msg', rawDesc);
    } else if (rawTitle.includes('Vitals Logged') || rawTitle.includes('BP 120/80')) {
      title = t('notif.vitals_logged_title', rawTitle);
      description = t('notif.vitals_logged_msg', rawDesc);
    } else if (rawTitle.includes('ABHA Health Record') || rawTitle.includes('ABHA')) {
      title = t('notif.abha_verified_title', rawTitle);
      description = t('notif.abha_verified_msg', rawDesc);
    } else if (rawTitle.includes('Pharmacy Order') || rawTitle.includes('Pharmacy')) {
      title = t('notif.pharmacy_preparing_title', rawTitle);
      description = t('notif.pharmacy_preparing_msg', rawDesc);
    } else if (rawTitle.includes('Medication Reminder') || rawDesc.includes('dose time has arrived') || rawDesc.includes('நேரம் வந்துவிட்டது')) {
      title = t('notif.dose_time_reminder_title', rawTitle);
      description = t('notif.dose_time_reminder_msg', rawDesc);
    } else if (rawTitle.includes('Doctor Appointment') || rawDesc.includes('10 மணிக்கு') || rawDesc.includes('10:00 AM')) {
      title = t('notif.doctor_appointment_title', rawTitle);
      description = t('notif.doctor_appointment_msg', rawDesc);
    } else if (rawTitle.includes('Lab Test') || rawTitle.includes('Test Results') || rawDesc.includes('பரிசோதனை முடிவுகள்')) {
      title = t('notif.lab_results_title', rawTitle);
      description = t('notif.lab_results_msg', rawDesc);
    } else if (rawTitle.includes('Emergency') || rawTitle.includes('அவசர') || rawDesc.includes('உடனடியாக') || rawDesc.includes('மருத்துவரை')) {
      title = t('notif.emergency_alert_title', rawTitle);
      description = t('notif.emergency_alert_msg', rawDesc);
    }

    return { title, description };
  };

  const isDoctorPortal = (role || '').toLowerCase() === 'doctor' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/doctor'));
  const isNursePortal = (role || '').toLowerCase() === 'nurse' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/nurse'));
  const isPharmacistPortal = (role || '').toLowerCase() === 'pharmacist' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/pharmacist'));
  const isInsurancePortal = (role || '').toLowerCase() === 'insurance' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/insurance'));
  const isAdminPortal = (role || '').toLowerCase() === 'admin' || (typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin'));

  let isPatientUser = !isDoctorPortal && !isNursePortal && !isPharmacistPortal && !isInsurancePortal && !isAdminPortal;
  try {
    const rawUser = localStorage.getItem('app_user');
    if (rawUser && isPatientUser) {
      const parsed = JSON.parse(rawUser);
      isPatientUser = (parsed?.role || '').toLowerCase() === 'patient';
    }
  } catch {}

  const loadNotifications = async () => {
    try {
      const [res, reqs] = await Promise.all([
        notificationApi.getNotifications().catch(() => ({ data: [] })),
        isPatientUser ? healthShareApi.getPatientRequests().catch(() => []) : Promise.resolve([]),
      ]);
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      const pendingReqs = Array.isArray(reqs) ? reqs.filter((r) => r.status === 'PENDING') : [];
      setAccessRequests(pendingReqs);

      const mapped: NotificationLog[] = list.map((n: any) => ({
        id: n.id,
        title: n.title,
        description: n.message,
        category: n.category || 'General',
        timeAgo: formatTimeAgo(n.createdAt),
        date: new Date(n.createdAt).toLocaleDateString(),
        isRead: Boolean(n.isRead),
        relatedModule: n.relatedModule || 'dashboard',
      }));

      // Ensure every pending health share request is in the notifications list without duplicate
      pendingReqs.forEach((req) => {
        const docName = req.doctorName || req.doctor?.fullName || 'Attending Doctor';
        const spec = req.doctorSpeciality || req.doctor?.speciality || 'General Medicine';
        const hosp = req.doctorHospital || req.doctor?.hospital || 'Apollo Multispeciality Hospitals';
        const alreadyExists = mapped.some(
          (n) => n.id === req.id || (n.description && n.description.includes(docName) && n.description.includes(req.purpose))
        );
        if (!alreadyExists) {
          mapped.unshift({
            id: req.id,
            title: '🔔 Medical Record Access Request',
            description: `${docName} (${spec} at ${hosp}) has requested access to your health records for ${req.purpose}.`,
            category: 'Clinical Access',
            timeAgo: formatTimeAgo(req.requestedAt),
            date: new Date(req.requestedAt).toLocaleDateString(),
            isRead: false,
            relatedModule: 'health-share',
          });
        }
      });

      // Ensure local storage notifications (e.g. from real-time insurance workflows) are merged
      try {
        const localRaw = localStorage.getItem('medicare_notifications');
        const localList = localRaw ? JSON.parse(localRaw) : [];
        if (Array.isArray(localList)) {
          localList.forEach((ln: any) => {
            const alreadyExists = mapped.some((m) => m.id === ln.id || (m.title === ln.title && m.description === ln.message));
            if (!alreadyExists) {
              mapped.unshift({
                id: ln.id,
                title: ln.title,
                description: ln.message,
                category: ln.category || 'Insurance Pre-Auth',
                timeAgo: formatTimeAgo(ln.createdAt),
                date: ln.createdAt ? new Date(ln.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
                isRead: Boolean(ln.isRead),
                relatedModule: ln.relatedModule || 'insurance',
              });
            }
          });
        }
      } catch {}

      setNotifications(mapped);
    } catch {
      // fallback if network error
    }
  };

  const handleAcceptClaimFromNotif = async (notifItem: NotificationLog) => {
    let claimId = '';
    const match = notifItem.title.match(/CLM-[A-Za-z0-9_-]+/i) || notifItem.description.match(/CLM-[A-Za-z0-9_-]+/i);
    if (match) claimId = match[0];

    const pool = getStoredInsuranceRecords();
    const matchedRecord = pool.find(r => 
      (r.currentClaim && (r.currentClaim.claimId === claimId || notifItem.description.includes(r.currentClaim.hospital))) ||
      (r.insuranceId && notifItem.description.includes(r.patientName))
    );

    const insId = matchedRecord?.insuranceId || 'INS-MC-2026-10245';
    const amt = matchedRecord?.currentClaim?.submittedAmount || 85000;

    await updateInsuranceClaimStatus(insId, 'Approved', amt, 'Claim ACCEPTED & Cashless Pre-Auth Approved');
    handleMarkRead(notifItem.id);
    showGlobalToast(`✓ Claim ${claimId || ''} ACCEPTED & APPROVED for ₹${amt.toLocaleString('en-IN')}! Patient notified immediately.`, 'success', 'Claim Approved');
    loadNotifications();
  };

  const handleDeclineClaimFromNotif = async (notifItem: NotificationLog) => {
    let claimId = '';
    const match = notifItem.title.match(/CLM-[A-Za-z0-9_-]+/i) || notifItem.description.match(/CLM-[A-Za-z0-9_-]+/i);
    if (match) claimId = match[0];

    const pool = getStoredInsuranceRecords();
    const matchedRecord = pool.find(r => 
      (r.currentClaim && (r.currentClaim.claimId === claimId || notifItem.description.includes(r.currentClaim.hospital))) ||
      (r.insuranceId && notifItem.description.includes(r.patientName))
    );

    const insId = matchedRecord?.insuranceId || 'INS-MC-2026-10245';
    const userReason = window.prompt("Reason for declining claim:", "Missing itemized hospital pharmacy breakdown & prescription");
    if (userReason === null) return; // user cancelled prompt

    const finalReason = userReason.trim() || 'Missing itemized hospital pharmacy breakdown & prescription';

    await updateInsuranceClaimStatus(insId, 'Rejected', 0, `Claim DECLINED: ${finalReason}`);
    handleMarkRead(notifItem.id);
    showGlobalToast(`Claim ${claimId || ''} DECLINED. Rejection notice sent to patient.`, 'warning', 'Claim Declined');
    loadNotifications();
  };

  useEffect(() => {
    loadNotifications();
    const handleUpdate = () => loadNotifications();
    window.addEventListener('notifications_updated', handleUpdate);

    const unsubNotif = socketService.subscribeToNotifications(() => {
      loadNotifications();
    });

    const unsubHealth = socketService.subscribeToHealthShareEvents(() => {
      loadNotifications();
    });

    return () => {
      window.removeEventListener('notifications_updated', handleUpdate);
      unsubNotif();
      unsubHealth();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  const updateLocalStorageRead = (id?: string) => {
    try {
      const raw = localStorage.getItem('medicare_notifications');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const updated = list.map((item: any) => {
            if (!id || item.id === id) {
              return { ...item, isRead: true, read: true };
            }
            return item;
          });
          localStorage.setItem('medicare_notifications', JSON.stringify(updated));
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem('user_notifications');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const updated = list.map((item: any) => {
            if (!id || item.id === id) {
              return { ...item, isRead: true };
            }
            return item;
          });
          localStorage.setItem('user_notifications', JSON.stringify(updated));
        }
      }
    } catch {}
  };

  const removeLocalStorageNotif = (id: string) => {
    try {
      const raw = localStorage.getItem('medicare_notifications');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          localStorage.setItem('medicare_notifications', JSON.stringify(list.filter((item: any) => item.id !== id)));
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem('user_notifications');
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          localStorage.setItem('user_notifications', JSON.stringify(list.filter((item: any) => item.id !== id)));
        }
      }
    } catch {}
  };

  const clearLocalStorageNotifs = (unreadOnly: boolean) => {
    try {
      if (unreadOnly) {
        const raw = localStorage.getItem('medicare_notifications');
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            localStorage.setItem('medicare_notifications', JSON.stringify(list.filter((item: any) => Boolean(item.isRead || item.read))));
          }
        }
        const rawUser = localStorage.getItem('user_notifications');
        if (rawUser) {
          const list = JSON.parse(rawUser);
          if (Array.isArray(list)) {
            localStorage.setItem('user_notifications', JSON.stringify(list.filter((item: any) => Boolean(item.isRead))));
          }
        }
      } else {
        localStorage.setItem('medicare_notifications', JSON.stringify([]));
        localStorage.setItem('user_notifications', JSON.stringify([]));
      }
    } catch {}
  };

  const handleMarkRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // 1. Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

    // 2. Persist to localStorage
    updateLocalStorageRead(id);

    // 3. Persist to server
    try {
      await notificationApi.markAsRead(id);
    } catch (err) {
      console.error('[NotificationPopover] Failed to mark as read:', err);
    }

    // 4. Dispatch event after database commit
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleMarkAllRead = async () => {
    // 1. Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

    // 2. Persist to localStorage
    updateLocalStorageRead();

    // 3. Persist to server
    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      console.error('[NotificationPopover] Failed to mark all as read:', err);
    }

    // 4. Dispatch event after database commit
    window.dispatchEvent(new Event('notifications_updated'));
  };

  const handleClearAll = async () => {
    try {
      if (filter === 'unread') {
        const unreadNotifs = notifications.filter((n) => !n.isRead);
        clearLocalStorageNotifs(true);
        await Promise.all(unreadNotifs.map((n) => notificationApi.deleteNotification(n.id).catch(() => null)));
        setNotifications((prev) => prev.filter((n) => n.isRead));
      } else {
        clearLocalStorageNotifs(false);
        await notificationApi.clearAllNotifications().catch(() => null);
        setNotifications([]);
      }
      window.dispatchEvent(new Event('notifications_updated'));
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const handleRemoveSingle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      removeLocalStorageNotif(id);
      await notificationApi.deleteNotification(id).catch(() => null);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      window.dispatchEvent(new Event('notifications_updated'));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
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
      case 'Clinical Access':
        return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-emerald-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div 
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200" 
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden font-sans text-xs max-h-[85vh] flex flex-col"
          >
            {/* POPOVER HEADER */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-teal-500/10 text-[#00a896] dark:text-cyan-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{t('header.notifications_title', 'Notifications')}</h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    {unreadCount > 0 ? `${unreadCount} ${t('notif_pop.unread', 'unread')}` : t('notif_pop.all_caught_up', 'All caught up!')}
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
                  {t('notif_pop.all', 'All')} ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-xl font-bold text-[11px] transition-all cursor-pointer font-sans ${
                    filter === 'unread'
                      ? 'bg-[#00a896] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t('notif_pop.unread', 'Unread')} ({unreadCount})
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    title={t('notif_pop.mark_all_read', 'Mark all as read')}
                    className="p-1.5 rounded-lg text-[#00a896] dark:text-cyan-400 hover:bg-teal-500/10 cursor-pointer"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    title={t('notif_pop.clear_all', 'Clear all')}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* NOTIFICATION LIST */}
            <div className="max-h-[55vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 scrollbar-thin">
              {filteredNotifs.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-teal-500/40 mx-auto" />
                  <p className="text-slate-600 dark:text-slate-400 font-bold">{t('notif_pop.no_notifications', 'No notifications to show')}</p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">{t('notif_pop.up_to_date', "You're all up to date with your health updates.")}</p>
                </div>
              ) : (
                filteredNotifs.map((notif) => {
                  const { title: displayTitle, description: displayDesc } = getLocalizedNotifText(notif.title, notif.description);
                  const isAccessRequest = 
                    isPatientUser && (
                      notif.relatedModule === 'health-share' || 
                      notif.category === 'Clinical Access' || 
                      (notif.title.toLowerCase().includes('access request') && !notif.title.toLowerCase().includes('approved') && !notif.title.toLowerCase().includes('declined') && !notif.title.toLowerCase().includes('rejected')) ||
                      notif.description.toLowerCase().includes('requested access to your health records')
                    );

                  let parsedDocName = '';
                  let parsedSpeciality = '';
                  let parsedHospital = '';
                  let parsedPurpose = '';

                  let matchedReq: AccessRequestItem | undefined = undefined;

                  if (isAccessRequest) {
                    const match = notif.description.match(/^([^(]+?)\s*\((.*?)\s+at\s+(.*?)\)\s+has requested access to your health records for\s+(.*?)\.?$/i);
                    if (match) {
                      parsedDocName = match[1].trim();
                      parsedSpeciality = match[2].trim();
                      parsedHospital = match[3].trim();
                      parsedPurpose = match[4].trim();
                    }

                    matchedReq = accessRequests.find((r) => 
                      r.id === notif.id || 
                      (parsedDocName && (r.doctorName?.toLowerCase().includes(parsedDocName.toLowerCase()) || r.doctor?.fullName?.toLowerCase().includes(parsedDocName.toLowerCase()))) ||
                      (parsedPurpose && r.purpose?.toLowerCase().includes(parsedPurpose.toLowerCase()))
                    ) || (accessRequests.length === 1 ? accessRequests[0] : undefined);

                    if (matchedReq) {
                      parsedDocName = matchedReq.doctorName || matchedReq.doctor?.fullName || parsedDocName;
                      parsedSpeciality = matchedReq.doctorSpeciality || matchedReq.doctor?.speciality || parsedSpeciality;
                      parsedHospital = matchedReq.doctorHospital || matchedReq.doctor?.hospital || parsedHospital;
                      parsedPurpose = matchedReq.purpose || parsedPurpose;
                    }
                  }

                  const isPending = isAccessRequest && (!matchedReq || matchedReq.status === 'PENDING') && !notif.isRead;
                  const displayScopes = (matchedReq?.permissionScope && matchedReq.permissionScope.length > 0)
                    ? matchedReq.permissionScope
                    : ['Vitals', 'Medical Records', 'Prescriptions', 'Lab Reports'];

                  if (isAccessRequest) {
                    return (
                      <div
                        key={notif.id}
                        className={`p-3.5 transition-colors border-l-4 ${
                          !isPending
                            ? 'border-l-slate-300 dark:border-l-slate-700 bg-white dark:bg-slate-900'
                            : 'border-l-amber-500 bg-amber-50/30 dark:bg-amber-950/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                            <Stethoscope className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  {displayTitle}
                                </h4>
                                {isPending ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/60">
                                    Pending
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    Resolved
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                                {notif.timeAgo}
                              </span>
                            </div>

                            {/* Doctor details */}
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-[11px] space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-slate-900 dark:text-white">
                                  {parsedDocName || 'Attending Doctor'}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                  {notif.date}
                                </span>
                              </div>
                              {(parsedSpeciality || parsedHospital) && (
                                <p className="text-[10px] text-slate-600 dark:text-slate-300">
                                  {[parsedSpeciality, parsedHospital].filter(Boolean).join(' • ')}
                                </p>
                              )}
                              {parsedPurpose && (
                                <p className="text-[10px] text-slate-600 dark:text-slate-300">
                                  <span className="font-bold text-slate-500">Purpose:</span> {parsedPurpose}
                                </p>
                              )}
                              <div className="pt-1 flex flex-wrap gap-1">
                                {displayScopes.map((scope) => (
                                  <span
                                    key={scope}
                                    className="px-1.5 py-0.2 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold text-[9px] border border-teal-200/60 dark:border-teal-800/40"
                                  >
                                    ✓ {scope}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                {isPending ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleMarkRead(notif.id);
                                      setIsAccessModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-all"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{t('requests.review_request', 'Review Request')}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setIsAccessModalOpen(true)}
                                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>View Consents</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    handleMarkRead(notif.id, e);
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-[11px] cursor-pointer transition-colors"
                                >
                                  <span>{t('common.dismiss', 'Dismiss')}</span>
                                </button>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notificationVoiceService.speakNotification(`${displayTitle}. ${displayDesc}`, language, notif.id, true);
                                  }}
                                  title={t('notif_pop.play_voice', 'Play voice announcement')}
                                  className="p-1 rounded-lg text-teal-600 dark:text-cyan-400 hover:bg-teal-500/20 transition-all cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                                </button>
                                <button
                                  onClick={(e) => handleRemoveSingle(notif.id, e)}
                                  title={t('notif_pop.dismiss', 'Remove from list')}
                                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  const isInsurancePortalUser = isInsurancePortal || (role || '').toLowerCase() === 'insurance';
                  const isIncomingInsuranceClaim = 
                    isInsurancePortalUser && 
                    (notif.category === 'Insurance Pre-Auth' || notif.relatedModule === 'insurance' || notif.title.toLowerCase().includes('incoming cashless claim')) &&
                    !notif.title.toLowerCase().includes('approved') &&
                    !notif.title.toLowerCase().includes('declined') &&
                    !notif.title.toLowerCase().includes('settled');

                  const isInsuranceDecision = 
                    (notif.category === 'Insurance Pre-Auth' || notif.relatedModule === 'insurance') &&
                    (notif.title.toLowerCase().includes('approved') || notif.title.toLowerCase().includes('declined') || notif.title.toLowerCase().includes('settled'));

                  const isApprovedClaim = notif.title.toLowerCase().includes('approved');

                  if (isIncomingInsuranceClaim) {
                    return (
                      <div
                        key={notif.id}
                        className={`p-3.5 transition-colors border-l-4 ${
                          !notif.isRead
                            ? 'border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/20'
                            : 'border-l-slate-300 dark:border-l-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-amber-100/70 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                            <ShieldAlert className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  {displayTitle}
                                </h4>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/60">
                                  Decision Needed
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                                {notif.timeAgo}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                              {displayDesc}
                            </p>

                            <div className="p-2 rounded-lg bg-amber-100/60 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-800/40 text-[10px] font-bold text-amber-900 dark:text-amber-300">
                              ⚡ Action Required: Do you want to Accept or Decline this cashless claim?
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleAcceptClaimFromNotif(notif)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>✓ Accept & Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeclineClaimFromNotif(notif)}
                                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>✕ Decline</span>
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkRead(notif.id);
                                  onClose();
                                  if (isPatientUser) {
                                    if (onNavigateTab) {
                                      onNavigateTab('insurance');
                                    } else {
                                      window.history.pushState(null, '', '/user/insurance');
                                      window.dispatchEvent(new Event('popstate'));
                                    }
                                  } else if (window.location.pathname !== '/insurance') {
                                    window.location.href = '/insurance';
                                  }
                                }}
                                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-[11px] cursor-pointer"
                              >
                                <span>Review</span>
                              </button>

                              <div className="ml-auto flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notificationVoiceService.speakNotification(`${displayTitle}. ${displayDesc}`, language, notif.id, true);
                                  }}
                                  title={t('notif_pop.play_voice', 'Play voice announcement')}
                                  className="p-1 rounded-lg text-teal-600 dark:text-cyan-400 hover:bg-teal-500/20 transition-all cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                                </button>
                                <button
                                  onClick={(e) => handleRemoveSingle(notif.id, e)}
                                  title={t('notif_pop.dismiss', 'Remove from list')}
                                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (isInsuranceDecision) {
                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id)}
                        className={`p-3.5 transition-colors border-l-4 cursor-pointer ${
                          isApprovedClaim
                            ? 'border-l-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20'
                            : 'border-l-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            isApprovedClaim
                              ? 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                          }`}>
                            {isApprovedClaim ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                                  {displayTitle}
                                </h4>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                  isApprovedClaim
                                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                                    : 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700'
                                }`}>
                                  {isApprovedClaim ? 'Claim Accepted' : 'Claim Declined'}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                                {notif.timeAgo}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                              {displayDesc}
                            </p>

                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkRead(notif.id);
                                  onClose();
                                  if (isPatientUser) {
                                    if (onNavigateTab) {
                                      onNavigateTab('insurance');
                                    } else {
                                      window.history.pushState(null, '', '/user/insurance');
                                      window.dispatchEvent(new Event('popstate'));
                                    }
                                  } else if (window.location.pathname !== '/insurance') {
                                    window.location.href = '/insurance';
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl text-white font-extrabold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition-all ${
                                  isApprovedClaim
                                    ? 'bg-emerald-600 hover:bg-emerald-500'
                                    : 'bg-slate-700 hover:bg-slate-600'
                                }`}
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>{isApprovedClaim ? 'View Pre-Auth Approval' : 'View Policy Status'}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    notificationVoiceService.speakNotification(`${displayTitle}. ${displayDesc}`, language, notif.id, true);
                                  }}
                                  title={t('notif_pop.play_voice', 'Play voice announcement')}
                                  className="p-1 rounded-lg text-teal-600 dark:text-cyan-400 hover:bg-teal-500/20 transition-all cursor-pointer"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                                </button>
                                <button
                                  onClick={(e) => handleRemoveSingle(notif.id, e)}
                                  title={t('notif_pop.dismiss', 'Remove from list')}
                                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={notif.id}
                      onClick={() => {
                        handleMarkRead(notif.id);
                        if (notif.relatedModule === 'health-share' || notif.category === 'Clinical Access' || notif.title.includes('Access Request')) {
                          setIsAccessModalOpen(true);
                        }
                      }}
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
                            {displayTitle}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 shrink-0">{notif.timeAgo}</span>
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                          {displayDesc}
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#00a896] dark:bg-cyan-400 animate-pulse" />
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            notificationVoiceService.speakNotification(`${displayTitle}. ${displayDesc}`, language, notif.id, true);
                          }}
                          title={t('notif_pop.play_voice', 'Play voice announcement')}
                          className="p-1 rounded-lg text-teal-600 dark:text-cyan-400 hover:bg-teal-500/20 hover:scale-110 transition-all cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#00a896] dark:text-cyan-400" />
                        </button>
                        <button
                          onClick={(e) => handleRemoveSingle(notif.id, e)}
                          title={t('notif_pop.dismiss', 'Dismiss notification')}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-opacity cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
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
                <span>{t('notif_pop.view_all_reminders', 'View All Notifications & Reminders')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

    {isPatientUser && (
      <PatientAccessRequestsModal
        isOpen={isAccessModalOpen}
        onClose={() => setIsAccessModalOpen(false)}
      />
    )}
    </>
  );
};

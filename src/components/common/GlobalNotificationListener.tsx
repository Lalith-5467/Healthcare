import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { socketService } from '../../services/socketService';
import { globalNotificationService, type GlobalNotification } from '../../services/globalNotificationService';
import { notificationVoiceService } from '../../services/notificationVoiceService';
import { useLanguage } from '../../context/LanguageContext';

interface GlobalNotificationListenerProps {
  activeRole?: string;
  isDashboard?: boolean;
}

export const GlobalNotificationListener: React.FC<GlobalNotificationListenerProps> = ({ 
  activeRole = 'Patient',
  isDashboard = true
}) => {
  const { t } = useLanguage();
  const [voiceBannerVisible, setVoiceBannerVisible] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isShortsOpen, setIsShortsOpen] = useState(false);

  useEffect(() => {
    const checkShorts = () => {
      const el = typeof document !== 'undefined' ? document.querySelector('[aria-label="Health Shorts Viewer"]') : null;
      setIsShortsOpen(!!el);
    };

    checkShorts();
    if (typeof document !== 'undefined') {
      const observer = new MutationObserver(checkShorts);
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    // 1. Check if voice audio needs explicit user activation (ONLY for Patient role on the Dashboard)
    const isPatient = !activeRole || activeRole.toUpperCase() === 'PATIENT';
    const isDismissed = typeof window !== 'undefined' && sessionStorage.getItem('medicare_voice_banner_dismissed') === 'true';
    if (isDashboard && isPatient && !isDismissed && notificationVoiceService.isVoiceSupported()) {
      const settings = notificationVoiceService.getSettings();
      if (settings.enabled && !isAudioEnabled) {
        // Show lightweight activation prompt if user hasn't clicked yet
        setVoiceBannerVisible(true);
      } else {
        setVoiceBannerVisible(false);
      }
    } else {
      setVoiceBannerVisible(false);
    }

    // 2. Connect to socketService
    try {
      socketService.connect();
    } catch (e) {
      console.warn('Socket connection note:', e);
    }

    // 3. Subscribe to socket notifications
    const unsubscribeNotif = socketService.subscribeToNotifications((payload: any) => {
      if (payload) {
        const notif: GlobalNotification = {
          id: payload.id || `socket-${Date.now()}`,
          recipientUserId: payload.recipientUserId || payload.userId,
          recipientRole: payload.recipientRole || payload.role || 'PATIENT',
          dependentId: payload.dependentId,
          wardName: payload.wardName,
          title: payload.title || 'New System Alert',
          message: payload.message || payload.body || 'You have a new update.',
          type: payload.type || 'General Notification',
          priority: payload.priority || 'NORMAL',
          timestamp: 'Just now',
          read: false,
          relatedRoute: payload.relatedRoute || payload.route,
          relatedEntityId: payload.relatedEntityId
        };
        globalNotificationService.dispatchNotification(notif);
      }
    });

    // 4. Subscribe to pharmacy order updates
    const unsubscribeOrder = socketService.subscribeToOrderUpdates((payload) => {
      if (payload) {
        const notif: GlobalNotification = {
          id: `order-update-${payload.orderId}-${payload.status}`,
          recipientRole: 'PATIENT',
          recipientUserId: payload.patientId,
          title: 'Pharmacy Order Status Updated',
          message: payload.message || `Order #${payload.orderId} status changed to ${payload.status}.`,
          type: 'Pharmacy Order',
          priority: 'NORMAL',
          timestamp: 'Just now',
          read: false,
          relatedRoute: 'pharmacy-orders',
          relatedEntityId: payload.orderId
        };
        globalNotificationService.dispatchNotification(notif);
      }
    });

    return () => {
      unsubscribeNotif();
      unsubscribeOrder();
    };
  }, [isAudioEnabled]);

  const handleEnableAudio = () => {
    setIsAudioEnabled(true);
    setVoiceBannerVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('medicare_voice_banner_dismissed', 'true');
    }

    // Speak a subtle test confirmation in selected language to unlock audio context in browser
    const lang = notificationVoiceService.getAppLanguage();
    const activationMessage = lang === 'ta' ? 'குரல் அறிவிப்புகள் செயல்படுத்தப்பட்டன' : 'Voice notifications active';
    notificationVoiceService.speakNotification(activationMessage, lang);
  };

  const handleDismissBanner = () => {
    setVoiceBannerVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('medicare_voice_banner_dismissed', 'true');
    }
  };

  if (!isDashboard || !voiceBannerVisible || isShortsOpen) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[45] flex flex-col items-center pointer-events-none select-none max-w-md w-full px-4 transition-all duration-300">
      <div className="pointer-events-auto select-auto max-w-sm sm:max-w-md w-full bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-3 sm:p-3.5 rounded-2xl shadow-xl shadow-teal-900/10 dark:shadow-2xl dark:shadow-black/60 border border-slate-200/90 dark:border-slate-800 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-200/80 dark:border-teal-500/30 flex items-center justify-center shrink-0 text-[#00a896] dark:text-teal-400">
          <Volume2 className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1 text-xs min-w-0">
          <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#00a896] dark:text-teal-400 shrink-0" />
            <span className="truncate">{t('voice.banner_title', 'Voice Announcements Ready')}</span>
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-snug line-clamp-1">
            {t('voice.banner_desc', 'Click enable to allow voice alerts for new appointments, orders & bookings.')}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleEnableAudio}
            className="px-3.5 py-1.5 bg-gradient-to-r from-[#00a896] to-teal-600 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-[11px] rounded-lg shadow-sm hover:shadow active:scale-95 transition cursor-pointer"
          >
            {t('voice.enable', 'Enable')}
          </button>
          <button
            onClick={handleDismissBanner}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={t('voice.dismiss', 'Dismiss')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

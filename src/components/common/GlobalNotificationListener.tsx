import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { socketService } from '../../services/socketService';
import { globalNotificationService, type GlobalNotification } from '../../services/globalNotificationService';
import { notificationVoiceService } from '../../services/notificationVoiceService';

interface GlobalNotificationListenerProps {
  activeRole?: string;
}

export const GlobalNotificationListener: React.FC<GlobalNotificationListenerProps> = ({ activeRole = 'Patient' }) => {
  const [voiceBannerVisible, setVoiceBannerVisible] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    // 1. Check if voice audio needs explicit user activation (ONLY for Patient role)
    const isPatient = !activeRole || activeRole.toUpperCase() === 'PATIENT';
    if (isPatient && notificationVoiceService.isVoiceSupported()) {
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

    // Speak a subtle test confirmation to unlock audio context in browser
    notificationVoiceService.speakNotification('Voice notifications active');
  };

  const handleDismissBanner = () => {
    setVoiceBannerVisible(false);
  };

  if (!voiceBannerVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-400">
        <Volume2 className="w-5 h-5 animate-pulse" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-semibold text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 inline" /> Voice Announcements Ready
        </p>
        <p className="text-slate-400 text-[11px] mt-0.5">
          Click enable to allow voice alerts for new appointments, orders & bookings.
        </p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleEnableAudio}
          className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-[11px] rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition"
        >
          Enable
        </button>
        <button
          onClick={handleDismissBanner}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

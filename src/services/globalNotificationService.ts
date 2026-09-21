import { notificationVoiceService } from './notificationVoiceService';

export type RoleType = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'PHARMACIST' | 'INSURANCE_PROVIDER' | 'CAREGIVER' | 'ADMIN';

export interface GlobalNotification {
  id: string;
  recipientUserId?: string;
  recipientRole: RoleType;
  dependentId?: string;
  wardName?: string;
  title: string;
  message: string;
  type: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'EMERGENCY';
  timestamp: string;
  read: boolean;
  relatedRoute?: string;
  relatedEntityId?: string;
  voiceEnabled?: boolean;
  voiceText?: string;
}

const STORAGE_KEYS = {
  PATIENT: 'medicare_notifications_v1',
  CAREGIVER: 'medicare_caregiver_notifs_v2',
  PHARMACIST: 'medicare_pharmacist_notifications',
  DOCTOR: 'medicare_doctor_notifications_v1',
  NURSE: 'medicare_nurse_notifications_v1',
  INSURANCE_PROVIDER: 'medicare_insurance_notifications_v1',
  ADMIN: 'medicare_admin_notifications_v1',
};

class GlobalNotificationService {
  private processedIds: Set<string> = new Set();
  private isInitialized = false;

  constructor() {
    this.initProcessedHistory();
  }

  /**
   * Populate processed set on startup to avoid re-announcing historical notifications.
   */
  private initProcessedHistory() {
    if (typeof window === 'undefined') return;
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        const stored = localStorage.getItem(key);
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            list.forEach((n: any) => {
              if (n.id) this.processedIds.add(n.id);
            });
          }
        }
      });
      this.isInitialized = true;
    } catch {
      this.isInitialized = true;
    }
  }

  /**
   * Central entry point to dispatch a new text + voice notification.
   */
  public dispatchNotification(notif: GlobalNotification, lang?: 'en' | 'ta') {
    if (!notif.id) {
      notif.id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }

    // Deduplication check
    if (this.processedIds.has(notif.id)) {
      return;
    }
    this.processedIds.add(notif.id);

    // Save to role-specific storage
    this.saveToStorage(notif);

    // Trigger custom window event for real-time UI component sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('medicare_global_notification', { detail: notif }));
      window.dispatchEvent(new Event('notifications_updated'));
      if (notif.recipientRole === 'CAREGIVER') {
        window.dispatchEvent(new Event('medicare_caregiver_sync'));
      }
    }

    // Voice announcement (only for newly dispatched PATIENT notifications after initialization)
    if (notif.recipientRole === 'PATIENT' && notif.voiceEnabled !== false && this.isInitialized) {
      const textToSpeak = notif.voiceText || `${notif.title}. ${notif.message}`;
      notificationVoiceService.speakNotification(textToSpeak, lang);
    }
  }

  private saveToStorage(notif: GlobalNotification) {
    if (typeof window === 'undefined') return;

    try {
      // Determine primary storage key
      const storageKey = STORAGE_KEYS[notif.recipientRole] || STORAGE_KEYS.PATIENT;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      const formattedForStore = {
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        timestamp: notif.timestamp || 'Just now',
        read: notif.read || false,
        isRead: notif.read || false,
        dependentId: notif.dependentId,
        wardName: notif.wardName,
        relatedRoute: notif.relatedRoute,
        relatedEntityId: notif.relatedEntityId,
        recipientUserId: notif.recipientUserId,
        recipientRole: notif.recipientRole,
        createdAt: new Date().toISOString()
      };

      const updated = [formattedForStore, ...existing];
      localStorage.setItem(storageKey, JSON.stringify(updated));

      // Also append to general patient store if patient or unassigned
      if (notif.recipientRole === 'PATIENT' && storageKey !== STORAGE_KEYS.PATIENT) {
        const genExisting = JSON.parse(localStorage.getItem(STORAGE_KEYS.PATIENT) || '[]');
        localStorage.setItem(STORAGE_KEYS.PATIENT, JSON.stringify([formattedForStore, ...genExisting]));
      }
    } catch (e) {
      console.error('Failed to save notification to storage:', e);
    }
  }

  /**
   * Safety helper to check if a notification belongs to the active recipient/role/dependent.
   */
  public isForRecipient(
    notif: GlobalNotification,
    activeRole: RoleType,
    activeUserId?: string,
    activeDependentId?: string
  ): boolean {
    if (notif.recipientRole && notif.recipientRole !== activeRole) {
      return false;
    }
    if (notif.recipientUserId && activeUserId && notif.recipientUserId !== activeUserId) {
      return false;
    }
    if (notif.dependentId && activeDependentId && notif.dependentId !== activeDependentId) {
      return false;
    }
    return true;
  }
}

export const globalNotificationService = new GlobalNotificationService();

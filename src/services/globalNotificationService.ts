import { notificationVoiceService } from './notificationVoiceService';
import { patientTranslations } from '../translations/patientTranslations';

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
      const activeLang = lang || notificationVoiceService.getAppLanguage();
      let textToSpeak = notif.voiceText;

      if (!textToSpeak) {
        if (activeLang === 'ta') {
          const loc = this.localizeNotificationForVoice(notif.title, notif.message);
          textToSpeak = `${loc.title}. ${loc.message}`;
        } else {
          textToSpeak = `${notif.title}. ${notif.message}`;
        }
      }

      notificationVoiceService.speakNotification(textToSpeak, activeLang, notif.id);
    }
  }

  /**
   * Helper to map English socket/system notification text to Tamil voice strings using patient translations
   */
  private localizeNotificationForVoice(title: string, message: string): { title: string; message: string } {
    // If text is already in Tamil characters, keep it as is
    if (/[\u0B80-\u0BFF]/.test(title) || /[\u0B80-\u0BFF]/.test(message)) {
      return { title, message };
    }

    const t = (patientTranslations.ta as Record<string, string>) || {};

    if (title.includes('Medication Scheduled') || title.includes('Amoxicillin')) {
      return {
        title: t['notif.medication_scheduled_title'] || 'மருந்து அட்டவணைப்படுத்தப்பட்டது',
        message: t['notif.medication_scheduled_msg'] || 'உங்கள் பிற்பகல் மருந்து அளவு திட்டமிடப்பட்டுள்ளது.',
      };
    }
    if (title.includes('Tele-Consultation') || title.includes('Consultation Confirmed')) {
      return {
        title: t['notif.tele_consultation_title'] || 'வீடியோ மருத்துவச் சந்திப்பு உறுதி செய்யப்பட்டது',
        message: t['notif.tele_consultation_msg'] || 'உங்கள் வீடியோ மருத்துவச் சந்திப்பு உறுதி செய்யப்பட்டுள்ளது.',
      };
    }
    if (title.includes('Vitals Logged') || title.includes('BP 120/80')) {
      return {
        title: t['notif.vitals_logged_title'] || 'உடல்நல அளவீடுகள் பதிவு செய்யப்பட்டன',
        message: t['notif.vitals_logged_msg'] || 'உங்கள் தினசரி உடல்நல அளவீடுகள் பதிவு செய்யப்பட்டன.',
      };
    }
    if (title.includes('ABHA') || title.includes('Health Record')) {
      return {
        title: t['notif.abha_verified_title'] || 'ஆயுஷ்மான் பாரத் மருத்துவ பதிவு சரிபார்க்கப்பட்டது',
        message: t['notif.abha_verified_msg'] || 'உங்கள் மருத்துவ பதிவுகள் சுகாதார கணக்கில் ஒத்திசைக்கப்பட்டன.',
      };
    }
    if (title.includes('Pharmacy') || title.includes('Order')) {
      return {
        title: t['notif.pharmacy_preparing_title'] || 'மருந்தக ஆர்டர் நிலை புதுப்பிக்கப்பட்டது',
        message: t['notif.pharmacy_preparing_msg'] || 'உங்கள் பரிந்துரைக்கப்பட்ட மருந்துகள் தயார் செய்யப்படுகின்றன.',
      };
    }
    if (title.includes('Reminder') || title.includes('dose time')) {
      return {
        title: t['notif.dose_time_reminder_title'] || 'மருந்து நினைவூட்டல்',
        message: t['notif.dose_time_reminder_msg'] || 'உங்கள் மருந்து எடுத்துக்கொள்ளும் நேரம் வந்துவிட்டது.',
      };
    }
    if (title.includes('Appointment') || title.includes('Doctor')) {
      return {
        title: t['notif.doctor_appointment_title'] || 'மருத்துவர் சந்திப்பு நினைவூட்டல்',
        message: t['notif.doctor_appointment_msg'] || 'உங்கள் மருத்துவர் சந்திப்பு திட்டமிடப்பட்டுள்ளது.',
      };
    }
    if (title.includes('Lab') || title.includes('Test')) {
      return {
        title: t['notif.lab_results_title'] || 'பரிசோதனை முடிவுகள் தயார்',
        message: t['notif.lab_results_msg'] || 'உங்கள் பரிசோதனை முடிவுகள் தயாராக உள்ளன.',
      };
    }
    if (title.includes('Emergency') || title.includes('SOS')) {
      return {
        title: t['notif.emergency_alert_title'] || 'அவசர அறிவிப்பு',
        message: t['notif.emergency_alert_msg'] || 'அவசர அறிவிப்பு. தயவுசெய்து உடனடியாக மருத்துவரை தொடர்பு கொள்ளவும்.',
      };
    }

    return {
      title: 'புதிய மருத்துவ அறிவிப்பு',
      message: 'உங்களுக்கு புதிய உடல்நலப் புதுப்பிப்பு வந்துள்ளது.',
    };
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

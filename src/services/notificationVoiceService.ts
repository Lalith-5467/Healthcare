import { apiClient } from './apiClient';

export interface VoiceSettings {
  enabled: boolean;
  language: 'en' | 'ta';
  volume: number; // 0.0 to 1.0
  rate: number;   // 0.5 to 1.5
}

const STORAGE_KEY_VOICE = 'medicare_voice_settings_v1';

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  language: 'en',
  volume: 0.9,
  rate: 1.0,
};

class NotificationVoiceService {
  private queue: { notifId?: string; text: string; lang: 'en' | 'ta' }[] = [];
  private isSpeaking = false;
  private settings: VoiceSettings = DEFAULT_SETTINGS;
  private voicesLoaded = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private playedNotifIds: Set<string> = new Set();

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
    }
  }

  private loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VOICE);
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      this.settings = DEFAULT_SETTINGS;
    }
  }

  public saveSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY_VOICE, JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save voice settings:', e);
    }
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public isVoiceSupported(): boolean {
    return typeof window !== 'undefined';
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      this.availableVoices = window.speechSynthesis.getVoices();
      if (this.availableVoices.length > 0) {
        this.voicesLoaded = true;
      }
    };

    load();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }

  public getAppLanguage(): 'en' | 'ta' {
    if (typeof window === 'undefined') return 'en';
    try {
      const stored = localStorage.getItem('medicare_language');
      if (stored) {
        const lower = stored.toLowerCase();
        if (lower === 'ta' || lower === 'tamil' || lower.startsWith('ta')) return 'ta';
      }
    } catch {}
    return 'en';
  }

  /**
   * Speak a notification text. If speech is currently running, adds to queue.
   * Uses deduplication via optional notificationId.
   */
  public speakNotification(text: string, lang?: 'en' | 'ta', notifId?: string) {
    if (!this.settings.enabled || !text || !text.trim()) {
      return;
    }

    if (notifId && this.playedNotifIds.has(notifId)) {
      return; // Skip duplicate audio play for same notification
    }
    if (notifId) {
      this.playedNotifIds.add(notifId);
    }

    const selectedLang = lang || this.getAppLanguage();
    this.queue.push({ notifId, text: text.trim(), lang: selectedLang });

    if (!this.isSpeaking) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0 || !this.settings.enabled) {
      this.isSpeaking = false;
      return;
    }

    this.isSpeaking = true;
    const currentItem = this.queue.shift();
    if (!currentItem) {
      this.isSpeaking = false;
      return;
    }

    // Attempt Murf API speech generation for Tamil / Murf TTS
    if (currentItem.lang === 'ta' || currentItem.text.match(/[\u0B80-\u0BFF]/)) {
      try {
        const res = await apiClient.post<{ success: boolean; audioUrl?: string; audioBase64?: string; fallback?: boolean }>('/notifications/speech', {
          text: currentItem.text,
          language: 'ta-IN',
        });

        if (res && res.data && res.data.success && (res.data.audioUrl || res.data.audioBase64)) {
          const src = res.data.audioUrl || `data:audio/mp3;base64,${res.data.audioBase64}`;
          const audio = new Audio(src);
          audio.volume = Math.max(0, Math.min(1, this.settings.volume));
          audio.playbackRate = Math.max(0.5, Math.min(1.5, this.settings.rate));

          audio.onended = () => {
            this.isSpeaking = false;
            setTimeout(() => this.processQueue(), 250);
          };

          audio.onerror = (e) => {
            console.warn('Murf audio playback note, falling back to SpeechSynthesis:', e);
            this.playBrowserSpeech(currentItem.text, 'ta');
          };

          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('Murf API service call note (falling back to SpeechSynthesis):', err);
      }
    }

    // Fallback to browser SpeechSynthesis
    this.playBrowserSpeech(currentItem.text, currentItem.lang);
  }

  private playBrowserSpeech(text: string, lang: 'en' | 'ta') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.isSpeaking = false;
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = Math.max(0, Math.min(1, this.settings.volume));
      utterance.rate = Math.max(0.5, Math.min(1.5, this.settings.rate));

      if (this.availableVoices.length === 0) {
        this.availableVoices = window.speechSynthesis.getVoices();
      }

      if (lang === 'ta') {
        const tamilVoice = this.availableVoices.find(v => v.lang.startsWith('ta') || v.lang.includes('TA'));
        if (tamilVoice) {
          utterance.voice = tamilVoice;
          utterance.lang = tamilVoice.lang;
        } else {
          utterance.lang = 'ta-IN';
          console.warn('Murf API key unconfigured & Tamil voice engine not found on device; falling back to standard ta-IN locale synthesis.');
        }
      } else {
        const englishVoice = this.availableVoices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en-US') || v.lang.startsWith('en'));
        if (englishVoice) {
          utterance.voice = englishVoice;
          utterance.lang = englishVoice.lang;
        } else {
          utterance.lang = 'en-US';
        }
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        setTimeout(() => this.processQueue(), 250);
      };

      utterance.onerror = (err) => {
        console.warn('Speech synthesis playback note:', err);
        this.isSpeaking = false;
        setTimeout(() => this.processQueue(), 250);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      this.isSpeaking = false;
    }
  }

  public stopSpeaking() {
    this.queue = [];
    this.isSpeaking = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error('Error stopping speech synthesis:', e);
      }
    }
  }
}

export const notificationVoiceService = new NotificationVoiceService();

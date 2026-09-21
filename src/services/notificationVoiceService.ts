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
  private queue: { text: string; lang: 'en' | 'ta' }[] = [];
  private isSpeaking = false;
  private settings: VoiceSettings = DEFAULT_SETTINGS;
  private voicesLoaded = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

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
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  private initVoices() {
    if (!this.isVoiceSupported()) return;

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

  /**
   * Speak a notification text. If speech is currently running, adds to queue.
   */
  public speakNotification(text: string, lang?: 'en' | 'ta') {
    if (!this.settings.enabled || !this.isVoiceSupported() || !text || !text.trim()) {
      return;
    }

    const selectedLang = lang || this.settings.language;
    this.queue.push({ text: text.trim(), lang: selectedLang });

    if (!this.isSpeaking) {
      this.processQueue();
    }
  }

  private processQueue() {
    if (this.queue.length === 0 || !this.isVoiceSupported() || !this.settings.enabled) {
      this.isSpeaking = false;
      return;
    }

    this.isSpeaking = true;
    const currentItem = this.queue.shift();
    if (!currentItem) {
      this.isSpeaking = false;
      return;
    }

    try {
      // Cancel previous remaining audio if any stuck
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentItem.text);
      utterance.volume = Math.max(0, Math.min(1, this.settings.volume));
      utterance.rate = Math.max(0.5, Math.min(1.5, this.settings.rate));

      // Select voice by language
      if (this.availableVoices.length === 0) {
        this.availableVoices = window.speechSynthesis.getVoices();
      }

      if (currentItem.lang === 'ta') {
        const tamilVoice = this.availableVoices.find(v => v.lang.startsWith('ta'));
        if (tamilVoice) {
          utterance.voice = tamilVoice;
          utterance.lang = tamilVoice.lang;
        } else {
          utterance.lang = 'ta-IN';
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
        setTimeout(() => this.processQueue(), 250); // slight pause between notifications
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
    if (this.isVoiceSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error('Error stopping speech synthesis:', e);
      }
    }
  }
}

export const notificationVoiceService = new NotificationVoiceService();

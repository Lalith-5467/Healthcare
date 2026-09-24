import { apiClient } from './apiClient';
import { showGlobalToast } from '../components/common/GlobalToastManager';

export interface VoiceSettings {
  enabled: boolean;
  language: 'en' | 'ta';
  volume: number; // 0.0 to 1.0
  rate: number;   // 0.5 to 1.5
}

const STORAGE_KEY_VOICE = 'medicare_voice_settings_v1';
const STORAGE_KEY_APP_LANG = 'medicare_language';

const DEFAULT_SETTINGS: VoiceSettings = {
  enabled: true,
  language: 'en',
  volume: 0.9,
  rate: 1.0,
};

interface QueueItem {
  notifId?: string;
  text: string;
  lang: 'en' | 'ta';
  timestamp: number;
}

class NotificationVoiceService {
  private queue: QueueItem[] = [];
  private isSpeaking = false;
  private settings: VoiceSettings = DEFAULT_SETTINGS;
  private voicesLoaded = false;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private playedNotifIds: Set<string> = new Set();
  private lastSpokenHash = '';
  private lastSpokenTime = 0;
  private currentAudio: HTMLAudioElement | null = null;
  private hasWarnedMissingTamilVoice = false;

  constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined') {
      this.initVoices();
      // Listen to app-wide language change events
      window.addEventListener('medicare_language_changed', (e: any) => {
        const newLang = e?.detail?.language;
        if (newLang === 'en' || newLang === 'ta') {
          this.setLanguage(newLang, false);
        }
      });
    }
  }

  private loadSettings() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VOICE);
      const appLang = this.getAppLanguage();
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored), language: appLang };
      } else {
        this.settings = { ...DEFAULT_SETTINGS, language: appLang };
      }
    } catch {
      this.settings = DEFAULT_SETTINGS;
    }
  }

  public saveSettings(newSettings: Partial<VoiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEY_VOICE, JSON.stringify(this.settings));
      if (newSettings.language) {
        localStorage.setItem(STORAGE_KEY_APP_LANG, newSettings.language);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('medicare_voice_settings_changed', { detail: this.settings }));
      }
    } catch (e) {
      console.error('[VoiceService] Failed to save voice settings:', e);
    }
  }

  public setLanguage(lang: 'en' | 'ta', syncAppLang = true) {
    if (this.settings.language !== lang) {
      console.info(`[VoiceService] Switching voice notification language to: ${lang.toUpperCase()}`);
      this.stopSpeaking();
    }
    this.settings.language = lang;
    if (syncAppLang) {
      this.saveSettings({ language: lang });
    }
  }

  public getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  public isVoiceSupported(): boolean {
    return typeof window !== 'undefined' && ('speechSynthesis' in window || typeof Audio !== 'undefined');
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const load = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          this.availableVoices = voices;
          this.voicesLoaded = true;
          const tamilVoice = this.getTamilVoice();
          const englishVoice = this.getEnglishVoice();
          console.info(`[VoiceService] TTS initialized. Total voices: ${voices.length} | Tamil voice: ${tamilVoice ? tamilVoice.name : 'Not installed on OS'} | English voice: ${englishVoice ? englishVoice.name : 'Default'}`);
        }
      } catch (e) {
        console.warn('[VoiceService] Voice loading note:', e);
      }
    };

    load();

    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', load);
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    if (this.availableVoices.length === 0) {
      this.availableVoices = window.speechSynthesis.getVoices();
    }
    return this.availableVoices;
  }

  /**
   * Find available Tamil voice from device's SpeechSynthesis engine.
   * Matches ta-IN, ta, ta_IN, ta-LK, ta-SG, or names containing Tamil / தமிழ் / Valluvar / Pallavi / Iniya.
   */
  public getTamilVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    return (
      voices.find(v => {
        const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
        const n = (v.name || '').toLowerCase();
        return (
          l === 'ta' ||
          l.startsWith('ta-') ||
          l.includes('tamil') ||
          n.includes('tamil') ||
          n.includes('தமிழ்') ||
          n.includes('valluvar') ||
          n.includes('pallavi') ||
          n.includes('iniya')
        );
      }) || null
    );
  }

  /**
   * Find available English voice from device's SpeechSynthesis engine.
   * Prefers en-IN, then en-US, en-GB, etc.
   */
  public getEnglishVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    return (
      voices.find(v => {
        const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
        return l.startsWith('en-in');
      }) ||
      voices.find(v => {
        const l = (v.lang || '').toLowerCase().replace(/_/g, '-');
        return l.startsWith('en-us') || l.startsWith('en-gb') || l.startsWith('en');
      }) ||
      null
    );
  }

  public getVoiceStatus() {
    const tamilVoice = this.getTamilVoice();
    const englishVoice = this.getEnglishVoice();
    return {
      tamilSupported: !!tamilVoice,
      tamilVoiceName: tamilVoice?.name,
      englishSupported: !!englishVoice,
      englishVoiceName: englishVoice?.name,
    };
  }

  public getAppLanguage(): 'en' | 'ta' {
    if (typeof window === 'undefined') return 'en';
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APP_LANG);
      if (stored) {
        const lower = stored.toLowerCase();
        if (lower === 'ta' || lower === 'tamil' || lower.startsWith('ta')) return 'ta';
      }
    } catch {}
    return 'en';
  }

  /**
   * Central speech entry point.
   * Uses deduplication, language verification, and queued sequential playback.
   */
  public speakNotification(text: string, lang?: 'en' | 'ta', notifId?: string, isManualReplay = false) {
    if (!this.settings.enabled || !text || !text.trim()) {
      return;
    }

    const trimmedText = text.trim();

    // Deduplication check via notifId (bypassed if user explicitly clicked replay)
    if (notifId && !isManualReplay && this.playedNotifIds.has(notifId)) {
      return;
    }
    if (notifId) {
      this.playedNotifIds.add(notifId);
    }

    // Determine target language: explicit parameter > settings language > stored app language
    const targetLang: 'en' | 'ta' = lang || this.settings.language || this.getAppLanguage();

    // Prevent duplicate triggers of identical text within 2 seconds (bypassed for manual click)
    const currentHash = `${targetLang}_${trimmedText}`;
    const now = Date.now();
    if (!isManualReplay && this.lastSpokenHash === currentHash && now - this.lastSpokenTime < 2000) {
      return;
    }
    this.lastSpokenHash = currentHash;
    this.lastSpokenTime = now;

    console.info(`[VoiceService] Enqueuing notification speech | Language: ${targetLang.toUpperCase()} | Length: ${trimmedText.length} chars | Manual: ${isManualReplay}`);

    this.queue.push({
      notifId,
      text: trimmedText,
      lang: targetLang,
      timestamp: now,
    });

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

    // 1. TAMIL NOTIFICATION FLOW
    if (currentItem.lang === 'ta' || /[\u0B80-\u0BFF]/.test(currentItem.text)) {
      await this.handleTamilSpeech(currentItem);
      return;
    }

    // 2. ENGLISH NOTIFICATION FLOW
    await this.handleEnglishSpeech(currentItem);
  }

  /**
   * Handles Tamil Voice Speech Playback.
   * Priority:
   * 1. Native device Tamil SpeechSynthesis voice (if installed on OS)
   * 2. Backend / Speech API natural Tamil audio (Murf AI / standard TTS stream)
   * 3. Direct browser audio fallback
   * 4. Safe failure with clear UI notification (NEVER silently use English voice)
   */
  private async handleTamilSpeech(item: QueueItem) {
    const text = item.text;
    console.info(`[VoiceService] Processing Tamil voice notification`);

    // Strategy 1: Check if device has native Tamil voice installed in browser SpeechSynthesis
    const nativeTamilVoice = this.getTamilVoice();
    if (nativeTamilVoice) {
      console.info(`[VoiceService] Using native device Tamil voice: ${nativeTamilVoice.name} (${nativeTamilVoice.lang})`);
      this.playSpeechSynthesis(text, nativeTamilVoice, 'ta-IN');
      return;
    }

    // Strategy 2: Use backend natural TTS audio generation
    try {
      console.info(`[VoiceService] Device lacks native Tamil voice engine. Requesting natural Tamil speech from server...`);
      const res: any = await apiClient.post('/notifications/speech', {
        text,
        language: 'ta-IN',
      });

      const resData = res?.data ?? res;
      const audioUrl = resData?.audioUrl;
      const audioBase64 = resData?.audioBase64;
      const isSuccess = resData?.success ?? false;

      if (isSuccess && (audioUrl || audioBase64)) {
        const src = audioUrl || `data:audio/mpeg;base64,${audioBase64}`;
        console.info(`[VoiceService] Playing natural Tamil audio stream (Murf/TTS)...`);
        await this.playAudioElement(src);
        return;
      } else {
        console.warn('[VoiceService] Server speech returned unsuccessful response:', resData);
      }
    } catch (apiErr: any) {
      console.warn('[VoiceService] Server speech generation unavailable, trying direct audio stream:', apiErr?.message || apiErr);
    }

    // Strategy 3: Direct browser audio stream fallback
    try {
      console.info(`[VoiceService] Attempting direct Tamil audio playback...`);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(text.slice(0, 200))}`;
      await this.playAudioElement(ttsUrl);
      return;
    } catch (audioErr: any) {
      console.warn('[VoiceService] Direct audio playback note:', audioErr?.message || audioErr);
    }

    // Strategy 4: Fallback failed - DO NOT speak Tamil text using an English voice!
    console.warn('[VoiceService] Tamil voice is unavailable: No native Tamil voice installed on OS and audio stream failed.');
    this.notifyTamilVoiceMissing();
    this.isSpeaking = false;
    setTimeout(() => this.processQueue(), 250);
  }

  /**
   * Handles English Voice Speech Playback.
   * Uses browser SpeechSynthesis with installed English voice (e.g. en-IN or en-US).
   */
  private async handleEnglishSpeech(item: QueueItem) {
    const text = item.text;
    console.info(`[VoiceService] Processing English voice notification`);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('[VoiceService] SpeechSynthesis is not supported in this browser.');
      this.isSpeaking = false;
      setTimeout(() => this.processQueue(), 250);
      return;
    }

    const englishVoice = this.getEnglishVoice();
    console.info(`[VoiceService] Using English voice: ${englishVoice ? englishVoice.name : 'System Default'} (${englishVoice ? englishVoice.lang : 'en-US'})`);
    this.playSpeechSynthesis(text, englishVoice, englishVoice ? englishVoice.lang : 'en-US');
  }

  /**
   * Synthesize speech using the browser's native SpeechSynthesis API with a specific voice.
   */
  private playSpeechSynthesis(text: string, voice: SpeechSynthesisVoice | null, targetLangCode: string) {
    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = Math.max(0, Math.min(1, this.settings.volume));
      utterance.rate = Math.max(0.5, Math.min(1.5, this.settings.rate));
      utterance.lang = targetLangCode;

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        console.info(`[VoiceService] Speech playback completed.`);
        this.isSpeaking = false;
        setTimeout(() => this.processQueue(), 250);
      };

      utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
        console.warn(`[VoiceService] Speech synthesis error: ${event.error}`);
        this.isSpeaking = false;
        setTimeout(() => this.processQueue(), 250);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('[VoiceService] Unexpected speech synthesis failure:', err);
      this.isSpeaking = false;
      setTimeout(() => this.processQueue(), 250);
    }
  }

  /**
   * Play speech audio from an MP3 audio URL or data URI.
   */
  private playAudioElement(src: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        if (this.currentAudio) {
          try {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
          } catch {}
          this.currentAudio = null;
        }

        const audio = new Audio(src);
        this.currentAudio = audio;
        audio.volume = Math.max(0, Math.min(1, this.settings.volume));
        audio.playbackRate = Math.max(0.5, Math.min(1.5, this.settings.rate));

        audio.onended = () => {
          console.info(`[VoiceService] Audio stream playback finished.`);
          this.currentAudio = null;
          this.isSpeaking = false;
          resolve(true);
          setTimeout(() => this.processQueue(), 250);
        };

        audio.onerror = (e) => {
          console.warn('[VoiceService] Audio element error:', e);
          this.currentAudio = null;
          reject(e);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[VoiceService] Audio play was prevented or failed:', err);
            this.currentAudio = null;
            reject(err);
          });
        }
      } catch (err) {
        this.currentAudio = null;
        reject(err);
      }
    });
  }

  /**
   * Alert user when Tamil voice is unavailable, explaining how to install Tamil voice data.
   */
  private notifyTamilVoiceMissing() {
    if (this.hasWarnedMissingTamilVoice) return;
    this.hasWarnedMissingTamilVoice = true;

    // Reset warning flag after 30 seconds to allow subsequent notifications without spamming
    setTimeout(() => {
      this.hasWarnedMissingTamilVoice = false;
    }, 30000);

    showGlobalToast(
      'Tamil voice data is not installed on this device. To enable Tamil voice notifications, please install the Tamil speech language pack in your device settings (Windows: Settings > Time & Language > Speech > Add voices; Android: Settings > Accessibility > Text-to-Speech).',
      'warning',
      'Tamil Voice Unavailable'
    );
  }

  /**
   * Stop any current voice speech or audio playback immediately.
   */
  public stopSpeaking() {
    this.queue = [];
    this.isSpeaking = false;

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio = null;
      } catch {}
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn('[VoiceService] Error cancelling speech synthesis:', e);
      }
    }
  }
}

export const notificationVoiceService = new NotificationVoiceService();

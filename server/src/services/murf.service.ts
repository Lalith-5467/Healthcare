interface MurfTTSRequest {
  text: string;
  language?: string;
}

interface AudioCacheEntry {
  audioUrl?: string;
  audioBase64?: string;
  timestamp: number;
}

const audioCache = new Map<string, AudioCacheEntry>();

export class MurfService {
  /**
   * Generate speech using Murf AI API for Tamil (Pooja / Falcon / Conversational / ta-IN)
   */
  static async generateSpeech(data: MurfTTSRequest) {
    const text = data.text;
    const isTamil = (data.language || '').toLowerCase().includes('ta');

    if (!text || !text.trim()) {
      return { success: false, message: 'Text is required' };
    }

    // Cache key based on text and language
    const cacheKey = `${data.language || 'ta-IN'}_${text.trim()}`;
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return {
        success: true,
        audioUrl: cached.audioUrl,
        audioBase64: cached.audioBase64,
        isCached: true,
        isMurf: true,
      };
    }

    const apiKey = process.env.MURF_API_KEY;

    // If Murf API key is not configured, generate natural Tamil speech via standard TTS audio service
    if (!apiKey) {
      if (isTamil || /[\u0B80-\u0BFF]/.test(text)) {
        try {
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ta&client=tw-ob&q=${encodeURIComponent(text.slice(0, 200))}`;
          const ttsRes = await fetch(ttsUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            },
          });

          if (ttsRes.ok) {
            const arrayBuf = await ttsRes.arrayBuffer();
            const audioBase64 = Buffer.from(arrayBuf).toString('base64');

            audioCache.set(cacheKey, {
              audioBase64,
              timestamp: Date.now(),
            });

            return {
              success: true,
              audioBase64,
              isMurf: false,
              isTamilTts: true,
              voiceDetails: {
                voice_id: 'Tamil-Natural-TTS',
                style: 'Natural',
                multiNativeLocale: 'ta-IN',
              },
            };
          }
        } catch (ttsErr: any) {
          console.warn('[MurfService] Natural Tamil TTS fallback note:', ttsErr?.message || ttsErr);
        }
      }

      return {
        success: false,
        fallback: true,
        message: 'MURF_API_KEY not configured. Falling back to client synthesis.',
      };
    }

    try {
      const primaryVoiceId = isTamil ? 'Pooja' : 'en-US-natalie';
      const fallbackVoiceId = isTamil ? 'ta-IN-iniya' : 'en-US-natalie';

      const voiceConfig = {
        voiceId: primaryVoiceId,
        style: 'Conversational',
        modelVersion: 'GEN2',
        multiNativeLocale: isTamil ? 'ta-IN' : 'en-US',
        rate: 0,
        pitch: 0,
        sampleRate: 24000,
        format: 'MP3',
      };

      let response = await fetch('https://api.murf.ai/v1/speech/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({ ...voiceConfig, text }),
      });

      let resData: any = await response.json();

      // If voiceId Pooja requires alias mapping in v1, retry with ta-IN-iniya
      if (response.status !== 200 && (resData?.error_message?.includes('Invalid voice_id') || resData?.errorCode === 'BAD_REQUEST')) {
        const retryConfig = { ...voiceConfig, voiceId: fallbackVoiceId };
        response = await fetch('https://api.murf.ai/v1/speech/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({ ...retryConfig, text }),
        });
        resData = await response.json();
      }

      const audioUrl = resData?.audioFile || resData?.audioUrl || resData?.url;
      const audioBase64 = resData?.encodedAudio || resData?.base64;

      if (audioUrl || audioBase64) {
        audioCache.set(cacheKey, {
          audioUrl,
          audioBase64,
          timestamp: Date.now(),
        });

        return {
          success: true,
          audioUrl,
          audioBase64,
          isMurf: true,
          voiceDetails: {
            voice_id: 'Pooja',
            style: 'Conversational',
            model: 'Falcon',
            multiNativeLocale: 'ta-IN',
          },
        };
      }

      console.warn('Murf API returned response:', resData);
      return { success: false, fallback: true };
    } catch (err: any) {
      console.error('Murf TTS API error:', err?.message || err);
      return {
        success: false,
        fallback: true,
        error: err?.message || 'Murf API request failed',
      };
    }
  }
}

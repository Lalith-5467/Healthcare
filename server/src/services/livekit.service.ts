import { AccessToken } from 'livekit-server-sdk';

export interface LiveKitTokenParams {
  roomName: string;
  participantIdentity: string;
  participantName: string;
  isDoctor: boolean;
  metadata?: Record<string, any>;
}

export class LiveKitService {
  private static getCredentials() {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const livekitUrl = process.env.LIVEKIT_URL;

    if (!apiKey || !apiSecret || !livekitUrl) {
      throw new Error('LiveKit credentials missing on server. Check LIVEKIT_URL, LIVEKIT_API_KEY, and LIVEKIT_API_SECRET.');
    }

    return { apiKey, apiSecret, livekitUrl };
  }

  /**
   * Returns the public LiveKit server URL
   */
  static getLiveKitUrl(): string {
    const { livekitUrl } = this.getCredentials();
    return livekitUrl;
  }

  /**
   * Generates a participant access token for a specific consultation room
   */
  static async generateToken(params: LiveKitTokenParams): Promise<{ token: string; url: string }> {
    const { apiKey, apiSecret, livekitUrl } = this.getCredentials();

    const at = new AccessToken(apiKey, apiSecret, {
      identity: params.participantIdentity,
      name: params.participantName,
      ttl: '2h', // Sensible 2 hour TTL for medical consultation
      metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
    });

    at.addGrant({
      roomJoin: true,
      room: params.roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return {
      token,
      url: livekitUrl,
    };
  }
}

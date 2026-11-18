import { apiClient } from './apiClient';
import type { ConsultationDoctor } from '../components/consultation/consultationData';

export interface VideoConsultationRequestPayload {
  doctorId: string;
  reason?: string;
}

export interface VideoConsultationResponse {
  id: string;
  patientId: string;
  doctorId: string;
  status: string;
  reason?: string | null;
  roomId?: string | null;
  acceptedAt?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  patient?: any;
  doctor?: any;
}

export const videoConsultationApi = {
  /**
   * Get available doctors for video consultation from the database
   */
  async getAvailableDoctors(): Promise<ConsultationDoctor[]> {
    try {
      const res = await apiClient.get<any>('/video-consultations/doctors');
      if (res?.doctors && Array.isArray(res.doctors)) {
        return res.doctors;
      }
      return [];
    } catch (e) {
      console.error('Failed to load consultation doctors:', e);
      return [];
    }
  },

  /**
   * Patient creates a consultation request
   */
  async createRequest(doctorId: string, reason?: string): Promise<VideoConsultationResponse> {
    const res = await apiClient.post<any>('/video-consultations/request', {
      doctorId,
      reason,
    });
    return res.consultation;
  },

  /**
   * Doctor retrieves incoming requests queue
   */
  async getDoctorRequests(): Promise<VideoConsultationResponse[]> {
    const res = await apiClient.get<any>('/video-consultations/doctor/requests');
    return res.requests || [];
  },

  /**
   * Patient retrieves their consultation requests
   */
  async getPatientRequests(): Promise<VideoConsultationResponse[]> {
    const res = await apiClient.get<any>('/video-consultations/patient/requests');
    return res.requests || [];
  },

  /**
   * Doctor accepts consultation request
   */
  async acceptRequest(id: string): Promise<VideoConsultationResponse> {
    const res = await apiClient.patch<any>(`/video-consultations/${id}/accept`);
    return res.consultation;
  },

  /**
   * Doctor declines consultation request
   */
  async declineRequest(id: string): Promise<VideoConsultationResponse> {
    const res = await apiClient.patch<any>(`/video-consultations/${id}/decline`);
    return res.consultation;
  },

  /**
   * Patient cancels consultation request
   */
  async cancelRequest(id: string): Promise<VideoConsultationResponse> {
    const res = await apiClient.patch<any>(`/video-consultations/${id}/cancel`);
    return res.consultation;
  },

  /**
   * Participant joins consultation
   */
  async joinConsultation(id: string): Promise<VideoConsultationResponse> {
    const res = await apiClient.patch<any>(`/video-consultations/${id}/join`);
    return res.consultation;
  },

  /**
   * Participant ends consultation
   */
  async endConsultation(id: string): Promise<VideoConsultationResponse> {
    const res = await apiClient.patch<any>(`/video-consultations/${id}/end`);
    return res.consultation;
  },

  /**
   * Get LiveKit access token and room URL for authenticated consultation
   */
  async getLiveKitToken(id: string): Promise<{
    token: string;
    url: string;
    roomName: string;
    participant: {
      identity: string;
      name: string;
      isDoctor: boolean;
    };
  }> {
    const res = await apiClient.post<any>(`/video-consultations/${id}/livekit-token`);
    return {
      token: res.token,
      url: res.url,
      roomName: res.roomName,
      participant: res.participant,
    };
  },
};

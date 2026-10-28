import { apiClient } from './apiClient';

export interface QRTokenResponse {
  token: string;
  expiresAt: string;
  durationMinutes: number;
}

export interface PatientIdentityBasics {
  id: string;
  fullName: string;
  gender: string;
  age: number;
  bloodGroup: string;
  abhaId: string | null;
}

export interface DoctorIdentityBasics {
  id: string;
  fullName: string;
  hospital: string;
  speciality: string;
  qualification: string;
  licenseNumber: string;
  department: string;
}

export interface ValidateQRResponse {
  token: string;
  patient: PatientIdentityBasics;
  doctor: DoctorIdentityBasics;
  availablePurposes: string[];
  availableScopes: string[];
}

export interface AccessRequestItem {
  id: string;
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  patientBloodGroup?: string;
  patientAbhaId?: string | null;
  doctorId?: string;
  doctorName?: string;
  doctorHospital?: string;
  doctorSpeciality?: string;
  doctorLicense?: string;
  doctorQualification?: string;
  purpose: string;
  permissionScope: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
  requestedAt: string;
  grantedAt?: string | null;
  expiresAt?: string | null;
  revokedAt?: string | null;
  doctor?: DoctorIdentityBasics;
}

export interface Patient360AuthorizedData {
  session: {
    id: string;
    status: string;
    purpose: string;
    grantedAt: string;
    expiresAt: string;
    approvedScopes: string[];
  };
  patient: {
    id: string;
    fullName: string;
    gender: string;
    dateOfBirth?: string;
    age: number;
    bloodGroup: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    familyPhone?: string;
    heightCm?: number;
    abhaId?: string;
    phoneNumber?: string;
  } | null;
  vitals: any[];
  medicalRecords: any[];
  reports: any[];
  prescriptions: any[];
  medicationHistory: any[];
  adherence: {
    hasData: boolean;
    percentage?: number;
    completedReminders?: number;
    totalReminders?: number;
    summary?: string;
    message?: string;
  } | null;
}

export const healthShareApi = {
  // 1. Patient generates secure temporary QR token
  generateQRToken: async (
    durationMinutes = 30,
    patientHint?: { patientName?: string; abhaId?: string; patientId?: string }
  ): Promise<QRTokenResponse> => {
    const res = await apiClient.post<QRTokenResponse>('/health-share/generate-qr', {
      durationMinutes,
      ...patientHint,
    });
    return res.data;
  },

  // 2. Doctor validates scanned QR token
  validateQRToken: async (token: string): Promise<ValidateQRResponse> => {
    const res = await apiClient.post<ValidateQRResponse>('/health-share/validate-qr', { token });
    return res.data;
  },

  // 3. Doctor creates access request
  createAccessRequest: async (payload: {
    token: string;
    purpose: string;
    permissionScope: string[];
    notes?: string;
    durationMinutes?: number;
  }) => {
    const res = await apiClient.post('/health-share/access-requests', payload);
    return res.data;
  },

  // 4. Patient gets pending requests
  getPatientRequests: async (): Promise<AccessRequestItem[]> => {
    let serverRequests: AccessRequestItem[] = [];
    try {
      const res = await apiClient.get<AccessRequestItem[]>('/health-share/access-requests/patient');
      if (Array.isArray(res.data)) {
        serverRequests = res.data;
      }
    } catch (e) {
      console.warn('API getPatientRequests fallback:', e);
    }

    // Merge any pending requests stored in localStorage for multi-tab testing
    try {
      const localRaw = localStorage.getItem('pending_patient_access_requests');
      if (localRaw) {
        const localList: AccessRequestItem[] = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          localList.forEach((lr) => {
            const exists = serverRequests.some((sr) => sr.id === lr.id);
            if (!exists) {
              serverRequests.unshift(lr);
            }
          });
        }
      }
    } catch {}

    return serverRequests;
  },

  // 5. Doctor gets access requests
  getDoctorRequests: async (): Promise<AccessRequestItem[]> => {
    let docRequests: AccessRequestItem[] = [];
    try {
      const res = await apiClient.get<AccessRequestItem[]>('/health-share/access-requests/doctor');
      if (Array.isArray(res.data)) {
        docRequests = res.data;
      }
    } catch (e) {
      console.warn('API getDoctorRequests fallback:', e);
    }

    // Also merge from local storage cache if any
    try {
      const localRaw = localStorage.getItem('pending_patient_access_requests');
      if (localRaw) {
        const localList: AccessRequestItem[] = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          localList.forEach((lr) => {
            const matchIndex = docRequests.findIndex((dr) => dr.id === lr.id);
            if (matchIndex === -1) {
              docRequests.unshift(lr);
            } else if (lr.status && lr.status !== docRequests[matchIndex].status) {
              docRequests[matchIndex].status = lr.status;
            }
          });
        }
      }
    } catch {}

    return docRequests;
  },

  // 6. Patient approves request
  approveRequest: async (requestId: string, permissionScope?: string[], durationMinutes = 60) => {
    // Update local storage items for instant tab sync
    try {
      const nowStr = new Date().toISOString();
      const expiresStr = new Date(Date.now() + durationMinutes * 60 * 1000).toISOString();
      const localRaw = localStorage.getItem('pending_patient_access_requests');
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          const updated = localList.map((r: any) =>
            r.id === requestId
              ? {
                  ...r,
                  status: 'APPROVED',
                  grantedAt: nowStr,
                  expiresAt: expiresStr,
                  permissionScope: permissionScope || r.permissionScope,
                }
              : r
          );
          localStorage.setItem('pending_patient_access_requests', JSON.stringify(updated));
        }
      }
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('health_share_channel');
        bc.postMessage({
          type: 'health-share:request-approved',
          event: 'health-share:request-approved',
          requestId,
          status: 'APPROVED',
          grantedAt: nowStr,
          expiresAt: expiresStr,
        });
        bc.close();
      }
    } catch {}

    const res = await apiClient.post(`/health-share/access-requests/${requestId}/approve`, {
      permissionScope,
      durationMinutes,
    });
    return res.data;
  },

  // 7. Patient rejects request
  rejectRequest: async (requestId: string) => {
    try {
      const nowStr = new Date().toISOString();
      const localRaw = localStorage.getItem('pending_patient_access_requests');
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          const updated = localList.map((r: any) =>
            r.id === requestId ? { ...r, status: 'REJECTED', revokedAt: nowStr } : r
          );
          localStorage.setItem('pending_patient_access_requests', JSON.stringify(updated));
        }
      }
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('health_share_channel');
        bc.postMessage({ type: 'health-share:request-rejected', event: 'health-share:request-rejected', requestId, status: 'REJECTED' });
        bc.close();
      }
    } catch {}

    const res = await apiClient.post(`/health-share/access-requests/${requestId}/reject`);
    return res.data;
  },

  // 8. Patient revokes active session
  revokeSession: async (requestId: string) => {
    try {
      const nowStr = new Date().toISOString();
      const localRaw = localStorage.getItem('pending_patient_access_requests');
      if (localRaw) {
        const localList = JSON.parse(localRaw);
        if (Array.isArray(localList)) {
          const updated = localList.map((r: any) =>
            r.id === requestId ? { ...r, status: 'REVOKED', revokedAt: nowStr } : r
          );
          localStorage.setItem('pending_patient_access_requests', JSON.stringify(updated));
        }
      }
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('health_share_channel');
        bc.postMessage({ type: 'health-share:session-revoked', event: 'health-share:session-revoked', requestId, status: 'REVOKED' });
        bc.close();
      }
    } catch {}

    const res = await apiClient.post(`/health-share/access-sessions/${requestId}/revoke`);
    return res.data;
  },

  // 9. Doctor fetches Patient 360 data
  getPatient360Data: async (patientId: string): Promise<Patient360AuthorizedData> => {
    const res = await apiClient.get<Patient360AuthorizedData>(`/health-share/patient-360/${patientId}`);
    return res.data;
  },
};

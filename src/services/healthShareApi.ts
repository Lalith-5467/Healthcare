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
  generateQRToken: async (durationMinutes = 30): Promise<QRTokenResponse> => {
    const res = await apiClient.post<QRTokenResponse>('/health-share/generate-qr', { durationMinutes });
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
    const res = await apiClient.get<AccessRequestItem[]>('/health-share/access-requests/patient');
    return res.data;
  },

  // 5. Doctor gets access requests
  getDoctorRequests: async (): Promise<AccessRequestItem[]> => {
    const res = await apiClient.get<AccessRequestItem[]>('/health-share/access-requests/doctor');
    return res.data;
  },

  // 6. Patient approves request
  approveRequest: async (requestId: string, permissionScope?: string[], durationMinutes = 60) => {
    const res = await apiClient.post(`/health-share/access-requests/${requestId}/approve`, {
      permissionScope,
      durationMinutes,
    });
    return res.data;
  },

  // 7. Patient rejects request
  rejectRequest: async (requestId: string) => {
    const res = await apiClient.post(`/health-share/access-requests/${requestId}/reject`);
    return res.data;
  },

  // 8. Patient revokes active session
  revokeSession: async (requestId: string) => {
    const res = await apiClient.post(`/health-share/access-sessions/${requestId}/revoke`);
    return res.data;
  },

  // 9. Doctor fetches Patient 360 data
  getPatient360Data: async (patientId: string): Promise<Patient360AuthorizedData> => {
    const res = await apiClient.get<Patient360AuthorizedData>(`/health-share/patient-360/${patientId}`);
    return res.data;
  },
};

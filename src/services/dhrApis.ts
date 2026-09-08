import { apiClient } from './apiClient';

export interface PatientProfile {
  id: string;
  userId: string;
  fullName: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  address?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  speciality: string;
  qualification?: string | null;
  licenseNumber?: string | null;
  hospital?: string | null;
  experienceYears: number;
  consultationFee: number;
  photoUrl?: string | null;
  about?: string | null;
}

export interface UserAccount {
  id: string;
  email: string;
  role: string;
  abhaId?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  profile?: PatientProfile | DoctorProfile | any;
}

export interface MedicalRecordEntity {
  id: string;
  patientId: string;
  doctorId?: string | null;
  title: string;
  type: string;
  hospital?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileSize?: string | null;
  status: string;
  isImportant: boolean;
  notes?: string | null;
  recordDate: string;
  createdAt: string;
}

export interface PrescriptionItemEntity {
  id: string;
  medicineName: string;
  dosage: string;
  unit: string;
  frequency: string;
  durationDays?: number | null;
  instructions?: string | null;
  foodInstruction?: string | null;
}

export interface PrescriptionEntity {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis?: string | null;
  notes?: string | null;
  status: string;
  issuedAt: string;
  validUntil?: string | null;
  items: PrescriptionItemEntity[];
  doctor?: DoctorProfile;
}

export interface AppointmentEntity {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  slotTime: string;
  type: string;
  status: string;
  fee: number | string;
  reason?: string | null;
  notes?: string | null;
  meetingLink?: string | null;
  doctor?: DoctorProfile;
  patient?: PatientProfile;
}

export interface VitalEntity {
  id: string;
  patientId: string;
  systolicBp?: number | null;
  diastolicBp?: number | null;
  heartRate?: number | null;
  respiratoryRate?: number | null;
  oxygenSaturation?: number | null;
  temperature?: number | null;
  bloodSugar?: number | null;
  weightKg?: number | null;
  notes?: string | null;
  recordedAt: string;
}

export interface ReminderEntity {
  id: string;
  patientId: string;
  title: string;
  type: string;
  scheduledTime: string;
  frequency?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: string;
  isCompletedToday: boolean;
  notes?: string | null;
  sourcePrescriptionId?: string | null;
  doctorName?: string | null;
  clinicName?: string | null;
  followUpStatus?: string | null;
  followUpDate?: string | null;
  priority?: string | null;
}

export interface NotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  category?: string | null;
  relatedModule?: string | null;
  isRead: boolean;
  createdAt: string;
}

// ==========================================
// DHR API SERVICES
// ==========================================

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ user: UserAccount; token: string }>('/auth/login', credentials),

  register: (userData: any) =>
    apiClient.post<{ user: UserAccount; token: string }>('/auth/register', userData),

  getCurrentUser: () =>
    apiClient.get<UserAccount>('/auth/me'),

  sendOtp: (email: string) =>
    apiClient.post<{ success: boolean; message: string; previewCode?: string }>('/auth/send-otp', { email }),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/verify-otp', { email, otp }),
};

export const profileApi = {
  getProfile: () => apiClient.get<UserAccount>('/profile'),
  updateProfile: (profileData: any) => apiClient.patch<UserAccount>('/profile', profileData),
};

export const appointmentApi = {
  getAppointments: () => apiClient.get<AppointmentEntity[]>('/appointments'),
  getAppointmentById: (id: string) => apiClient.get<AppointmentEntity>(`/appointments/${id}`),
  createAppointment: (data: {
    doctorId: string;
    appointmentDate: string;
    slotTime: string;
    type?: string;
    reason?: string;
    notes?: string;
  }) => apiClient.post<AppointmentEntity>('/appointments', data),
  updateAppointment: (id: string, data: any) => apiClient.patch<AppointmentEntity>(`/appointments/${id}`, data),
  cancelAppointment: (id: string, reason?: string) =>
    apiClient.delete<AppointmentEntity>(`/appointments/${id}`, reason ? { reason } : undefined),
};

export const recordApi = {
  getMedicalRecords: (patientId?: string) =>
    apiClient.get<MedicalRecordEntity[]>(patientId ? `/medical-records?patientId=${patientId}` : '/medical-records'),
  getMedicalRecordById: (id: string) => apiClient.get<MedicalRecordEntity>(`/medical-records/${id}`),
  createMedicalRecord: (record: any) => apiClient.post<MedicalRecordEntity>('/medical-records', record),
  updateMedicalRecord: (id: string, data: any) => apiClient.patch<MedicalRecordEntity>(`/medical-records/${id}`, data),
  deleteMedicalRecord: (id: string) => apiClient.delete(`/medical-records/${id}`),
};

export const vitalApi = {
  getVitals: (patientId?: string) =>
    apiClient.get<VitalEntity[]>(patientId ? `/vitals?patientId=${patientId}` : '/vitals'),
  createVital: (vital: Partial<VitalEntity>) => apiClient.post<VitalEntity>('/vitals', vital),
};

export const reminderApi = {
  getReminders: (patientId?: string) =>
    apiClient.get<ReminderEntity[]>(patientId ? `/reminders?patientId=${patientId}` : '/reminders'),
  createReminder: (reminder: Partial<ReminderEntity>) => apiClient.post<ReminderEntity>('/reminders', reminder),
  updateReminder: (id: string, data: Partial<ReminderEntity>) => apiClient.patch<ReminderEntity>(`/reminders/${id}`, data),
  updateFollowUpStatus: (id: string, followUpStatus: 'Accepted' | 'Declined') =>
    apiClient.patch<ReminderEntity>(`/reminders/${id}/follow-up`, { followUpStatus }),
  deleteReminder: (id: string) => apiClient.delete(`/reminders/${id}`),
};

export const medicineApi = {
  getMedicines: (search?: string, category?: string) =>
    apiClient.get<any[]>(`/medicines?${search ? `search=${encodeURIComponent(search)}&` : ''}${category ? `category=${encodeURIComponent(category)}` : ''}`),
  getActiveMedications: (patientId?: string) =>
    apiClient.get<{ medications: any[]; todayDoses: any[] }>(patientId ? `/medicines/active?patientId=${patientId}` : '/medicines/active'),
  createPatientMedication: (data: any) => apiClient.post('/medicines/patient-meds', data),
  updatePatientMedication: (id: string, data: any) => apiClient.patch(`/medicines/patient-meds/${id}`, data),
  deletePatientMedication: (id: string) => apiClient.delete(`/medicines/patient-meds/${id}`),
  recordDoseLog: (data: { doseId: string; medicineId: string; status: 'taken' | 'skipped'; skipReason?: string }) =>
    apiClient.post('/medicines/dose-log', data),
  createMedicine: (med: any) => apiClient.post('/medicines', med),
};

export const insuranceApi = {
  getPolicies: (search?: string) => apiClient.get<any[]>(`/insurance/policies${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getPolicyById: (id: string) => apiClient.get<any>(`/insurance/policies/${id}`),
  createPolicy: (data: any) => apiClient.post('/insurance/policies', data),
  getClaims: (status?: string) => apiClient.get<any[]>(`/insurance/claims${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createClaim: (data: any) => apiClient.post('/insurance/claims', data),
  updateClaimStatus: (id: string, data: { status: string; approvedAmount?: number; reason?: string }) =>
    apiClient.patch(`/insurance/claims/${id}/status`, data),
  getPreAuthorizations: () => apiClient.get<any[]>('/insurance/preauth'),
  getSettlements: () => apiClient.get<any[]>('/insurance/settlements'),
};

export const caregiverApi = {
  getWards: () => apiClient.get<any[]>('/caregiver/wards'),
  getTasks: (patientId?: string) => apiClient.get<any[]>(patientId ? `/caregiver/tasks?patientId=${patientId}` : '/caregiver/tasks'),
  createTask: (data: any) => apiClient.post('/caregiver/tasks', data),
  updateTask: (id: string, data: { status?: string; notes?: string }) => apiClient.patch(`/caregiver/tasks/${id}`, data),
  logVital: (data: any) => apiClient.post('/caregiver/vitals', data),
};

export const prescriptionApi = {
  getPrescriptions: (patientId?: string) =>
    apiClient.get<PrescriptionEntity[]>(patientId ? `/prescriptions?patientId=${patientId}` : '/prescriptions'),
  getPrescriptionById: (id: string) => apiClient.get<PrescriptionEntity>(`/prescriptions/${id}`),
  createPrescription: (prescriptionData: any) => apiClient.post<PrescriptionEntity>('/prescriptions', prescriptionData),
  confirmPrescription: (id: string) => apiClient.patch<PrescriptionEntity>(`/prescriptions/${id}/confirm`, {}),
};

export const pharmacyApi = {
  getPharmacies: () => apiClient.get<any[]>('/pharmacies'),
  getPharmacyOrders: (patientId?: string) =>
    apiClient.get<any[]>(patientId ? `/pharmacy-orders?patientId=${patientId}` : '/pharmacy-orders'),
  getPharmacyOrderById: (id: string) => apiClient.get<any>(`/pharmacy-orders/${id}`),
  createPharmacyOrder: (orderData: any) => apiClient.post<any>('/pharmacy-orders', orderData),
  updateOrderStatus: (id: string, status: string, notes?: string) =>
    apiClient.patch<any>(`/pharmacy-orders/${id}/status`, { status, notes }),
  declineOrder: (id: string, reason: string) =>
    apiClient.patch<any>(`/pharmacy-orders/${id}/decline`, { reason }),
};

export const notificationApi = {
  getNotifications: () => apiClient.get<NotificationEntity[]>('/notifications'),
  markAsRead: (id: string) => apiClient.patch<NotificationEntity>(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/notifications/read-all'),
};

export const dashboardApi = {
  getStats: () => apiClient.get<any>('/dashboard/stats'),
};

export const clinicalApi = {
  getDoctorPatients: () => apiClient.get<any[]>('/clinical/doctor-patients'),
  getNurseCareRequests: () => apiClient.get<any[]>('/clinical/nurse-care-requests'),
  getMyCareRequests: () => apiClient.get<any[]>('/clinical/my-care-requests'),
  createNurseCareRequest: (data: any) => apiClient.post<any>('/clinical/nurse-care-requests', data),
  updateCareRequest: (id: string, data: any) => apiClient.patch<any>(`/clinical/nurse-care-requests/${id}`, data),
};

export const adminApi = {
  getUsers: (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any[]>(`/admin/users?${query}`);
  },
  getUserById: (id: string) => apiClient.get<any>(`/admin/users/${id}`),
  createUser: (userData: any) => apiClient.post<any>('/admin/users', userData),
  updateUser: (id: string, userData: any) => apiClient.put<any>(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => apiClient.delete<any>(`/admin/users/${id}`),
  updateUserStatus: (id: string, status: string) => apiClient.patch<any>(`/admin/users/${id}/status`, { status }),
  updateUserRole: (id: string, role: string) => apiClient.patch<any>(`/admin/users/${id}/role`, { role }),
};

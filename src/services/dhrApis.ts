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
  cancellationReason?: string | null;
  cancellationDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
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
  sugarType?: string | null;
  weightKg?: number | null;
  notes?: string | null;
  recordedAt: string;
  date?: string;
  time?: string;
  rawTimestamp?: number;
  status?: string;
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
  getAdherenceTrends: (patientId?: string) =>
    apiClient.get<{ summary: any; timeSeries: any[]; hasData: boolean }>(patientId ? `/medicines/adherence?patientId=${patientId}` : '/medicines/adherence'),
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
  addDependent: (data: any) => apiClient.post<any[]>('/caregiver/dependents', data),
  removeDependent: (patientId: string) => apiClient.delete<any>(`/caregiver/dependents/${patientId}`),
  getTasks: (patientId?: string) => apiClient.get<any[]>(patientId ? `/caregiver/tasks?patientId=${patientId}` : '/caregiver/tasks'),
  createTask: (data: any) => apiClient.post('/caregiver/tasks', data),
  updateTask: (id: string, data: { status?: string; notes?: string }) => apiClient.patch(`/caregiver/tasks/${id}`, data),
  logVital: (data: any) => apiClient.post('/caregiver/vitals', data),
  getCareCircle: (patientId: string) => apiClient.get<any>(`/caregiver/care-circle?patientId=${patientId}`),
  addCareCircleMember: (data: any) => apiClient.post<any>('/caregiver/care-circle/members', data),
  removeCareCircleMember: (patientId: string, targetCaregiverId: string) => apiClient.delete<any>(`/caregiver/care-circle/members/${targetCaregiverId}?patientId=${patientId}`),
  toggleConsentStatus: (patientId: string, status: 'Active' | 'Revoked') => apiClient.patch<any>('/caregiver/consent/status', { patientId, status }),
};

export const prescriptionApi = {
  getPrescriptions: (patientId?: string) =>
    apiClient.get<PrescriptionEntity[]>(patientId ? `/prescriptions?patientId=${patientId}` : '/prescriptions'),
  getPrescriptionById: (id: string) => apiClient.get<PrescriptionEntity>(`/prescriptions/${id}`),
  createPrescription: (prescriptionData: any) => apiClient.post<PrescriptionEntity>('/prescriptions', prescriptionData),
  confirmPrescription: (id: string) => apiClient.patch<PrescriptionEntity>(`/prescriptions/${id}/confirm`, {}),
  getHealthTopics: () => apiClient.get<{ success: boolean; data: any[] }>('/health-topics'),
};

export const pharmacyApi = {
  getPharmacies: () => apiClient.get<any[]>('/pharmacies'),
  getAvailablePharmacies: () => apiClient.get<any[]>('/pharmacies/available'),
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
  deleteNotification: (id: string) => apiClient.delete(`/notifications/${id}`),
  clearAllNotifications: () => apiClient.delete('/notifications/clear-all'),
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
  resetPassword: (id: string, password?: string) => apiClient.post<any>(`/admin/users/${id}/reset-password`, { password }),
  getAuditLogs: (params?: { page?: number; limit?: number; module?: string; action?: string; search?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient.get<any>(`/admin/audit-logs?${query}`);
  },
};

export interface BrandingConfig {
  appName: string;
  tagline: string;
  brandText?: string;
  primaryColor: string;
  accentColor: string;
  themeMode: 'auto' | 'light' | 'dark';
  logoUrl?: string | null;
  alternateLogoUrl?: string | null;
  faviconUrl?: string | null;
  loginTitle: string;
  loginSubtitle: string;
}

export interface LandingHeroConfig {
  badge?: string;
  title: string;
  highlightTitle: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaAction: string;
  secondaryCtaText: string;
  secondaryCtaAction: string;
  backgroundVideoUrl?: string;
  backgroundImageUrl?: string;
  mediaType?: 'video' | 'image';
  overlayStyle?: 'light' | 'medium' | 'dark' | 'gradient';
  showSosCard?: boolean;
  sosCardTitle?: string;
  sosCardSubtitle?: string;
  showSoundControl?: boolean;
  showIndicators?: boolean;
  enabled?: boolean;
}

export interface LandingAboutConfig {
  badge: string;
  title: string;
  description: string;
  highlights: string[];
  learnMoreText: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  missionImageUrl?: string;
  visionImageUrl?: string;
  videoUrl?: string;
  videoPosterUrl?: string;
  videoTitle?: string;
  videoDescription?: string;
  showVideo?: boolean;
  galleryImages?: string[];
}

export interface LandingFeaturesConfig {
  badge: string;
  title: string;
  highlightTitle?: string;
  subtitle: string;
}

export interface LandingCtaConfig {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface LandingConfig {
  sectionsVisibility: {
    hero: boolean;
    about: boolean;
    features: boolean;
    doctors: boolean;
    abha: boolean;
    partnerLoop: boolean;
    cta: boolean;
  };
  sectionsOrder: string[];
  hero: LandingHeroConfig;
  about: LandingAboutConfig;
  features: LandingFeaturesConfig;
  cta: LandingCtaConfig;
}

export interface HeaderNavItem {
  id: string;
  label: string;
  url?: string;
  visible: boolean;
  order: number;
  isMega?: boolean;
  removable?: boolean;
}

export interface HeaderConfig {
  navItems: HeaderNavItem[];
  showProgressBar: boolean;
  showSearch: boolean;
}

export interface FooterConfig {
  footerText: string;
  aboutText: string;
  complianceNotice: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  sectionVisibility: {
    brand: boolean;
    product: boolean;
    care: boolean;
    account: boolean;
  };
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  enabled: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface WidgetConfigItem {
  key: string;
  label: string;
  description?: string;
  enabled: boolean;
  colSpan?: 'full' | 'half' | 'third';
  order: number;
  removable?: boolean;
}

export interface RoleDashboardConfig {
  announcement: {
    id?: string;
    enabled: boolean;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    startDate?: string | null;
    endDate?: string | null;
  };
  announcements?: AnnouncementItem[];
  widgets: Record<string, boolean>;
  widgetList?: WidgetConfigItem[];
}

export interface DashboardsConfig {
  patient: RoleDashboardConfig;
  doctor: RoleDashboardConfig;
  nurse: RoleDashboardConfig;
  caregiver: RoleDashboardConfig;
  pharmacist: RoleDashboardConfig;
  insurance: RoleDashboardConfig;
  admin: RoleDashboardConfig;
  superAdmin: RoleDashboardConfig;
}

export interface SystemSettingsEntity {
  id: string;
  hospitalName: string;
  tagline?: string;
  logoUrl?: string | null;
  supportEmail: string;
  supportPhone?: string | null;
  emergencyPhone?: string | null;
  sessionTimeout: number;
  mfaEnforced: boolean;
  emailAlerts: boolean;
  smsAlerts: boolean;
  maintenanceMode: boolean;
  footerText?: string | null;
  isPublished?: boolean;
  publishedAt?: string | null;
  publishedBy?: string | null;
  updatedAt?: string;
  updatedBy?: string | null;
  branding?: BrandingConfig;
  landing?: LandingConfig;
  header?: HeaderConfig;
  footer?: FooterConfig;
  dashboards?: DashboardsConfig;
  draft?: any;
  rbacMatrix?: Record<string, Record<string, boolean>>;
}

export const settingsApi = {
  getSettings: () => apiClient.get<SystemSettingsEntity>('/settings'),
  getAdminSettings: () => apiClient.get<SystemSettingsEntity>('/admin/settings'),
  updateSettings: (data: any) => apiClient.put<SystemSettingsEntity>('/admin/settings', data),
  publishDraft: () => apiClient.post<any>('/admin/settings/publish', {}),
  resetSettings: () => apiClient.post<any>('/admin/settings/reset', {}),
  getRbacMatrix: () => apiClient.get<Record<string, Record<string, boolean>>>('/admin/roles-permissions/matrix'),
  updateRbacMatrix: (matrix: Record<string, Record<string, boolean>>) => apiClient.put<any>('/admin/roles-permissions/matrix', { matrix }),

  // Role Dashboards CRUD operations
  createAnnouncement: (role: string, data: Partial<AnnouncementItem>) =>
    apiClient.post<any>(`/admin/settings/dashboards/${role}/announcements`, data),
  updateAnnouncement: (role: string, id: string, data: Partial<AnnouncementItem>) =>
    apiClient.put<any>(`/admin/settings/dashboards/${role}/announcements/${id}`, data),
  deleteAnnouncement: (role: string, id: string) =>
    apiClient.delete<any>(`/admin/settings/dashboards/${role}/announcements/${id}`),
  toggleAnnouncement: (role: string, id: string) =>
    apiClient.patch<any>(`/admin/settings/dashboards/${role}/announcements/${id}/toggle`),
  updateRoleWidgets: (role: string, data: { widgets?: Record<string, boolean>; widgetList?: WidgetConfigItem[] }) =>
    apiClient.put<any>(`/admin/settings/dashboards/${role}/widgets`, data),
  resetRoleWidgets: (role: string) =>
    apiClient.post<any>(`/admin/settings/dashboards/${role}/widgets/reset`),
};

export const uploadApi = {
  uploadImage: (file: File, category: string = 'GENERAL') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    return apiClient.post<{
      id: string;
      url: string;
      fileName: string;
      originalName: string;
      mimeType: string;
      sizeBytes: number;
      category: string;
    }>('/upload', formData);
  },
};

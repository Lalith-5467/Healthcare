export interface UserProfileSettings {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  location: string;
  bloodGroup: string;
  emergencyContact: string;
  avatarUrl?: string;
}

export interface AccountSettings {
  accountStatus: 'Active' | 'Inactive' | 'Suspended';
  memberSince: string;
  userId: string;
  plan: string;
}

export interface SecuritySettingsState {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  twoFactorMethod: 'Authenticator App' | 'Email OTP' | 'SMS OTP';
  recentLogins: { id: string; device: string; browser: string; location: string; time: string; status: string }[];
  activeSessions: { id: string; device: string; browser: string; isCurrent: boolean }[];
}

export interface NotificationSettingsState {
  appointments: boolean;
  medications: boolean;
  checkUp: boolean;
  insurance: boolean;
  family: boolean;
  messages: boolean;
  emergency: boolean;
  system: boolean;
  channelInApp: boolean;
  channelEmail: boolean;
  channelSMS: boolean;
  channelPush: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface PrivacySettingsState {
  profileVisibility: 'Private' | 'Family Only' | 'Public';
  healthDataSharing: boolean;
  familyDataSharing: boolean;
  activityTracking: boolean;
  locationAccess: boolean;
  personalizedExperience: boolean;
}

export interface AppearanceSettingsState {
  theme: 'Dark' | 'Light' | 'System';
  accentColor: 'Violet' | 'Blue' | 'Cyan' | 'Green' | 'Rose';
  fontSize: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  reducedMotion: boolean;
}

export interface HealthPreferencesSettingsState {
  healthcareType: 'General Care' | 'Specialist Care' | 'Preventive Care';
  language: 'English' | 'Tamil' | 'Hindi';
  units: 'Metric' | 'Imperial';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12 Hour' | '24 Hour';
  remindersMedication: boolean;
  remindersAppointment: boolean;
  remindersCheckUp: boolean;
  remindersInsurance: boolean;
  remindersHydration: boolean;
}

export interface ConnectedServiceItem {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Not Connected';
  iconName: string;
  enabled: boolean;
}

export const INITIAL_USER_PROFILE: UserProfileSettings = {
  fullName: 'Arun Kumar',
  email: 'arun.kumar@health.in',
  phone: '+91 98401 23456',
  dob: '1990-08-15',
  gender: 'Male',
  location: 'Chennai, Tamil Nadu',
  bloodGroup: 'O+',
  emergencyContact: 'Priya Kumar (Mother)'
};

export const INITIAL_ACCOUNT_SETTINGS: AccountSettings = {
  accountStatus: 'Active',
  memberSince: 'January 2026',
  userId: 'USR-XXXX-2841',
  plan: 'Patient Portal'
};

export const INITIAL_SECURITY_SETTINGS: SecuritySettingsState = {
  passwordLastChanged: '12 Jul 2026',
  twoFactorEnabled: false,
  twoFactorMethod: 'Authenticator App',
  recentLogins: [
    { id: 'LOG-1', device: 'Windows PC', browser: 'Chrome 128', location: 'Chennai, IN', time: 'Today, 10:30 AM', status: 'Current Session' },
    { id: 'LOG-2', device: 'Android Phone', browser: 'Chrome Mobile', location: 'Chennai, IN', time: 'Yesterday, 08:15 PM', status: 'Verified' },
    { id: 'LOG-3', device: 'Windows PC', browser: 'Edge Browser', location: 'Chennai, IN', time: '19 Aug 2026, 02:45 PM', status: 'Verified' }
  ],
  activeSessions: [
    { id: 'SES-1', device: 'Windows PC', browser: 'Chrome (Desktop)', isCurrent: true },
    { id: 'SES-2', device: 'Galaxy S24 Ultra', browser: 'Chrome Mobile App', isCurrent: false }
  ]
};

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSettingsState = {
  appointments: true,
  medications: true,
  checkUp: true,
  insurance: true,
  family: true,
  messages: true,
  emergency: true,
  system: true,
  channelInApp: true,
  channelEmail: true,
  channelSMS: false,
  channelPush: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00'
};

export const INITIAL_PRIVACY_SETTINGS: PrivacySettingsState = {
  profileVisibility: 'Private',
  healthDataSharing: false,
  familyDataSharing: true,
  activityTracking: true,
  locationAccess: false,
  personalizedExperience: true
};

export const INITIAL_APPEARANCE_SETTINGS: AppearanceSettingsState = {
  theme: 'Dark',
  accentColor: 'Violet',
  fontSize: 'Medium',
  reducedMotion: false
};

export const INITIAL_HEALTH_PREFERENCES: HealthPreferencesSettingsState = {
  healthcareType: 'General Care',
  language: 'English',
  units: 'Metric',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12 Hour',
  remindersMedication: true,
  remindersAppointment: true,
  remindersCheckUp: true,
  remindersInsurance: true,
  remindersHydration: false
};

export const CONNECTED_SERVICES_LIST: ConnectedServiceItem[] = [
  { id: 'SERV-01', name: 'Health Records', category: 'Medical Vault', status: 'Connected', iconName: 'FileText', enabled: true },
  { id: 'SERV-02', name: 'Care Appointments', category: 'Doctor Booking', status: 'Connected', iconName: 'Calendar', enabled: true },
  { id: 'SERV-03', name: 'Family Connect', category: 'Dependent Network', status: 'Connected', iconName: 'Users', enabled: true },
  { id: 'SERV-04', name: 'Insurance Desk', category: 'Claims & Policies', status: 'Connected', iconName: 'ShieldCheck', enabled: true },
  { id: 'SERV-05', name: 'Nearby Hospitals', category: 'Trauma Locator', status: 'Connected', iconName: 'Building2', enabled: true },
  { id: 'SERV-06', name: 'SOS & Emergency', category: 'Safety Desk', status: 'Connected', iconName: 'AlertTriangle', enabled: true }
];

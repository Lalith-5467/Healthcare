export interface EmergencyContactItem {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: 'Primary' | 'Secondary' | 'Medical Contact';
  avatarUrl?: string;
  status: 'Ready' | 'Notified';
}

export interface EmergencyMedicalInfo {
  patientName: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  medications: string;
  preferredHospital: string;
  medicalId: string;
}

export interface EmergencyServiceItem {
  id: string;
  serviceName: string;
  phone: string;
  description: string;
  iconType: 'ambulance' | 'police' | 'fire' | 'hospital';
}

export interface EmergencyActivityItem {
  id: string;
  event: string;
  date: string;
  time: string;
  status: 'Completed' | 'Cancelled' | 'Test';
}

export interface EmergencyPreferencesState {
  countdownSeconds: number; // 3, 5, 10
  locationSharing: boolean;
  requireConfirmation: boolean;
}

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContactItem[] = [
  {
    id: 'CONT-01',
    name: 'Priya Kumar',
    relationship: 'Mother',
    phone: '+91 98401 23456',
    priority: 'Primary',
    status: 'Ready'
  },
  {
    id: 'CONT-02',
    name: 'Arun Kumar',
    relationship: 'Father',
    phone: '+91 98401 67890',
    priority: 'Secondary',
    status: 'Ready'
  },
  {
    id: 'CONT-03',
    name: 'Dr. Rajesh Kumar',
    relationship: 'Doctor / Caregiver',
    phone: '+91 44 2234 5678',
    priority: 'Medical Contact',
    status: 'Ready'
  }
];

export const INITIAL_MEDICAL_INFO: EmergencyMedicalInfo = {
  patientName: 'Arun Kumar',
  bloodGroup: 'O+',
  allergies: 'Penicillin, Peanuts (Severe)',
  conditions: 'Hypertension, Mild Asthma',
  medications: 'Amlodipine 5mg, Montelukast 10mg',
  preferredHospital: 'CityCare Multispecialty Hospital',
  medicalId: 'MED-XXXX-2381'
};

export const EMERGENCY_SERVICES: EmergencyServiceItem[] = [
  {
    id: 'SERV-01',
    serviceName: 'Ambulance',
    phone: '108',
    description: 'Emergency medical life support & trauma transport',
    iconType: 'ambulance'
  },
  {
    id: 'SERV-02',
    serviceName: 'Police Department',
    phone: '100',
    description: 'Police emergency assistance & safety dispatch',
    iconType: 'police'
  },
  {
    id: 'SERV-03',
    serviceName: 'Fire & Rescue',
    phone: '101',
    description: 'Fire hazard response & rescue operations',
    iconType: 'fire'
  },
  {
    id: 'SERV-04',
    serviceName: 'Nearby Emergency Hospital',
    phone: '+91 44 2234 5678',
    description: 'Find 24x7 active emergency trauma care bays',
    iconType: 'hospital'
  }
];

export const INITIAL_EMERGENCY_HISTORY: EmergencyActivityItem[] = [
  { id: 'ACT-01', event: 'SOS Simulation', date: '24 Aug 2026', time: '10:32 AM', status: 'Cancelled' },
  { id: 'ACT-02', event: 'Emergency Contact Test', date: '18 Aug 2026', time: '04:20 PM', status: 'Completed' },
  { id: 'ACT-03', event: 'Location Preview Check', date: '05 Aug 2026', time: '11:15 AM', status: 'Completed' }
];

export const DEFAULT_EMERGENCY_PREFERENCES: EmergencyPreferencesState = {
  countdownSeconds: 5,
  locationSharing: true,
  requireConfirmation: true
};

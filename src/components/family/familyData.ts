export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'Father' | 'Mother' | 'Spouse' | 'Child' | 'Sibling' | 'Grandparent' | 'Other';
  status: 'Connected' | 'Pending' | 'Removed';
  avatarUrl: string;
  connectedSince: string;
  sharedItemsCount: number;
  lastActivity: string;
  age?: number;
  phone?: string;
  email?: string;
}

export interface PendingRequest {
  id: string;
  name: string;
  relationship: string;
  contact: string;
  type: 'Incoming' | 'Outgoing';
  timeAgo: string;
  status: 'Pending';
}

export interface SharedAppointment {
  id: string;
  doctorName: string;
  speciality: string;
  type: 'Video Consultation' | 'In-Person';
  date: string;
  time: string;
  sharedWith: string[]; // Member names
  status: 'Upcoming' | 'Completed';
}

export interface SharedReminder {
  id: string;
  title: string;
  dosage?: string;
  time: string;
  sharedWith: string[]; // Member names
  status: 'Active' | 'Completed';
}

export interface FamilyActivityItem {
  id: string;
  type: 'Appointment' | 'Reminder' | 'Connection' | 'Pharmacy' | 'Message';
  title: string;
  subtitle: string;
  date: string;
  time: string;
  memberName: string;
}

export interface FamilyChatMessage {
  id: string;
  sender: 'Self' | 'Member';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface SharingPermissionState {
  memberId: string;
  memberName: string;
  accessLevel: 'View Only' | 'Manage' | 'Full Access';
  appointments: boolean;
  reminders: boolean;
  pharmacy: boolean;
  medicalRecords: boolean;
  healthAnalytics: boolean;
  consultations: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: 'Primary Contact' | 'Secondary Contact';
}

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'MEM-101',
    name: 'Arun Kumar',
    relationship: 'Father',
    status: 'Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    connectedSince: '12 Aug 2026',
    sharedItemsCount: 4,
    lastActivity: 'Today · 10:30 AM',
    age: 62,
    phone: '+91 98765 43210',
    email: 'arun.kumar@example.com'
  },
  {
    id: 'MEM-102',
    name: 'Priya Kumar',
    relationship: 'Mother',
    status: 'Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    connectedSince: '15 Aug 2026',
    sharedItemsCount: 3,
    lastActivity: 'Yesterday · 04:20 PM',
    age: 58,
    phone: '+91 98765 43211',
    email: 'priya.kumar@example.com'
  },
  {
    id: 'MEM-103',
    name: 'Ananya Kumar',
    relationship: 'Sibling',
    status: 'Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    connectedSince: '18 Aug 2026',
    sharedItemsCount: 2,
    lastActivity: '22 Aug · 11:10 AM',
    age: 26,
    phone: '+91 98765 43212',
    email: 'ananya.kumar@example.com'
  },
  {
    id: 'MEM-104',
    name: 'Rahul Kumar',
    relationship: 'Sibling',
    status: 'Connected',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
    connectedSince: '20 Aug 2026',
    sharedItemsCount: 1,
    lastActivity: '21 Aug · 06:30 PM',
    age: 24,
    phone: '+91 98765 43213',
    email: 'rahul.kumar@example.com'
  }
];

export const INITIAL_PENDING_REQUESTS: PendingRequest[] = [
  {
    id: 'REQ-201',
    name: 'Meena Kumar',
    relationship: 'Mother',
    contact: 'meena.kumar@example.com',
    type: 'Outgoing',
    timeAgo: '2 hours ago',
    status: 'Pending'
  }
];

export const INITIAL_SHARED_APPOINTMENTS: SharedAppointment[] = [
  {
    id: 'APT-SH-01',
    doctorName: 'Dr. Rajesh Kumar',
    speciality: 'Cardiologist',
    type: 'Video Consultation',
    date: 'Today · 24 Aug 2026',
    time: '10:30 AM',
    sharedWith: ['Priya Kumar (Mother)', 'Arun Kumar (Father)'],
    status: 'Upcoming'
  },
  {
    id: 'APT-SH-02',
    doctorName: 'Dr. Priya Sharma',
    speciality: 'General Physician',
    type: 'In-Person',
    date: '25 Aug 2026',
    time: '05:00 PM',
    sharedWith: ['Arun Kumar (Father)'],
    status: 'Upcoming'
  }
];

export const INITIAL_SHARED_REMINDERS: SharedReminder[] = [
  {
    id: 'REM-SH-01',
    title: 'Metformin Dose (500mg)',
    dosage: '1 tablet after lunch',
    time: '12:30 PM Daily',
    sharedWith: ['Priya Kumar (Mother)'],
    status: 'Active'
  },
  {
    id: 'REM-SH-02',
    title: 'Atorvastatin Dose (10mg)',
    dosage: '1 tablet at bedtime',
    time: '09:00 PM Daily',
    sharedWith: ['Arun Kumar (Father)'],
    status: 'Active'
  }
];

export const INITIAL_FAMILY_ACTIVITIES: FamilyActivityItem[] = [
  {
    id: 'ACT-FAM-01',
    type: 'Appointment',
    title: 'Appointment Shared',
    subtitle: 'Dr. Rajesh Kumar - Video Consultation',
    date: 'Today',
    time: '10:30 AM',
    memberName: 'Priya Kumar (Mother)'
  },
  {
    id: 'ACT-FAM-02',
    type: 'Reminder',
    title: 'Medication Reminder Shared',
    subtitle: 'Metformin 500mg daily tracking',
    date: 'Yesterday',
    time: '04:20 PM',
    memberName: 'Arun Kumar (Father)'
  },
  {
    id: 'ACT-FAM-03',
    type: 'Connection',
    title: 'Family Member Connected',
    subtitle: 'Ananya Kumar joined your family care vault',
    date: '22 Aug',
    time: '11:10 AM',
    memberName: 'Ananya Kumar'
  }
];

export const INITIAL_FAMILY_MESSAGES: FamilyChatMessage[] = [
  {
    id: 'MSG-FAM-01',
    sender: 'Member',
    senderName: 'Priya Kumar (Mother)',
    text: 'Hello Samson! Your cardiology consultation is scheduled for today at 10:30 AM.',
    timestamp: '10:15 AM',
    isRead: true
  },
  {
    id: 'MSG-FAM-02',
    sender: 'Self',
    senderName: 'Samson L.',
    text: 'Yes Mother! I have joined the pre-call device setup and lab reports are attached.',
    timestamp: '10:18 AM',
    isRead: true
  }
];

export const INITIAL_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'EMG-01',
    name: 'Arun Kumar',
    relationship: 'Father',
    phone: '+91 98765 43210',
    priority: 'Primary Contact'
  },
  {
    id: 'EMG-02',
    name: 'Priya Kumar',
    relationship: 'Mother',
    phone: '+91 98765 43211',
    priority: 'Secondary Contact'
  }
];

export const DEFAULT_SHARING_PERMISSIONS: SharingPermissionState[] = [
  {
    memberId: 'MEM-101',
    memberName: 'Arun Kumar (Father)',
    accessLevel: 'Manage',
    appointments: true,
    reminders: true,
    pharmacy: true,
    medicalRecords: true,
    healthAnalytics: false,
    consultations: true
  },
  {
    memberId: 'MEM-102',
    memberName: 'Priya Kumar (Mother)',
    accessLevel: 'View Only',
    appointments: true,
    reminders: true,
    pharmacy: true,
    medicalRecords: false,
    healthAnalytics: false,
    consultations: true
  }
];

export interface ReminderItem {
  id: string;
  title: string;
  category: 'Medication' | 'Appointment' | 'Pharmacy' | 'Consultation' | 'General' | 'System';
  description: string;
  date: string; // e.g. "24 Aug 2026"
  time: string; // e.g. "12:30 PM"
  repeat: 'Does not repeat' | 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
  customDays?: string[];
  timing: 'At scheduled time' | '5 minutes before' | '15 minutes before' | '30 minutes before' | '1 hour before' | '1 day before';
  status: 'Upcoming' | 'Due Now' | 'Completed' | 'Snoozed' | 'Dismissed' | 'Missed' | 'Cancelled';
  priority: 'Normal' | 'Important' | 'High Priority';
  completedTime?: string;
  snoozedUntil?: string;
  relatedModule?: 'medicines' | 'appointments' | 'pharmacy' | 'consultation';
  sourcePrescriptionId?: string;
  doctorName?: string;
  clinicName?: string;
  followUpStatus?: 'Pending' | 'Accepted' | 'Declined';
  followUpDate?: string;
}

export interface NotificationLog {
  id: string;
  title: string;
  description: string;
  category: 'Medication' | 'Appointment' | 'Pharmacy' | 'Consultation' | 'General' | 'System';
  timeAgo: string;
  date: string;
  isRead: boolean;
  relatedModule?: 'medicines' | 'appointments' | 'pharmacy' | 'consultation';
}

export interface NotificationSettingsState {
  medicationReminders: boolean;
  appointmentReminders: boolean;
  pharmacyUpdates: boolean;
  consultationAlerts: boolean;
  generalNotifications: boolean;
  systemNotifications: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  reminderSound: 'Default' | 'Soft' | 'Minimal' | 'Off';
  browserPermission: 'Granted' | 'Denied' | 'Default';
}

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'REM-REQ-001',
    title: 'Doctor Follow-up: Dr. Arun Kumar',
    category: 'Appointment',
    description: 'Follow-up review with Dr. Arun Kumar',
    date: '05 Sep 2026',
    time: '10:30 AM',
    repeat: 'Does not repeat',
    timing: '1 day before',
    status: 'Upcoming',
    priority: 'High Priority',
    doctorName: 'Dr. Arun Kumar',
    clinicName: 'General Medicine',
    followUpStatus: 'Pending',
    relatedModule: 'appointments'
  },
  {
    id: 'REM-REQ-002',
    title: 'Cardiology Follow-up: Dr. Meena Iyer',
    category: 'Appointment',
    description: 'Routine check-up with Dr. Meena Iyer',
    date: '12 Sep 2026',
    time: '02:00 PM',
    repeat: 'Does not repeat',
    timing: '15 minutes before',
    status: 'Upcoming',
    priority: 'Normal',
    doctorName: 'Dr. Meena Iyer',
    clinicName: 'Cardiology',
    followUpStatus: 'Pending',
    relatedModule: 'appointments'
  },
  {
    id: 'REM-101',
    title: 'Take Metformin (500 mg)',
    category: 'Medication',
    description: 'Pill tracker: Take after lunch with warm water',
    date: '24 Aug 2026',
    time: '12:30 PM',
    repeat: 'Daily',
    timing: 'At scheduled time',
    status: 'Upcoming',
    priority: 'High Priority',
    relatedModule: 'medicines'
  },
  {
    id: 'REM-102',
    title: 'Cardiology Appointment Review',
    category: 'Appointment',
    description: 'Dr. Rajesh Kumar at Apollo Hospital',
    date: '24 Aug 2026',
    time: '05:00 PM',
    repeat: 'Does not repeat',
    timing: '1 hour before',
    status: 'Upcoming',
    priority: 'Important',
    relatedModule: 'appointments'
  },
  {
    id: 'REM-103',
    title: 'Take Vitamin D3 (1000 IU)',
    category: 'Medication',
    description: 'Morning vitamin supplement after breakfast',
    date: '24 Aug 2026',
    time: '08:00 AM',
    repeat: 'Daily',
    timing: 'At scheduled time',
    status: 'Completed',
    priority: 'Normal',
    completedTime: '08:02 AM',
    relatedModule: 'medicines'
  },
  {
    id: 'REM-104',
    title: 'Pharmacy Refill Ready for Pickup',
    category: 'Pharmacy',
    description: 'Order RX-2026-00482 ready at HealthPlus Pharmacy',
    date: '24 Aug 2026',
    time: '02:00 PM',
    repeat: 'Does not repeat',
    timing: 'At scheduled time',
    status: 'Upcoming',
    priority: 'Important',
    relatedModule: 'pharmacy'
  },
  {
    id: 'REM-105',
    title: 'Take Atorvastatin (10 mg)',
    category: 'Medication',
    description: 'Bedtime cholesterol medication',
    date: '24 Aug 2026',
    time: '09:00 PM',
    repeat: 'Daily',
    timing: '15 minutes before',
    status: 'Upcoming',
    priority: 'Normal',
    relatedModule: 'medicines'
  },
  {
    id: 'REM-106',
    title: 'Follow-up Video Consultation',
    category: 'Consultation',
    description: 'Tele-consultation session with Dr. Priya Sharma',
    date: '25 Aug 2026',
    time: '10:30 AM',
    repeat: 'Does not repeat',
    timing: '30 minutes before',
    status: 'Upcoming',
    priority: 'High Priority',
    relatedModule: 'consultation'
  },
  {
    id: 'REM-107',
    title: 'System Security Health Check',
    category: 'System',
    description: 'ABHA health ID PIN validation reminder',
    date: '26 Aug 2026',
    time: '11:00 AM',
    repeat: 'Monthly',
    timing: '1 day before',
    status: 'Upcoming',
    priority: 'Normal'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  {
    id: 'NOTIF-201',
    title: 'Medicine marked as taken',
    description: 'Vitamin D3 (1000 IU) marked as taken at 08:02 AM.',
    category: 'Medication',
    timeAgo: '2 hours ago',
    date: 'Today',
    isRead: false,
    relatedModule: 'medicines'
  },
  {
    id: 'NOTIF-202',
    title: 'Appointment Reminder',
    description: 'Your Cardiology appointment with Dr. Rajesh Kumar is today at 05:00 PM.',
    category: 'Appointment',
    timeAgo: '3 hours ago',
    date: 'Today',
    isRead: false,
    relatedModule: 'appointments'
  },
  {
    id: 'NOTIF-203',
    title: 'Pharmacy Refill Dispatched',
    description: 'Refill Order RX-2026-00482 is out for delivery with HealthPlus Pharmacy.',
    category: 'Pharmacy',
    timeAgo: '5 hours ago',
    date: 'Today',
    isRead: false,
    relatedModule: 'pharmacy'
  },
  {
    id: 'NOTIF-204',
    title: 'Consultation Summary Available',
    description: 'Dr. Rajesh Kumar published your video consultation summary notes.',
    category: 'Consultation',
    timeAgo: 'Yesterday',
    date: '23 Aug',
    isRead: true,
    relatedModule: 'consultation'
  },
  {
    id: 'NOTIF-205',
    title: 'System Backup Complete',
    description: 'Longitudinal medical records encrypted & synced to ABDM storage.',
    category: 'System',
    timeAgo: '2 days ago',
    date: '22 Aug',
    isRead: true
  }
];

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettingsState = {
  medicationReminders: true,
  appointmentReminders: true,
  pharmacyUpdates: true,
  consultationAlerts: true,
  generalNotifications: true,
  systemNotifications: true,
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  reminderSound: 'Default',
  browserPermission: 'Default'
};

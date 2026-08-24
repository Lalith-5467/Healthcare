export interface VitalDataPoint {
  date: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  temperature: number;
  spo2: number;
  weight: number;
}

export interface AdherenceDay {
  day: string;
  percentage: number;
}

export interface HealthGoal {
  id: string;
  title: string;
  category: 'Steps' | 'Sleep' | 'Water' | 'Activity' | 'Other';
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate: string;
  progress: number; // percentage 0-100
  isPaused: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'Medication' | 'Appointment' | 'Record' | 'Consultation' | 'Wellness';
  title: string;
  subtitle: string;
  date: string;
  time: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled' | 'Added';
}

export interface MonthlyComparisonMetric {
  label: string;
  currentValue: string;
  previousValue: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export const MOCK_VITALS_TIMELINE: VitalDataPoint[] = [
  { date: '18 Aug', heartRate: 70, systolic: 118, diastolic: 78, temperature: 98.2, spo2: 98, weight: 69.2 },
  { date: '19 Aug', heartRate: 74, systolic: 122, diastolic: 82, temperature: 98.6, spo2: 97, weight: 69.0 },
  { date: '20 Aug', heartRate: 72, systolic: 120, diastolic: 80, temperature: 98.4, spo2: 98, weight: 68.8 },
  { date: '21 Aug', heartRate: 68, systolic: 116, diastolic: 76, temperature: 98.1, spo2: 99, weight: 68.5 },
  { date: '22 Aug', heartRate: 75, systolic: 121, diastolic: 81, temperature: 98.5, spo2: 98, weight: 68.3 },
  { date: '23 Aug', heartRate: 71, systolic: 119, diastolic: 79, temperature: 98.3, spo2: 98, weight: 68.1 },
  { date: '24 Aug', heartRate: 72, systolic: 120, diastolic: 80, temperature: 98.4, spo2: 98, weight: 68.0 }
];

export const MOCK_WEEKLY_ADHERENCE: AdherenceDay[] = [
  { day: 'Mon', percentage: 92 },
  { day: 'Tue', percentage: 88 },
  { day: 'Wed', percentage: 95 },
  { day: 'Thu', percentage: 82 },
  { day: 'Fri', percentage: 90 },
  { day: 'Sat', percentage: 87 },
  { day: 'Sun', percentage: 91 }
];

export const INITIAL_HEALTH_GOALS: HealthGoal[] = [
  {
    id: 'GOAL-101',
    title: 'Daily Steps',
    category: 'Steps',
    target: 8000,
    current: 7420,
    unit: 'steps',
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    progress: 92,
    isPaused: false
  },
  {
    id: 'GOAL-102',
    title: 'Night Sleep Duration',
    category: 'Sleep',
    target: 8,
    current: 7.5,
    unit: 'hours',
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    progress: 94,
    isPaused: false
  },
  {
    id: 'GOAL-103',
    title: 'Daily Water Intake',
    category: 'Water',
    target: 2.5,
    current: 2.1,
    unit: 'Liters',
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    progress: 84,
    isPaused: false
  },
  {
    id: 'GOAL-104',
    title: 'Active Exercise Duration',
    category: 'Activity',
    target: 45,
    current: 42,
    unit: 'minutes',
    startDate: '01 Aug 2026',
    endDate: '31 Aug 2026',
    progress: 93,
    isPaused: false
  }
];

export const MOCK_ACTIVITY_TIMELINE: ActivityItem[] = [
  {
    id: 'ACT-01',
    type: 'Record',
    title: 'Lab Report Added',
    subtitle: 'CBC Blood Test (Apollo Diagnostics)',
    date: 'Today',
    time: '10:30 AM',
    status: 'Added'
  },
  {
    id: 'ACT-02',
    type: 'Medication',
    title: 'Medication Dose Taken',
    subtitle: 'Metformin 500mg (Morning dose)',
    date: 'Today',
    time: '08:02 AM',
    status: 'Completed'
  },
  {
    id: 'ACT-03',
    type: 'Consultation',
    title: 'Video Consultation Completed',
    subtitle: 'Dr. Rajesh Kumar (Cardiologist)',
    date: 'Yesterday',
    time: '04:20 PM',
    status: 'Completed'
  },
  {
    id: 'ACT-04',
    type: 'Appointment',
    title: 'Appointment Booked',
    subtitle: 'Routine Health Checkup with Dr. Priya Sharma',
    date: '22 Aug 2026',
    time: '11:30 AM',
    status: 'Upcoming'
  },
  {
    id: 'ACT-05',
    type: 'Record',
    title: 'Imaging Report Uploaded',
    subtitle: 'Chest X-Ray Digital Record',
    date: '20 Aug 2026',
    time: '02:15 PM',
    status: 'Added'
  }
];

export const MOCK_MONTHLY_COMPARISONS: MonthlyComparisonMetric[] = [
  { label: 'Medication Adherence', currentValue: '91%', previousValue: '86%', change: '+5%', trend: 'up' },
  { label: 'Appointments Completed', currentValue: '8 visits', previousValue: '6 visits', change: '+2', trend: 'up' },
  { label: 'Medical Records Uploaded', currentValue: '4 records', previousValue: '3 records', change: '+1', trend: 'up' },
  { label: 'Tele-Consultation Hours', currentValue: '5 sessions', previousValue: '4 sessions', change: '+1', trend: 'up' }
];

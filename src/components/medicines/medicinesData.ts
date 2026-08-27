export interface MedicineItem {
  id: string;
  name: string;
  dosage: string;
  unit: 'mg' | 'g' | 'ml' | 'tablet' | 'capsule' | 'drop';
  frequency: 'Once daily' | 'Twice daily' | 'Three times daily' | 'Every 4 hours' | 'As needed';
  route: 'Oral' | 'Topical' | 'Injection' | 'Other';
  times: string[]; // e.g. ["08:00 AM", "12:30 PM"]
  startDate: string; // e.g. "01 Aug 2026"
  endDate: string; // e.g. "30 Sep 2026"
  prescribedBy: string; // e.g. "Dr. Rajesh Kumar"
  hospital: string; // e.g. "Apollo Hospital"
  purpose: string;
  instructions: string; // e.g. "Take after food with warm water"
  foodInstruction?: 'Before Food' | 'After Food' | 'With Food' | 'Anytime';
  status: 'Active' | 'Completed' | 'Paused';
  stockRemaining: number;
  totalStock: number;
  reminderEnabled: boolean;
  notes?: string;
  sourcePrescriptionId?: string;
}

export interface DoseRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  scheduledTime: string;
  actualTime: string | null;
  date: string;
  status: 'Taken' | 'Upcoming' | 'Due Now' | 'Missed' | 'Skipped';
}

export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'MED-101',
    name: 'Metformin',
    dosage: '500',
    unit: 'mg',
    frequency: 'Twice daily',
    route: 'Oral',
    times: ['08:00 AM', '12:30 PM'],
    startDate: '01 Aug 2026',
    endDate: '30 Sep 2026',
    prescribedBy: 'Dr. Rajesh Kumar',
    hospital: 'Apollo Hospital',
    purpose: 'Blood sugar control and diabetes management',
    instructions: 'Take after meal with a full glass of water.',
    foodInstruction: 'After Food',
    status: 'Active',
    stockRemaining: 8,
    totalStock: 60,
    reminderEnabled: true
  },
  {
    id: 'MED-102',
    name: 'Atorvastatin',
    dosage: '10',
    unit: 'mg',
    frequency: 'Once daily',
    route: 'Oral',
    times: ['09:00 PM'],
    startDate: '10 Jul 2026',
    endDate: '10 Oct 2026',
    prescribedBy: 'Dr. Priya Sharma',
    hospital: 'Fortis Healthcare',
    purpose: 'Cholesterol control and cardiovascular wellness',
    instructions: 'Take once daily at bedtime.',
    foodInstruction: 'Anytime',
    status: 'Active',
    stockRemaining: 24,
    totalStock: 30,
    reminderEnabled: true
  },
  {
    id: 'MED-103',
    name: 'Vitamin D3',
    dosage: '1000',
    unit: 'IU' as any,
    frequency: 'Once daily',
    route: 'Oral',
    times: ['08:00 AM'],
    startDate: '01 Jun 2026',
    endDate: '31 Aug 2026',
    prescribedBy: 'Dr. Rajesh Kumar',
    hospital: 'Apollo Hospital',
    purpose: 'Bone strength and immunity supplement',
    instructions: 'Take morning after breakfast.',
    foodInstruction: 'After Food',
    status: 'Active',
    stockRemaining: 12,
    totalStock: 30,
    reminderEnabled: true
  },
  {
    id: 'MED-104',
    name: 'Omeprazole',
    dosage: '20',
    unit: 'mg',
    frequency: 'Once daily',
    route: 'Oral',
    times: ['07:30 AM'],
    startDate: '15 Aug 2026',
    endDate: '30 Aug 2026',
    prescribedBy: 'Dr. Rajesh Kumar',
    hospital: 'Apollo Hospital',
    purpose: 'Gastric acid reflux relief',
    instructions: 'Take 30 minutes before breakfast.',
    foodInstruction: 'Before Food',
    status: 'Active',
    stockRemaining: 7,
    totalStock: 15,
    reminderEnabled: false
  },
  {
    id: 'MED-105',
    name: 'Amoxicillin',
    dosage: '500',
    unit: 'mg',
    frequency: 'Twice daily',
    route: 'Oral',
    times: ['09:00 AM', '09:00 PM'],
    startDate: '12 Aug 2026',
    endDate: '20 Aug 2026',
    prescribedBy: 'Dr. Rajesh Kumar',
    hospital: 'Apollo Hospital',
    purpose: 'Antibiotic treatment for bacterial throat infection',
    instructions: 'Complete 7-day course as prescribed.',
    foodInstruction: 'After Food',
    status: 'Completed',
    stockRemaining: 0,
    totalStock: 14,
    reminderEnabled: false
  },
  {
    id: 'MED-106',
    name: 'Amlodipine (BP Medicine)',
    dosage: '5',
    unit: 'mg',
    frequency: 'Once daily',
    route: 'Oral',
    times: ['06:00 PM'],
    startDate: '01 May 2026',
    endDate: '01 Nov 2026',
    prescribedBy: 'Dr. Priya Sharma',
    hospital: 'Fortis Healthcare',
    purpose: 'Blood pressure control',
    instructions: 'Take regularly every evening.',
    foodInstruction: 'Anytime',
    status: 'Active',
    stockRemaining: 18,
    totalStock: 30,
    reminderEnabled: true
  }
];

export const INITIAL_TODAY_DOSES: DoseRecord[] = [
  {
    id: 'DOSE-01',
    medicineId: 'MED-103',
    medicineName: 'Vitamin D3 (1000 IU)',
    dosage: '1000 IU',
    scheduledTime: '08:00 AM',
    actualTime: '08:02 AM',
    date: '23 Aug 2026',
    status: 'Taken'
  },
  {
    id: 'DOSE-02',
    medicineId: 'MED-101',
    medicineName: 'Metformin (500 mg)',
    dosage: '500 mg',
    scheduledTime: '08:00 AM',
    actualTime: '08:15 AM',
    date: '23 Aug 2026',
    status: 'Taken'
  },
  {
    id: 'DOSE-03',
    medicineId: 'MED-101',
    medicineName: 'Metformin (500 mg)',
    dosage: '500 mg',
    scheduledTime: '12:30 PM',
    actualTime: null,
    date: '23 Aug 2026',
    status: 'Upcoming'
  },
  {
    id: 'DOSE-04',
    medicineId: 'MED-106',
    medicineName: 'Amlodipine (BP Medicine)',
    dosage: '5 mg',
    scheduledTime: '06:00 PM',
    actualTime: null,
    date: '23 Aug 2026',
    status: 'Upcoming'
  },
  {
    id: 'DOSE-05',
    medicineId: 'MED-102',
    medicineName: 'Atorvastatin (10 mg)',
    dosage: '10 mg',
    scheduledTime: '09:00 PM',
    actualTime: null,
    date: '23 Aug 2026',
    status: 'Upcoming'
  }
];

export const MOCK_HISTORY_LOGS: DoseRecord[] = [
  { id: 'HIST-101', medicineId: 'MED-103', medicineName: 'Vitamin D3', dosage: '1000 IU', scheduledTime: '08:00 AM', actualTime: '08:02 AM', date: '23 Aug', status: 'Taken' },
  { id: 'HIST-102', medicineId: 'MED-101', medicineName: 'Metformin', dosage: '500 mg', scheduledTime: '08:00 AM', actualTime: '08:15 AM', date: '23 Aug', status: 'Taken' },
  { id: 'HIST-103', medicineId: 'MED-102', medicineName: 'Atorvastatin', dosage: '10 mg', scheduledTime: '09:00 PM', actualTime: '09:05 PM', date: '22 Aug', status: 'Taken' },
  { id: 'HIST-104', medicineId: 'MED-101', medicineName: 'Metformin', dosage: '500 mg', scheduledTime: '12:30 PM', actualTime: null, date: '22 Aug', status: 'Skipped' },
  { id: 'HIST-105', medicineId: 'MED-101', medicineName: 'Metformin', dosage: '500 mg', scheduledTime: '08:00 AM', actualTime: '08:10 AM', date: '22 Aug', status: 'Taken' },
  { id: 'HIST-106', medicineId: 'MED-103', medicineName: 'Vitamin D3', dosage: '1000 IU', scheduledTime: '08:00 AM', actualTime: '08:00 AM', date: '21 Aug', status: 'Taken' },
  { id: 'HIST-107', medicineId: 'MED-106', medicineName: 'Amlodipine', dosage: '5 mg', scheduledTime: '06:00 PM', actualTime: '06:20 PM', date: '21 Aug', status: 'Taken' }
];

export const MOCK_WEEKLY_ADHERENCE = [
  { day: 'Mon', percent: 92 },
  { day: 'Tue', percent: 88 },
  { day: 'Wed', percent: 95 },
  { day: 'Thu', percent: 82 },
  { day: 'Fri', percent: 90 },
  { day: 'Sat', percent: 87 },
  { day: 'Sun', percent: 75 }
];

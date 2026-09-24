import { useState, useEffect } from 'react';
import { vitalApi } from '../services/dhrApis';

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  timing: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'As Needed';
  instructions: string;
  takenToday: boolean;
  takenAt?: string;
  stockLeft: number;
  totalStock: number;
  pillColor: string;
  shape: 'round' | 'capsule' | 'oval' | 'syrup' | 'inhaler';
  prescribedBy: string;
}

export interface VitalRecord {
  id: string;
  date: string;
  time: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  bloodSugar?: number;
  sugarType?: 'Fasting' | 'Post-Meal' | 'Random';
  spo2?: number;
  temperature?: number;
  weight?: number;
  notes?: string;
  status: 'normal' | 'elevated' | 'critical';
}

export type CareTaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';

export interface CareTask {
  id: string;
  wardId: string;
  title: string;
  category: 'Medication' | 'Vitals' | 'Nutrition' | 'Mobility' | 'Hygiene' | 'Doctor' | 'Hydration' | 'Personal Care' | 'Wellness';
  dueDate?: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  status?: CareTaskStatus;
  completedAt?: string;
  assignedTo: string;
  notes?: string;
  instructions?: string;
}

export interface WardAppointment {
  id: string;
  wardId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  mode: 'In-Clinic' | 'Video Consultation' | 'Home Visit';
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes?: string;
  meetLink?: string;
}

export interface EmergencyAlert {
  id: string;
  wardId: string;
  wardName: string;
  timestamp: number;
  type: 'Fall Detected' | 'SOS Panic Button' | 'Abnormal Vitals' | 'Geofence Breach' | 'Manual Alert';
  location: string;
  status: 'Active' | 'Dispatched' | 'Resolved';
  responder?: string;
}

export interface WardDependent {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  abhaId: string;
  bloodGroup: string;
  primaryCondition: string;
  allergies: string[];
  photoUrl?: string;
  emergencyContact: string;
  primaryDoctor: {
    name: string;
    specialty: string;
    phone: string;
    hospital: string;
  };
  geofenceStatus: 'Inside Safe Zone' | 'Near Boundary' | 'Outside Safe Zone';
  currentLocation: string;
  lastLocationUpdate: string;
  overallStatus: 'Stable' | 'Needs Attention' | 'Alert' | 'Recovering';
  accessLevel: 'Full Legal Guardian' | 'Medical Proxy' | 'Emergency Viewer';
  vitals: VitalRecord[];
  medications: MedicationItem[];
  appointments: WardAppointment[];
  notes: Array<{ id: string; date: string; time: string; author: string; text: string; tag: string }>;
}

export type CaregiverNotificationType = 
  | 'Appointment Reminder'
  | 'Appointment Status'
  | 'Nurse Booking'
  | 'Care Task'
  | 'Vital Alert'
  | 'ABHA Update'
  | 'General Caregiver Alert';

export interface CaregiverNotification {
  id: string;
  dependentId: string;
  wardName?: string;
  title: string;
  message: string;
  type: CaregiverNotificationType;
  timestamp: string;
  read: boolean;
  relatedEntityId?: string;
  relatedRoute: 'appointments' | 'home-care' | 'routines' | 'vitals' | 'records' | 'medications' | 'dashboard';
  actionRoute?: string;
}

const STORAGE_KEY_WARDS = 'medicare_caregiver_wards_v2';
const STORAGE_KEY_TASKS = 'medicare_caregiver_tasks_v2';
const STORAGE_KEY_ALERTS = 'medicare_caregiver_alerts_v2';
const STORAGE_KEY_NOTIFS = 'medicare_caregiver_notifs_v2';
const STORAGE_KEY_ACTIVE_WARD = 'medicare_caregiver_active_ward_v2';

const INITIAL_WARDS: WardDependent[] = [
  {
    id: 'ward-1',
    name: 'Ragul Kumar',
    relationship: 'Father',
    age: 68,
    gender: 'Male',
    abhaId: '91-8472-9104-5821@abdm',
    bloodGroup: 'O+',
    primaryCondition: 'Hypertension & Type 2 Diabetes',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    emergencyContact: '+91 98765 11223',
    primaryDoctor: {
      name: 'Dr. Rajesh Varma',
      specialty: 'Cardiologist',
      phone: '+91 98450 12345',
      hospital: 'Apollo Central Health City, Chennai'
    },
    geofenceStatus: 'Inside Safe Zone',
    currentLocation: 'Home - Master Bedroom (WiFi: HomeMesh_5G)',
    lastLocationUpdate: 'Just now',
    overallStatus: 'Stable',
    accessLevel: 'Full Legal Guardian',
    vitals: [
      {
        id: 'v1',
        date: 'Today',
        time: '08:00 AM',
        systolic: 128,
        diastolic: 82,
        heartRate: 72,
        bloodSugar: 118,
        sugarType: 'Fasting',
        spo2: 98,
        temperature: 98.4,
        weight: 71.5,
        status: 'normal',
        notes: 'Morning vitals recorded after breakfast. Good baseline.'
      },
      {
        id: 'v2',
        date: 'Yesterday',
        time: '07:30 PM',
        systolic: 136,
        diastolic: 88,
        heartRate: 76,
        bloodSugar: 142,
        sugarType: 'Post-Meal',
        spo2: 97,
        temperature: 98.6,
        status: 'elevated',
        notes: 'Mild elevation post-dinner walk.'
      }
    ],
    medications: [
      {
        id: 'med-1',
        name: 'Telmisartan 40mg',
        dosage: '1 Tablet Daily',
        timing: 'Morning',
        instructions: 'Take with warm water before breakfast',
        takenToday: true,
        takenAt: '08:15 AM',
        stockLeft: 18,
        totalStock: 30,
        pillColor: 'bg-rose-500',
        shape: 'round',
        prescribedBy: 'Dr. Rajesh Varma'
      },
      {
        id: 'med-2',
        name: 'Metformin SR 500mg',
        dosage: '1 Tablet Twice Daily',
        timing: 'Morning',
        instructions: 'Take immediately after food to avoid gastric irritation',
        takenToday: true,
        takenAt: '08:30 AM',
        stockLeft: 8,
        totalStock: 30,
        pillColor: 'bg-cyan-500',
        shape: 'oval',
        prescribedBy: 'Dr. Rajesh Varma'
      },
      {
        id: 'med-3',
        name: 'Metformin SR 500mg',
        dosage: '1 Tablet (Evening dose)',
        timing: 'Night',
        instructions: 'Take post dinner',
        takenToday: false,
        stockLeft: 8,
        totalStock: 30,
        pillColor: 'bg-cyan-500',
        shape: 'oval',
        prescribedBy: 'Dr. Rajesh Varma'
      },
      {
        id: 'med-4',
        name: 'Atorvastatin 10mg',
        dosage: '1 Tablet at Bedtime',
        timing: 'Night',
        instructions: 'Take 30 mins before sleeping',
        takenToday: false,
        stockLeft: 4,
        totalStock: 30,
        pillColor: 'bg-amber-500',
        shape: 'capsule',
        prescribedBy: 'Dr. Rajesh Varma'
      }
    ],
    appointments: [
      {
        id: 'apt-1',
        wardId: 'ward-1',
        doctorName: 'Dr. Rajesh Varma',
        specialty: 'Cardiology Review',
        hospital: 'Apollo Central Health City',
        date: 'Tomorrow, 10:30 AM',
        time: '10:30 AM',
        mode: 'In-Clinic',
        status: 'Upcoming',
        notes: 'Follow-up for BP control and recent lipid profile review.'
      },
      {
        id: 'apt-2',
        wardId: 'ward-1',
        doctorName: 'Dr. Priya Sundaram',
        specialty: 'Endocrinology',
        hospital: 'Medicare Telehealth',
        date: 'Sept 5, 04:00 PM',
        time: '04:00 PM',
        mode: 'Video Consultation',
        status: 'Upcoming',
        meetLink: 'https://medicare.telehealth.live/room/ragul-varma'
      }
    ],
    notes: [
      {
        id: 'n1',
        date: 'Today',
        time: '08:35 AM',
        author: 'Anita (Caregiver)',
        text: 'Father reported mild stiffness in knee joints this morning. Assisted with light stretching. Vitals are stable.',
        tag: 'Daily Routine'
      },
      {
        id: 'n2',
        date: 'Aug 30',
        time: '02:15 PM',
        author: 'Dr. Rajesh Varma',
        text: 'BP is responding well to Telmisartan. Continue low-sodium diet and 20 min morning walk.',
        tag: 'Doctor Note'
      }
    ]
  },
  {
    id: 'ward-2',
    name: 'Meena Kumar',
    relationship: 'Mother',
    age: 64,
    gender: 'Female',
    abhaId: '91-6281-4490-1124@abdm',
    bloodGroup: 'B+',
    primaryCondition: 'Osteoarthritis & Hypothyroidism',
    allergies: ['NSAIDs (Ibuprofen)'],
    emergencyContact: '+91 98765 11223',
    primaryDoctor: {
      name: 'Dr. Ananya Sen',
      specialty: 'Orthopedic & Rheumatology',
      phone: '+91 98450 88776',
      hospital: 'Manipal Super Specialty, Bengaluru'
    },
    geofenceStatus: 'Inside Safe Zone',
    currentLocation: 'Home - Balcony Garden',
    lastLocationUpdate: '5 mins ago',
    overallStatus: 'Needs Attention',
    accessLevel: 'Full Legal Guardian',
    vitals: [
      {
        id: 'v3',
        date: 'Today',
        time: '07:45 AM',
        systolic: 122,
        diastolic: 78,
        heartRate: 78,
        bloodSugar: 98,
        sugarType: 'Fasting',
        spo2: 99,
        temperature: 98.6,
        weight: 64.0,
        status: 'normal',
        notes: 'Thyroid pill taken on empty stomach.'
      }
    ],
    medications: [
      {
        id: 'med-5',
        name: 'Thyronorm 50mcg',
        dosage: '1 Tablet Empty Stomach',
        timing: 'Morning',
        instructions: 'Take 45 mins before breakfast with plain water',
        takenToday: true,
        takenAt: '06:45 AM',
        stockLeft: 22,
        totalStock: 30,
        pillColor: 'bg-emerald-500',
        shape: 'round',
        prescribedBy: 'Dr. Ananya Sen'
      },
      {
        id: 'med-6',
        name: 'Calcium + Vit D3 500mg',
        dosage: '1 Tablet Post Lunch',
        timing: 'Afternoon',
        instructions: 'Take with milk or meal',
        takenToday: false,
        stockLeft: 14,
        totalStock: 30,
        pillColor: 'bg-violet-500',
        shape: 'oval',
        prescribedBy: 'Dr. Ananya Sen'
      },
      {
        id: 'med-7',
        name: 'Glucosamine & Chondroitin',
        dosage: '1 Capsule Evening',
        timing: 'Evening',
        instructions: 'Take after tea/snack for joint support',
        takenToday: false,
        stockLeft: 3,
        totalStock: 30,
        pillColor: 'bg-amber-500',
        shape: 'capsule',
        prescribedBy: 'Dr. Ananya Sen'
      }
    ],
    appointments: [
      {
        id: 'apt-3',
        wardId: 'ward-2',
        doctorName: 'Dr. Ananya Sen',
        specialty: 'Joint Mobility & Physio',
        hospital: 'Manipal Orthopedic Wing',
        date: 'Sept 4, 11:00 AM',
        time: '11:00 AM',
        mode: 'In-Clinic',
        status: 'Upcoming',
        notes: 'Knee joint mobility test & physiotherapy assessment.'
      }
    ],
    notes: [
      {
        id: 'n3',
        date: 'Today',
        time: '07:00 AM',
        author: 'Anita (Caregiver)',
        text: 'Morning walk completed with knee support brace. Pain scale: 2/10.',
        tag: 'Physical Therapy'
      }
    ]
  },
  {
    id: 'ward-3',
    name: 'Aarav Kumar',
    relationship: 'Son',
    age: 8,
    gender: 'Male',
    abhaId: '91-1029-3847-5501@abdm',
    bloodGroup: 'O+',
    primaryCondition: 'Mild Pediatric Asthma',
    allergies: ['Dust Mites', 'Peanuts'],
    emergencyContact: '+91 98765 43210',
    primaryDoctor: {
      name: 'Dr. Vikram Seth',
      specialty: 'Pediatric Pulmonology',
      phone: '+91 98450 99881',
      hospital: 'Rainbow Childrens Hospital'
    },
    geofenceStatus: 'Inside Safe Zone',
    currentLocation: 'Greenwood School - Campus (Safe Zone)',
    lastLocationUpdate: '10 mins ago',
    overallStatus: 'Stable',
    accessLevel: 'Full Legal Guardian',
    vitals: [
      {
        id: 'v4',
        date: 'Today',
        time: '07:15 AM',
        systolic: 104,
        diastolic: 66,
        heartRate: 88,
        spo2: 99,
        temperature: 98.4,
        weight: 27.5,
        status: 'normal',
        notes: 'Peak flow reading 220 L/min (Green zone).'
      }
    ],
    medications: [
      {
        id: 'med-8',
        name: 'Montelukast Chewable 4mg',
        dosage: '1 Tablet Daily',
        timing: 'Night',
        instructions: 'Chew before bedtime',
        takenToday: false,
        stockLeft: 20,
        totalStock: 30,
        pillColor: 'bg-pink-500',
        shape: 'round',
        prescribedBy: 'Dr. Vikram Seth'
      },
      {
        id: 'med-9',
        name: 'Levolin Inhaler 50mcg',
        dosage: '2 Puffs SOS',
        timing: 'As Needed',
        instructions: 'Use spacer if experiencing wheezing',
        takenToday: false,
        stockLeft: 60,
        totalStock: 100,
        pillColor: 'bg-sky-500',
        shape: 'inhaler',
        prescribedBy: 'Dr. Vikram Seth'
      }
    ],
    appointments: [],
    notes: [
      {
        id: 'n4',
        date: 'Yesterday',
        time: '06:00 PM',
        author: 'Anita (Caregiver)',
        text: 'Used spacer for peak flow practice. No coughing during football practice.',
        tag: 'Pediatric'
      }
    ]
  }
];

const INITIAL_TASKS: CareTask[] = [
  // Ward 1 - Ragul Kumar (Father / Arun Raj)
  {
    id: 't-1',
    wardId: 'ward-1',
    title: 'Assist Ragul with Morning BP & Metformin',
    category: 'Medication',
    dueDate: 'Today',
    time: '08:00 AM',
    priority: 'high',
    completed: true,
    status: 'Completed',
    completedAt: '08:30 AM',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Take Telmisartan and Metformin post-breakfast with warm water.'
  },
  {
    id: 't-2',
    wardId: 'ward-1',
    title: 'Morning Blood Pressure Check',
    category: 'Vitals',
    dueDate: 'Today',
    time: '09:30 AM',
    priority: 'high',
    completed: false,
    status: 'In Progress',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Measure sitting BP before noon meal. Record systolic/diastolic.'
  },
  {
    id: 't-3',
    wardId: 'ward-1',
    title: 'Breakfast & Dietary Check',
    category: 'Nutrition',
    dueDate: 'Today',
    time: '10:00 AM',
    priority: 'medium',
    completed: false,
    status: 'Pending',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Serve low-sodium oats breakfast and verify hydration.'
  },
  {
    id: 't-4',
    wardId: 'ward-1',
    title: 'Doctor Appointment Preparation for Cardiology Review',
    category: 'Doctor',
    dueDate: 'Today',
    time: '07:30 AM',
    priority: 'high',
    completed: false,
    status: 'Overdue',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Prepare latest lab reports and ECG history file for Dr. Rajesh Varma.'
  },
  {
    id: 't-5',
    wardId: 'ward-1',
    title: 'Record Evening Blood Sugar & Night Medication',
    category: 'Vitals',
    dueDate: 'Today',
    time: '08:30 PM',
    priority: 'high',
    completed: false,
    status: 'Pending',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Test post-dinner blood sugar and administer Atorvastatin.'
  },

  // Ward 2 - Meena Kumar (Mother / Meena Raj)
  {
    id: 't-6',
    wardId: 'ward-2',
    title: 'Ensure Meena takes Calcium post-lunch',
    category: 'Medication',
    dueDate: 'Today',
    time: '01:30 PM',
    priority: 'medium',
    completed: false,
    status: 'Pending',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Administer Calcium + Vit D3 after lunch with warm milk.'
  },
  {
    id: 't-7',
    wardId: 'ward-2',
    title: 'Hydration & Electrolyte Monitoring',
    category: 'Hydration',
    dueDate: 'Today',
    time: '11:00 AM',
    priority: 'low',
    completed: false,
    status: 'In Progress',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Ensure at least 500ml of water or fresh coconut water intake.'
  },
  {
    id: 't-8',
    wardId: 'ward-2',
    title: 'Assist Meena with 15-min Knee Mobility Exercises',
    category: 'Mobility',
    dueDate: 'Today',
    time: '05:30 PM',
    priority: 'high',
    completed: false,
    status: 'Pending',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Guide through gentle joint stretches wearing knee support brace.'
  },
  {
    id: 't-9',
    wardId: 'ward-2',
    title: 'Morning Thyronorm & Temperature Check',
    category: 'Vitals',
    dueDate: 'Today',
    time: '07:00 AM',
    priority: 'high',
    completed: false,
    status: 'Overdue',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Check morning body temp and confirm Thyronorm on empty stomach.'
  },

  // Ward 3 - Aarav Kumar (Son)
  {
    id: 't-10',
    wardId: 'ward-3',
    title: 'Morning Levolin Inhaler Check',
    category: 'Medication',
    dueDate: 'Today',
    time: '07:30 AM',
    priority: 'high',
    completed: true,
    status: 'Completed',
    completedAt: '07:45 AM',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: '2 puffs via spacer before school.'
  },
  {
    id: 't-11',
    wardId: 'ward-3',
    title: 'School Water Bottle & Hydration Check',
    category: 'Hydration',
    dueDate: 'Today',
    time: '08:15 AM',
    priority: 'low',
    completed: false,
    status: 'In Progress',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Pack warm water bottle for school.'
  },
  {
    id: 't-12',
    wardId: 'ward-3',
    title: 'Evening Peak Flow Measurement',
    category: 'Vitals',
    dueDate: 'Today',
    time: '06:00 PM',
    priority: 'medium',
    completed: false,
    status: 'Pending',
    assignedTo: 'Anita (Primary Caregiver)',
    instructions: 'Record peak flow score post school play.'
  }
];

const INITIAL_NOTIFICATIONS: CaregiverNotification[] = [
  // Ward 1 - Ragul Kumar (Father / Arun Raj)
  {
    id: 'notif-101',
    dependentId: 'ward-1',
    wardName: 'Ragul Kumar',
    title: 'Cardiology Follow-up Confirmed',
    message: 'In-clinic Cardiology appointment with Dr. Rajesh Varma confirmed for tomorrow at 10:30 AM.',
    type: 'Appointment Status',
    timestamp: '10 mins ago',
    read: false,
    relatedEntityId: 'apt-1',
    relatedRoute: 'appointments'
  },
  {
    id: 'notif-102',
    dependentId: 'ward-1',
    wardName: 'Ragul Kumar',
    title: 'Overdue Care Task Alert',
    message: 'Doctor appointment preparation for Ragul\'s cardiology review is overdue.',
    type: 'Care Task',
    timestamp: '25 mins ago',
    read: false,
    relatedEntityId: 't-4',
    relatedRoute: 'routines'
  },
  {
    id: 'notif-103',
    dependentId: 'ward-1',
    wardName: 'Ragul Kumar',
    title: 'Mild Elevation in Evening BP',
    message: 'Recorded BP: 136/88 mmHg. Mild elevation detected post-dinner walk.',
    type: 'Vital Alert',
    timestamp: '2 hours ago',
    read: true,
    relatedEntityId: 'v2',
    relatedRoute: 'vitals'
  },
  {
    id: 'notif-104',
    dependentId: 'ward-1',
    wardName: 'Ragul Kumar',
    title: 'New ABHA Health Record Linked',
    message: 'Apollo Central Health City uploaded latest Cardiology Follow-up summary to ABDM Health Locker.',
    type: 'ABHA Update',
    timestamp: 'Yesterday',
    read: true,
    relatedEntityId: 'rec-101',
    relatedRoute: 'records'
  },

  // Ward 2 - Meena Kumar (Mother / Meena Raj)
  {
    id: 'notif-201',
    dependentId: 'ward-2',
    wardName: 'Meena Kumar',
    title: 'Home Nurse Arrival Update',
    message: 'Sister Sarah (Verified Home Care Nurse) has arrived for Meena\'s knee mobility session.',
    type: 'Nurse Booking',
    timestamp: 'Just now',
    read: false,
    relatedEntityId: 'hb-201',
    relatedRoute: 'home-care'
  },
  {
    id: 'notif-202',
    dependentId: 'ward-2',
    wardName: 'Meena Kumar',
    title: 'Post-Lunch Medication Reminder',
    message: 'Upcoming task: Ensure Meena takes Calcium + Vit D3 after lunch.',
    type: 'Care Task',
    timestamp: '1 hour ago',
    read: false,
    relatedEntityId: 't-6',
    relatedRoute: 'routines'
  },
  {
    id: 'notif-203',
    dependentId: 'ward-2',
    wardName: 'Meena Kumar',
    title: 'Upcoming Orthopedic Consultation',
    message: 'Joint mobility & physiotherapy test with Dr. Ananya Sen scheduled for Sept 4 at 11:00 AM.',
    type: 'Appointment Reminder',
    timestamp: '3 hours ago',
    read: true,
    relatedEntityId: 'apt-3',
    relatedRoute: 'appointments'
  },

  // Ward 3 - Aarav Kumar (Son)
  {
    id: 'notif-301',
    dependentId: 'ward-3',
    wardName: 'Aarav Kumar',
    title: 'Morning Asthma Dose Completed',
    message: 'Levolin Inhaler 50mcg (2 puffs) recorded successfully before school.',
    type: 'Care Task',
    timestamp: '2 hours ago',
    read: true,
    relatedEntityId: 't-10',
    relatedRoute: 'routines'
  },
  {
    id: 'notif-302',
    dependentId: 'ward-3',
    wardName: 'Aarav Kumar',
    title: 'Peak Flow Vitals Normal',
    message: 'Peak flow reading 220 L/min recorded (Green zone - optimal pediatric lung function).',
    type: 'Vital Alert',
    timestamp: '4 hours ago',
    read: true,
    relatedEntityId: 'v4',
    relatedRoute: 'vitals'
  }
];



import { caregiverApi } from '../services/dhrApis';

export const useCaregiverWorkflow = () => {
  const [wards, setWards] = useState<WardDependent[]>(INITIAL_WARDS);
  const [tasks, setTasks] = useState<CareTask[]>(INITIAL_TASKS);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [notifications, setNotifications] = useState<CaregiverNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeWardId, setActiveWardIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_WARD) || 'ward-1';
  });
  const [loading, setLoading] = useState(false);

  const loadBackendData = async () => {
    try {
      setLoading(true);
      const res = await caregiverApi.getWards();
      if (res && res.data && res.data.length > 0) {
        const mappedWards: WardDependent[] = res.data.map((p: any, idx: number) => {
          const rawVitals = Array.isArray(p.vitals) ? p.vitals : [];
          const mappedVitals: VitalRecord[] = rawVitals.map((v: any) => ({
            id: v.id,
            date: new Date(v.recordedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
            time: new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            systolic: v.systolicBp,
            diastolic: v.diastolicBp,
            heartRate: v.heartRate,
            bloodSugar: v.bloodSugar,
            sugarType: 'Post-Meal',
            spo2: v.oxygenSaturation,
            temperature: v.temperature,
            weight: v.weightKg,
            notes: v.notes,
            status: (v.systolicBp > 140 || v.bloodSugar > 180) ? 'elevated' : 'normal',
          }));

          const rawTasks = Array.isArray(p.caregiverTasks) ? p.caregiverTasks : [];
          const mappedTasks: CareTask[] = rawTasks.map((t: any) => ({
            id: t.id,
            wardId: `ward-${idx + 1}`,
            title: t.title,
            category: t.category as any,
            time: t.scheduledTime,
            priority: (t.priority?.toLowerCase() || 'medium') as any,
            completed: t.status === 'Completed',
            completedAt: t.completedAt ? new Date(t.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            assignedTo: 'Caregiver',
            notes: t.notes,
          }));

          if (mappedTasks.length > 0) {
            setTasks(mappedTasks);
          }

          return {
            id: p.id || `ward-${idx + 1}`,
            name: p.fullName || 'Patient',
            relationship: p.relationship || 'Dependent Ward',
            age: p.dateOfBirth ? Math.max(1, new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear()) : 65,
            gender: (p.gender as any) || 'Female',
            abhaId: p.user?.abhaId || p.abhaId || 'ABHA Registered Patient',
            bloodGroup: p.bloodGroup || 'O+',
            primaryCondition: p.primaryCondition || 'General Health Care',
            allergies: p.allergies ? (Array.isArray(p.allergies) ? p.allergies : [p.allergies]) : [],
            emergencyContact: p.emergencyContactPhone || p.user?.phoneNumber || 'N/A',
            primaryDoctor: {
              name: p.primaryDoctorName || 'Dr. Rajesh Varma',
              specialty: 'Attending Physician',
              phone: p.primaryDoctorPhone || '+91 98450 12345',
              hospital: p.hospital || 'Apollo Multispeciality Hospital'
            },
            geofenceStatus: 'Inside Safe Zone',
            currentLocation: 'Monitored Residence',
            lastLocationUpdate: 'Just now',
            overallStatus: 'Stable',
            accessLevel: 'Medical Proxy',
            vitals: mappedVitals,
            medications: (p.medications || []).map((m: any) => ({
              id: m.id,
              name: m.name,
              dosage: m.dosage,
              timing: 'Morning',
              instructions: m.instructions || 'Take as prescribed',
              takenToday: m.takenToday ?? false,
              stockLeft: m.remainingDoses || 10,
              totalStock: m.totalDoses || 30,
              pillColor: 'bg-[#00a896]',
              shape: 'capsule',
              prescribedBy: m.prescribedBy || 'Attending Physician'
            })),
            appointments: (p.appointments || []).map((a: any) => ({
              id: a.id,
              wardId: p.id,
              doctorName: a.doctor?.fullName || 'Attending Physician',
              specialty: a.type || 'Consultation',
              hospital: a.doctor?.hospital || 'MediCare Health',
              date: new Date(a.appointmentDate).toLocaleDateString(),
              time: a.slotTime || '10:00 AM',
              mode: a.type === 'ONLINE' ? 'Video Consultation' : 'In-Clinic',
              status: a.status === 'CONFIRMED' ? 'Upcoming' : a.status
            })),
            notes: []
          };
        });
        setWards(mappedWards);
        const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_WARD);
        const exists = mappedWards.some(w => w.id === savedId);
        if (exists && savedId) {
          setActiveWardIdState(savedId);
        } else if (mappedWards.length > 0) {
          setActiveWardIdState(mappedWards[0].id);
          localStorage.setItem(STORAGE_KEY_ACTIVE_WARD, mappedWards[0].id);
        }
      }
    } catch (err: any) {
      console.error('Failed to load caregiver data from database:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackendData();
    const handleSync = () => {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_WARD);
      if (saved) {
        setActiveWardIdState(saved);
      }
    };
    window.addEventListener('medicare_caregiver_sync', handleSync);
    window.addEventListener('medicare_active_ward_change', handleSync);
    return () => {
      window.removeEventListener('medicare_caregiver_sync', handleSync);
      window.removeEventListener('medicare_active_ward_change', handleSync);
    };
  }, []);

  const setActiveWardId = (id: string) => {
    localStorage.setItem(STORAGE_KEY_ACTIVE_WARD, id);
    setActiveWardIdState(id);
    window.dispatchEvent(new CustomEvent('medicare_active_ward_change', { detail: id }));
    window.dispatchEvent(new Event('medicare_caregiver_sync'));
  };

  const activeWard = wards.find(w => w.id === activeWardId) || wards[0] || null;

  const sync = (newWards = wards, newTasks = tasks, newAlerts = alerts) => {
    setWards(newWards);
    setTasks(newTasks);
    setAlerts(newAlerts);
    window.dispatchEvent(new Event('medicare_caregiver_sync'));
  };

  // 1. Toggle medication taken
  const toggleMedicationTaken = (wardId: string, medId: string) => {
    const updated = wards.map(w => {
      if (w.id !== wardId) return w;
      return {
        ...w,
        medications: w.medications.map(m => {
          if (m.id !== medId) return m;
          const nextTaken = !m.takenToday;
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return {
            ...m,
            takenToday: nextTaken,
            takenAt: nextTaken ? nowStr : undefined,
            stockLeft: nextTaken ? Math.max(0, m.stockLeft - 1) : m.stockLeft + 1
          };
        })
      };
    });
    setWards(updated);
    sync(updated, tasks, alerts);
  };

  // 2. Add vital reading
  const addVitalReading = (wardId: string, reading: Omit<VitalRecord, 'id' | 'date' | 'time' | 'status'> & { status?: 'normal' | 'elevated' | 'critical' }) => {
    const now = new Date();
    const dateStr = 'Today';
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let status: 'normal' | 'elevated' | 'critical' = 'normal';
    if ((reading.systolic && reading.systolic >= 140) || (reading.diastolic && reading.diastolic >= 90) || (reading.bloodSugar && reading.bloodSugar >= 180)) {
      status = 'elevated';
    }
    if ((reading.systolic && reading.systolic >= 160) || (reading.spo2 && reading.spo2 < 92)) {
      status = 'critical';
    }

    const newVital: VitalRecord = {
      ...reading,
      id: `v-${Date.now()}`,
      date: dateStr,
      time: timeStr,
      status
    };

    // Sync to MySQL Database
    vitalApi.createVital({
      systolicBp: reading.systolic,
      diastolicBp: reading.diastolic,
      heartRate: reading.heartRate,
      oxygenSaturation: reading.spo2,
      temperature: reading.temperature,
      bloodSugar: reading.bloodSugar,
      weightKg: reading.weight,
      notes: reading.notes || `Caregiver recorded vitals for ward ${wardId}`,
    }).catch(() => {});

    const updated = wards.map(w => {
      if (w.id !== wardId) return w;
      return {
        ...w,
        vitals: [newVital, ...w.vitals]
      };
    });

    setWards(updated);
    sync(updated, tasks, alerts);
  };

  // 3. Request Pharmacy Refill
  const requestMedicationRefill = (wardId: string, medId: string) => {
    const ward = wards.find(w => w.id === wardId);
    const med = ward?.medications.find(m => m.id === medId);
    if (!ward || !med) return;

    const updated = wards.map(w => {
      if (w.id !== wardId) return w;
      return {
        ...w,
        medications: w.medications.map(m => {
          if (m.id !== medId) return m;
          return { ...m, stockLeft: m.stockLeft + m.totalStock };
        })
      };
    });

    setWards(updated);
    sync(updated, tasks, alerts);
  };

  // 4. Update Task Status & Toggle
  const updateTaskStatus = (taskId: string, status: CareTaskStatus) => {
    const updatedTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      const isCompleted = status === 'Completed';
      return {
        ...t,
        status,
        completed: isCompleted,
        completedAt: isCompleted ? (t.completedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) : undefined
      };
    });
    setTasks(updatedTasks);
    sync(wards, updatedTasks, alerts);
  };

  const startTask = (taskId: string) => {
    updateTaskStatus(taskId, 'In Progress');
  };

  const reopenTask = (taskId: string) => {
    updateTaskStatus(taskId, 'Pending');
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      const nextDone = !t.completed;
      const nextStatus: CareTaskStatus = nextDone ? 'Completed' : 'Pending';
      return {
        ...t,
        completed: nextDone,
        status: nextStatus,
        completedAt: nextDone ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
      };
    });
    setTasks(updatedTasks);
    sync(wards, updatedTasks, alerts);
  };

  // 5. Add Care Task
  const addTask = (task: Omit<CareTask, 'id' | 'completed'>) => {
    const newTask: CareTask = {
      ...task,
      id: `t-${Date.now()}`,
      completed: false
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    sync(wards, updatedTasks, alerts);
  };

  // 6. Trigger SOS Emergency
  const triggerSOS = (wardId: string, type: EmergencyAlert['type'] = 'SOS Panic Button') => {
    const ward = wards.find(w => w.id === wardId) || wards[0];
    const newAlert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      wardId: ward.id,
      wardName: ward.name,
      timestamp: Date.now(),
      type,
      location: ward.currentLocation,
      status: 'Active',
      responder: 'Apollo 108 Emergency Ambulance #4'
    };

    const newAlerts = [newAlert, ...alerts];

    setAlerts(newAlerts);
    sync(wards, tasks, newAlerts);
    return newAlert;
  };

  // 7. Resolve SOS Alert
  const resolveSOS = (alertId: string) => {
    const updatedAlerts = alerts.map(a => a.id === alertId ? { ...a, status: 'Resolved' as const } : a);
    setAlerts(updatedAlerts);
    sync(wards, tasks, updatedAlerts);
  };

  // 8. Add Note to Ward
  const addNote = (wardId: string, text: string, tag: string = 'Caregiver Note') => {
    const now = new Date();
    const newNote = {
      id: `n-${Date.now()}`,
      date: 'Today',
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: 'Anita Sharma (Caregiver)',
      text,
      tag
    };

    const updated = wards.map(w => {
      if (w.id !== wardId) return w;
      return {
        ...w,
        notes: [newNote, ...w.notes]
      };
    });

    setWards(updated);
    sync(updated, tasks, alerts);
  };

  // 9. Schedule Appointment
  const addAppointment = (wardId: string, apt: Omit<WardAppointment, 'id' | 'status'>) => {
    const newApt: WardAppointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      status: 'Upcoming'
    };

    const updated = wards.map(w => {
      if (w.id !== wardId) return w;
      return {
        ...w,
        appointments: [newApt, ...w.appointments]
      };
    });

    setWards(updated);
    sync(updated, tasks, alerts);
  };



  // 11. Add New Dependent Ward
  const addWard = (wardData: Omit<WardDependent, 'id' | 'vitals' | 'medications' | 'appointments' | 'notes' | 'geofenceStatus' | 'currentLocation' | 'lastLocationUpdate' | 'overallStatus'>) => {
    const newWard: WardDependent = {
      ...wardData,
      id: `ward-${Date.now()}`,
      geofenceStatus: 'Inside Safe Zone',
      currentLocation: 'Home',
      lastLocationUpdate: 'Just now',
      overallStatus: 'Stable',
      vitals: [],
      medications: [],
      appointments: [],
      notes: [{
        id: `n-${Date.now()}`,
        date: 'Today',
        time: 'Just now',
        author: 'System',
        text: 'Dependent ward registered with digital proxy consent.',
        tag: 'Registration'
      }]
    };
    const updated = [...wards, newWard];
    setWards(updated);
    setActiveWardId(newWard.id);
    sync(updated, tasks, alerts);
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    window.dispatchEvent(new Event('notifications_updated'));
    window.dispatchEvent(new Event('medicare_caregiver_sync'));
  };

  const markAllNotificationsRead = (targetWardId?: string) => {
    const wardIdToClear = targetWardId || activeWardId;
    const updated = notifications.map(n => n.dependentId === wardIdToClear ? { ...n, read: true } : n);
    setNotifications(updated);
    window.dispatchEvent(new Event('notifications_updated'));
    window.dispatchEvent(new Event('medicare_caregiver_sync'));
  };

  const unreadNotificationsCount = notifications.filter(n => n.dependentId === activeWardId && !n.read).length;

  return {
    wards,
    activeWardId,
    setActiveWardId,
    activeWard,
    tasks,
    alerts,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    toggleTask,
    updateTaskStatus,
    startTask,
    reopenTask,
    toggleMedicationTaken,
    requestMedicationRefill,
    addVitalReading,
    triggerSOS,
    resolveSOS,
    addNote,
    addTask,
    addAppointment,
    addWard
  };
};

import { useState, useEffect } from 'react';

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

export interface CareTask {
  id: string;
  wardId: string;
  title: string;
  category: 'Medication' | 'Vitals' | 'Nutrition' | 'Mobility' | 'Hygiene' | 'Doctor';
  time: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  completedAt?: string;
  assignedTo: string;
  notes?: string;
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

export interface CaregiverNotification {
  id: string;
  wardId?: string;
  wardName?: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'vital' | 'med' | 'alert' | 'appointment' | 'refill';
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
  {
    id: 't-1',
    wardId: 'ward-1',
    title: 'Assist Ragul with Morning BP & Metformin',
    category: 'Medication',
    time: '08:00 AM',
    priority: 'high',
    completed: true,
    completedAt: '08:30 AM',
    assignedTo: 'Anita (Primary Caregiver)'
  },
  {
    id: 't-2',
    wardId: 'ward-2',
    title: 'Ensure Meena takes Calcium post-lunch',
    category: 'Medication',
    time: '01:30 PM',
    priority: 'medium',
    completed: false,
    assignedTo: 'Anita (Primary Caregiver)'
  },
  {
    id: 't-3',
    wardId: 'ward-1',
    title: 'Book Home Nurse for Ragul ECG check',
    category: 'Doctor',
    time: '03:00 PM',
    priority: 'medium',
    completed: false,
    assignedTo: 'Anita (Primary Caregiver)'
  },
  {
    id: 't-4',
    wardId: 'ward-2',
    title: 'Assist Meena with 15-min Knee Mobility Exercises',
    category: 'Mobility',
    time: '05:30 PM',
    priority: 'high',
    completed: false,
    assignedTo: 'Anita (Primary Caregiver)'
  },
  {
    id: 't-5',
    wardId: 'ward-1',
    title: 'Record Evening Blood Sugar & Night Medication',
    category: 'Vitals',
    time: '08:30 PM',
    priority: 'high',
    completed: false,
    assignedTo: 'Anita (Primary Caregiver)'
  }
];

const INITIAL_NOTIFS: CaregiverNotification[] = [
  {
    id: 'nt-1',
    wardId: 'ward-1',
    wardName: 'Ragul Kumar',
    title: 'Low Medication Stock Alert',
    message: 'Atorvastatin 10mg has only 4 tablets remaining (2 days left). Tap to 1-click reorder.',
    time: '20 mins ago',
    read: false,
    type: 'refill'
  },
  {
    id: 'nt-2',
    wardId: 'ward-1',
    wardName: 'Ragul Kumar',
    title: 'Upcoming Appointment Tomorrow',
    message: 'Cardiology follow-up with Dr. Rajesh Varma at Apollo Hospital at 10:30 AM.',
    time: '1 hour ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'nt-3',
    wardId: 'ward-2',
    wardName: 'Meena Kumar',
    title: 'Morning Vitals Recorded',
    message: 'BP 122/78 mmHg is well within healthy bounds. Great job!',
    time: '3 hours ago',
    read: true,
    type: 'vital'
  }
];

export const useCaregiverWorkflow = () => {
  const [wards, setWards] = useState<WardDependent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WARDS);
    return saved ? JSON.parse(saved) : INITIAL_WARDS;
  });

  const [tasks, setTasks] = useState<CareTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<CaregiverNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFS;
  });

  const [activeWardId, setActiveWardIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_WARD) || 'ward-1';
  });

  const setActiveWardId = (id: string) => {
    setActiveWardIdState(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_WARD, id);
    window.dispatchEvent(new Event('medicare_caregiver_sync'));
  };

  const activeWard = wards.find(w => w.id === activeWardId) || wards[0] || INITIAL_WARDS[0];

  const sync = (newWards = wards, newTasks = tasks, newAlerts = alerts, newNotifs = notifications) => {
    localStorage.setItem(STORAGE_KEY_WARDS, JSON.stringify(newWards));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(newTasks));
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(newAlerts));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(newNotifs));
    localStorage.setItem(STORAGE_KEY_ACTIVE_WARD, activeWardId);
    window.dispatchEvent(new Event('medicare_caregiver_sync'));
  };

  useEffect(() => {
    const handleSync = () => {
      const savedWards = localStorage.getItem(STORAGE_KEY_WARDS);
      const savedTasks = localStorage.getItem(STORAGE_KEY_TASKS);
      const savedAlerts = localStorage.getItem(STORAGE_KEY_ALERTS);
      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFS);
      const savedActiveWard = localStorage.getItem(STORAGE_KEY_ACTIVE_WARD);

      if (savedWards) setWards(JSON.parse(savedWards));
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
      if (savedActiveWard) setActiveWardIdState(savedActiveWard);
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('medicare_caregiver_sync', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('medicare_caregiver_sync', handleSync);
    };
  }, []);

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
    sync(updated, tasks, alerts, notifications);
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

    const updated = wards.map(w => {
      if (w.id !== wardId) return w;
      return {
        ...w,
        vitals: [newVital, ...w.vitals]
      };
    });

    const notif: CaregiverNotification = {
      id: `nt-${Date.now()}`,
      wardId,
      wardName: wards.find(w => w.id === wardId)?.name || 'Ward',
      title: status === 'critical' ? '⚠️ Critical Vital Logged' : 'New Vital Reading Recorded',
      message: `${newVital.systolic ? `BP: ${newVital.systolic}/${newVital.diastolic} mmHg` : ''} ${newVital.bloodSugar ? `Sugar: ${newVital.bloodSugar} mg/dL` : ''} ${newVital.spo2 ? `SpO2: ${newVital.spo2}%` : ''}`,
      time: 'Just now',
      read: false,
      type: 'vital'
    };

    const newNotifs = [notif, ...notifications];
    setWards(updated);
    setNotifications(newNotifs);
    sync(updated, tasks, alerts, newNotifs);
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

    const notif: CaregiverNotification = {
      id: `nt-${Date.now()}`,
      wardId,
      wardName: ward.name,
      title: 'Pharmacy Refill Dispatched',
      message: `Prescription refill for ${med.name} sent to Apollo Central Pharmacy. Expected arrival: 45 mins.`,
      time: 'Just now',
      read: false,
      type: 'refill'
    };

    const newNotifs = [notif, ...notifications];
    setWards(updated);
    setNotifications(newNotifs);
    sync(updated, tasks, alerts, newNotifs);
  };

  // 4. Toggle Task Complete
  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(t => {
      if (t.id !== taskId) return t;
      const nextDone = !t.completed;
      return {
        ...t,
        completed: nextDone,
        completedAt: nextDone ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
      };
    });
    setTasks(updatedTasks);
    sync(wards, updatedTasks, alerts, notifications);
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
    sync(wards, updatedTasks, alerts, notifications);
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

    const notif: CaregiverNotification = {
      id: `nt-${Date.now()}`,
      wardId: ward.id,
      wardName: ward.name,
      title: `🚨 EMERGENCY ALERT: ${type}`,
      message: `Emergency triggered for ${ward.name} at ${ward.currentLocation}. Ambulance & Care team notified.`,
      time: 'Just now',
      read: false,
      type: 'alert'
    };

    const newNotifs = [notif, ...notifications];
    setAlerts(newAlerts);
    setNotifications(newNotifs);
    sync(wards, tasks, newAlerts, newNotifs);
    return newAlert;
  };

  // 7. Resolve SOS Alert
  const resolveSOS = (alertId: string) => {
    const updatedAlerts = alerts.map(a => a.id === alertId ? { ...a, status: 'Resolved' as const } : a);
    setAlerts(updatedAlerts);
    sync(wards, tasks, updatedAlerts, notifications);
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
    sync(updated, tasks, alerts, notifications);
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

    const notif: CaregiverNotification = {
      id: `nt-${Date.now()}`,
      wardId,
      wardName: wards.find(w => w.id === wardId)?.name || 'Ward',
      title: 'Appointment Confirmed',
      message: `${apt.mode} booked with ${apt.doctorName} (${apt.specialty}) for ${apt.date} at ${apt.time}.`,
      time: 'Just now',
      read: false,
      type: 'appointment'
    };

    const newNotifs = [notif, ...notifications];
    setWards(updated);
    setNotifications(newNotifs);
    sync(updated, tasks, alerts, newNotifs);
  };

  // 10. Mark Notif Read
  const markNotifRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    sync(wards, tasks, alerts, updated);
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
    sync(updated, tasks, alerts, notifications);
  };

  return {
    wards,
    activeWardId,
    setActiveWardId,
    activeWard,
    tasks,
    alerts,
    notifications,
    toggleMedicationTaken,
    addVitalReading,
    requestMedicationRefill,
    toggleTask,
    addTask,
    triggerSOS,
    resolveSOS,
    addNote,
    addAppointment,
    markNotifRead,
    addWard
  };
};

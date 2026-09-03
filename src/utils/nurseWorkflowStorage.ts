import { useState, useEffect } from 'react';

export type BookingStatus = 
  | 'Pending' // Initial request
  | 'Accepted' // Nurse accepts
  | 'Scheduled' // Time confirmed
  | 'On the Way' // Nurse travels
  | 'Arrived' // Nurse at location
  | 'Care in Progress' // Visit active
  | 'Completed' // Visit done
  | 'Rejected'; // Nurse rejected

export interface CareRequest {
  id: string;
  patientName: string;
  patientAge: string;
  patientPhone?: string;
  serviceType: string;
  prefDate: string;
  time: string;
  location: string;
  distanceKm?: string;
  instructions: string;
  status: BookingStatus;
  createdAt: number;
  nurseId?: string;
  nurseName?: string;
  otpPin?: string;
  declineReason?: string;
  etaMinutes?: number;
  vitals?: {
    bp: string;
    hr: string;
    temp: string;
    spo2: string;
    bs: string;
  };
  notes?: string;
  checklist?: {
    id: string;
    label: string;
    done: boolean;
  }[];
}

export interface NurseNotification {
  id: string;
  message: string;
  time: number;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const STORAGE_KEY_BOOKINGS = 'medicare_nurse_bookings_v2';
const STORAGE_KEY_NOTIFICATIONS = 'medicare_nurse_notifications_v2';

const INITIAL_BOOKINGS: CareRequest[] = [
  {
    id: 'NR-2026-8491',
    patientName: 'Ragul Kumar',
    patientAge: '34 Years',
    patientPhone: '+91 98765 43210',
    serviceType: 'Post-Op Wound Dressing & IV Cannula',
    prefDate: 'Today',
    time: '10:00 AM',
    location: 'Anna Nagar, Chennai (Flat 4B, Green Towers)',
    distanceKm: '2.4 km',
    instructions: 'Post-discharge suture dressing & antibiotic IV infusion as prescribed by Dr. Sarah Jenkins. Clean wound margins and check incision drain.',
    status: 'Accepted',
    createdAt: Date.now() - 3600000,
    nurseId: 'RN-7701',
    nurseName: 'Nurse Sarah, Senior RN',
    otpPin: '5928',
    etaMinutes: 12,
    vitals: {
      bp: '120/80 mmHg',
      hr: '74 bpm',
      temp: '98.6 °F',
      spo2: '99%',
      bs: '105 mg/dL'
    },
    checklist: [
      { id: 'c1', label: 'Sterile surgical field & PPE setup', done: true },
      { id: 'c2', label: 'Incision site inspection & redness check', done: true },
      { id: 'c3', label: 'Antiseptic swab & sterile dressing change', done: false },
      { id: 'c4', label: 'IV Cannula patency check & flush', done: false },
      { id: 'c5', label: 'Record post-procedure telemetry vitals', done: false }
    ],
    notes: 'Patient is comfortable. Suture incision is healing well with minimal exudate.'
  },
  {
    id: 'NR-2026-8492',
    patientName: 'Mrs. Meenakshi Sundaram',
    patientAge: '68 Years',
    patientPhone: '+91 94441 82910',
    serviceType: 'Elderly ICU Vitals & Catheter Care',
    prefDate: 'Today',
    time: '02:00 PM',
    location: 'T. Nagar, Chennai (12/4 Habibullah Road)',
    distanceKm: '3.8 km',
    instructions: 'Elderly patient requiring Foley catheter bag replacement, continuous SpO2 monitoring, and blood glucose check before afternoon meal.',
    status: 'Pending',
    createdAt: Date.now() - 1800000,
    otpPin: '4192'
  },
  {
    id: 'NR-2026-8493',
    patientName: 'Abinesh Kumar',
    patientAge: '29 Years',
    patientPhone: '+91 98402 11928',
    serviceType: 'IV Infusion & Antibiotic Drip Setup',
    prefDate: 'Today',
    time: '04:30 PM',
    location: 'Velachery, Chennai (Plot 89, 100ft Bypass Road)',
    distanceKm: '5.1 km',
    instructions: 'Administer Ceftriaxone 1g in 100ml NS over 30 minutes as advised for chest infection recovery.',
    status: 'Pending',
    createdAt: Date.now() - 900000,
    otpPin: '8834'
  },
  {
    id: 'NR-2026-8488',
    patientName: 'Suresh Menon',
    patientAge: '52 Years',
    patientPhone: '+91 97909 33211',
    serviceType: 'Post-Cardiology Suture Removal',
    prefDate: 'Yesterday',
    time: '11:30 AM',
    location: 'Adyar, Chennai (3rd Cross Street)',
    distanceKm: '4.2 km',
    instructions: 'Post-stent surgical access dressing completed.',
    status: 'Completed',
    createdAt: Date.now() - 86400000,
    nurseName: 'Nurse Sarah, Senior RN',
    notes: 'Completed successfully without any bleeding. Patient advised on normal mobility.'
  }
];

const INITIAL_NOTIFICATIONS: NurseNotification[] = [
  {
    id: 'notif-1',
    message: 'New care request from Mrs. Meenakshi Sundaram for Elderly ICU Vitals.',
    time: Date.now() - 1800000,
    read: false,
    type: 'info'
  },
  {
    id: 'notif-2',
    message: 'Care request for Ragul Kumar confirmed and assigned to your shift.',
    time: Date.now() - 3600000,
    read: true,
    type: 'success'
  }
];

// Helper to get from local storage
const getBookings = (): CareRequest[] => {
  const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    return INITIAL_BOOKINGS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
};

const getNotifications = (): NurseNotification[] => {
  const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const useNurseWorkflow = () => {
  const [bookings, setBookings] = useState<CareRequest[]>(() => getBookings());
  const [notifications, setNotifications] = useState<NurseNotification[]>(() => getNotifications());

  // Load initial data and set up storage event listener
  useEffect(() => {
    setBookings(getBookings());
    setNotifications(getNotifications());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BOOKINGS) {
        setBookings(getBookings());
      }
      if (e.key === STORAGE_KEY_NOTIFICATIONS) {
        setNotifications(getNotifications());
      }
    };

    const handleCustomEvent = () => {
      setBookings(getBookings());
      setNotifications(getNotifications());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('medicare_sync_nurse', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('medicare_sync_nurse', handleCustomEvent);
    };
  }, []);

  const triggerSync = () => {
    window.dispatchEvent(new Event('medicare_sync_nurse'));
  };

  const createBooking = (request: Omit<CareRequest, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: CareRequest = {
      ...request,
      id: `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: Date.now(),
      otpPin: Math.floor(1000 + Math.random() * 9000).toString(),
      checklist: [
        { id: 'c1', label: 'Sterile field preparation & PPE', done: false },
        { id: 'c2', label: 'Patient vitals baseline audit', done: false },
        { id: 'c3', label: 'Clinical procedure administration', done: false },
        { id: 'c4', label: 'Post-procedure telemetry sync', done: false }
      ]
    };
    const current = getBookings();
    const updated = [newBooking, ...current];
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    setBookings(updated);
    
    addNotification(`New care request from ${request.patientName} for ${request.serviceType}.`, 'info');
    triggerSync();
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, extra?: Partial<CareRequest>) => {
    const current = getBookings();
    const updated = current.map(b => {
      if (b.id === id) {
        return {
          ...b,
          status,
          ...(status === 'Accepted' ? { nurseName: 'Nurse Sarah, Senior RN', nurseId: 'RN-7701' } : {}),
          ...extra
        };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    setBookings(updated);
    triggerSync();
  };
  
  const updateBookingData = (id: string, updates: Partial<CareRequest>) => {
    const current = getBookings();
    const updated = current.map(b => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    setBookings(updated);
    triggerSync();
  };

  const toggleChecklistItem = (bookingId: string, itemId: string) => {
    const current = getBookings();
    const updated = current.map(b => {
      if (b.id === bookingId && b.checklist) {
        const updatedList = b.checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c);
        return { ...b, checklist: updatedList };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    setBookings(updated);
    triggerSync();
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newNotif: NurseNotification = {
      id: Date.now().toString(),
      message,
      time: Date.now(),
      read: false,
      type
    };
    const current = getNotifications();
    const updated = [newNotif, ...current];
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    setNotifications(updated);
    triggerSync();
  };

  const markNotificationRead = (id: string) => {
    const current = getNotifications();
    const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    setNotifications(updated);
    triggerSync();
  };

  const clearBookings = () => {
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    setBookings(INITIAL_BOOKINGS);
    triggerSync();
  };

  return {
    bookings,
    notifications,
    createBooking,
    updateBookingStatus,
    updateBookingData,
    toggleChecklistItem,
    addNotification,
    markNotificationRead,
    clearBookings
  };
};

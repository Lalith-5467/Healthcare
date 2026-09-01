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
  serviceType: string;
  prefDate: string;
  time: string;
  location: string;
  instructions: string;
  status: BookingStatus;
  createdAt: number;
  nurseId?: string;
  nurseName?: string;
  vitals?: {
    bp: string;
    hr: string;
    temp: string;
    spo2: string;
    bs: string;
  };
  notes?: string;
}

export interface NurseNotification {
  id: string;
  message: string;
  time: number;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const STORAGE_KEY_BOOKINGS = 'medicare_nurse_bookings';
const STORAGE_KEY_NOTIFICATIONS = 'medicare_nurse_notifications';

// Helper to get from local storage
const getBookings = (): CareRequest[] => {
  const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
  return data ? JSON.parse(data) : [];
};

const getNotifications = (): NurseNotification[] => {
  const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
  return data ? JSON.parse(data) : [];
};

export const useNurseWorkflow = () => {
  const [bookings, setBookings] = useState<CareRequest[]>([]);
  const [notifications, setNotifications] = useState<NurseNotification[]>([]);

  // Load initial data and set up storage event listener
  useEffect(() => {
    // Initial load
    setBookings(getBookings());
    setNotifications(getNotifications());

    // Listen for changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_BOOKINGS) {
        setBookings(getBookings());
      }
      if (e.key === STORAGE_KEY_NOTIFICATIONS) {
        setNotifications(getNotifications());
      }
    };

    // Also listen for custom events within the same tab
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
      id: Date.now().toString(),
      status: 'Pending',
      createdAt: Date.now(),
    };
    const updated = [newBooking, ...getBookings()];
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    
    // Also trigger notification for nurse
    addNotification(`New care request from ${request.patientName} for ${request.serviceType}.`, 'info');
    
    triggerSync();
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    const current = getBookings();
    const updated = current.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
    triggerSync();
  };
  
  const updateBookingData = (id: string, updates: Partial<CareRequest>) => {
    const current = getBookings();
    const updated = current.map(b => b.id === id ? { ...b, ...updates } : b);
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
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
    const updated = [newNotif, ...getNotifications()];
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    triggerSync();
  };

  const markNotificationRead = (id: string) => {
    const current = getNotifications();
    const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    triggerSync();
  };

  const clearBookings = () => {
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    triggerSync();
  };

  return {
    bookings,
    notifications,
    createBooking,
    updateBookingStatus,
    updateBookingData,
    addNotification,
    markNotificationRead,
    clearBookings
  };
};

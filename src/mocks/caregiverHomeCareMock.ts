export interface DemoHomeCareBooking {
  bookingId: string;
  dependentId: string;
  dependentName: string;
  careProfessionalName: string;
  role: 'Nurse' | 'Caregiver' | 'Home Care Assistant';
  specialization: string;
  serviceType: string;
  bookingDate: string;
  bookingTime: string;
  duration: string;
  status: 'Requested' | 'Confirmed' | 'Assigned' | 'On The Way' | 'Arrived' | 'Visit Completed' | 'Cancelled';
  address: string;
  notes: string;
  rawTimestamp: number;
}

export const DEMO_HOME_CARE_BOOKINGS_BY_WARD: Record<string, DemoHomeCareBooking[]> = {
  // Ward 1 / Arun Raj (Ragul Kumar)
  'ward-1': [
    {
      bookingId: 'hc-demo-1-1',
      dependentId: 'ward-1',
      dependentName: 'Arun Raj',
      careProfessionalName: 'Nurse Sarah Jenkins',
      role: 'Nurse',
      specialization: 'Post-op Wound Dressing & BP Monitoring',
      serviceType: 'Daily Wound Care & Vital Telemetry Check',
      bookingDate: 'Today',
      bookingTime: '05:30 PM',
      duration: '1 Hour',
      status: 'On The Way',
      address: 'Flat 4B, Emerald Heights, T. Nagar, Chennai - 600017',
      notes: 'Sterile dressing kit provided by caregiver. Check fasting blood sugar before insulin administration.',
      rawTimestamp: Date.now() + 1800000
    },
    {
      bookingId: 'hc-demo-1-2',
      dependentId: 'ward-1',
      dependentName: 'Arun Raj',
      careProfessionalName: 'Priya Sharma',
      role: 'Home Care Assistant',
      specialization: 'Senior Mobility & Physiotherapy Support',
      serviceType: 'Evening Assisted Walking & Mobility Exercise',
      bookingDate: 'Tomorrow',
      bookingTime: '10:00 AM',
      duration: '2 Hours',
      status: 'Confirmed',
      address: 'Flat 4B, Emerald Heights, T. Nagar, Chennai - 600017',
      notes: 'Knee support brace required during stair walking practice. Keep walker nearby.',
      rawTimestamp: Date.now() + 86400000
    },
    {
      bookingId: 'hc-demo-1-3',
      dependentId: 'ward-1',
      dependentName: 'Arun Raj',
      careProfessionalName: 'Rajesh Kumar',
      role: 'Caregiver',
      specialization: 'Geriatric Hygiene & Medication Support',
      serviceType: 'Routine Personal Care & Bedside Care',
      bookingDate: '15 Sep 2026',
      bookingTime: '09:00 AM',
      duration: '4 Hours',
      status: 'Visit Completed',
      address: 'Flat 4B, Emerald Heights, T. Nagar, Chennai - 600017',
      notes: 'Patient was comfortable. All morning medication doses administered on time.',
      rawTimestamp: Date.now() - (3 * 86400000)
    }
  ],

  // Ward 2 / Priya Raj (Meena Kumar)
  'ward-2': [
    {
      bookingId: 'hc-demo-2-1',
      dependentId: 'ward-2',
      dependentName: 'Priya Raj',
      careProfessionalName: 'Nurse Anjali Nair',
      role: 'Nurse',
      specialization: 'Rheumatology & Joint Pain Care',
      serviceType: 'Hot Compress Therapy & Pain Management',
      bookingDate: '20 Sep 2026',
      bookingTime: '11:00 AM',
      duration: '1.5 Hours',
      status: 'Assigned',
      address: 'No. 12, Rose Garden, Indiranagar, Bengaluru - 560038',
      notes: 'Physio exercises as prescribed by Dr. Ananya Sen. Check knee swelling.',
      rawTimestamp: Date.now() + (2 * 86400000)
    },
    {
      bookingId: 'hc-demo-2-2',
      dependentId: 'ward-2',
      dependentName: 'Priya Raj',
      careProfessionalName: 'Sunita Rao',
      role: 'Home Care Assistant',
      specialization: 'Post-Discharge Rehabilitation',
      serviceType: 'Vital Check & Diet Assistance',
      bookingDate: '10 Aug 2026',
      bookingTime: '03:00 PM',
      duration: '2 Hours',
      status: 'Visit Completed',
      address: 'No. 12, Rose Garden, Indiranagar, Bengaluru - 560038',
      notes: 'Completed successfully without any discomfort.',
      rawTimestamp: Date.now() - (39 * 86400000)
    }
  ],

  // Ward 3 / Karthik Raj (Aarav Kumar)
  'ward-3': [
    {
      bookingId: 'hc-demo-3-1',
      dependentId: 'ward-3',
      dependentName: 'Karthik Raj',
      careProfessionalName: 'Nurse Vikram Singh',
      role: 'Nurse',
      specialization: 'Pediatric Respiratory Care',
      serviceType: 'Inhaler Technique & Nebulizer Support',
      bookingDate: '25 Sep 2026',
      bookingTime: '04:00 PM',
      duration: '1 Hour',
      status: 'Requested',
      address: 'House 88, Lake View Appts, Jubilee Hills, Hyderabad - 500033',
      notes: 'Peak flow meter monitoring before nebulization session.',
      rawTimestamp: Date.now() + (7 * 86400000)
    }
  ],

  // Ward 4 / Meena Raj
  'ward-4': [
    {
      bookingId: 'hc-demo-4-1',
      dependentId: 'ward-4',
      dependentName: 'Meena Raj',
      careProfessionalName: 'Nurse Sarah Jenkins',
      role: 'Nurse',
      specialization: 'Geriatric Memory Care & Medication Assist',
      serviceType: 'Cognitive Assistance & Pill Setup',
      bookingDate: '22 Sep 2026',
      bookingTime: '09:30 AM',
      duration: '3 Hours',
      status: 'Confirmed',
      address: 'Block C, Senior Paradise, Adyar, Chennai - 600020',
      notes: 'Caregiver companion requested during home visit session.',
      rawTimestamp: Date.now() + (4 * 86400000)
    }
  ]
};

// Helper function to add new home care booking from Patient Dashboard or Caregiver Portal
export const addHomeCareBooking = (booking: DemoHomeCareBooking) => {
  if (!DEMO_HOME_CARE_BOOKINGS_BY_WARD[booking.dependentId]) {
    DEMO_HOME_CARE_BOOKINGS_BY_WARD[booking.dependentId] = [];
  }
  
  // Prepend to active in-memory dictionary
  DEMO_HOME_CARE_BOOKINGS_BY_WARD[booking.dependentId].unshift(booking);

  // Add corresponding caregiver notification to localStorage
  try {
    const STORAGE_KEY_NOTIFS = 'medicare_caregiver_notifs_v2';
    const existingNotifs = JSON.parse(localStorage.getItem(STORAGE_KEY_NOTIFS) || '[]');
    const newNotif = {
      id: `notif-${Date.now()}`,
      dependentId: booking.dependentId,
      wardName: booking.dependentName,
      title: 'New Home Care Booking Requested',
      message: `Home care visit for ${booking.serviceType} booked for ${booking.bookingDate} at ${booking.bookingTime}.`,
      type: 'Nurse Booking',
      timestamp: 'Just now',
      read: false,
      relatedRoute: 'home-care'
    };
    const updatedNotifs = [newNotif, ...existingNotifs];
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updatedNotifs));
  } catch (e) {
    console.error('Failed to create caregiver notification:', e);
  }

  // Dispatch sync events to update Caregiver Overview & Caregiver Home Care View in real-time
  window.dispatchEvent(new Event('medicare_caregiver_sync'));
  window.dispatchEvent(new Event('notifications_updated'));
};


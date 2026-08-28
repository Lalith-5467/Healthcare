import { useState, useEffect } from 'react';

// Types for the massive mock patient database
export interface MedicationAdherence {
  id: string;
  medicine: string;
  dose: string;
  frequency: string;
  adherencePercent: number;
  status: 'Taken as scheduled' | 'Missed doses' | 'Paused';
  isAntibiotic?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface VitalTrend {
  date: string;
  bp: string;
  hr: string;
  temp: string;
  spo2: string;
}

export interface PatientTimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  actor: string;
  type: 'consultation' | 'prescription' | 'lab' | 'nurse' | 'vitals';
  details?: string;
}

export interface DoctorPatientRecord {
  id: string;
  patientId: string;
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  medications: MedicationAdherence[];
  vitalsHistory: VitalTrend[];
  timeline: PatientTimelineEvent[];
}

const STORAGE_KEY_DOCTOR = 'medicare_doctor_patients';

// Initial Mock Data representing Abinesh Kumar
const INITIAL_MOCK_DATA: DoctorPatientRecord[] = [
  {
    id: '1',
    patientId: 'MC-10245',
    name: 'Abinesh Kumar',
    age: '34 Years',
    gender: 'Male',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    medications: [
      {
        id: 'm1',
        medicine: 'Amoxicillin',
        dose: '500 mg',
        frequency: '3 times daily',
        adherencePercent: 80,
        status: 'Missed doses',
        isAntibiotic: true,
        startDate: 'Aug 28, 2026',
        endDate: 'Sep 4, 2026'
      },
      {
        id: 'm2',
        medicine: 'Paracetamol',
        dose: '500 mg',
        frequency: 'As prescribed',
        adherencePercent: 100,
        status: 'Taken as scheduled',
        isAntibiotic: false
      },
      {
        id: 'm3',
        medicine: 'Vitamin D',
        dose: 'Once daily',
        frequency: 'Once daily',
        adherencePercent: 70,
        status: 'Missed doses',
        isAntibiotic: false
      }
    ],
    vitalsHistory: [
      { date: 'Aug 1', bp: '120/80', hr: '72', temp: '98.6', spo2: '99' },
      { date: 'Aug 15', bp: '118/78', hr: '74', temp: '98.4', spo2: '98' },
      { date: 'Aug 20', bp: '122/82', hr: '76', temp: '99.1', spo2: '97' },
      { date: 'Aug 28', bp: '125/84', hr: '80', temp: '99.5', spo2: '96' }
    ],
    timeline: [
      { id: 't1', date: 'Aug 20, 2026', time: '10:00 AM', title: 'Previous Consultation', actor: 'Dr. Rajesh', type: 'consultation' },
      { id: 't2', date: 'Aug 25, 2026', time: '02:00 PM', title: 'Video Consultation', actor: 'Dr. Rajesh', type: 'consultation' },
      { id: 't3', date: 'Aug 27, 2026', time: '09:00 AM', title: 'Lab Report Uploaded', actor: 'Patient', type: 'lab', details: 'CBC & Vitamin D' },
      { id: 't4', date: 'Aug 28, 2026', time: '10:30 AM', title: 'Nurse Visit', actor: 'Nurse Sarah', type: 'nurse', details: 'Home Care Service' },
    ]
  }
];

const getDoctorRecords = (): DoctorPatientRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY_DOCTOR);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_DOCTOR, JSON.stringify(INITIAL_MOCK_DATA));
    return INITIAL_MOCK_DATA;
  }
  return JSON.parse(data);
};

export const useDoctorWorkflow = () => {
  const [records, setRecords] = useState<DoctorPatientRecord[]>([]);

  useEffect(() => {
    setRecords(getDoctorRecords());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_DOCTOR) {
        setRecords(getDoctorRecords());
      }
    };
    
    const handleCustomEvent = () => {
      setRecords(getDoctorRecords());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('medicare_sync_doctor', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('medicare_sync_doctor', handleCustomEvent);
    };
  }, []);

  const triggerSync = () => {
    window.dispatchEvent(new Event('medicare_sync_doctor'));
  };

  const addTimelineEvent = (patientId: string, event: Omit<PatientTimelineEvent, 'id'>) => {
    const current = getDoctorRecords();
    const newEvent: PatientTimelineEvent = { ...event, id: Date.now().toString() };
    
    const updated = current.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          timeline: [newEvent, ...p.timeline]
        };
      }
      return p;
    });
    
    localStorage.setItem(STORAGE_KEY_DOCTOR, JSON.stringify(updated));
    triggerSync();
  };

  const addPrescription = (patientId: string, med: Omit<MedicationAdherence, 'id' | 'adherencePercent' | 'status'>) => {
    const current = getDoctorRecords();
    const newMed: MedicationAdherence = { 
      ...med, 
      id: Date.now().toString(),
      adherencePercent: 0,
      status: 'Taken as scheduled'
    };
    
    const updated = current.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          medications: [newMed, ...p.medications]
        };
      }
      return p;
    });
    
    localStorage.setItem(STORAGE_KEY_DOCTOR, JSON.stringify(updated));
    
    addTimelineEvent(patientId, {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title: `Prescription Added: ${med.medicine}`,
      actor: 'Dr. Rajesh',
      type: 'prescription'
    });
    
    triggerSync();
  };

  return {
    records,
    addTimelineEvent,
    addPrescription
  };
};

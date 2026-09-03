import { useState, useEffect } from 'react';

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
  instructions?: string;
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

export interface LabReportItem {
  id: string;
  testName: string;
  date: string;
  value: string;
  normalRange: string;
  status: 'Normal' | 'Elevated' | 'Critical';
  labName: string;
}

export interface DoctorPatientRecord {
  id: string;
  patientId: string;
  name: string;
  age: string;
  gender: string;
  bloodGroup: string;
  phone?: string;
  appointmentTime?: string;
  chiefComplaint: string;
  allergies: string[];
  diagnosis: string[];
  medications: MedicationAdherence[];
  vitalsHistory: VitalTrend[];
  labReports: LabReportItem[];
  timeline: PatientTimelineEvent[];
  clinicalNotes?: string;
}

const STORAGE_KEY_DOCTOR = 'medicare_doctor_patients_v2';

const INITIAL_MOCK_DATA: DoctorPatientRecord[] = [
  {
    id: '1',
    patientId: 'MC-10245',
    name: 'Abinesh Kumar',
    age: '34 Years',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98765 43210',
    appointmentTime: 'Today • 10:30 AM',
    chiefComplaint: 'Post-Op Surgical Incision Follow-up & Mild Fever',
    allergies: ['Penicillin'],
    diagnosis: ['Post-Appendectomy Suture Recovery', 'Mild Upper Respiratory Infection'],
    medications: [
      {
        id: 'm1',
        medicine: 'Amoxicillin & Clavulanate',
        dose: '625 mg',
        frequency: 'Twice daily after food',
        adherencePercent: 85,
        status: 'Taken as scheduled',
        isAntibiotic: true,
        startDate: 'Aug 28, 2026',
        endDate: 'Sep 4, 2026',
        instructions: 'Complete full 7-day antibiotic course.'
      },
      {
        id: 'm2',
        medicine: 'Paracetamol',
        dose: '500 mg',
        frequency: 'As needed for fever/pain',
        adherencePercent: 100,
        status: 'Taken as scheduled',
        isAntibiotic: false,
        instructions: 'Max 3 tablets in 24 hours.'
      },
      {
        id: 'm3',
        medicine: 'Pantoprazole',
        dose: '40 mg',
        frequency: 'Once daily before breakfast',
        adherencePercent: 90,
        status: 'Taken as scheduled',
        isAntibiotic: false,
        instructions: 'Antacid support.'
      }
    ],
    vitalsHistory: [
      { date: 'Aug 15', bp: '118/78', hr: '74', temp: '98.4', spo2: '99' },
      { date: 'Aug 20', bp: '122/82', hr: '76', temp: '99.1', spo2: '98' },
      { date: 'Aug 28', bp: '125/84', hr: '80', temp: '99.5', spo2: '97' },
      { date: 'Today', bp: '120/80', hr: '74', temp: '98.6', spo2: '99' }
    ],
    labReports: [
      { id: 'l1', testName: 'Complete Blood Count (CBC)', date: 'Aug 28, 2026', value: 'WBC 9,200 /mcL', normalRange: '4,000 - 11,000 /mcL', status: 'Normal', labName: 'Apollo Diagnostics' },
      { id: 'l2', testName: 'C-Reactive Protein (CRP)', date: 'Aug 28, 2026', value: '4.2 mg/L', normalRange: '< 5.0 mg/L', status: 'Normal', labName: 'Apollo Diagnostics' },
      { id: 'l3', testName: 'Serum Creatinine', date: 'Aug 20, 2026', value: '0.9 mg/dL', normalRange: '0.7 - 1.3 mg/dL', status: 'Normal', labName: 'Apollo Diagnostics' },
      { id: 'l4', testName: 'Fasting Blood Sugar', date: 'Aug 20, 2026', value: '98 mg/dL', normalRange: '70 - 100 mg/dL', status: 'Normal', labName: 'City Diagnostic Labs' }
    ],
    timeline: [
      { id: 't1', date: 'Aug 20, 2026', time: '10:00 AM', title: 'Hospital Post-Op Review', actor: 'Dr. Rajesh Varma', type: 'consultation', details: 'Suture line evaluated. Healing normally.' },
      { id: 't2', date: 'Aug 25, 2026', time: '02:00 PM', title: 'Tele-Consultation Check', actor: 'Dr. Rajesh Varma', type: 'consultation', details: 'Vitals stable. Prescription refreshed.' },
      { id: 't3', date: 'Aug 28, 2026', time: '10:30 AM', title: 'In-Home Nurse Dressing', actor: 'Nurse Sarah, RN', type: 'nurse', details: 'Antiseptic swab & sterile dressing completed.' },
      { id: 't4', date: 'Today', time: '09:00 AM', title: 'Live Telemetry Sync', actor: 'ABDM Health Locker', type: 'vitals', details: 'BP 120/80 & SpO2 99% logged.' }
    ],
    clinicalNotes: 'Patient is recovering satisfactorily from surgical excision. Suture margins are dry. Antibiotic course is ongoing.'
  },
  {
    id: '2',
    patientId: 'MC-10246',
    name: 'Ragul Kumar',
    age: '34 Years',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 98402 77011',
    appointmentTime: 'Today • 11:45 AM',
    chiefComplaint: 'Routine Cardiology & ECG Telemetry Review',
    allergies: ['None Reported'],
    diagnosis: ['Mild Essential Hypertension', 'Hyperlipidemia'],
    medications: [
      {
        id: 'm4',
        medicine: 'Telmisartan',
        dose: '40 mg',
        frequency: 'Once daily morning',
        adherencePercent: 95,
        status: 'Taken as scheduled',
        instructions: 'Monitor morning blood pressure.'
      },
      {
        id: 'm5',
        medicine: 'Atorvastatin',
        dose: '10 mg',
        frequency: 'Once daily at bedtime',
        adherencePercent: 90,
        status: 'Taken as scheduled',
        instructions: 'Lipid control.'
      }
    ],
    vitalsHistory: [
      { date: 'Aug 10', bp: '135/88', hr: '78', temp: '98.6', spo2: '99' },
      { date: 'Aug 22', bp: '130/85', hr: '74', temp: '98.4', spo2: '98' },
      { date: 'Today', bp: '124/82', hr: '72', temp: '98.6', spo2: '99' }
    ],
    labReports: [
      { id: 'l5', testName: 'Lipid Profile (Total Cholesterol)', date: 'Aug 10, 2026', value: '185 mg/dL', normalRange: '< 200 mg/dL', status: 'Normal', labName: 'Apollo Diagnostics' },
      { id: 'l6', testName: 'HbA1c (Glycated Hemoglobin)', date: 'Aug 10, 2026', value: '5.6%', normalRange: '< 5.7%', status: 'Normal', labName: 'Apollo Diagnostics' }
    ],
    timeline: [
      { id: 't5', date: 'Aug 10, 2026', time: '11:00 AM', title: 'Cardiac Wellness Consultation', actor: 'Dr. Rajesh Varma', type: 'consultation', details: 'Prescribed Telmisartan 40mg.' }
    ],
    clinicalNotes: 'Blood pressure is well managed with lifestyle modifications and Telmisartan.'
  },
  {
    id: '3',
    patientId: 'MC-10247',
    name: 'Mrs. Meenakshi Sundaram',
    age: '68 Years',
    gender: 'Female',
    bloodGroup: 'B+',
    phone: '+91 94441 82910',
    appointmentTime: 'Today • 03:00 PM',
    chiefComplaint: 'Elderly Vitals Check & Glycemic Adherence',
    allergies: ['Sulfa Drugs'],
    diagnosis: ['Type 2 Diabetes Mellitus', 'Osteoarthritis'],
    medications: [
      {
        id: 'm6',
        medicine: 'Metformin SR',
        dose: '500 mg',
        frequency: 'Twice daily with meals',
        adherencePercent: 92,
        status: 'Taken as scheduled'
      }
    ],
    vitalsHistory: [
      { date: 'Aug 12', bp: '130/82', hr: '70', temp: '98.4', spo2: '98' },
      { date: 'Today', bp: '126/80', hr: '72', temp: '98.6', spo2: '99' }
    ],
    labReports: [
      { id: 'l7', testName: 'HbA1c', date: 'Aug 12, 2026', value: '6.8%', normalRange: '< 7.0% (Controlled)', status: 'Normal', labName: 'Apollo Diagnostics' }
    ],
    timeline: [
      { id: 't6', date: 'Aug 12, 2026', time: '03:30 PM', title: 'Endocrinology Consultation', actor: 'Dr. Rajesh Varma', type: 'consultation' }
    ],
    clinicalNotes: 'Glycemic control stable on Metformin 500mg SR.'
  }
];

const getDoctorRecords = (): DoctorPatientRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY_DOCTOR);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_DOCTOR, JSON.stringify(INITIAL_MOCK_DATA));
    return INITIAL_MOCK_DATA;
  }
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_DATA;
  } catch {
    return INITIAL_MOCK_DATA;
  }
};

export const useDoctorWorkflow = () => {
  const [records, setRecords] = useState<DoctorPatientRecord[]>(() => getDoctorRecords());

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
    setRecords(updated);
    triggerSync();
  };

  const addPrescription = (patientId: string, med: Omit<MedicationAdherence, 'id' | 'adherencePercent' | 'status'>) => {
    const current = getDoctorRecords();
    const newMed: MedicationAdherence = { 
      ...med, 
      id: Date.now().toString(),
      adherencePercent: 100,
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
    setRecords(updated);
    
    addTimelineEvent(patientId, {
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      title: `E-Prescription Generated: ${med.medicine} (${med.dose})`,
      actor: 'Dr. Rajesh Varma',
      type: 'prescription',
      details: med.frequency
    });
    
    triggerSync();
  };

  const saveClinicalNotes = (patientId: string, notes: string) => {
    const current = getDoctorRecords();
    const updated = current.map(p => p.id === patientId ? { ...p, clinicalNotes: notes } : p);
    localStorage.setItem(STORAGE_KEY_DOCTOR, JSON.stringify(updated));
    setRecords(updated);
    triggerSync();
  };

  return {
    records,
    addTimelineEvent,
    addPrescription,
    saveClinicalNotes
  };
};

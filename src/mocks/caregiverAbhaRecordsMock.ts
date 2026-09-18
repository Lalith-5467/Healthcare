export interface AbhaRecordItem {
  id: string;
  type: 'Consultation' | 'Prescription' | 'Lab Report' | 'Vaccination' | 'Diagnosis';
  category: 'Consultations' | 'Prescriptions' | 'Lab Reports' | 'Vaccinations';
  title: string;
  date: string;
  rawDate: number;
  provider: string;
  facility: string;
  status: 'Completed' | 'Available' | 'Active';
  summary: string;
  diagnosis?: string;
  medications?: Array<{
    medicineName: string;
    dosage: string;
    unit: string;
    frequency: string;
    instructions?: string;
  }>;
  labResults?: Array<{
    testName: string;
    result: string;
    unit: string;
    referenceRange: string;
    status: 'Normal' | 'Elevated' | 'Low';
  }>;
  notes?: string;
}

export interface AbhaDependentProfile {
  id: string;
  name: string;
  abhaId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  relationship: string;
  lastUpdated: string;
  recordStatus: 'Connected' | 'Authorized';
  allergies: string[];
  medicalHistory: string[];
  currentMedications: string[];
  records: AbhaRecordItem[];
}

export const MOCK_ABHA_DEPENDENTS: AbhaDependentProfile[] = [
  {
    id: 'dep-arun-raj',
    name: 'Arun Raj',
    abhaId: '91-8472-9104-5821@abdm',
    age: 58,
    gender: 'Male',
    bloodGroup: 'O+',
    relationship: 'Dependent',
    lastUpdated: 'Today, 10:45 AM',
    recordStatus: 'Connected',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    medicalHistory: ['Hypertension (2020)', 'Type 2 Diabetes Mellitus (2022)', 'Hyperlipidemia (2023)'],
    currentMedications: ['Telmisartan 40mg', 'Metformin SR 500mg', 'Atorvastatin 10mg'],
    records: [
      {
        id: 'rec-arun-1',
        type: 'Consultation',
        category: 'Consultations',
        title: 'Comprehensive Cardiology Review & BP Evaluation',
        date: '18 Aug 2026',
        rawDate: new Date('2026-08-18').getTime(),
        provider: 'Dr. Rajesh Varma',
        facility: 'Apollo Central Health City, Chennai',
        status: 'Completed',
        diagnosis: 'Essential Primary Hypertension & Stable Glycemic Control',
        summary: 'Routine 6-month cardiovascular checkup. BP controlled at 124/82 mmHg. Patient advised low-sodium diet and daily 30-min walking.',
        notes: 'ECG shows normal sinus rhythm. Continue current antihypertensive dosage of Telmisartan 40mg daily morning.',
        medications: [
          { medicineName: 'Telmisartan', dosage: '40', unit: 'mg', frequency: 'Once daily (Morning)', instructions: 'Take with warm water before breakfast' }
        ]
      },
      {
        id: 'rec-arun-2',
        type: 'Prescription',
        category: 'Prescriptions',
        title: 'Type 2 Diabetes & Lipid Management Prescription',
        date: '15 Aug 2026',
        rawDate: new Date('2026-08-15').getTime(),
        provider: 'Dr. Priya Sundaram',
        facility: 'Medicare Endocrine Speciality Clinic',
        status: 'Active',
        diagnosis: 'Type 2 Diabetes Mellitus (Well-Controlled)',
        summary: 'Prescription renewed following HbA1c lab result of 6.7%. Glucophage SR 500mg and Atorvastatin 10mg prescribed.',
        medications: [
          { medicineName: 'Metformin SR', dosage: '500', unit: 'mg', frequency: 'Twice daily', instructions: 'Take post meal with plain water' },
          { medicineName: 'Atorvastatin', dosage: '10', unit: 'mg', frequency: 'Once daily at bedtime', instructions: 'Take 30 mins before sleeping' }
        ]
      },
      {
        id: 'rec-arun-3',
        type: 'Lab Report',
        category: 'Lab Reports',
        title: 'Comprehensive Lipid & Fasting Glucose Panel',
        date: '12 Aug 2026',
        rawDate: new Date('2026-08-12').getTime(),
        provider: 'Dr. Ananya Sen',
        facility: 'Lal PathLabs Central Diagnostic Hub',
        status: 'Completed',
        summary: 'Blood chemistry and lipid profile panel completed. Fasting blood sugar 112 mg/dL, Total Cholesterol 185 mg/dL.',
        labResults: [
          { testName: 'Fasting Blood Sugar (FBS)', result: '112', unit: 'mg/dL', referenceRange: '70 - 110', status: 'Elevated' },
          { testName: 'HbA1c (Glycated Hemoglobin)', result: '6.7', unit: '%', referenceRange: '4.0 - 5.6', status: 'Elevated' },
          { testName: 'Total Cholesterol', result: '185', unit: 'mg/dL', referenceRange: '< 200', status: 'Normal' },
          { testName: 'Triglycerides', result: '142', unit: 'mg/dL', referenceRange: '< 150', status: 'Normal' },
          { testName: 'Serum Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.3', status: 'Normal' }
        ]
      },
      {
        id: 'rec-arun-4',
        type: 'Vaccination',
        category: 'Vaccinations',
        title: 'Annual Influenza Quadrivalent Vaccine Dose',
        date: '04 Jun 2026',
        rawDate: new Date('2026-06-04').getTime(),
        provider: 'Dr. Vikram Seth',
        facility: 'City Preventive Healthcare Center',
        status: 'Completed',
        summary: 'Seasonal influenza booster shot administered in left deltoid. No acute adverse reactions observed during 30-min monitoring window.',
        notes: 'Next booster recommended in June 2027.'
      }
    ]
  },
  {
    id: 'dep-priya-raj',
    name: 'Priya Raj',
    abhaId: '91-6281-4490-1124@abdm',
    age: 54,
    gender: 'Female',
    bloodGroup: 'B+',
    relationship: 'Spouse / Dependent',
    lastUpdated: 'Yesterday, 04:15 PM',
    recordStatus: 'Connected',
    allergies: ['NSAIDs (Ibuprofen)'],
    medicalHistory: ['Osteoarthritis Knee (2021)', 'Hypothyroidism (2019)'],
    currentMedications: ['Thyronorm 50mcg', 'Calcium + Vit D3 500mg'],
    records: [
      {
        id: 'rec-priya-1',
        type: 'Consultation',
        category: 'Consultations',
        title: 'Thyroid Function Evaluation & Physio Assessment',
        date: '10 Aug 2026',
        rawDate: new Date('2026-08-10').getTime(),
        provider: 'Dr. Ananya Sen',
        facility: 'Manipal Super Specialty Hospital, Bengaluru',
        status: 'Completed',
        diagnosis: 'Hypothyroidism & Bilateral Knee Osteoarthritis Stage II',
        summary: 'Patient reports improved mobility post knee brace usage. TSH level normalized at 2.4 mIU/L on Thyronorm 50mcg.',
        notes: 'Continue 15-min daily low-impact knee mobility exercises.'
      },
      {
        id: 'rec-priya-2',
        type: 'Prescription',
        category: 'Prescriptions',
        title: 'Thyroid Hormone Replacement & Bone Health Rx',
        date: '08 Aug 2026',
        rawDate: new Date('2026-08-08').getTime(),
        provider: 'Dr. Ananya Sen',
        facility: 'Manipal Super Specialty Hospital',
        status: 'Active',
        diagnosis: 'Hypothyroidism & Osteopenia',
        summary: 'Thyronorm 50mcg empty stomach morning dosage maintained along with Calcium + Vitamin D3 post lunch.',
        medications: [
          { medicineName: 'Thyronorm', dosage: '50', unit: 'mcg', frequency: 'Once daily (Empty Stomach)', instructions: 'Take 45 mins before breakfast with water' },
          { medicineName: 'Calcium + Vit D3', dosage: '500', unit: 'mg', frequency: 'Once daily post lunch', instructions: 'Take with milk or meal' }
        ]
      },
      {
        id: 'rec-priya-3',
        type: 'Lab Report',
        category: 'Lab Reports',
        title: 'Thyroid Profile (FT3, FT4, TSH) & Serum Calcium Test',
        date: '02 Aug 2026',
        rawDate: new Date('2026-08-02').getTime(),
        provider: 'Dr. Rajesh Varma',
        facility: 'Apollo Diagnostics Laboratory',
        status: 'Completed',
        summary: 'TSH level 2.4 mIU/L (Euthyroid state). Serum Calcium 9.6 mg/dL within optimal reference limits.',
        labResults: [
          { testName: 'TSH (Thyroid Stimulating Hormone)', result: '2.4', unit: 'mIU/L', referenceRange: '0.4 - 4.2', status: 'Normal' },
          { testName: 'Serum Calcium', result: '9.6', unit: 'mg/dL', referenceRange: '8.8 - 10.2', status: 'Normal' }
        ]
      }
    ]
  },
  {
    id: 'dep-karthik-raj',
    name: 'Karthik Raj',
    abhaId: '91-1029-3847-5501@abdm',
    age: 26,
    gender: 'Male',
    bloodGroup: 'A+',
    relationship: 'Son / Dependent',
    lastUpdated: '14 Aug 2026',
    recordStatus: 'Authorized',
    allergies: ['Dust Mites', 'Pollen'],
    medicalHistory: ['Mild Pediatric Asthma (2010)'],
    currentMedications: ['Levolin Inhaler 50mcg (SOS)'],
    records: [
      {
        id: 'rec-karthik-1',
        type: 'Consultation',
        category: 'Consultations',
        title: 'Annual Occupational Fitness & Respiratory Checkup',
        date: '01 Aug 2026',
        rawDate: new Date('2026-08-01').getTime(),
        provider: 'Dr. Vikram Seth',
        facility: 'Greenwood Wellness & Pulmonology Clinic',
        status: 'Completed',
        diagnosis: 'Mild Seasonal Allergic Rhinitis & Asymptomatic Asthma',
        summary: 'Spirometry test shows normal FEV1/FVC ratio (> 85%). Patient advised to keep Levolin inhaler for exertion SOS.',
        notes: 'No nocturnal wheezing or emergency flare-ups reported in past 12 months.'
      },
      {
        id: 'rec-karthik-2',
        type: 'Vaccination',
        category: 'Vaccinations',
        title: 'Hepatitis B Booster Dose',
        date: '15 May 2026',
        rawDate: new Date('2026-05-15').getTime(),
        provider: 'Dr. Anita Sharma',
        facility: 'Apollo Community Health Hub',
        status: 'Completed',
        summary: 'Hepatitis B recombinant vaccine booster administered successfully.'
      }
    ]
  },
  {
    id: 'dep-meena-raj',
    name: 'Meena Raj',
    abhaId: '91-7733-2211-9988@abdm',
    age: 82,
    gender: 'Female',
    bloodGroup: 'AB+',
    relationship: 'Mother / Dependent',
    lastUpdated: '12 Aug 2026',
    recordStatus: 'Connected',
    allergies: ['Ciprofloxacin'],
    medicalHistory: ['Hypertension', 'Mild Cognitive Impairment', 'Cataract Surgery Left Eye (2024)'],
    currentMedications: ['Amlodipine 5mg', 'Donepezil 5mg'],
    records: [
      {
        id: 'rec-meena-1',
        type: 'Consultation',
        category: 'Consultations',
        title: 'Geriatric Health Review & Cognitive Assessment',
        date: '12 Aug 2026',
        rawDate: new Date('2026-08-12').getTime(),
        provider: 'Dr. Priya Sundaram',
        facility: 'Apollo Senior Care & Geriatric Wing',
        status: 'Completed',
        diagnosis: 'Stable Mild Cognitive Memory Impairment',
        summary: 'MMSE score 26/30. Patient calm, memory exercises ongoing with family caregiver assistance.',
        notes: 'Amlodipine 5mg keeps blood pressure within target range (130/80 mmHg).'
      },
      {
        id: 'rec-meena-2',
        type: 'Prescription',
        category: 'Prescriptions',
        title: 'Geriatric Antihypertensive & Memory Support Rx',
        date: '10 Aug 2026',
        rawDate: new Date('2026-08-10').getTime(),
        provider: 'Dr. Priya Sundaram',
        facility: 'Apollo Senior Care Center',
        status: 'Active',
        diagnosis: 'Mild Cognitive Decline & Primary Hypertension',
        medications: [
          { medicineName: 'Amlodipine', dosage: '5', unit: 'mg', frequency: 'Once daily morning', instructions: 'Take with plain water' },
          { medicineName: 'Donepezil', dosage: '5', unit: 'mg', frequency: 'Once daily at bedtime', instructions: 'Take after dinner' }
        ]
      },
      {
        id: 'rec-meena-3',
        type: 'Lab Report',
        category: 'Lab Reports',
        title: 'Routine Senior Metabolic & Kidney Function Panel',
        date: '28 Jul 2026',
        rawDate: new Date('2026-07-28').getTime(),
        provider: 'Dr. Rajesh Varma',
        facility: 'Apollo Diagnostic Lab',
        status: 'Completed',
        summary: 'Serum Electrolytes (Sodium 138 mmol/L, Potassium 4.2 mmol/L) and eGFR 78 mL/min (Normal for age).',
        labResults: [
          { testName: 'Serum Sodium', result: '138', unit: 'mmol/L', referenceRange: '135 - 145', status: 'Normal' },
          { testName: 'Serum Potassium', result: '4.2', unit: 'mmol/L', referenceRange: '3.5 - 5.0', status: 'Normal' },
          { testName: 'eGFR', result: '78', unit: 'mL/min/1.73m2', referenceRange: '> 60', status: 'Normal' }
        ]
      },
      {
        id: 'rec-meena-4',
        type: 'Vaccination',
        category: 'Vaccinations',
        title: 'Pneumococcal Conjugate Vaccine (PCV13)',
        date: '10 Feb 2026',
        rawDate: new Date('2026-02-10').getTime(),
        provider: 'Dr. Vikram Seth',
        facility: 'Apollo Senior Care',
        status: 'Completed',
        summary: 'Single PCV13 dose administered for pneumonia prevention in senior patient.'
      }
    ]
  }
];

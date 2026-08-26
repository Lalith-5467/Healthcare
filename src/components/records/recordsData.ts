export interface MedicalRecordItem {
  id: string;
  title: string;
  type: 'Lab Report' | 'Prescription' | 'Consultation' | 'Imaging' | 'Discharge' | 'Vaccination' | 'Other';
  hospital: string;
  doctor: string;
  date: string;
  timestamp: number;
  status: 'Normal' | 'Attention' | 'Reviewed' | 'Pending';
  fileSize: string;
  fileName: string;
  isImportant?: boolean;
  notes?: string;
  metrics?: { name: string; value: string; status: 'Normal' | 'High' | 'Low' }[];
}

export const INITIAL_RECORDS: MedicalRecordItem[] = [
  {
    id: 'REC-2026-00842',
    title: 'CBC Blood Test Report',
    type: 'Lab Report',
    hospital: 'Apollo Hospital, Greams Road',
    doctor: 'Dr. Rajesh Kumar',
    date: '21 Aug 2026',
    timestamp: 1787300000000,
    status: 'Normal',
    fileSize: '2.4 MB',
    fileName: 'CBC_Report_Aug2026.pdf',
    isImportant: true,
    metrics: [
      { name: 'Hemoglobin', value: '14.2 g/dL', status: 'Normal' },
      { name: 'WBC Count', value: '7,200 /µL', status: 'Normal' },
      { name: 'Platelets', value: '245,000 /µL', status: 'Normal' },
      { name: 'RBC Count', value: '4.8 M/µL', status: 'Normal' }
    ]
  },
  {
    id: 'REC-2026-00839',
    title: 'Diabetes HbA1c Report',
    type: 'Lab Report',
    hospital: 'Apollo Hospital',
    doctor: 'Dr. Rajesh Kumar',
    date: '19 Aug 2026',
    timestamp: 1787120000000,
    status: 'Reviewed',
    fileSize: '1.8 MB',
    fileName: 'HbA1c_Report_Aug2026.pdf',
    isImportant: false,
    metrics: [
      { name: 'HbA1c', value: '6.2%', status: 'Normal' },
      { name: 'Fasting Blood Sugar', value: '108 mg/dL', status: 'Normal' },
      { name: 'Post Prandial Sugar', value: '142 mg/dL', status: 'Normal' }
    ]
  },
  {
    id: 'REC-2026-00835',
    title: 'Hypertension Medicine Prescription',
    type: 'Prescription',
    hospital: 'Fortis Healthcare',
    doctor: 'Dr. Anita Sharma',
    date: '20 Aug 2026',
    timestamp: 1787200000000,
    status: 'Normal',
    fileSize: '1.2 MB',
    fileName: 'Prescription_Aug2026.pdf',
    isImportant: true,
    notes: 'Prescribed Amoxicillin 500mg, Metformin 10mg twice daily.'
  },
  {
    id: 'REC-2026-00828',
    title: 'Cardiology Consultation Summary',
    type: 'Consultation',
    hospital: 'Apollo Hospital',
    doctor: 'Dr. Rajesh Kumar',
    date: '18 Aug 2026',
    timestamp: 1787034000000,
    status: 'Normal',
    fileSize: '3.1 MB',
    fileName: 'Consultation_Aug18.pdf',
    isImportant: false,
    notes: 'BP logged 120/80 mmHg. Exercise regimen recommended 40 min daily.'
  },
  {
    id: 'REC-2026-00814',
    title: 'Chest X-Ray Imaging Scan',
    type: 'Imaging',
    hospital: 'Fortis Healthcare',
    doctor: 'Dr. Vikram Sethi',
    date: '15 Aug 2026',
    timestamp: 1786775000000,
    status: 'Normal',
    fileSize: '14.5 MB',
    fileName: 'Chest_XRay_Aug2026.dcm',
    isImportant: true,
    notes: 'Clear lung fields. Normal cardiac size and silhouette.'
  },
  {
    id: 'REC-2026-00795',
    title: 'Post-Surgical Discharge Summary',
    type: 'Discharge',
    hospital: 'Apollo Hospital',
    doctor: 'Dr. Rajesh Kumar',
    date: '10 Aug 2026',
    timestamp: 1786343000000,
    status: 'Reviewed',
    fileSize: '4.8 MB',
    fileName: 'Discharge_Summary_Aug2026.pdf',
    isImportant: false,
    notes: 'Appendectomy surgery recovery complete. Sutures removed.'
  },
  {
    id: 'REC-2026-00780',
    title: 'COVID-19 Booster Vaccination Record',
    type: 'Vaccination',
    hospital: 'Govt Primary Health Center',
    doctor: 'Dr. S. Ramesh',
    date: '08 Aug 2026',
    timestamp: 1786170000000,
    status: 'Normal',
    fileSize: '850 KB',
    fileName: 'Vaccine_Certificate_2026.pdf',
    isImportant: false
  },
  {
    id: 'REC-2026-00762',
    title: 'Lipid Profile Blood Test',
    type: 'Lab Report',
    hospital: 'Metropolis Diagnostics',
    doctor: 'Dr. Sunita Patel',
    date: '02 Aug 2026',
    timestamp: 1785652000000,
    status: 'Attention',
    fileSize: '2.1 MB',
    fileName: 'Lipid_Profile_Aug2026.pdf',
    isImportant: false,
    metrics: [
      { name: 'Total Cholesterol', value: '215 mg/dL', status: 'High' },
      { name: 'Triglycerides', value: '160 mg/dL', status: 'High' },
      { name: 'HDL Cholesterol', value: '45 mg/dL', status: 'Normal' },
      { name: 'LDL Cholesterol', value: '138 mg/dL', status: 'Normal' }
    ]
  },
  {
    id: 'REC-2026-00741',
    title: 'ECG Electrocardiogram Report',
    type: 'Imaging',
    hospital: 'Apollo Hospital',
    doctor: 'Dr. Rajesh Kumar',
    date: '28 Jul 2026',
    timestamp: 1785220000000,
    status: 'Pending',
    fileSize: '5.6 MB',
    fileName: 'ECG_Scan_Jul2026.pdf',
    isImportant: false,
    notes: 'Normal sinus rhythm. Heart rate 72 bpm.'
  },
  {
    id: 'REC-2026-00712',
    title: 'Thyroid Function Test (T3 T4 TSH)',
    type: 'Lab Report',
    hospital: 'Apollo Hospital',
    doctor: 'Dr. Sunita Patel',
    date: '20 Jul 2026',
    timestamp: 1784529000000,
    status: 'Normal',
    fileSize: '1.7 MB',
    fileName: 'Thyroid_Test_Jul2026.pdf',
    isImportant: false,
    metrics: [
      { name: 'TSH', value: '2.4 µIU/mL', status: 'Normal' },
      { name: 'Total T3', value: '110 ng/dL', status: 'Normal' },
      { name: 'Total T4', value: '8.1 µg/dL', status: 'Normal' }
    ]
  },
  {
    id: 'REC-2026-00680',
    title: 'Orthopedic Knee Assessment',
    type: 'Consultation',
    hospital: 'Fortis Healthcare',
    doctor: 'Dr. Vikram Sethi',
    date: '12 Jul 2026',
    timestamp: 1783838000000,
    status: 'Reviewed',
    fileSize: '2.9 MB',
    fileName: 'Ortho_Assessment_Jul2026.pdf',
    isImportant: false
  },
  {
    id: 'REC-2026-00650',
    title: 'Annual Physical Health Certificate',
    type: 'Other',
    hospital: 'Apollo Hospital',
    doctor: 'Dr. Rajesh Kumar',
    date: '05 Jul 2026',
    timestamp: 1783233000000,
    status: 'Normal',
    fileSize: '1.5 MB',
    fileName: 'Fitness_Certificate_2026.pdf',
    isImportant: false
  }
];

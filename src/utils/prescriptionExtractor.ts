import { runOpticalOcr, parseStructuredPrescriptionFromOcr } from './ocrService';

export interface ExtractedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  foodInstruction: 'Before Food' | 'After Food' | 'With Food' | 'Anytime';
}

export interface FollowUpInfo {
  hasFollowUp: boolean;
  date: string; // e.g. "2026-09-05" or "05 Sep 2026"
  rawText: string; // e.g. "Review after 7 days on 05/09/2026"
  instructions: string;
}

export interface StructuredPrescription {
  id: string;
  patientName: string;
  doctorName: string;
  clinicName: string;
  doctorSpeciality?: string;
  prescriptionDate: string; // e.g. "2026-08-27"
  medicines: ExtractedMedicine[];
  followUp: FollowUpInfo;
  status: 'pending-review' | 'confirmed';
  notes?: string;
  rawImagePreview?: string;
  rawOcrText?: string;
  confidence?: number;
  rawConfidence?: number;
  isAbdmCompliant?: boolean;
  fields?: string[];
  pages?: string[];
  pageCount?: number;
  createdAt: number;
}

export interface SamplePrescriptionPreset {
  id: string;
  label: string;
  doctor: string;
  clinic: string;
  summary: string;
  data: Omit<StructuredPrescription, 'id' | 'createdAt'>;
}

export const SAMPLE_PRESCRIPTION_PRESETS: SamplePrescriptionPreset[] = [
  {
    id: 'preset-akshara-sms',
    label: 'SMS Hospital Pune - Dr. Akshara',
    doctor: 'Dr. Akshara, M.S. (Reg. No: MMC 2018)',
    clinic: 'SMS Hospital, MG Road, Pune',
    summary: 'Malaria & Infection Care (Abciximab + Vomilast + Zoclar 500 + Gestakind 10/SR)',
    data: {
      patientName: 'Akshara',
      doctorName: 'Dr. Akshara, M.S.',
      clinicName: 'SMS Hospital, Pune',
      doctorSpeciality: 'General & Internal Medicine',
      prescriptionDate: '2026-08-30',
      medicines: [
        {
          id: 'med-abciximab',
          name: 'Tab. Abciximab',
          dosage: '1 Morning',
          frequency: 'Once daily',
          duration: '8 Days',
          quantity: 8,
          instructions: 'Take 1 tablet in the morning before food',
          foodInstruction: 'Before Food'
        },
        {
          id: 'med-vomilast',
          name: 'Tab. Vomilast (Doxylamine + Pyridoxine + Folic Acid)',
          dosage: '1 Morning, 1 Night',
          frequency: 'Twice daily',
          duration: '8 Days',
          quantity: 16,
          instructions: 'Take 1 morning and 1 night after meals',
          foodInstruction: 'After Food'
        },
        {
          id: 'med-zoclar',
          name: 'Cap. Zoclar 500 (Clarithromycin 500mg)',
          dosage: '1 Morning',
          frequency: 'Once daily',
          duration: '3 Days',
          quantity: 3,
          instructions: 'Take 1 capsule in the morning after breakfast',
          foodInstruction: 'After Food'
        },
        {
          id: 'med-gestakind',
          name: 'Tab. Gestakind 10/SR (Isoxsuprine 10mg)',
          dosage: '1 Night',
          frequency: 'Once daily',
          duration: '4 Days',
          quantity: 4,
          instructions: 'Take 1 tablet at night before bedtime',
          foodInstruction: 'After Food'
        }
      ],
      followUp: {
        hasFollowUp: true,
        date: '2026-09-04',
        rawText: 'Follow Up: 04-09-2026',
        instructions: 'Take complete bed rest. Avoid outside food. Eat easy to digest boiled food with daal.'
      },
      status: 'pending-review',
      notes: 'Prescription verified via Optical AI Engine. Clinical diagnosis: Malaria.'
    }
  },
  {
    id: 'preset-arun-kumar',
    label: 'Apollo General OPD - Dr. Arun Kumar',
    doctor: 'Dr. Arun Kumar, MD (Gen Med)',
    clinic: 'Apollo Medical Centre, Chennai',
    summary: 'Fever & Acute Bronchitis Rx (Paracetamol + Amoxicillin) with 9-Day Follow-up',
    data: {
      patientName: 'Ragul Kumar',
      doctorName: 'Dr. Arun Kumar',
      clinicName: 'Apollo Medical Centre',
      doctorSpeciality: 'General Medicine',
      prescriptionDate: '2026-08-27',
      medicines: [
        {
          id: 'med-paracetamol-500',
          name: 'Paracetamol',
          dosage: '500 mg',
          frequency: 'Twice daily',
          duration: '5 days',
          quantity: 10,
          instructions: 'Take for fever and body ache',
          foodInstruction: 'After Food'
        },
        {
          id: 'med-amoxicillin-500',
          name: 'Amoxicillin',
          dosage: '500 mg',
          frequency: 'Three times daily',
          duration: '7 days',
          quantity: 21,
          instructions: 'Complete full antibacterial course',
          foodInstruction: 'After Food'
        },
        {
          id: 'med-pantoprazole-40',
          name: 'Pantoprazole',
          dosage: '40 mg',
          frequency: 'Once daily',
          duration: '5 days',
          quantity: 5,
          instructions: 'Take 30 mins before morning breakfast',
          foodInstruction: 'Before Food'
        }
      ],
      followUp: {
        hasFollowUp: true,
        date: '2026-09-05',
        rawText: 'Review after 9 days on 05 September 2026',
        instructions: 'Review after 9 days for clinical evaluation and chest auscultation'
      },
      status: 'pending-review',
      notes: 'Advised plenty of warm fluids, steam inhalation, and adequate hydration.'
    }
  },
  {
    id: 'preset-priya-cardio',
    label: 'Fortis Cardiology - Dr. Priya Sharma',
    doctor: 'Dr. Priya Sharma, DM (Cardiology)',
    clinic: 'Fortis Hospital & Heart Institute',
    summary: 'Cardiovascular & BP Maintenance Rx (Telmisartan + Atorvastatin) with 14-Day Review',
    data: {
      patientName: 'Ragul Kumar',
      doctorName: 'Dr. Priya Sharma',
      clinicName: 'Fortis Hospital & Heart Institute',
      doctorSpeciality: 'Cardiology',
      prescriptionDate: '2026-08-27',
      medicines: [
        {
          id: 'med-telmisartan-40',
          name: 'Telmisartan',
          dosage: '40 mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          instructions: 'Take in the morning for blood pressure maintenance',
          foodInstruction: 'Before Food'
        },
        {
          id: 'med-atorvastatin-10',
          name: 'Atorvastatin',
          dosage: '10 mg',
          frequency: 'Once daily',
          duration: '30 days',
          quantity: 30,
          instructions: 'Take once daily at bedtime',
          foodInstruction: 'After Food'
        }
      ],
      followUp: {
        hasFollowUp: true,
        date: '2026-09-12',
        rawText: 'Review on September 12, 2026 with 7-day BP log sheet',
        instructions: 'Bring home BP chart and fasting lipid profile report.'
      },
      status: 'pending-review',
      notes: 'Maintain low-sodium diet (< 2g/day) and 30 minutes of brisk walking daily.'
    }
  },
  {
    id: 'preset-rajesh-ent',
    label: 'Manipal ENT Care - Dr. Rajesh Kumar',
    doctor: 'Dr. Rajesh Kumar, MS (ENT)',
    clinic: 'Manipal Health Centre',
    summary: 'Sinusitis & Allergy Relief Rx (Levocetirizine + Fluticasone) - No Follow-up Required',
    data: {
      patientName: 'Ragul Kumar',
      doctorName: 'Dr. Rajesh Kumar',
      clinicName: 'Manipal Health Centre',
      doctorSpeciality: 'ENT Specialist',
      prescriptionDate: '2026-08-27',
      medicines: [
        {
          id: 'med-levocet-5',
          name: 'Levocetirizine',
          dosage: '5 mg',
          frequency: 'Once daily',
          duration: '7 days',
          quantity: 7,
          instructions: 'Take 1 tablet at night for allergic rhinitis',
          foodInstruction: 'After Food'
        },
        {
          id: 'med-saline-spray',
          name: 'Saline Nasal Spray',
          dosage: '0.9% w/v',
          frequency: 'Three times daily',
          duration: '10 days',
          quantity: 1,
          instructions: '2 sprays in each nostril thrice daily',
          foodInstruction: 'Anytime'
        }
      ],
      followUp: {
        hasFollowUp: false,
        date: '',
        rawText: 'SOS visit only if symptoms persist after 10 days',
        instructions: 'Avoid cold beverages and dust exposure.'
      },
      status: 'pending-review',
      notes: 'Use nasal mist after warm shower for best efficacy.'
    }
  }
];

/**
 * Real Optical Prescription Extraction Helper:
 * Runs Tesseract OCR on the supplied document and parses genuine prescription entities.
 * Returns demo preset only when explicitly selected by the user in demo mode.
 */
export const extractPrescriptionData = async (
  fileOrImage: File | string,
  presetId?: string,
  onProgress?: (step: string, percent: number) => void,
  customPatientName?: string
): Promise<StructuredPrescription> => {
  // If the user explicitly selected a clinical preset scenario from the demo presets list:
  if (presetId && presetId !== 'custom-upload') {
    const matchedPreset = SAMPLE_PRESCRIPTION_PRESETS.find((p) => p.id === presetId);
    if (matchedPreset) {
      if (onProgress) onProgress('Loading clinical preset demo...', 100);
      const uniqueId = `RX-DOC-${Date.now().toString().slice(-6)}`;
      return {
        id: uniqueId,
        patientName: customPatientName?.trim() || matchedPreset.data.patientName,
        doctorName: matchedPreset.data.doctorName,
        clinicName: matchedPreset.data.clinicName,
        doctorSpeciality: matchedPreset.data.doctorSpeciality,
        prescriptionDate: new Date().toISOString().slice(0, 10),
        medicines: matchedPreset.data.medicines.map((m, idx) => ({ ...m, id: `med-${uniqueId}-${idx + 1}` })),
        followUp: { ...matchedPreset.data.followUp },
        status: 'pending-review',
        notes: matchedPreset.data.notes,
        createdAt: Date.now()
      };
    }
  }

  // Real OCR pipeline for all uploaded files, captured images, or photo library files
  const ocrResult = await runOpticalOcr(fileOrImage, (prog, msg) => {
    if (onProgress) {
      onProgress(msg || 'Extracting prescription data with optical OCR...', prog);
    }
  });

  const previewUrl = typeof fileOrImage === 'string'
    ? fileOrImage
    : (ocrResult.previewUrl || (fileOrImage instanceof Blob ? URL.createObjectURL(fileOrImage) : undefined));
  return parseStructuredPrescriptionFromOcr(ocrResult, customPatientName, previewUrl);
};

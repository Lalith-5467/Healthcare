export interface CheckupCategory {
  id: string;
  title: string;
  iconName: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
  progressPercentage: number;
}

export interface CheckupAnswers {
  wellness: string;
  energy: string;
  sleep: string;
  activity: string;
  hydration: string;
  mood: string;
  stress: string;
  symptoms: string[];
  otherSymptomsText?: string;
  vitals: {
    heartRate: string;
    bloodPressure: string;
    temperature: string;
    weight: string;
    spO2: string;
  };
  medicationAdherence: string;
  healthHistory: {
    doctorVisit: boolean;
    labTest: boolean;
    hospitalVisit: boolean;
    vaccination: boolean;
  };
}

export interface CheckupHistoryItem {
  id: string;
  date: string;
  time: string;
  type: 'General Wellness Check-Up' | 'Quick Check-Up' | 'Routine Check-Up';
  status: 'Completed' | 'In Progress';
  completionScore: number; // e.g. 92% (Form Completion Score)
  answers: CheckupAnswers;
}

export const INITIAL_CATEGORIES: CheckupCategory[] = [
  {
    id: 'gen-wellness',
    title: 'General Wellness',
    iconName: 'Stethoscope',
    description: 'Daily wellness and general health activity.',
    status: 'Completed',
    progressPercentage: 100
  },
  {
    id: 'vitals',
    title: 'Vital Signs',
    iconName: 'Heart',
    description: 'Record basic health measurements.',
    status: 'Completed',
    progressPercentage: 100
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    iconName: 'Activity',
    description: 'Sleep, activity, nutrition and hydration.',
    status: 'In Progress',
    progressPercentage: 80
  },
  {
    id: 'mental-wellbeing',
    title: 'Mental Wellbeing',
    iconName: 'Smile',
    description: 'Simple mood and wellbeing check-in.',
    status: 'Completed',
    progressPercentage: 100
  },
  {
    id: 'medication-review',
    title: 'Medication Review',
    iconName: 'Pill',
    description: 'Review medication tracking activity.',
    status: 'Completed',
    progressPercentage: 100
  },
  {
    id: 'health-history',
    title: 'Health History',
    iconName: 'FileText',
    description: 'Review recent health information.',
    status: 'Not Started',
    progressPercentage: 50
  }
];

export const DEFAULT_CHECKUP_ANSWERS: CheckupAnswers = {
  wellness: 'Good',
  energy: 'Moderate',
  sleep: '7–8 hours',
  activity: 'Active',
  hydration: '1.5–2L',
  mood: 'Good 🙂',
  stress: 'Low',
  symptoms: ['None'],
  otherSymptomsText: '',
  vitals: {
    heartRate: '72 BPM',
    bloodPressure: '120/80',
    temperature: '98.4°F',
    weight: '68 kg',
    spO2: '98%'
  },
  medicationAdherence: 'Mostly',
  healthHistory: {
    doctorVisit: true,
    labTest: true,
    hospitalVisit: false,
    vaccination: false
  }
};

export const INITIAL_CHECKUP_HISTORY: CheckupHistoryItem[] = [
  {
    id: 'CHK-2026-0824',
    date: '24 Aug 2026',
    time: '10:32 AM',
    type: 'General Wellness Check-Up',
    status: 'Completed',
    completionScore: 92,
    answers: DEFAULT_CHECKUP_ANSWERS
  },
  {
    id: 'CHK-2026-0818',
    date: '18 Aug 2026',
    time: '04:15 PM',
    type: 'Quick Check-Up',
    status: 'Completed',
    completionScore: 100,
    answers: {
      ...DEFAULT_CHECKUP_ANSWERS,
      wellness: 'Very Good',
      energy: 'Good',
      symptoms: ['None']
    }
  },
  {
    id: 'CHK-2026-0802',
    date: '02 Aug 2026',
    time: '09:00 AM',
    type: 'Routine Check-Up',
    status: 'Completed',
    completionScore: 85,
    answers: {
      ...DEFAULT_CHECKUP_ANSWERS,
      wellness: 'Okay',
      energy: 'Moderate',
      stress: 'Moderate'
    }
  }
];

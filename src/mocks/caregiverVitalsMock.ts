export interface DemoVitalReading {
  id: string;
  date: string;
  time: string;
  rawTimestamp: number;
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

export const DEMO_VITALS_BY_WARD: Record<string, DemoVitalReading[]> = {
  // Ward 1 (e.g. Arun Raj / Ragul Kumar - Senior Dependent)
  'ward-1': [
    {
      id: 'demo-v1-1',
      date: 'Today',
      time: '08:30 AM',
      rawTimestamp: Date.now() - 3600000,
      systolic: 124,
      diastolic: 82,
      bloodSugar: 112,
      sugarType: 'Fasting',
      spo2: 98,
      heartRate: 74,
      temperature: 98.4,
      weight: 68.5,
      notes: 'Morning vitals recorded after breakfast & daily walk.',
      status: 'normal'
    },
    {
      id: 'demo-v1-2',
      date: 'Yesterday',
      time: '07:45 PM',
      rawTimestamp: Date.now() - 86400000,
      systolic: 128,
      diastolic: 84,
      bloodSugar: 145,
      sugarType: 'Post-Meal',
      spo2: 97,
      heartRate: 78,
      temperature: 98.6,
      weight: 68.4,
      notes: 'Evening readings post-dinner. Hydration good.',
      status: 'normal'
    },
    {
      id: 'demo-v1-3',
      date: '16 Sep 2026',
      time: '08:15 AM',
      rawTimestamp: Date.now() - 172800000,
      systolic: 138,
      diastolic: 88,
      bloodSugar: 162,
      sugarType: 'Fasting',
      spo2: 96,
      heartRate: 82,
      temperature: 98.8,
      weight: 68.6,
      notes: 'Slightly elevated morning blood sugar. Caregiver notified.',
      status: 'elevated'
    }
  ],

  // Ward 2 (e.g. Meena / Meenakshi Sundaram - Mother)
  'ward-2': [
    {
      id: 'demo-v2-1',
      date: 'Today',
      time: '07:15 AM',
      rawTimestamp: Date.now() - 7200000,
      systolic: 118,
      diastolic: 76,
      bloodSugar: 98,
      sugarType: 'Fasting',
      spo2: 99,
      heartRate: 68,
      temperature: 98.2,
      weight: 58.0,
      notes: 'Thyroid pill taken on empty stomach. Vitals optimal.',
      status: 'normal'
    },
    {
      id: 'demo-v2-2',
      date: '15 Sep 2026',
      time: '06:30 PM',
      rawTimestamp: Date.now() - 259200000,
      systolic: 120,
      diastolic: 78,
      bloodSugar: 128,
      sugarType: 'Post-Meal',
      spo2: 98,
      heartRate: 70,
      temperature: 98.4,
      weight: 58.1,
      notes: 'Routine evening biometrics. Patient feeling energetic.',
      status: 'normal'
    }
  ],

  // Ward 3 (e.g. Suresh Menon - Spouse / Relative)
  'ward-3': [
    {
      id: 'demo-v3-1',
      date: '14 Sep 2026',
      time: '09:00 AM',
      rawTimestamp: Date.now() - 345600000,
      systolic: 122,
      diastolic: 80,
      bloodSugar: 105,
      sugarType: 'Fasting',
      spo2: 98,
      heartRate: 72,
      temperature: 98.6,
      weight: 72.0,
      notes: 'Baseline checkup completed.',
      status: 'normal'
    }
  ]
};

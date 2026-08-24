export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
  isHelpful?: boolean | null;
  savedToNotes?: boolean;
  suggestedQuestions?: string[];
  isEmergencyAlert?: boolean;
}

export interface ChatConversation {
  id: string;
  title: string;
  date: string;
  messages: ChatMessage[];
}

export interface SavedHealthNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface HealthTopicItem {
  id: string;
  title: string;
  category: string;
  iconName: string;
  summary: string;
  whyItMatters: string;
  healthyHabits: string[];
  doctorQuestions: string[];
}

export interface AIAssistantSettingsState {
  responseStyle: 'Simple' | 'Detailed' | 'Professional';
  language: 'English' | 'Tamil' | 'Hindi';
  saveHistory: boolean;
}

export interface HealthTipItem {
  id: string;
  tip: string;
  category: string;
}

export const EMERGENCY_KEYWORDS = [
  'chest pain',
  'severe breathing',
  'difficulty breathing',
  'unconscious',
  'heavy bleeding',
  'severe injury',
  'heart attack',
  'stroke',
  'seizure'
];

export const HEALTH_TOPICS_DATABASE: HealthTopicItem[] = [
  {
    id: 'TOPIC-01',
    title: 'Sleep Hygiene & Rest',
    category: 'Sleep',
    iconName: 'Moon',
    summary: 'Consistent 7-9 hours of restful sleep supports immunity, cognitive clarity, and cardiovascular health.',
    whyItMatters: 'Chronic sleep deprivation increases risk of hypertension, weight gain, and impaired memory consolidation.',
    healthyHabits: [
      'Maintain a consistent sleep schedule (bedtime & wake time).',
      'Keep bedroom dark, quiet, and cool (18-21°C).',
      'Avoid blue light screens 60 minutes before bedtime.'
    ],
    doctorQuestions: [
      'Could my daily fatigue be linked to sleep apnea?',
      'Is my current medication affecting my sleep cycle?'
    ]
  },
  {
    id: 'TOPIC-02',
    title: 'Stress & Mental Wellness',
    category: 'Mental Health',
    iconName: 'Heart',
    summary: 'Managing stress through mindfulness and routine protects mental clarity and lowers cortisol levels.',
    whyItMatters: 'Unmanaged chronic stress elevates heart rate, blood pressure, and disrupts digestive balance.',
    healthyHabits: [
      'Practice 5 minutes of deep box breathing twice daily.',
      'Take regular micro-breaks during work sessions.',
      'Engage in outdoor walks in natural sunlight.'
    ],
    doctorQuestions: [
      'Are my physical symptoms (headaches/palpitations) stress-related?',
      'Can you recommend stress management resources or specialists?'
    ]
  },
  {
    id: 'TOPIC-03',
    title: 'Nutrition & Balanced Diet',
    category: 'Diet',
    iconName: 'Utensils',
    summary: 'A whole-food diet rich in fiber, lean proteins, and healthy fats fuels daily energy and digestive wellness.',
    whyItMatters: 'Balanced nutrition helps stabilize blood sugar, manage blood pressure, and support gut microbiota.',
    healthyHabits: [
      'Fill half your plate with colorful vegetables at lunch and dinner.',
      'Stay hydrated with 2-3 liters of water daily.',
      'Limit processed sugars and refined sodium intake.'
    ],
    doctorQuestions: [
      'Does my blood work suggest any vitamin or mineral deficiencies?',
      'Should I modify my dietary intake for my blood pressure?'
    ]
  },
  {
    id: 'TOPIC-04',
    title: 'Cardiovascular Health',
    category: 'Heart Health',
    iconName: 'Activity',
    summary: 'Regular aerobic exercise, low sodium, and blood pressure monitoring maintain strong vascular health.',
    whyItMatters: 'Heart health is key to longevity and preventing heart attacks, strokes, and arterial stiffness.',
    healthyHabits: [
      'Aim for 150 minutes of moderate aerobic exercise per week.',
      'Monitor blood pressure at home regularly.',
      'Avoid tobacco products and limit excessive alcohol.'
    ],
    doctorQuestions: [
      'What is my target blood pressure range?',
      'How often should I test my lipid panel / cholesterol levels?'
    ]
  }
];

export const HEALTH_TIPS_COLLECTION: HealthTipItem[] = [
  { id: 'TIP-1', tip: 'Staying hydrated with 8 glasses of water daily helps maintain energy levels and kidney function.', category: 'Hydration' },
  { id: 'TIP-2', tip: 'Taking 5-minute movement breaks every hour improves circulation and reduces postural strain.', category: 'Exercise' },
  { id: 'TIP-3', tip: 'Limiting screen exposure 60 minutes before bed enhances natural melatonin production for deeper sleep.', category: 'Sleep' },
  { id: 'TIP-4', tip: 'Eating high-fiber foods like oats, apples, and lentils supports stable blood sugar levels.', category: 'Nutrition' }
];

export const DEFAULT_AI_SETTINGS: AIAssistantSettingsState = {
  responseStyle: 'Simple',
  language: 'English',
  saveHistory: true
};

// SIMULATED DEMO RESPONSE GENERATOR BASED ON KEYWORDS
export const generateDemoAIResponse = (userQuery: string, style: 'Simple' | 'Detailed' | 'Professional'): { content: string; questions: string[]; isEmergency: boolean } => {
  const queryLower = userQuery.toLowerCase();

  // Check Emergency First
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => queryLower.includes(kw));
  if (isEmergency) {
    return {
      content: `🚨 **Potential Emergency Detected**: Your message contains keywords associated with severe medical conditions (such as chest pain or severe breathing difficulty). If you or someone around you is experiencing a medical emergency, please click below immediately to access **SOS & Emergency** or contact **108 Ambulance**.`,
      questions: ['Open SOS & Emergency', 'Call 108 Ambulance', 'Find Nearby Emergency Hospitals'],
      isEmergency: true
    };
  }

  // Symptom Questions
  if (queryLower.includes('headache') || queryLower.includes('migraine')) {
    return {
      content: style === 'Simple'
        ? `Headaches can be caused by dehydration, stress, lack of sleep, or eye strain. Rest in a quiet, dark room and drink water. If headache is severe or accompanied by fever/confusion, consult a doctor.`
        : `Headaches are commonly categorized into tension headaches, migraines, or cluster headaches. Common triggers include dehydration, muscular tension, caffeine withdrawal, and stress. If symptoms persist longer than 48 hours or escalate rapidly, schedule a medical evaluation.`,
      questions: ['How can I prepare for my doctor visit?', 'What hydration tips can help?', 'Check my active medicines'],
      isEmergency: false
    };
  }

  if (queryLower.includes('fever') || queryLower.includes('temperature') || queryLower.includes('cold')) {
    return {
      content: style === 'Simple'
        ? `A fever is usually a sign that your body is fighting an infection. Rest, stay hydrated, and monitor your temperature. If fever exceeds 102°F (38.8°C) or lasts over 3 days, seek medical advice.`
        : `Fever (pyrexia) is a temporary elevation in body temperature, often due to viral or bacterial immune response. Maintain fluid intake and monitor for secondary symptoms such as chills, cough, or shortness of breath. Contact your physician if accompanied by stiff neck or severe throat pain.`,
      questions: ['Prepare questions for doctor', 'Find nearby clinics', 'Check health checkup due date'],
      isEmergency: false
    };
  }

  if (queryLower.includes('medicine') || queryLower.includes('drug') || queryLower.includes('pill') || queryLower.includes('prescription')) {
    return {
      content: `You currently have **3 active medication reminders** in your patient profile (e.g., Amlodipine 5mg). Always take prescription medications as directed by your doctor. Never modify dosage or stop taking prescribed pills without professional medical consultation.`,
      questions: ['View my Medicines module', 'Set medication reminder', 'Ask pharmacist questions'],
      isEmergency: false
    };
  }

  if (queryLower.includes('appointment') || queryLower.includes('doctor') || queryLower.includes('visit')) {
    return {
      content: `Your next upcoming specialist appointment is scheduled for **25 Aug 2026 at 10:30 AM** with **Dr. Rajesh Kumar** (Cardiology). You can prepare a customized question list or review your appointment details.`,
      questions: ['Prepare for Doctor Visit', 'View Appointments module', 'Check medical records'],
      isEmergency: false
    };
  }

  if (queryLower.includes('insurance') || queryLower.includes('policy') || queryLower.includes('claim')) {
    return {
      content: `Your **CarePlus Family Floater Policy** is active with **₹10 Lakhs** total coverage. Your remaining balance is **₹7,60,000**, valid until **31 Dec 2026**.`,
      questions: ['View Insurance module', 'How do I start a claim?', 'View digital health card'],
      isEmergency: false
    };
  }

  if (queryLower.includes('hospital') || queryLower.includes('clinic')) {
    return {
      content: `There are **12 empanelled cashless hospitals** near your location (e.g., CityCare Multispecialty Hospital - 1.2 km). You can explore active emergency bays or navigate to the hospitals page.`,
      questions: ['View Nearby Hospitals module', 'Filter 24x7 Emergency Bays', 'Get directions'],
      isEmergency: false
    };
  }

  // Default General Educational Response
  return {
    content: style === 'Simple'
      ? `I'm your AI Health Assistant companion. I can help explain medical terms, organize questions for your doctor visit, and guide you through your medicines, appointments, insurance, and emergency settings.`
      : `Thank you for your inquiry. As a simulated health guidance companion, I provide general educational information and assist in navigating your patient portal. For diagnosis or treatment advice, always consult a certified doctor.`,
    questions: ['Explain a Medical Term', 'Prepare for Doctor Visit', 'Explore Health Topics', 'Check my Health Snapshot'],
    isEmergency: false
  };
};

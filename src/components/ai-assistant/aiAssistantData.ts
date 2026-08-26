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

// MULTI-STYLE & MULTI-LINGUAL RESPONSE ENGINE
export const generateDemoAIResponse = (
  userQuery: string,
  style: 'Simple' | 'Detailed' | 'Professional' = 'Simple',
  language: 'English' | 'Tamil' | 'Hindi' = 'English'
): { content: string; questions: string[]; isEmergency: boolean } => {
  const queryLower = userQuery.toLowerCase();

  // 1. Check Emergency First
  const isEmergency = EMERGENCY_KEYWORDS.some((kw) => queryLower.includes(kw));
  if (isEmergency) {
    let content = `🚨 **Potential Emergency Detected**: Your message contains keywords associated with severe medical conditions (such as chest pain or severe breathing difficulty). If you or someone around you is experiencing a medical emergency, please click below immediately to access **SOS & Emergency** or contact **108 Ambulance**.`;
    if (language === 'Tamil') {
      content = `🚨 **அவசர நிலை எச்சரிக்கை**: உங்கள் செய்தியில் தீவிர மருத்துவ அறிகுறிகள் (நெஞ்சு வலி அல்லது மூச்சுத்திணறல்) கண்டறியப்பட்டுள்ளன. உடனடியாக 108 ஆம்புலன்ஸ் அல்லது SOS அவசர சேவையை தொடர்பு கொள்ளவும்.`;
    } else if (language === 'Hindi') {
      content = `🚨 **आपातकालीन चेतावनी**: आपके संदेश में गंभीर चिकित्सा लक्षण (जैसे सीने में दर्द या सांस लेने में तकलीफ) पाए गए हैं। कृपया तुरंत 108 एम्बुलेंस या SOS आपातकालीन सेवा संपर्क करें।`;
    }
    return {
      content,
      questions: language === 'Tamil' ? ['SOS அவசரம்', '108 ஆம்புலன்ஸ்', 'அருகிலுள்ள மருத்துவமனை'] : language === 'Hindi' ? ['SOS आपातकाल', '108 एम्बुलेंस', 'पास के अस्पताल'] : ['Open SOS & Emergency', 'Call 108 Ambulance', 'Find Nearby Emergency Hospitals'],
      isEmergency: true
    };
  }

  // 2. Medication Reminder specific prompt
  if (queryLower.includes('set medication reminder') || queryLower.includes('set reminder') || queryLower.includes('pill alarm') || queryLower.includes('நினைவூட்டல்')) {
    let content = '';
    if (style === 'Simple') {
      content = `⏰ **Medication Reminder Setup**: To set a daily reminder for your prescription (e.g. Metformin 500mg or Amlodipine 5mg), navigate to the **Medicines** or **Reminders** tab. You can configure exact dosage times and push notification alerts.`;
    } else if (style === 'Detailed') {
      content = `⏰ **Medication Reminder Setup & Adherence Guide**:\n\n1. **Configuring Reminders**: Go to the **Medicines** module to select your active drugs (Amlodipine 5mg, Metformin) and set daily dose times (e.g., 08:00 AM & 08:00 PM).\n2. **Push Notifications**: Enable mobile push & SMS alerts so you never miss a dose.\n3. **Missed Dose Protocol**: If a dose is missed by >4 hours, take it as soon as remembered unless it is almost time for the next scheduled dose. Never double dose.`;
    } else {
      content = `📋 **CLINICAL MEDICATION ADHERENCE PROTOCOL**\n\n• **Module Integration**: Active patient records indicate 3 scheduled therapies (Amlodipine 5mg QD, Metformin 500mg BID).\n• **Administration Guidelines**: Ensure consistent post-prandial administration. Configure automated push triggers under the **Reminders** portal.\n• **Safety Alert**: Pharmacokinetic doubling must be strictly avoided during missed dose recovery window.`;
    }

    if (language === 'Tamil') {
      content = `⏰ **மருந்து நினைவூட்டல் அமைப்பு**: உங்கள் மருந்துகளுக்கான தினசரி நினைவூட்டலை அமைக்க **Medicines** அல்லது **Reminders** பகுதிக்கு செல்லவும். இதில் மருந்து எடுக்கும் நேரம் மற்றும் அறிவிப்புகளை எளிதாக அமைக்கலாம்.`;
    } else if (language === 'Hindi') {
      content = `⏰ **दवा रिमाइंडर्स सेटिंग**: अपनी निर्धारित दवाइयों के लिए दैनिक रिमाइंडर सेट करने के लिए **Medicines** या **Reminders** अनुभाग में जाएं। आप खुराक का समय और नोटिफिकेशन सेट कर सकते हैं।`;
    }

    return {
      content,
      questions: language === 'Tamil' ? ['மருந்துகள் பகுதி', 'நினைவூட்டல்கள் பகுதி', 'மருந்து ஆலோசனை'] : language === 'Hindi' ? ['दवाइयां अनुभाग', 'रिमाइंडर्स अनुभाग', 'फार्मासिस्ट सलाह'] : ['View Medicines module', 'View Reminders module', 'What to do if I miss a dose?'],
      isEmergency: false
    };
  }

  // 3. Headache / Migraine Queries
  if (queryLower.includes('headache') || queryLower.includes('migraine')) {
    let content = '';
    if (style === 'Simple') {
      content = `💡 **Headache Relief**: Headaches are commonly caused by dehydration, stress, lack of sleep, or eye strain.\n\n• Rest in a quiet, dark room.\n• Drink 1-2 glasses of water.\n• Apply a cool compress to your forehead.\n• If severe or accompanied by fever/stiff neck, consult a doctor immediately.`;
    } else if (style === 'Detailed') {
      content = `💡 **Comprehensive Headache Breakdown & Care Guide**:\n\n🔍 **Possible Causes**: Dehydration, muscle tension in neck/shoulders, caffeine withdrawal, prolonged screen time, or emotional stress.\n\n🏠 **Actionable Home Steps**:\n1. **Hydration**: Drink 500ml of room-temperature water immediately.\n2. **Environment**: Dim screen lights and step into a cool, ventilated space.\n3. **Relaxation**: Apply a warm or cool compress for 15 minutes.\n\n⚠️ **When to Seek Immediate Care**: Sudden onset "thunderclap" headache, vision changes, slurred speech, or persistent vomiting.`;
    } else {
      content = `🩺 **CLINICAL EVALUATION & CEPHALALGIA TRIAGE PROTOCOL**\n\n• **Etiology Breakdown**: Tension-type headache vs Vascular Migraine vs Secondary Hypertension Cephalalgia.\n• **Diagnostic Differential**: Evaluate for dehydration osmolarity, cervical muscular hypertonia, or ocular strain.\n• **Pharmacotherapy Note**: First-line analgesics (e.g. Paracetamol 500mg) should be administered only under physician oversight.\n• **Red Flag Criteria**: Sudden onset thunderclap presentation or focal neurological deficit requires urgent ER evaluation.`;
    }

    if (language === 'Tamil') {
      content = `தலைவலி பொதுவாக நீர்ச்சத்து குறைபாடு, மனஅழுத்தம், தூக்கமின்மை அல்லது கண்கள் சோர்வடைவதால் ஏற்படலாம். அமைதியான இருண்ட அறையில் ஓய்வெடுத்து 1-2 டம்ளர் தண்ணீர் குடிக்கவும். தலைவலி தீவிரமாக இருந்தால் மருத்துவரை அணுகவும்.`;
    } else if (language === 'Hindi') {
      content = `सिरदर्द आमतौर पर डिहाइड्रेशन, तनाव, नींद की कमी या आंखों के तनाव के कारण हो सकता है। शांत कमरे में आराम करें और पर्याप्त पानी पिएं। यदि सिरदर्द गंभीर है, तो कृपया डॉक्टर से सलाह लें।`;
    }

    return {
      content,
      questions: language === 'Tamil' ? ['மருத்துவர் தயாரிப்பு', 'நீர்ச்சத்து குறிப்புகள்', 'எனது மருந்துகள்'] : language === 'Hindi' ? ['डॉक्टर तैयारी', 'हाइड्रेशन टिप्स', 'मेरी दवाइयां'] : ['How can I prepare for my doctor visit?', 'What hydration tips can help?', 'Check my active medicines'],
      isEmergency: false
    };
  }

  // 4. Fever / Cold Queries
  if (queryLower.includes('fever') || queryLower.includes('temperature') || queryLower.includes('cold')) {
    let content = '';
    if (style === 'Simple') {
      content = `🌡 **Fever Guidance**: A fever is a sign your immune system is fighting an infection.\n\n• Rest and stay hydrated with water and warm fluids.\n• Monitor your temperature with a thermometer.\n• Seek medical care if temperature exceeds 102°F (38.8°C) or lasts over 3 days.`;
    } else if (style === 'Detailed') {
      content = `🌡 **Detailed Fever & Infection Recovery Plan**:\n\n🔍 **Physiological Mechanism**: Fever (pyrexia) occurs when immune pyrogens reset the body thermostat to inhibit viral/bacterial replication.\n\n🏠 **Care Steps**:\n1. **Fluid Intake**: Drink 2.5-3L of water, electrolyte solution, or warm broths.\n2. **Tepid Sponge**: Wipe arms and forehead with warm water if body temp exceeds 101°F.\n3. **Monitoring**: Record temperature every 4 hours in a health journal.\n\n⚠️ **Seek ER Care If**: Accompanied by stiff neck, shortness of breath, or confusion.`;
    } else {
      content = `🩺 **CLINICAL PYREXIA EVALUATION & INFECTION RESPONSE**\n\n• **Pathophysiology**: Febrile response driven by interleukin-1 and prostaglandin E2 elevation.\n• **Patient Triage**: Monitor for systemic inflammatory signs, secondary respiratory tract involvement, or skin petechiae.\n• **Therapeutic Measures**: Hydration protocol (30-40 ml/kg/day), antipyretic administration under clinical dosage guidelines.\n• **Escalation Trigger**: Sustained temperature >102.5°F refractory to antipyretics requires immediate clinical review.`;
    }

    if (language === 'Tamil') {
      content = `காய்ச்சல் உடலின் நோய் எதிர்ப்பு அமைப்பு தொற்றுடன் போராடுவதன் அறிகுறியாகும். போதுமான தண்ணீர் குடித்து நன்கு ஓய்வு எடுக்கவும். காய்ச்சல் 102°F க்கும் அதிகமாக இருந்தால் மருத்துவரை அணுகவும்.`;
    } else if (language === 'Hindi') {
      content = `बुखार इस बात का संकेत है कि आपका शरीर संक्रमण से लड़ रहा है। भरपूर आराम करें, पानी पिएं और तापमान पर नज़र रखें। यदि बुखार 102°F से अधिक है, तो डॉक्टर से सलाह लें।`;
    }

    return {
      content,
      questions: language === 'Tamil' ? ['மருத்துவரிடம் கேட்க', 'மருத்துவமனை கண்டறி', 'பரிசோதனை தேதி'] : language === 'Hindi' ? ['डॉक्टर से पूछें', 'क्लिनिक खोजें', 'चेकअप तिथि'] : ['Prepare questions for doctor', 'Find nearby clinics', 'Check health checkup due date'],
      isEmergency: false
    };
  }

  // 5. Diet & Nutrition Queries
  if (queryLower.includes('diet') || queryLower.includes('food') || queryLower.includes('nutrition') || queryLower.includes('meal')) {
    let content = '';
    if (style === 'Simple') {
      content = `🥗 **Balanced Diet Basics**: Eat 50% vegetables, 25% lean protein, and 25% whole grains. Limit processed sugar and drink 2-3L water daily.`;
    } else if (style === 'Detailed') {
      content = `🥗 **Comprehensive Clinical Meal Plan**:\n\n1. **Macro Distribution**: 50% fiber-dense vegetables, 25% quality proteins (tofu, legumes, fish), 25% low-GI complex carbs (quinoa, oats).\n2. **Hydration Engine**: Drink 2.5-3L water to optimize renal filtration and metabolic energy.\n3. **Micronutrients**: Include leafy greens for Vitamin K & iron, and seeds for Omega-3 fatty acids.`;
    } else {
      content = `📋 **CLINICAL NUTRITION & METABOLIC PROTOCOL**\n\n• **Glycemic Index Control**: Prioritize complex polysaccharides to attenuate post-prandial insulin spikes.\n• **Dietary Sodium Target**: Enforce <2,000 mg/day sodium cap for vascular tone preservation.\n• **Lipid Modulation**: Incorporate monounsaturated fatty acids to support high-density lipoprotein (HDL) ratio.`;
    }

    if (language === 'Tamil') {
      content = `சீரான ஆரோக்கியத்திற்கு 50% காய்கறிகள், 25% புரதம் மற்றும் 25% தானியங்கள் அடங்கிய உணவை உட்கொள்ளவும். தினமும் 2-3 லிட்டர் தண்ணீர் குடிப்பது அவசியம்.`;
    } else if (language === 'Hindi') {
      content = `बेहतर स्वास्थ्य के लिए 50% हरी सब्जियां, 25% प्रोटीन और 25% कार्बोहाइड्रेट युक्त संतुलित आहार लें। रोजाना 2-3 लीटर पानी पिएं।`;
    }

    return {
      content,
      questions: language === 'Tamil' ? ['உணவு முறை பார்க்க', 'நீர்ச்சத்து அளவீடு', 'கொலஸ்ட்ரால் குறிப்புகள்'] : language === 'Hindi' ? ['डाइट प्लान देखें', 'पानी की मात्रा', 'कोलेस्ट्रॉल टिप्स'] : ['View Diet & Nutrition Plans', 'How much water should I drink?', 'Check cholesterol tips'],
      isEmergency: false
    };
  }

  // 6. Default General Educational Response
  let content = '';
  if (style === 'Simple') {
    content = `💡 **AI Health Guidance**: I can assist you with understanding symptoms, preparing questions for your doctor visit, checking active medicines, and explaining lab reports.`;
  } else if (style === 'Detailed') {
    content = `💡 **Detailed Healthcare Companion Guidance**:\n\n• **Symptoms & Triage**: Learn safe home care measures and red-flag warning signs.\n• **Medications**: Check dosage schedules and pharmacist consultation checklists.\n• **Doctor Visit Prep**: Generate tailored question lists before your appointment with Dr. Rajesh Kumar.`;
  } else {
    content = `🩺 **CLINICAL PORTAL ASSISTANT & HEALTHCARE GUIDELINES**\n\n• **Scope of Service**: Provides evidence-based general health education, biometric trend interpretation, and appointment preparation.\n• **Regulatory Compliance**: ABDM 2.0 & HIPAA compliant data handling.\n• **Physician Disclaimer**: Information provided does not constitute direct medical diagnosis or prescription modification.`;
  }

  if (language === 'Tamil') {
    content = `வணக்கம்! நான் உங்கள் AI மருத்துவ உதவியாளன். உங்களின் மருத்துவ சந்தேகங்கள், மருந்துகள், பரிசோதனை முடிவுகள் மற்றும் மருத்துவ சந்திப்புகளுக்கு வழிகாட்ட தயாராக உள்ளேன்.`;
  } else if (language === 'Hindi') {
    content = `नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं आपकी स्वास्थ्य संबंधी जानकारी, दवाइयों, जांच रिपोर्ट और डॉक्टर अपॉइंटमेंट में मार्गदर्शन करने के लिए तत्पर हूं।`;
  }

  return {
    content,
    questions: language === 'Tamil' ? ['மருத்துவ வார்த்தைகள் விளக்கம்', 'மருத்துவர் தயாரிப்பு', 'ஆரோக்கிய தலைப்புகள்', 'சுகாதார சுருக்கம்'] : language === 'Hindi' ? ['चिकित्सा शब्द व्याख्या', 'डॉक्टर विजिट तैयारी', 'स्वास्थ्य विषय', 'हेल्थ स्नैपशॉट'] : ['Explain a Medical Term', 'Prepare for Doctor Visit', 'Explore Health Topics', 'Check my Health Snapshot'],
    isEmergency: false
  };
};

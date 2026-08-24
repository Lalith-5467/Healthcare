export interface ConsultationDoctor {
  id: string;
  name: string;
  speciality: string;
  rating: number;
  experienceYears: number;
  languages: string[];
  hospital: string;
  avatarUrl: string;
  bio: string;
}

export interface ConsultationAppointment {
  id: string; // e.g. "APT-2026-00482"
  doctor: ConsultationDoctor;
  date: string; // e.g. "23 Aug 2026"
  time: string; // e.g. "10:30 AM"
  type: 'Video Consultation' | 'In-Person';
  status: 'Confirmed' | 'In Progress' | 'Completed';
  reason: string;
}

export interface ChatMessage {
  id: string;
  sender: 'Doctor' | 'Patient';
  senderName: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface SharedDocument {
  id: string;
  title: string;
  type: 'Lab Report' | 'Prescription' | 'Imaging' | 'Summary';
  date: string;
  fileName: string;
}

export const MOCK_CONSULTATION_DOCTOR: ConsultationDoctor = {
  id: 'DOC-101',
  name: 'Dr. Rajesh Kumar',
  speciality: 'General Physician & Cardiologist',
  rating: 4.8,
  experienceYears: 12,
  languages: ['English', 'Tamil', 'Hindi'],
  hospital: 'Apollo Hospital, Chennai',
  avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80',
  bio: 'Senior Consultant Physician specializing in preventive health checkups, cardiovascular wellness, and chronic disease management.'
};

export const MOCK_CONSULTATION_APPOINTMENT: ConsultationAppointment = {
  id: 'APT-2026-00482',
  doctor: MOCK_CONSULTATION_DOCTOR,
  date: 'Today · 23 Aug 2026',
  time: '10:30 AM',
  type: 'Video Consultation',
  status: 'Confirmed',
  reason: 'Routine quarterly health checkup & blood sugar review'
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'MSG-1',
    sender: 'Doctor',
    senderName: 'Dr. Rajesh Kumar',
    text: 'Hello Samson! Welcome to your digital video consultation. How are you feeling today?',
    timestamp: '10:30 AM',
    isRead: true
  },
  {
    id: 'MSG-2',
    sender: 'Patient',
    senderName: 'Samson L.',
    text: "Good morning Doctor. I'm doing well! I wanted to review my recent fasting blood sugar report.",
    timestamp: '10:31 AM',
    isRead: true
  },
  {
    id: 'MSG-3',
    sender: 'Doctor',
    senderName: 'Dr. Rajesh Kumar',
    text: "Excellent. I have your lab records open. Let's go over the parameters together.",
    timestamp: '10:32 AM',
    isRead: true
  }
];

export const MOCK_SHARED_DOCUMENTS: SharedDocument[] = [
  {
    id: 'DOC-REC-01',
    title: 'Complete Blood Count (CBC) Report',
    type: 'Lab Report',
    date: '20 Aug 2026',
    fileName: 'CBC_Report_Aug2026.pdf'
  },
  {
    id: 'DOC-REC-02',
    title: 'Fasting Blood Glucose Test',
    type: 'Lab Report',
    date: '15 Aug 2026',
    fileName: 'Glucose_Test_Aug15.pdf'
  },
  {
    id: 'DOC-REC-03',
    title: 'Cardiology Consultation Summary',
    type: 'Summary',
    date: '01 Aug 2026',
    fileName: 'Cardio_Summary_Aug01.pdf'
  }
];

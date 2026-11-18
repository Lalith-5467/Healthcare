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

export const AVAILABLE_CONSULTATION_DOCTORS: ConsultationDoctor[] = [
  {
    id: 'DOC-101',
    name: 'Dr. Jim',
    speciality: 'Senior Consultant Physician & Cardiologist',
    rating: 4.9,
    experienceYears: 14,
    languages: ['English', 'Tamil', 'Hindi'],
    hospital: 'Medicare Multi-Specialty Hospital',
    avatarUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    bio: 'Lead physician specializing in preventive cardiology, hypertension control, and digital health consultation.'
  },
  {
    id: 'DOC-102',
    name: 'Dr. Priya Sharma',
    speciality: 'Senior Interventional Cardiologist',
    rating: 4.95,
    experienceYears: 16,
    languages: ['English', 'Hindi'],
    hospital: 'Fortis Healthcare, Adyar',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78947?auto=format&fit=crop&w=600&q=80',
    bio: 'Lead Interventional Cardiologist specializing in preventive cardiology, angioplasty, and heart rhythm wellness.'
  },
  {
    id: 'DOC-103',
    name: 'Dr. Rajesh Kumar',
    speciality: 'Senior General Physician',
    rating: 4.85,
    experienceYears: 15,
    languages: ['English', 'Tamil', 'Hindi'],
    hospital: 'Apollo Hospital, Greams Road',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Renowned General Physician with 15+ years of clinical experience in diabetes, fever, and routine healthcare.'
  },
  {
    id: 'DOC-104',
    name: 'Dr. Meena Swaminathan',
    speciality: 'Senior Pediatrician & Child Health Specialist',
    rating: 4.9,
    experienceYears: 12,
    languages: ['English', 'Tamil'],
    hospital: 'Child Health Care Hospital, Egmore',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in child development, adolescent medicine, immunizations, and preventive pediatric health.'
  }
];

export const MOCK_CONSULTATION_DOCTOR: ConsultationDoctor = AVAILABLE_CONSULTATION_DOCTORS[0];

export const MOCK_CONSULTATION_APPOINTMENT: ConsultationAppointment = {
  id: 'APT-2026-00482',
  doctor: MOCK_CONSULTATION_DOCTOR,
  date: 'Today · Live Session',
  time: '11:30 AM',
  type: 'Video Consultation',
  status: 'In Progress',
  reason: 'Routine quarterly health checkup & blood sugar review'
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'MSG-1',
    sender: 'Doctor',
    senderName: 'Dr. Jim',
    text: 'Hello Helen! Welcome to your digital video consultation. How are you feeling today?',
    timestamp: '11:30 AM',
    isRead: true
  },
  {
    id: 'MSG-2',
    sender: 'Patient',
    senderName: 'Helen Persia',
    text: "Good morning Dr. Jim. I'm doing well! I wanted to review my recent vitals and blood sugar reports.",
    timestamp: '11:31 AM',
    isRead: true
  },
  {
    id: 'MSG-3',
    sender: 'Doctor',
    senderName: 'Dr. Jim',
    text: "Excellent Helen. I have your patient 360 records open on my console. Let's go over the parameters together.",
    timestamp: '11:32 AM',
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

export interface Doctor {
  id: string;
  name: string;
  speciality: string;
  photoUrl: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationCount: number;
  languages: string[];
  fee: number;
  availability: 'Available Today' | 'Available Tomorrow' | 'Next Available Mon';
  hospital: string;
  about: string;
  gender: 'Male' | 'Female';
}

export interface SpecialityItem {
  id: string;
  name: string;
  iconName: string;
  doctorCount: number;
  desc: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  speciality: string;
  date: string; // e.g. "2026-08-23" or "23 Aug 2026"
  time: string; // e.g. "10:30 AM"
  timestamp: number; // UNIX epoch timestamp for sorting/countdown
  type: 'Video' | 'In-Person';
  status: 'Confirmed' | 'Starting Soon' | 'Ready to Join' | 'Completed' | 'Cancelled';
  hospital: string;
  fee: number;
  reason?: string;
  notes?: string;
  reminderOffset?: string; // e.g. "15 minutes before"
  cancellationDate?: string;
  cancellationReason?: string;
}

export const MOCK_SPECIALITIES: SpecialityItem[] = [
  { id: 'gen', name: 'General Physician', iconName: 'Stethoscope', doctorCount: 32, desc: 'Primary health consultations, fever, vitals & routine checkups' },
  { id: 'cardio', name: 'Cardiology', iconName: 'HeartPulse', doctorCount: 24, desc: 'Heart care, blood pressure, ECG & cardiovascular health' },
  { id: 'derma', name: 'Dermatology', iconName: 'Sparkles', doctorCount: 18, desc: 'Skin, hair, acne, allergies & cosmetic health' },
  { id: 'pedia', name: 'Pediatrics', iconName: 'Baby', doctorCount: 15, desc: 'Child health, immunization, growth & pediatric care' },
  { id: 'ortho', name: 'Orthopedics', iconName: 'Activity', doctorCount: 20, desc: 'Bone, joint, spine, sports injuries & fracture care' },
  { id: 'ent', name: 'ENT', iconName: 'Ear', doctorCount: 12, desc: 'Ear, nose, throat, sinusitis & hearing evaluation' },
  { id: 'neuro', name: 'Neurology', iconName: 'Brain', doctorCount: 14, desc: 'Brain, nerves, migraine, stroke & spinal cord disorders' },
  { id: 'gynaec', name: 'Gynecology', iconName: 'UserCheck', doctorCount: 16, desc: 'Womens health, maternity & reproductive care' },
  { id: 'dental', name: 'Dentistry', iconName: 'Smile', doctorCount: 22, desc: 'Teeth cleaning, root canal, braces & oral hygiene' },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'DOC-101',
    name: 'Dr. Rajesh Kumar',
    speciality: 'General Physician',
    photoUrl: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    experienceYears: 14,
    rating: 4.9,
    reviewCount: 482,
    consultationCount: 1245,
    languages: ['English', 'Tamil', 'Hindi'],
    fee: 500,
    availability: 'Available Today',
    hospital: 'Apollo Hospital, Greams Road',
    gender: 'Male',
    about: 'Dr. Rajesh Kumar is a renowned Senior General Physician with 14+ years of clinical experience in preventative health, hypertension, diabetes management, and infectious disease care.'
  },
  {
    id: 'DOC-102',
    name: 'Dr. Priya Sharma',
    speciality: 'Cardiology',
    photoUrl: 'https://images.unsplash.com/photo-1594824813566-88855ce78947?auto=format&fit=crop&w=600&q=80',
    experienceYears: 16,
    rating: 4.95,
    reviewCount: 620,
    consultationCount: 1890,
    languages: ['English', 'Hindi'],
    fee: 800,
    availability: 'Available Today',
    hospital: 'Fortis Healthcare, Adyar',
    gender: 'Female',
    about: 'Dr. Priya Sharma is a lead Interventional Cardiologist specializing in preventive cardiology, coronary angioplasty, hypertension control, and lifestyle heart wellness.'
  },
  {
    id: 'DOC-103',
    name: 'Dr. Arun Kumar',
    speciality: 'Dermatology',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    experienceYears: 10,
    rating: 4.8,
    reviewCount: 310,
    consultationCount: 940,
    languages: ['English', 'Tamil'],
    fee: 650,
    availability: 'Available Tomorrow',
    hospital: 'Kauvery Hospital, Alwarpet',
    gender: 'Male',
    about: 'Dr. Arun Kumar is a certified Dermatologist and Trichologist specializing in laser treatments, eczema, acne management, and aesthetic dermatology.'
  },
  {
    id: 'DOC-104',
    name: 'Dr. Meena Swaminathan',
    speciality: 'Pediatrics',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    experienceYears: 12,
    rating: 4.88,
    reviewCount: 415,
    consultationCount: 1120,
    languages: ['English', 'Tamil', 'Telugu'],
    fee: 600,
    availability: 'Available Today',
    hospital: 'Apollo Childrens Hospital',
    gender: 'Female',
    about: 'Dr. Meena Swaminathan is a compassionate Pediatrician focusing on child nutrition, vaccination schedules, developmental milestones, and acute childhood illnesses.'
  },
  {
    id: 'DOC-105',
    name: 'Dr. Vikram Sethi',
    speciality: 'Orthopedics',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    experienceYears: 18,
    rating: 4.9,
    reviewCount: 540,
    consultationCount: 1530,
    languages: ['English', 'Hindi', 'Punjabi'],
    fee: 900,
    availability: 'Next Available Mon',
    hospital: 'MGM Healthcare',
    gender: 'Male',
    about: 'Dr. Vikram Sethi is a senior Orthopedic Surgeon expert in joint replacement, knee arthroscopy, sports injuries, and complex spine rehabilitations.'
  },
  {
    id: 'DOC-106',
    name: 'Dr. Ananya Roy',
    speciality: 'ENT',
    photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=600&q=80',
    experienceYears: 9,
    rating: 4.75,
    reviewCount: 220,
    consultationCount: 780,
    languages: ['English', 'Bengali', 'Hindi'],
    fee: 550,
    availability: 'Available Today',
    hospital: 'Sims Hospital, Vadapalani',
    gender: 'Female',
    about: 'Dr. Ananya Roy is an ENT specialist providing comprehensive treatment for allergic rhinitis, hearing disorders, snoring, and sinus endoscopic surgeries.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-2026-00482',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Rajesh Kumar',
    doctorPhoto: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    speciality: 'General Physician',
    date: '23 Aug 2026',
    time: '10:30 AM',
    timestamp: Date.now() + 6120000, // ~1 hr 42 min from now
    type: 'Video',
    status: 'Confirmed',
    hospital: 'Apollo Hospital, Greams Road',
    fee: 500,
    reason: 'Follow-up consultation for blood pressure vitals and lab test evaluation.',
    notes: 'Please keep previous CBC report ready for screen share.'
  },
  {
    id: 'APT-2026-00485',
    doctorId: 'DOC-102',
    doctorName: 'Dr. Priya Sharma',
    doctorPhoto: 'https://images.unsplash.com/photo-1594824813566-88855ce78947?auto=format&fit=crop&w=600&q=80',
    speciality: 'Cardiology',
    date: '25 Aug 2026',
    time: '11:00 AM',
    timestamp: Date.now() + 172800000,
    type: 'In-Person',
    status: 'Confirmed',
    hospital: 'Fortis Healthcare, Adyar',
    fee: 800,
    reason: 'Routine ECG review and cholesterol health checkup.'
  },
  {
    id: 'APT-2026-00488',
    doctorId: 'DOC-103',
    doctorName: 'Dr. Arun Kumar',
    doctorPhoto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    speciality: 'Dermatology',
    date: '28 Aug 2026',
    time: '03:30 PM',
    timestamp: Date.now() + 432000000,
    type: 'Video',
    status: 'Confirmed',
    hospital: 'Kauvery Hospital, Alwarpet',
    fee: 650,
    reason: 'Skin allergy assessment & prescription refill.'
  },
  // COMPLETED PAST APPOINTMENTS
  {
    id: 'APT-2026-00410',
    doctorId: 'DOC-101',
    doctorName: 'Dr. Rajesh Kumar',
    doctorPhoto: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
    speciality: 'General Physician',
    date: '18 Aug 2026',
    time: '10:00 AM',
    timestamp: Date.now() - 432000000,
    type: 'Video',
    status: 'Completed',
    hospital: 'Apollo Hospital',
    fee: 500,
    reason: 'Fever and viral cough evaluation.',
    notes: 'Prescribed Amoxicillin 500mg twice daily for 5 days.'
  },
  {
    id: 'APT-2026-00395',
    doctorId: 'DOC-104',
    doctorName: 'Dr. Meena Swaminathan',
    doctorPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    speciality: 'Pediatrics',
    date: '12 Aug 2026',
    time: '02:00 PM',
    timestamp: Date.now() - 950000000,
    type: 'In-Person',
    status: 'Completed',
    hospital: 'Apollo Childrens Hospital',
    fee: 600,
    reason: 'Child routine wellness checkup.'
  },
  {
    id: 'APT-2026-00360',
    doctorId: 'DOC-105',
    doctorName: 'Dr. Vikram Sethi',
    doctorPhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&auto=format&fit=crop&q=80',
    speciality: 'Orthopedics',
    date: '04 Aug 2026',
    time: '04:30 PM',
    timestamp: Date.now() - 1640000000,
    type: 'In-Person',
    status: 'Completed',
    hospital: 'MGM Healthcare',
    fee: 900,
    reason: 'Right knee joint pain consultation.'
  },
  // CANCELLED APPOINTMENTS
  {
    id: 'APT-2026-00430',
    doctorId: 'DOC-106',
    doctorName: 'Dr. Ananya Roy',
    doctorPhoto: 'https://images.unsplash.com/photo-1594824813566-88855ce78947?w=300&auto=format&fit=crop&q=80',
    speciality: 'ENT',
    date: '15 Aug 2026',
    time: '05:00 PM',
    timestamp: Date.now() - 690000000,
    type: 'Video',
    status: 'Cancelled',
    hospital: 'Sims Hospital',
    fee: 550,
    cancellationDate: '14 Aug 2026',
    cancellationReason: 'Schedule conflict with work commitment'
  },
  {
    id: 'APT-2026-00380',
    doctorId: 'DOC-103',
    doctorName: 'Dr. Arun Kumar',
    doctorPhoto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    speciality: 'Dermatology',
    date: '08 Aug 2026',
    time: '11:30 AM',
    timestamp: Date.now() - 1290000000,
    type: 'In-Person',
    status: 'Cancelled',
    hospital: 'Kauvery Hospital',
    fee: 650,
    cancellationDate: '07 Aug 2026',
    cancellationReason: 'Feeling better, symptom resolved'
  }
];

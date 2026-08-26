export interface HospitalReview {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface HospitalItem {
  id: string;
  name: string;
  type: 'Multispecialty Hospital' | 'General Hospital' | 'Government Hospital' | 'Clinic' | 'Diagnostic Centre' | 'Specialty Hospital' | 'Emergency Centre' | 'Dental Clinic';
  rating: number;
  reviewsCount: number;
  distance: string;
  distanceKm: number;
  status: 'Open Now' | '24 Hours' | 'Closed' | 'Opening Soon';
  emergencyCare: boolean;
  insuranceAccepted: 'Cashless Accepted' | 'Insurance Supported' | 'Self Pay';
  address: string;
  phone: string;
  openingHours: string;
  facilities: string[];
  specialties: string[];
  doctorsCount: number;
  bedsAvailable: number;
  lat: number; // For map representation
  lng: number; // For map representation
  imageUrl: string;
  reviewsList: HospitalReview[];
}

export interface HospitalFilterState {
  category: string;
  distanceRange: string; // 'Within 1 km', 'Within 3 km', 'Within 5 km', 'Within 10 km', 'Any Distance'
  minRating: string; // '4.5+', '4.0+', '3.5+', 'Any Rating'
  openNowOnly: boolean;
  emergencyOnly: boolean;
  sortBy: 'Nearest' | 'Top Rated' | 'Most Reviewed' | 'Recommended' | 'Alphabetical';
}

export const INITIAL_HOSPITALS: HospitalItem[] = [
  {
    id: 'HOSP-01',
    name: 'CityCare Multispecialty Hospital',
    type: 'Multispecialty Hospital',
    rating: 4.8,
    reviewsCount: 428,
    distance: '1.2 km',
    distanceKm: 1.2,
    status: '24 Hours',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '142 Healthcare Boulevard, Near Central Station, Chennai',
    phone: '+91 44 2234 5678',
    openingHours: 'Open 24 Hours • 7 Days a Week',
    facilities: ['ICU', '24x7 Pharmacy', 'Advanced Radiology', 'Cath Lab', 'Blood Bank', 'Ambulance', 'Wheelchair Access', 'Parking'],
    specialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Gastroenterology'],
    doctorsCount: 48,
    bedsAvailable: 18,
    lat: 40,
    lng: 45,
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&q=80',
    reviewsList: [
      { id: 'REV-1', patientName: 'Ramesh Patel', rating: 5, comment: 'Excellent emergency response team and clean ICU facilities.', date: '2 days ago' },
      { id: 'REV-2', patientName: 'Anitha Sharma', rating: 4.8, comment: 'Dr. Rajesh Kumar listened carefully and provided great cardiac consultation.', date: '1 week ago' }
    ]
  },
  {
    id: 'HOSP-02',
    name: 'Apex Super Specialty Hospital',
    type: 'Specialty Hospital',
    rating: 4.7,
    reviewsCount: 312,
    distance: '1.8 km',
    distanceKm: 1.8,
    status: '24 Hours',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '88 Medico Avenue, Anna Nagar, Chennai',
    phone: '+91 44 2456 7890',
    openingHours: 'Open 24 Hours • Emergency Care Active',
    facilities: ['Cardiac ICU', '24x7 Pharmacy', 'MRI / CT Scan', 'Dialysis Unit', 'Cafeteria'],
    specialties: ['Cardiology', 'Nephrology', 'Urology', 'Pulmonology', 'Oncology'],
    doctorsCount: 36,
    bedsAvailable: 12,
    lat: 55,
    lng: 60,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
    reviewsList: [
      { id: 'REV-3', patientName: 'Vikram Singh', rating: 4.7, comment: 'Prompt cashless claim processing and top nephrologists.', date: '3 days ago' }
    ]
  },
  {
    id: 'HOSP-03',
    name: 'Apollo Shine Children & Women Hospital',
    type: 'Multispecialty Hospital',
    rating: 4.9,
    reviewsCount: 520,
    distance: '2.4 km',
    distanceKm: 2.4,
    status: 'Open Now',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '25 Maternity Lane, T. Nagar, Chennai',
    phone: '+91 44 2812 3456',
    openingHours: '07:00 AM – 10:00 PM • Emergency 24x7',
    facilities: ['NICU', 'Pediatric ICU', 'Maternity Suites', '24x7 Pharmacy', 'Vaccination Clinic'],
    specialties: ['Pediatrics', 'Gynecology', 'Obstetrics', 'Pediatric Surgery', 'Neonatology'],
    doctorsCount: 28,
    bedsAvailable: 15,
    lat: 30,
    lng: 70,
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&q=80',
    reviewsList: [
      { id: 'REV-4', patientName: 'Priya Narayanan', rating: 5, comment: 'Caring pediatric staff and pleasant maternity suites.', date: 'Yesterday' }
    ]
  },
  {
    id: 'HOSP-04',
    name: 'Metro Heart & Vascular Institute',
    type: 'Specialty Hospital',
    rating: 4.8,
    reviewsCount: 284,
    distance: '3.1 km',
    distanceKm: 3.1,
    status: '24 Hours',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '56 Cardiac Ring Road, Velachery, Chennai',
    phone: '+91 44 2255 1122',
    openingHours: 'Open 24 Hours',
    facilities: ['Hybrid Cath Lab', 'Cardiovascular ICU', 'Cardiac Ambulance', 'Blood Bank'],
    specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Vascular Surgery'],
    doctorsCount: 22,
    bedsAvailable: 8,
    lat: 65,
    lng: 35,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80',
    reviewsList: [
      { id: 'REV-5', patientName: 'Karthik Subramanian', rating: 4.8, comment: 'World class cardiac care and immediate ECG screening.', date: '4 days ago' }
    ]
  },
  {
    id: 'HOSP-05',
    name: 'Grace Dental & Oral Surgery Clinic',
    type: 'Dental Clinic',
    rating: 4.6,
    reviewsCount: 195,
    distance: '1.1 km',
    distanceKm: 1.1,
    status: 'Open Now',
    emergencyCare: false,
    insuranceAccepted: 'Insurance Supported',
    address: '12 Smile Arcade, Selaiyur, Chennai',
    phone: '+91 44 2229 4455',
    openingHours: '09:00 AM – 08:30 PM • Mon to Sat',
    facilities: ['3D Dental X-Ray', 'Sterilization Lab', 'Wheelchair Access'],
    specialties: ['Dental', 'Orthodontics', 'Implants', 'Pediatric Dentistry'],
    doctorsCount: 6,
    bedsAvailable: 0,
    lat: 35,
    lng: 30,
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&q=80',
    reviewsList: [
      { id: 'REV-6', patientName: 'Sneha Roy', rating: 4.6, comment: 'Painless root canal treatment and friendly dentists.', date: '5 days ago' }
    ]
  },
  {
    id: 'HOSP-06',
    name: 'Green Valley Diagnostic & Imaging Center',
    type: 'Diagnostic Centre',
    rating: 4.5,
    reviewsCount: 210,
    distance: '0.8 km',
    distanceKm: 0.8,
    status: 'Open Now',
    emergencyCare: false,
    insuranceAccepted: 'Insurance Supported',
    address: '5 Lab Park Street, Camp Road, Chennai',
    phone: '+91 44 2277 8899',
    openingHours: '06:30 AM – 09:00 PM • Daily',
    facilities: ['1.5T MRI', '128-Slice CT', 'Ultrasound', 'Automated Pathology', 'Home Sample Pickup'],
    specialties: ['Diagnostics', 'Radiology', 'Pathology', 'Health Screening'],
    doctorsCount: 12,
    bedsAvailable: 0,
    lat: 48,
    lng: 42,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80',
    reviewsList: [
      { id: 'REV-7', patientName: 'Deepak V.', rating: 4.5, comment: 'Quick blood test sample collection and digital PDF reports in 4 hours.', date: '1 week ago' }
    ]
  },
  {
    id: 'HOSP-07',
    name: 'National Orthopedic & Spine Rehab Institute',
    type: 'Specialty Hospital',
    rating: 4.7,
    reviewsCount: 260,
    distance: '3.8 km',
    distanceKm: 3.8,
    status: 'Open Now',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '99 Bone & Joint Drive, Guindy, Chennai',
    phone: '+91 44 2250 9900',
    openingHours: '08:00 AM – 08:00 PM • Emergency 24x7',
    facilities: ['Robotic Joint Replacement', 'Physiotherapy Center', 'Hydrotherapy', '24x7 Pharmacy'],
    specialties: ['Orthopedics', 'Spine Surgery', 'Sports Medicine', 'Physiotherapy'],
    doctorsCount: 18,
    bedsAvailable: 20,
    lat: 72,
    lng: 50,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    reviewsList: [
      { id: 'REV-8', patientName: 'Sanjay Kumar', rating: 4.8, comment: 'Top knee replacement surgery unit and rehab specialists.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'HOSP-08',
    name: 'Lifeline 24x7 Emergency Trauma Center',
    type: 'Emergency Centre',
    rating: 4.8,
    reviewsCount: 390,
    distance: '1.5 km',
    distanceKm: 1.5,
    status: '24 Hours',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '1 Emergency Highway, Tambaram, Chennai',
    phone: '+91 44 2222 0000',
    openingHours: 'Open 24 Hours • Priority Emergency Bay',
    facilities: ['Trauma ICU', 'Advanced Life Support Ambulance', 'Blood Bank', 'Helipad'],
    specialties: ['Emergency Medicine', 'Trauma Surgery', 'Critical Care'],
    doctorsCount: 30,
    bedsAvailable: 10,
    lat: 50,
    lng: 25,
    imageUrl: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=600&q=80',
    reviewsList: [
      { id: 'REV-9', patientName: 'Meena R.', rating: 5, comment: 'Rapid ambulance triage and immediate trauma care doctor.', date: '3 days ago' }
    ]
  },
  {
    id: 'HOSP-09',
    name: 'CareFirst Polyclinic & Family Wellness',
    type: 'Clinic',
    rating: 4.4,
    reviewsCount: 140,
    distance: '0.9 km',
    distanceKm: 0.9,
    status: 'Open Now',
    emergencyCare: false,
    insuranceAccepted: 'Insurance Supported',
    address: '44 Neighborhood Mall Road, Medavakkam, Chennai',
    phone: '+91 44 2277 3311',
    openingHours: '08:30 AM – 08:30 PM • Daily',
    facilities: ['ECG', 'Nebulization', 'Minor OT', 'Basic Pharmacy'],
    specialties: ['General Medicine', 'ENT', 'Dermatology', 'Diabetology'],
    doctorsCount: 8,
    bedsAvailable: 0,
    lat: 38,
    lng: 52,
    imageUrl: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&q=80',
    reviewsList: [
      { id: 'REV-10', patientName: 'Girish Chandra', rating: 4.4, comment: 'Convenient neighborhood clinic for quick fever & BP checks.', date: '6 days ago' }
    ]
  },
  {
    id: 'HOSP-10',
    name: 'Sanjeevani Ayurvedic & Integrative Care',
    type: 'General Hospital',
    rating: 4.5,
    reviewsCount: 165,
    distance: '4.2 km',
    distanceKm: 4.2,
    status: 'Open Now',
    emergencyCare: false,
    insuranceAccepted: 'Self Pay',
    address: '7 Herb Garden Road, Chromepet, Chennai',
    phone: '+91 44 2244 6677',
    openingHours: '08:00 AM – 07:00 PM • Mon to Sat',
    facilities: ['Panchakarma Center', 'Yoga Studio', 'Herbal Pharmacy', 'Dietary Wellness'],
    specialties: ['General Medicine', 'Ayurveda', 'Integrative Care', 'Rehabilitation'],
    doctorsCount: 10,
    bedsAvailable: 12,
    lat: 80,
    lng: 65,
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&q=80',
    reviewsList: [
      { id: 'REV-11', patientName: 'Revathi S.', rating: 4.5, comment: 'Peaceful environment and natural joint wellness therapies.', date: '2 weeks ago' }
    ]
  },
  {
    id: 'HOSP-11',
    name: 'VisionCare Eye Speciality Institute',
    type: 'Specialty Hospital',
    rating: 4.7,
    reviewsCount: 290,
    distance: '2.9 km',
    distanceKm: 2.9,
    status: 'Open Now',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '18 Retina Avenue, Adyar, Chennai',
    phone: '+91 44 2444 8822',
    openingHours: '08:30 AM – 07:30 PM • Ocular Emergency 24x7',
    facilities: ['Femto LASIK OT', 'Retina Diagnostics', 'Glaucoma Lab', 'Optical Store'],
    specialties: ['Ophthalmology', 'Cataract', 'Retina', 'Pediatric Ophthalmology'],
    doctorsCount: 14,
    bedsAvailable: 6,
    lat: 25,
    lng: 55,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&q=80',
    reviewsList: [
      { id: 'REV-12', patientName: 'Alok Gupta', rating: 4.8, comment: 'Quick LASIK consultation and state-of-the-art eye testing equipment.', date: '1 week ago' }
    ]
  },
  {
    id: 'HOSP-12',
    name: 'Government District Headquarter Hospital',
    type: 'Government Hospital',
    rating: 4.2,
    reviewsCount: 450,
    distance: '3.5 km',
    distanceKm: 3.5,
    status: '24 Hours',
    emergencyCare: true,
    insuranceAccepted: 'Cashless Accepted',
    address: '1 Civic Health Road, Saidapet, Chennai',
    phone: '+91 44 2433 1111',
    openingHours: 'Open 24 Hours • Free ABDM Care',
    facilities: ['24x7 Emergency', 'Free Pharmacy', 'Blood Bank', 'Dialysis Wing', 'Immunization'],
    specialties: ['General Medicine', 'General Surgery', 'Pediatrics', 'Obstetrics', 'Orthopedics'],
    doctorsCount: 52,
    bedsAvailable: 40,
    lat: 60,
    lng: 75,
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
    reviewsList: [
      { id: 'REV-13', patientName: 'Sundar M.', rating: 4.2, comment: 'Dedicated doctors and free ABDM digital record integration.', date: '5 days ago' }
    ]
  }
];

export const HOSPITAL_CATEGORIES = [
  'All',
  'Hospitals',
  'Clinics',
  'Emergency',
  'Diagnostics',
  'Pharmacy',
  'Dental',
  'Specialists'
];

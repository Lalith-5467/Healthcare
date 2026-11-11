// Central Mock Data Store for Admin & Super Admin Management Console

export interface HospitalAdminRecord {
  id: string;
  hospitalId: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  contactPhone: string;
  email: string;
  adminName: string;
  adminEmail: string;
  bedCapacity: number;
  activeDoctors: number;
  activeNurses: number;
  activePatients: number;
  activePharmacists: number;
  activeCaregivers: number;
  insurancePartnersCount: number;
  status: 'Active' | 'Under Review' | 'Suspended';
  establishedYear: number;
  accreditation: string;
  departments: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Patient' | 'Doctor' | 'Nurse' | 'Pharmacist' | 'Caregiver' | 'Insurance' | 'Admin' | 'Super Admin';
  department: string;
  hospital?: string;
  status: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  lastLogin: string;
  createdDate: string;
  avatar?: string;
  abhaId?: string;
}

export interface PatientAdminRecord {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  bloodGroup: string;
  assignedDoctor: string;
  hospital?: string;
  status: 'Active' | 'Discharged' | 'Critical' | 'Disabled';
  lastVisit: string;
  abhaId: string;
  admittedWard?: string;
}

export interface DoctorAdminRecord {
  id: string;
  doctorId: string;
  name: string;
  specialization: string;
  department: string;
  hospital?: string;
  email: string;
  phone: string;
  nmcRegNo: string;
  status: 'Active' | 'On Leave' | 'Suspended';
  assignedPatients: number;
  lastLogin: string;
}

export interface NurseAdminRecord {
  id: string;
  nurseId: string;
  name: string;
  department: string;
  hospital?: string;
  shift: 'Morning (Shift A)' | 'Evening (Shift B)' | 'Night (Shift C)';
  email: string;
  phone: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  assignedPatients: number;
  councilRegNo: string;
}

export interface PharmacistAdminRecord {
  id: string;
  pharmacistId: string;
  name: string;
  dispensary: string;
  hospital: string;
  email: string;
  phone: string;
  councilRegNo: string;
  status: 'Active' | 'Suspended';
  assignedOrders: number;
}

export interface CaregiverAdminRecord {
  id: string;
  caregiverId: string;
  name: string;
  specialty: string;
  hospital: string;
  email: string;
  phone: string;
  certificationId: string;
  status: 'Active' | 'Suspended';
  assignedPatients: number;
}

export interface PharmacyOrderAdminRecord {
  id: string;
  orderId: string;
  patientName: string;
  patientId: string;
  prescriptionId: string;
  pharmacyName: string;
  pharmacistName: string;
  orderDate: string;
  totalAmount: number;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Declined';
  lastUpdated: string;
}

export interface InsuranceAdminRecord {
  id: string;
  policyId: string;
  patientName: string;
  patientId: string;
  provider: string;
  hospital?: string;
  policyType: 'Comprehensive Health' | 'Senior Citizen' | 'Critical Illness' | 'Corporate Group';
  coverageAmount: number;
  expiryDate: string;
  verificationStatus: 'Active' | 'Pending' | 'Expired' | 'Verified' | 'Rejected';
  cashlessPreAuth: boolean;
}

export interface MedicalRecordAdminRecord {
  id: string;
  recordId: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  recordType: 'Consultation' | 'Diagnosis' | 'Prescription' | 'Lab Report' | 'Scan Report' | 'Discharge Summary';
  createdDate: string;
  lastUpdated: string;
  accessStatus: 'Restricted (ABHA Consent)' | 'Public Health' | 'Emergency Access';
  fileSize: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  module: 'User Auth' | 'EHR Records' | 'Prescription' | 'Pharmacy' | 'Insurance' | 'System Settings' | 'Security';
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed' | 'Blocked';
}

export interface AdminSecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'Failed Login Attempt' | 'Suspicious IP Geolocation' | 'Role Escalation' | 'Mass Export Attempt' | 'Consent Revocation';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  source: string;
  actor: string;
  status: 'Investigating' | 'Resolved' | 'Blocked';
}

export const INITIAL_HOSPITALS: HospitalAdminRecord[] = [
  {
    id: 'HOSP-01',
    hospitalId: 'HOSP-MC-001',
    name: 'MediCare Central Hospital',
    code: 'MC-BLR',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '42 Health City Boulevard, Electronic City Phase 1, Bengaluru 560100',
    contactPhone: '+91 80 2841 0000',
    email: 'info@medicare-central.in',
    adminName: 'Dr. Ramesh Narayan',
    adminEmail: 'hospital.admin@medicare-central.in',
    bedCapacity: 450,
    activeDoctors: 48,
    activeNurses: 92,
    activePatients: 310,
    activePharmacists: 14,
    activeCaregivers: 22,
    insurancePartnersCount: 16,
    status: 'Active',
    establishedYear: 2012,
    accreditation: 'NABH & JCI Accredited',
    departments: ['Cardiology', 'Pulmonology & Chest Medicine', 'Endocrinology', 'Emergency & Trauma ICU', 'Pediatrics', 'Neurology', 'Central Pharmacy']
  },
  {
    id: 'HOSP-02',
    hospitalId: 'HOSP-APO-002',
    name: 'Apollo Central Hub',
    code: 'APO-CHN',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '21 Greams Lane, Thousand Lights, Chennai 600006',
    contactPhone: '+91 44 2829 0200',
    email: 'contact@apollocentral.in',
    adminName: 'Kavita Sundaram',
    adminEmail: 'admin.kavita@apollocentral.in',
    bedCapacity: 600,
    activeDoctors: 64,
    activeNurses: 130,
    activePatients: 480,
    activePharmacists: 18,
    activeCaregivers: 30,
    insurancePartnersCount: 22,
    status: 'Active',
    establishedYear: 2008,
    accreditation: 'NABH Gold Standard',
    departments: ['Oncology', 'Organ Transplant', 'Cardiology', 'Pulmonology', 'Critical Care', 'Orthopedics', 'Outpatient Pharmacy']
  },
  {
    id: 'HOSP-03',
    hospitalId: 'HOSP-FOR-003',
    name: 'Fortis Memorial Healthcare',
    code: 'FOR-DEL',
    city: 'New Delhi',
    state: 'Delhi NCR',
    address: 'Sector 44, Institutional Area, Opp HUDA City Centre, Gurugram 122002',
    contactPhone: '+91 124 496 2200',
    email: 'care@fortismemorial.in',
    adminName: 'Sanjay Deshmukh',
    adminEmail: 'admin@fortismemorial.in',
    bedCapacity: 380,
    activeDoctors: 36,
    activeNurses: 78,
    activePatients: 240,
    activePharmacists: 10,
    activeCaregivers: 15,
    insurancePartnersCount: 18,
    status: 'Active',
    establishedYear: 2015,
    accreditation: 'NABH Accredited & ISO 9001:2015',
    departments: ['Neurosurgery', 'Cardiology', 'Pediatrics & Neonatology', 'Emergency & Trauma', 'Robotic Surgery']
  },
  {
    id: 'HOSP-04',
    hospitalId: 'HOSP-MAN-004',
    name: 'Manipal Multi-Specialty Hospital',
    code: 'MAN-HYD',
    city: 'Hyderabad',
    state: 'Telangana',
    address: 'Road No. 2, Banjara Hills, Hyderabad 500034',
    contactPhone: '+91 40 2338 8888',
    email: 'info@manipalhyderabad.in',
    adminName: 'Dr. Priya Venu',
    adminEmail: 'admin@manipalhyderabad.in',
    bedCapacity: 500,
    activeDoctors: 52,
    activeNurses: 110,
    activePatients: 390,
    activePharmacists: 15,
    activeCaregivers: 20,
    insurancePartnersCount: 20,
    status: 'Active',
    establishedYear: 2011,
    accreditation: 'NABH & NABL Accredited',
    departments: ['Gastroenterology', 'Nephrology & Dialysis', 'Cardiology', 'General OPD', 'Trauma Care']
  }
];

export const getStoredHospitals = (): HospitalAdminRecord[] => {
  try {
    const raw = localStorage.getItem('admin_hospitals_store');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_HOSPITALS;
};

export const saveStoredHospitals = (hospitals: HospitalAdminRecord[]): void => {
  try {
    localStorage.setItem('admin_hospitals_store', JSON.stringify(hospitals));
    window.dispatchEvent(new Event('admin_hospitals_updated'));
  } catch {}
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  { id: 'USR-1001', name: 'Ragul Kumar', email: 'ragul.kumar@abdm.in', phone: '+91 98401 23456', role: 'Patient', department: 'General OPD', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: '10 mins ago', createdDate: '12 Jan 2026', abhaId: '91-8472-9104-5821' },
  { id: 'USR-1002', name: 'Dr. Rajesh Varma', email: 'dr.rajesh@apollocentral.in', phone: '+91 98402 34567', role: 'Doctor', department: 'Pulmonology', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: '2 mins ago', createdDate: '05 Jan 2026' },
  { id: 'USR-1003', name: 'Nurse Sarah Jenkins', email: 'sarah.nurse@hospital.in', phone: '+91 98403 45678', role: 'Nurse', department: 'Emergency & Trauma', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: '25 mins ago', createdDate: '08 Jan 2026' },
  { id: 'USR-1004', name: 'Suresh Nair', email: 'pharmacist@apollocentral.in', phone: '+91 98404 56789', role: 'Pharmacist', department: 'Central Dispensary', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: '1 hour ago', createdDate: '15 Jan 2026' },
  { id: 'USR-1005', name: 'Anita Sharma', email: 'anita.caregiver@abdm.in', phone: '+91 98405 67890', role: 'Caregiver', department: 'Elderly Homecare', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: '3 hours ago', createdDate: '20 Jan 2026' },
  { id: 'USR-1006', name: 'Rohan Mehra', email: 'rohan.tpa@starhealth.in', phone: '+91 98406 78901', role: 'Insurance', department: 'Cashless TPA Desk', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: '45 mins ago', createdDate: '18 Jan 2026' },
  { id: 'USR-1007', name: 'Kavita Sundaram', email: 'admin.kavita@dhr-medicare.in', phone: '+91 98407 89012', role: 'Admin', department: 'Hospital Administration', hospital: 'Apollo Central Hub', status: 'Active', lastLogin: 'Just now', createdDate: '01 Jan 2026' },
  { id: 'USR-1008', name: 'Vikramaditya Rao', email: 'superadmin@dhr-medicare.in', phone: '+91 98408 90123', role: 'Super Admin', department: 'National Health Directorate', hospital: 'MediCare Central Hospital', status: 'Active', lastLogin: 'Just now', createdDate: '01 Jan 2026' },
  { id: 'USR-1009', name: 'Abinesh Kumar', email: 'abinesh.k@abdm.in', phone: '+91 98409 01234', role: 'Patient', department: 'Cardiology OPD', hospital: 'Apollo Central Hub', status: 'Active', lastLogin: 'Yesterday', createdDate: '02 Feb 2026', abhaId: '91-8842-5921-1029' },
  { id: 'USR-1010', name: 'Dr. Anita Desai', email: 'anita.desai@apollocentral.in', phone: '+91 98410 12345', role: 'Doctor', department: 'Endocrinology', hospital: 'Apollo Central Hub', status: 'Active', lastLogin: '2 hours ago', createdDate: '10 Jan 2026' },
  { id: 'USR-1011', name: 'Deepak Verma', email: 'deepak.v@hospital.in', phone: '+91 98411 23456', role: 'Patient', department: 'Neurology', hospital: 'Fortis Memorial Healthcare', status: 'Suspended', lastLogin: '5 days ago', createdDate: '14 Feb 2026' }
];

export const INITIAL_PATIENTS: PatientAdminRecord[] = [
  { id: 'PAT-01', patientId: 'MC-10245', name: 'Abinesh Kumar', age: 34, gender: 'Male', phone: '+91 98409 01234', bloodGroup: 'O+', assignedDoctor: 'Dr. Rajesh Varma', hospital: 'MediCare Central Hospital', status: 'Active', lastVisit: '01 Sep 2026', abhaId: '91-8842-5921-1029', admittedWard: 'Ward 4B (Bed 12)' },
  { id: 'PAT-02', patientId: 'MC-10246', name: 'Ragul Kumar', age: 34, gender: 'Male', phone: '+91 98401 23456', bloodGroup: 'O+', assignedDoctor: 'Dr. Rajesh Varma', hospital: 'MediCare Central Hospital', status: 'Active', lastVisit: '31 Aug 2026', abhaId: '91-8472-9104-5821' },
  { id: 'PAT-03', patientId: 'MC-10247', name: 'Meenakshi Sundaram', age: 58, gender: 'Female', phone: '+91 98412 34567', bloodGroup: 'B+', assignedDoctor: 'Dr. Anita Desai', hospital: 'Apollo Central Hub', status: 'Critical', lastVisit: '01 Sep 2026', abhaId: '91-7719-3382-4401', admittedWard: 'ICU Stepdown (Bed 04)' },
  { id: 'PAT-04', patientId: 'MC-10248', name: 'Priya Narayanan', age: 29, gender: 'Female', phone: '+91 98413 45678', bloodGroup: 'A+', assignedDoctor: 'Dr. Rajesh Varma', hospital: 'Fortis Memorial Healthcare', status: 'Active', lastVisit: '28 Aug 2026', abhaId: '91-3321-4491-0023' },
  { id: 'PAT-05', patientId: 'MC-10249', name: 'Karthik Raja', age: 46, gender: 'Male', phone: '+91 98414 56789', bloodGroup: 'AB+', assignedDoctor: 'Dr. Anita Desai', hospital: 'Manipal Multi-Specialty Hospital', status: 'Discharged', lastVisit: '25 Aug 2026', abhaId: '91-5542-8812-7731' }
];

export const INITIAL_DOCTORS: DoctorAdminRecord[] = [
  { id: 'DOC-01', doctorId: 'DR-8941', name: 'Dr. Rajesh Varma', specialization: 'Pulmonologist & Critical Care', department: 'Pulmonology & Chest Medicine', hospital: 'MediCare Central Hospital', email: 'dr.rajesh@apollocentral.in', phone: '+91 98402 34567', nmcRegNo: 'NMC-74829-KA', status: 'Active', assignedPatients: 42, lastLogin: '2 mins ago' },
  { id: 'DOC-02', doctorId: 'DR-8942', name: 'Dr. Anita Desai', specialization: 'Consultant Diabetologist', department: 'Endocrinology', hospital: 'Apollo Central Hub', email: 'anita.desai@apollocentral.in', phone: '+91 98410 12345', nmcRegNo: 'NMC-66102-MH', status: 'Active', assignedPatients: 38, lastLogin: '2 hours ago' },
  { id: 'DOC-03', doctorId: 'DR-8943', name: 'Dr. Arvind Swaminathan', specialization: 'Senior Cardiothoracic Surgeon', department: 'Cardiology', hospital: 'Fortis Memorial Healthcare', email: 'arvind.cardio@apollocentral.in', phone: '+91 98415 67890', nmcRegNo: 'NMC-55910-DL', status: 'Active', assignedPatients: 29, lastLogin: '1 hour ago' },
  { id: 'DOC-04', doctorId: 'DR-8944', name: 'Dr. Sneha Pillai', specialization: 'Pediatric Specialist', department: 'Pediatrics', hospital: 'Manipal Multi-Specialty Hospital', email: 'sneha.p@apollocentral.in', phone: '+91 98416 78901', nmcRegNo: 'NMC-88310-TN', status: 'On Leave', assignedPatients: 14, lastLogin: '2 days ago' }
];

export const INITIAL_NURSES: NurseAdminRecord[] = [
  { id: 'NUR-01', nurseId: 'RN-88421', name: 'Nurse Sarah Jenkins', department: 'Emergency & Trauma ICU', hospital: 'MediCare Central Hospital', shift: 'Morning (Shift A)', email: 'sarah.nurse@hospital.in', phone: '+91 98403 45678', status: 'On Duty', assignedPatients: 8, councilRegNo: 'KNC-88421-RN' },
  { id: 'NUR-02', nurseId: 'RN-88422', name: 'Nurse Lakshmi Priya', department: 'In-Patient General Ward', hospital: 'Apollo Central Hub', shift: 'Evening (Shift B)', email: 'lakshmi.nurse@hospital.in', phone: '+91 98417 89012', status: 'On Duty', assignedPatients: 14, councilRegNo: 'TNC-77210-RN' },
  { id: 'NUR-03', nurseId: 'RN-88423', name: 'Nurse Mary D\'Souza', department: 'Cardiology Step-Down', hospital: 'Fortis Memorial Healthcare', shift: 'Night (Shift C)', email: 'mary.dsouza@hospital.in', phone: '+91 98418 90123', status: 'Off Duty', assignedPatients: 6, councilRegNo: 'MNC-99140-RN' }
];

export const INITIAL_PHARMACISTS: PharmacistAdminRecord[] = [
  { id: 'PHARM-01', pharmacistId: 'PH-4421', name: 'Suresh Nair', dispensary: 'Central Dispensary & OPD Pharmacy', hospital: 'MediCare Central Hospital', email: 'pharmacist@apollocentral.in', phone: '+91 98404 56789', councilRegNo: 'PCI-90241-TN', status: 'Active', assignedOrders: 18 },
  { id: 'PHARM-02', pharmacistId: 'PH-4422', name: 'Arun Kumar', dispensary: 'MedLife Express Dispensary', hospital: 'Apollo Central Hub', email: 'arun.pharma@medlife.in', phone: '+91 98419 01234', councilRegNo: 'PCI-77120-KA', status: 'Active', assignedOrders: 24 },
  { id: 'PHARM-03', pharmacistId: 'PH-4423', name: 'Divya Krishnan', dispensary: 'Emergency Trauma Pharmacy', hospital: 'MediCare Central Hospital', email: 'divya.pharma@hospital.in', phone: '+91 98420 12345', councilRegNo: 'PCI-66290-MH', status: 'Active', assignedOrders: 12 }
];

export const INITIAL_CAREGIVERS: CaregiverAdminRecord[] = [
  { id: 'CG-01', caregiverId: 'CG-991', name: 'Anita Sharma', specialty: 'Elderly Homecare & Geriatric Care', hospital: 'MediCare Central Hospital', email: 'anita.caregiver@abdm.in', phone: '+91 98405 67890', certificationId: 'CG-CERT-5819', status: 'Active', assignedPatients: 4 },
  { id: 'CG-02', caregiverId: 'CG-992', name: 'Ramesh Babu', specialty: 'Post-Op Physical Rehabilitation', hospital: 'MediCare Central Hospital', email: 'ramesh.caregiver@abdm.in', phone: '+91 98421 23456', certificationId: 'CG-CERT-6620', status: 'Active', assignedPatients: 3 },
  { id: 'CG-03', caregiverId: 'CG-993', name: 'Sunita Patil', specialty: 'Palliative & Chronic Support', hospital: 'Apollo Central Hub', email: 'sunita.care@abdm.in', phone: '+91 98422 34567', certificationId: 'CG-CERT-8841', status: 'Active', assignedPatients: 5 }
];

export const INITIAL_PHARMACY_ORDERS: PharmacyOrderAdminRecord[] = [
  { id: 'ORD-01', orderId: 'ORD-9024', patientName: 'Abinesh Kumar', patientId: 'MC-10245', prescriptionId: 'RX-2026-8819', pharmacyName: 'Apollo Central Hub', pharmacistName: 'Suresh Nair', orderDate: '01 Sep 2026, 11:30 AM', totalAmount: 1624, status: 'Preparing', lastUpdated: '10 mins ago' },
  { id: 'ORD-02', orderId: 'ORD-9025', patientName: 'Ragul Kumar', patientId: 'MC-10246', prescriptionId: 'RX-2026-8820', pharmacyName: 'Apollo Central Hub', pharmacistName: 'Suresh Nair', orderDate: '01 Sep 2026, 10:15 AM', totalAmount: 873, status: 'Delivered', lastUpdated: '1 hour ago' },
  { id: 'ORD-03', orderId: 'ORD-9026', patientName: 'Meenakshi Sundaram', patientId: 'MC-10247', prescriptionId: 'RX-2026-8821', pharmacyName: 'MedLife Express Dispensary', pharmacistName: 'Arun Kumar', orderDate: '01 Sep 2026, 09:40 AM', totalAmount: 3192, status: 'Out for Delivery', lastUpdated: '25 mins ago' },
  { id: 'ORD-04', orderId: 'ORD-9027', patientName: 'Priya Narayanan', patientId: 'MC-10248', prescriptionId: 'RX-2026-8822', pharmacyName: 'Apollo Central Hub', pharmacistName: 'Suresh Nair', orderDate: '01 Sep 2026, 12:05 PM', totalAmount: 540, status: 'Pending', lastUpdated: '5 mins ago' }
];

export const INITIAL_INSURANCE_POLICIES: InsuranceAdminRecord[] = [
  { id: 'INS-01', policyId: 'POL-STAR-8819', patientName: 'Abinesh Kumar', patientId: 'MC-10245', provider: 'Star Health & Allied Insurance', hospital: 'MediCare Central Hospital', policyType: 'Comprehensive Health', coverageAmount: 1000000, expiryDate: '31 Mar 2027', verificationStatus: 'Verified', cashlessPreAuth: true },
  { id: 'INS-02', policyId: 'POL-HDFC-5520', patientName: 'Ragul Kumar', patientId: 'MC-10246', provider: 'HDFC ERGO General Insurance', hospital: 'MediCare Central Hospital', policyType: 'Corporate Group', coverageAmount: 750000, expiryDate: '31 Dec 2026', verificationStatus: 'Active', cashlessPreAuth: true },
  { id: 'INS-03', policyId: 'POL-CARE-3310', patientName: 'Meenakshi Sundaram', patientId: 'MC-10247', provider: 'Care Health Insurance', hospital: 'Apollo Central Hub', policyType: 'Senior Citizen', coverageAmount: 1500000, expiryDate: '15 Aug 2027', verificationStatus: 'Verified', cashlessPreAuth: true },
  { id: 'INS-04', policyId: 'POL-NIVA-9901', patientName: 'Deepak Verma', patientId: 'MC-10251', provider: 'Niva Bupa Health Insurance', hospital: 'Fortis Memorial Healthcare', policyType: 'Critical Illness', coverageAmount: 2500000, expiryDate: '01 Jan 2026', verificationStatus: 'Expired', cashlessPreAuth: false }
];

export const INITIAL_MEDICAL_RECORDS: MedicalRecordAdminRecord[] = [
  { id: 'REC-01', recordId: 'EHR-DOC-7712', patientName: 'Abinesh Kumar', patientId: 'MC-10245', doctorName: 'Dr. Rajesh Varma', recordType: 'Consultation', createdDate: '01 Sep 2026', lastUpdated: '01 Sep 2026, 10:45 AM', accessStatus: 'Restricted (ABHA Consent)', fileSize: '2.4 MB' },
  { id: 'REC-02', recordId: 'EHR-LAB-9931', patientName: 'Abinesh Kumar', patientId: 'MC-10245', doctorName: 'Dr. Rajesh Varma', recordType: 'Lab Report', createdDate: '30 Aug 2026', lastUpdated: '30 Aug 2026, 04:20 PM', accessStatus: 'Restricted (ABHA Consent)', fileSize: '1.1 MB' },
  { id: 'REC-03', recordId: 'EHR-RX-8840', patientName: 'Ragul Kumar', patientId: 'MC-10246', doctorName: 'Dr. Anita Desai', recordType: 'Prescription', createdDate: '31 Aug 2026', lastUpdated: '31 Aug 2026, 02:15 PM', accessStatus: 'Emergency Access', fileSize: '840 KB' },
  { id: 'REC-04', recordId: 'EHR-SCN-2210', patientName: 'Meenakshi Sundaram', patientId: 'MC-10247', doctorName: 'Dr. Arvind Swaminathan', recordType: 'Scan Report', createdDate: '28 Aug 2026', lastUpdated: '28 Aug 2026, 11:00 AM', accessStatus: 'Restricted (ABHA Consent)', fileSize: '18.6 MB' }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  { id: 'LOG-01', timestamp: '01 Sep 2026, 11:42 AM', userName: 'Dr. Rajesh Varma', userRole: 'Doctor', action: 'Issued e-Prescription (RX-2026-8819)', module: 'Prescription', ipAddress: '192.168.1.42 (Hospital LAN)', status: 'Success' },
  { id: 'LOG-02', timestamp: '01 Sep 2026, 11:35 AM', userName: 'Suresh Nair', userRole: 'Pharmacist', action: 'Accepted Dispensary Order (ORD-9024)', module: 'Pharmacy', ipAddress: '192.168.1.88 (Pharmacy POS)', status: 'Success' },
  { id: 'LOG-03', timestamp: '01 Sep 2026, 11:20 AM', userName: 'Nurse Sarah Jenkins', userRole: 'Nurse', action: 'Logged Bedside Vitals (SpO2 99%, BP 124/82)', module: 'EHR Records', ipAddress: '10.0.4.12 (Tablet)', status: 'Success' },
  { id: 'LOG-04', timestamp: '01 Sep 2026, 10:55 AM', userName: 'Rohan Mehra', userRole: 'Insurance', action: 'Verified Cashless Pre-Auth Claim (₹45,000)', module: 'Insurance', ipAddress: '49.207.18.91 (TPA Gateway)', status: 'Success' },
  { id: 'LOG-05', timestamp: '01 Sep 2026, 10:30 AM', userName: 'Vikramaditya Rao', userRole: 'Super Admin', action: 'Updated System Security Firewall Rules', module: 'System Settings', ipAddress: '10.0.0.1 (Secure Admin)', status: 'Success' },
  { id: 'LOG-06', timestamp: '01 Sep 2026, 09:15 AM', userName: 'Unknown Actor', userRole: 'Guest', action: '3 Failed Login Attempts for user admin@dhr.in', module: 'User Auth', ipAddress: '103.21.244.0 (External)', status: 'Blocked' }
];

export const INITIAL_SECURITY_EVENTS: AdminSecurityEvent[] = [
  { id: 'SEC-01', timestamp: '01 Sep 2026, 09:15 AM', eventType: 'Failed Login Attempt', severity: 'High', source: 'IP 103.21.244.0 (Brute force protection triggered)', actor: 'Unauthenticated Request', status: 'Blocked' },
  { id: 'SEC-02', timestamp: '31 Aug 2026, 08:40 PM', eventType: 'Suspicious IP Geolocation', severity: 'Medium', source: 'Attempted login from foreign CIDR range', actor: 'Doctor Account (Dr. Arvind)', status: 'Resolved' },
  { id: 'SEC-03', timestamp: '30 Aug 2026, 03:22 PM', eventType: 'Role Escalation', severity: 'Critical', source: 'Super Admin Panel audit log verification', actor: 'Super Admin (Vikramaditya Rao)', status: 'Resolved' },
  { id: 'SEC-04', timestamp: '29 Aug 2026, 11:10 AM', eventType: 'Mass Export Attempt', severity: 'Medium', source: 'Patient Registry CSV download rate limiter', actor: 'Admin (Kavita S.)', status: 'Resolved' }
];

export const DEFAULT_PERMISSION_MATRIX: Record<string, Record<string, boolean>> = {
  'View Patient Records': { 'Patient': true, 'Doctor': true, 'Nurse': true, 'Pharmacist': false, 'Caregiver': true, 'Insurance': false, 'Admin': true, 'Super Admin': true },
  'Edit Medical Records': { 'Patient': false, 'Doctor': true, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': false, 'Super Admin': true },
  'Create Prescription': { 'Patient': false, 'Doctor': true, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': false, 'Super Admin': true },
  'Dispense Medicines': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': true, 'Caregiver': false, 'Insurance': false, 'Admin': false, 'Super Admin': true },
  'Record Patient Vitals': { 'Patient': true, 'Doctor': true, 'Nurse': true, 'Pharmacist': false, 'Caregiver': true, 'Insurance': false, 'Admin': false, 'Super Admin': true },
  'Approve Insurance Claims': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': true, 'Admin': false, 'Super Admin': true },
  'Manage User Accounts': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': true, 'Super Admin': true },
  'Manage Administrator Roles': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': false, 'Super Admin': true },
  'Configure Security & Firewalls': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': false, 'Super Admin': true },
  'View Audit & Activity Logs': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': true, 'Super Admin': true },
  'Trigger System Backup': { 'Patient': false, 'Doctor': false, 'Nurse': false, 'Pharmacist': false, 'Caregiver': false, 'Insurance': false, 'Admin': false, 'Super Admin': true }
};

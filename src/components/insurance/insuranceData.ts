export interface InsurancePolicy {
  id: string;
  providerName: string;
  planName: string;
  policyNumber: string;
  policyHolder: string;
  policyType: 'Family Floater' | 'Individual' | 'Employer' | 'Government' | 'Senior Citizen';
  startDate: string;
  expiryDate: string;
  coverageAmount: number;
  usedAmount: number;
  remainingAmount: number;
  premiumAmount: number;
  premiumFrequency: string;
  status: 'Active' | 'Expiring Soon' | 'Expired' | 'Pending';
  memberId: string;
  isPrimary: boolean;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  hospitalName: string;
  treatmentType: 'Hospitalization' | 'Outpatient' | 'Diagnostic Tests' | 'Medicines' | 'Emergency Care';
  submittedDate: string;
  claimedAmount: number;
  approvedAmount: number;
  status: 'Approved' | 'Pending' | 'Under Review' | 'Rejected';
  documentsAttached: string[];
  timeline: {
    stage: string;
    date: string;
    completed: boolean;
    active: boolean;
  }[];
}

export interface InsuranceDocument {
  id: string;
  fileName: string;
  category: 'Policy Document' | 'Premium Receipt' | 'Claim Documents' | 'ID Proof' | 'Health Card' | 'Other';
  dateAdded: string;
  fileSize: string;
}

export interface FamilyMemberCoverage {
  id: string;
  memberName: string;
  relationship: 'Self' | 'Mother' | 'Father' | 'Spouse' | 'Sister' | 'Brother' | 'Child';
  status: 'Covered' | 'Pending' | 'Not Covered';
  coverageLimit: number;
  usedAmount: number;
}

export interface PremiumPaymentRecord {
  id: string;
  monthYear: string;
  amount: number;
  paymentDate: string;
  status: 'Paid' | 'Upcoming' | 'Overdue';
  receiptNumber: string;
}

export interface InsurancePlanOption {
  id: string;
  name: string;
  monthlyPremium: number;
  coverageAmount: number;
  hospitalization: string;
  outpatient: string;
  diagnostics: string;
  emergency: string;
  deductible: string;
  coPay: string;
}

export interface InsuranceFilterState {
  policyStatus: string;
  claimStatus: string;
  docCategory: string;
}

export const INITIAL_POLICIES: InsurancePolicy[] = [
  {
    id: 'POL-01',
    providerName: 'CarePlus Health Insurance',
    planName: 'Family Health Secure',
    policyNumber: 'HLT-XXXX-4582',
    policyHolder: 'Ragul Kumar',
    policyType: 'Family Floater',
    startDate: '01 Jan 2026',
    expiryDate: '31 Dec 2026',
    coverageAmount: 1000000,
    usedAmount: 240000,
    remainingAmount: 760000,
    premiumAmount: 2450,
    premiumFrequency: '/ month',
    status: 'Active',
    memberId: 'MEM-XXXX-7821',
    isPrimary: true
  },
  {
    id: 'POL-02',
    providerName: 'SecureLife Health Shield',
    planName: 'Personal Care Plan',
    policyNumber: 'SEC-XXXX-9812',
    policyHolder: 'Ragul Kumar',
    policyType: 'Individual',
    startDate: '16 Mar 2026',
    expiryDate: '15 Mar 2027',
    coverageAmount: 500000,
    usedAmount: 50000,
    remainingAmount: 450000,
    premiumAmount: 1200,
    premiumFrequency: '/ month',
    status: 'Active',
    memberId: 'MEM-XXXX-3341',
    isPrimary: false
  }
];

export const INITIAL_CLAIMS: InsuranceClaim[] = [
  {
    id: 'CLM-1024',
    claimNumber: 'CLM-1024',
    hospitalName: 'CityCare Multispecialty Hospital',
    treatmentType: 'Hospitalization',
    submittedDate: '15 Aug 2026',
    claimedAmount: 85000,
    approvedAmount: 85000,
    status: 'Approved',
    documentsAttached: ['Discharge_Summary.pdf', 'Hospital_Invoice_85K.pdf', 'Lab_Reports.pdf'],
    timeline: [
      { stage: 'Submitted', date: '15 Aug 2026', completed: true, active: false },
      { stage: 'Under Review', date: '16 Aug 2026', completed: true, active: false },
      { stage: 'Documents Verified', date: '17 Aug 2026', completed: true, active: false },
      { stage: 'Approved', date: '18 Aug 2026', completed: true, active: true },
      { stage: 'Payment Processed', date: '19 Aug 2026', completed: true, active: false }
    ]
  },
  {
    id: 'CLM-1025',
    claimNumber: 'CLM-1025',
    hospitalName: 'Green Valley Diagnostic Center',
    treatmentType: 'Diagnostic Tests',
    submittedDate: '20 Aug 2026',
    claimedAmount: 12500,
    approvedAmount: 0,
    status: 'Pending',
    documentsAttached: ['MRI_Bill_Receipt.pdf', 'Prescription_Scan.pdf'],
    timeline: [
      { stage: 'Submitted', date: '20 Aug 2026', completed: true, active: false },
      { stage: 'Under Review', date: '21 Aug 2026', completed: false, active: true },
      { stage: 'Documents Verified', date: 'Pending', completed: false, active: false },
      { stage: 'Approved', date: 'Pending', completed: false, active: false },
      { stage: 'Payment Processed', date: 'Pending', completed: false, active: false }
    ]
  },
  {
    id: 'CLM-1026',
    claimNumber: 'CLM-1026',
    hospitalName: 'Grace Dental & Oral Clinic',
    treatmentType: 'Outpatient',
    submittedDate: '10 Jul 2026',
    claimedAmount: 8000,
    approvedAmount: 8000,
    status: 'Approved',
    documentsAttached: ['Dental_Receipt.pdf'],
    timeline: [
      { stage: 'Submitted', date: '10 Jul 2026', completed: true, active: false },
      { stage: 'Under Review', date: '11 Jul 2026', completed: true, active: false },
      { stage: 'Documents Verified', date: '12 Jul 2026', completed: true, active: false },
      { stage: 'Approved', date: '13 Jul 2026', completed: true, active: true },
      { stage: 'Payment Processed', date: '14 Jul 2026', completed: true, active: false }
    ]
  }
];

export const INITIAL_DOCUMENTS: InsuranceDocument[] = [
  { id: 'DOC-1', fileName: 'CarePlus_Policy_Schedule_2026.pdf', category: 'Policy Document', dateAdded: '01 Jan 2026', fileSize: '2.4 MB' },
  { id: 'DOC-2', fileName: 'Premium_Receipt_Aug2026.pdf', category: 'Premium Receipt', dateAdded: '01 Aug 2026', fileSize: '450 KB' },
  { id: 'DOC-3', fileName: 'Claim_CLM1024_Settlement_Letter.pdf', category: 'Claim Documents', dateAdded: '19 Aug 2026', fileSize: '1.2 MB' },
  { id: 'DOC-4', fileName: 'Digital_Health_Card_Front.png', category: 'Health Card', dateAdded: '02 Jan 2026', fileSize: '880 KB' },
  { id: 'DOC-5', fileName: 'Aadhaar_ID_Proof_Card.pdf', category: 'ID Proof', dateAdded: '01 Jan 2026', fileSize: '1.1 MB' }
];

export const INITIAL_FAMILY_COVERAGE: FamilyMemberCoverage[] = [
  { id: 'FAM-1', memberName: 'Arun Kumar', relationship: 'Self', status: 'Covered', coverageLimit: 1000000, usedAmount: 140000 },
  { id: 'FAM-2', memberName: 'Priya Kumar', relationship: 'Mother', status: 'Covered', coverageLimit: 1000000, usedAmount: 60000 },
  { id: 'FAM-3', memberName: 'Ananya Kumar', relationship: 'Sister', status: 'Covered', coverageLimit: 1000000, usedAmount: 40000 },
  { id: 'FAM-4', memberName: 'Rahul Kumar', relationship: 'Brother', status: 'Covered', coverageLimit: 1000000, usedAmount: 0 }
];

export const INITIAL_PAYMENTS: PremiumPaymentRecord[] = [
  { id: 'PAY-1', monthYear: 'Aug 2026', amount: 2450, paymentDate: '01 Aug 2026', status: 'Paid', receiptNumber: 'REC-8841-AUG' },
  { id: 'PAY-2', monthYear: 'Jul 2026', amount: 2450, paymentDate: '01 Jul 2026', status: 'Paid', receiptNumber: 'REC-7412-JUL' },
  { id: 'PAY-3', monthYear: 'Jun 2026', amount: 2450, paymentDate: '01 Jun 2026', status: 'Paid', receiptNumber: 'REC-6209-JUN' }
];

export const SAMPLE_INSURANCE_PLANS: InsurancePlanOption[] = [
  {
    id: 'PLAN-01',
    name: 'Essential Care Shield',
    monthlyPremium: 1500,
    coverageAmount: 500000,
    hospitalization: '100% Cashless (up to ₹5 Lakhs)',
    outpatient: 'Up to ₹15,000 / year',
    diagnostics: '70% Covered at empanelled labs',
    emergency: '24x7 Ambulance Covered',
    deductible: '₹10,000 / year',
    coPay: '15%'
  },
  {
    id: 'PLAN-02',
    name: 'Family Health Secure (Active)',
    monthlyPremium: 2450,
    coverageAmount: 1000000,
    hospitalization: '100% Cashless (up to ₹10 Lakhs)',
    outpatient: 'Up to ₹35,000 / year',
    diagnostics: '80% Covered nationwide',
    emergency: '24x7 ALS Ambulance & ICU',
    deductible: '₹10,000 / year',
    coPay: '10%'
  },
  {
    id: 'PLAN-03',
    name: 'Premium Global Care Shield',
    monthlyPremium: 4200,
    coverageAmount: 2000000,
    hospitalization: '100% Unlimited Cashless',
    outpatient: 'Up to ₹75,000 / year',
    diagnostics: '100% Covered at any facility',
    emergency: 'Global Air Ambulance & ICU',
    deductible: 'Zero Deductible',
    coPay: '0% Co-pay'
  }
];

export const INSURANCE_FAQS = [
  {
    q: 'What medical services are covered under Family Health Secure?',
    a: 'Your policy covers 100% inpatient hospitalization, ICU room rent, day-care surgical procedures, 80% diagnostic lab tests, 24x7 emergency ambulance transport, and pre & post hospitalization expenses for up to 60 days.'
  },
  {
    q: 'How do I submit a cashless or reimbursement claim?',
    a: 'For cashless hospitalization, show your Digital Health Card at any network hospital admission desk. For reimbursement claims, click "Start New Claim" in this portal, upload your hospital bill invoices & discharge summary, and submit for instant verification.'
  },
  {
    q: 'When does my primary insurance policy expire?',
    a: 'Your primary CarePlus policy expires on 31 Dec 2026 (129 days remaining). You can set auto-renewal reminders or submit a demo renewal request directly from the policy card.'
  },
  {
    q: 'Can I add or remove family members from my policy?',
    a: 'Yes, Family Floater plans allow adding dependent parents, spouse, siblings, or children. Use the "+ Add Member to Policy" button in the Family Coverage section.'
  }
];

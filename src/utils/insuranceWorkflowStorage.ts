import { useState, useEffect } from 'react';

// Types for the insurance mock database
export interface InsuranceDocument {
  id: string;
  name: string;
  uploadDate: string;
  uploadedBy: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Missing';
}

export interface InsuranceTimelineEvent {
  id: string;
  date: string;
  time: string;
  action: string;
  role: string;
  status: 'Completed' | 'Current' | 'Pending';
}

export interface InsuranceClaim {
  claimId: string;
  insuranceId: string;
  patientId: string;
  hospital: string;
  treatment: string;
  admissionDate: string;
  dischargeDate: string;
  submittedAmount: number;
  approvedAmount: number;
  patientContribution: number;
  status: 'New' | 'Under Review' | 'Approved' | 'Partially Approved' | 'Rejected' | 'Settled';
  documents: InsuranceDocument[];
  timeline: InsuranceTimelineEvent[];
  preAuthCode?: string;
  settlementTxnId?: string;
  settlementDate?: string;
}

export interface InsurancePolicyRecord {
  insuranceId: string;
  patientId: string;
  patientName: string;
  policyNumber: string;
  policyName: string;
  policyStatus: 'Active' | 'Inactive' | 'Expired';
  policyStartDate: string;
  policyEndDate: string;
  coverageAmount: number;
  usedCoverage: number;
  remainingCoverage: number;
  benefits: {
    hospitalization: 'Covered' | 'Partial' | 'Not Covered';
    emergency: 'Covered' | 'Partial' | 'Not Covered';
    consultation: 'Covered' | 'Partial' | 'Not Covered';
    diagnostics: 'Covered' | 'Partial' | 'Not Covered';
    medicines: 'Covered' | 'Partial' | 'Not Covered';
    nursing: 'Covered' | 'Partial' | 'Not Covered';
  };
  claims: InsuranceClaim[];
  currentClaim: InsuranceClaim | null;
}

const STORAGE_KEY_INSURANCE = 'medicare_insurance_records_v4';

// Initial Mock Records representing patient accounts
const INITIAL_MOCK_DATA: InsurancePolicyRecord[] = [
  {
    insuranceId: 'INS-MC-2026-10245',
    patientId: '91-8472-9104-5821@abdm',
    patientName: 'Ragul Kumar',
    policyNumber: 'HLT-XXXX-4582',
    policyName: 'CarePlus Family Health Secure',
    policyStatus: 'Active',
    policyStartDate: '01 Jan 2026',
    policyEndDate: '31 Dec 2026',
    coverageAmount: 1000000,
    usedCoverage: 240000,
    remainingCoverage: 760000,
    benefits: {
      hospitalization: 'Covered',
      emergency: 'Covered',
      consultation: 'Covered',
      diagnostics: 'Covered',
      medicines: 'Partial',
      nursing: 'Covered'
    },
    claims: [
      {
        claimId: 'CLM-1024',
        insuranceId: 'INS-MC-2026-10245',
        patientId: '91-8472-9104-5821@abdm',
        hospital: 'CityCare Multispecialty Hospital',
        treatment: 'Hospitalization & Cardiology Review',
        admissionDate: 'Aug 12, 2026',
        dischargeDate: 'Aug 15, 2026',
        submittedAmount: 85000,
        approvedAmount: 85000,
        patientContribution: 0,
        status: 'Settled',
        documents: [
          { id: 'd1', name: 'Hospital_Invoice_85K.pdf', uploadDate: 'Aug 15', uploadedBy: 'Hospital', status: 'Verified' },
          { id: 'd2', name: 'Discharge_Summary.pdf', uploadDate: 'Aug 15', uploadedBy: 'Doctor', status: 'Verified' }
        ],
        timeline: [
          { id: 't1', date: 'Aug 15', time: '10:00 AM', action: 'Claim Submitted Online', role: 'Patient', status: 'Completed' },
          { id: 't2', date: 'Aug 16', time: '11:30 AM', action: 'Medical Vault Documents Verified', role: 'Insurance Team', status: 'Completed' },
          { id: 't3', date: 'Aug 18', time: '02:15 PM', action: 'Cashless Payout Settled Directly', role: 'Insurance Team', status: 'Completed' }
        ]
      }
    ],
    currentClaim: {
      claimId: 'CLM-2026-00231',
      insuranceId: 'INS-MC-2026-10245',
      patientId: '91-8472-9104-5821@abdm',
      hospital: 'Apollo Central Health City, Chennai',
      treatment: 'Emergency Hospitalization & Inpatient Care',
      admissionDate: 'Aug 26, 2026',
      dischargeDate: 'Aug 28, 2026',
      submittedAmount: 120000,
      approvedAmount: 0,
      patientContribution: 0,
      status: 'Under Review',
      documents: [
        { id: 'd1', name: 'Hospital Bill (₹1,20,000)', uploadDate: 'Aug 27', uploadedBy: 'Hospital', status: 'Verified' },
        { id: 'd2', name: 'Doctor Prescription & Vitals Chart', uploadDate: 'Aug 27', uploadedBy: 'Doctor', status: 'Verified' },
        { id: 'd3', name: 'Lab Reports (Biochemistry & ECG)', uploadDate: 'Aug 27', uploadedBy: 'Patient', status: 'Verified' },
        { id: 'd4', name: 'Discharge Summary Certificate', uploadDate: 'Aug 28', uploadedBy: 'Hospital', status: 'Verified' }
      ],
      timeline: [
        { id: 't1', date: 'Aug 27', time: '09:00 AM', action: 'Claim Submitted Online with OTP Auth', role: 'Patient', status: 'Completed' },
        { id: 't2', date: 'Aug 27', time: '11:00 AM', action: 'ABDM Medical Records Transmitted', role: 'System', status: 'Completed' },
        { id: 't3', date: 'Aug 28', time: '10:00 AM', action: 'Medical Officer Pre-Auth Review in Progress', role: 'Insurance Team', status: 'Current' }
      ]
    }
  },
  {
    insuranceId: 'INS-STAR-2026-94821',
    patientId: '91-9234-8812-4019@abdm',
    patientName: 'Abinesh Kumar',
    policyNumber: 'POL-784521',
    policyName: 'Star Health Comprehensive Shield',
    policyStatus: 'Active',
    policyStartDate: '01 Jan 2026',
    policyEndDate: '31 Dec 2026',
    coverageAmount: 500000,
    usedCoverage: 125000,
    remainingCoverage: 375000,
    benefits: {
      hospitalization: 'Covered',
      emergency: 'Covered',
      consultation: 'Covered',
      diagnostics: 'Covered',
      medicines: 'Partial',
      nursing: 'Covered'
    },
    claims: [
      {
        claimId: 'CLM-2026-00124',
        insuranceId: 'INS-STAR-2026-94821',
        patientId: '91-9234-8812-4019@abdm',
        hospital: 'MediCare Hospital',
        treatment: 'Minor Surgery Reimbursement',
        admissionDate: 'Jul 12, 2026',
        dischargeDate: 'Jul 14, 2026',
        submittedAmount: 75000,
        approvedAmount: 68500,
        patientContribution: 6500,
        status: 'Settled',
        documents: [],
        timeline: []
      }
    ],
    currentClaim: {
      claimId: 'CLM-2026-00232',
      insuranceId: 'INS-STAR-2026-94821',
      patientId: '91-9234-8812-4019@abdm',
      hospital: 'City General Hospital',
      treatment: 'Emergency Care & Diagnostics',
      admissionDate: 'Aug 29, 2026',
      dischargeDate: 'Aug 30, 2026',
      submittedAmount: 45000,
      approvedAmount: 0,
      patientContribution: 0,
      status: 'New',
      documents: [
        { id: 'd1', name: 'Emergency Admission Note.pdf', uploadDate: 'Aug 29', uploadedBy: 'Hospital', status: 'Pending' },
        { id: 'd2', name: 'Pharmacy Receipt & Vitals.pdf', uploadDate: 'Aug 30', uploadedBy: 'Patient', status: 'Pending' }
      ],
      timeline: [
        { id: 't1', date: 'Aug 30', time: '02:00 PM', action: 'Claim Submitted Online by Patient', role: 'Patient', status: 'Completed' }
      ]
    }
  },
  {
    insuranceId: 'INS-CARE-2026-77402',
    patientId: '91-7291-0394-1184@abdm',
    patientName: 'Priya Sharma',
    policyNumber: 'CARE-FLOATER-9921',
    policyName: 'Care Health Super Top-Up Plan',
    policyStatus: 'Active',
    policyStartDate: '01 Feb 2026',
    policyEndDate: '31 Jan 2027',
    coverageAmount: 1500000,
    usedCoverage: 62000,
    remainingCoverage: 1438000,
    benefits: {
      hospitalization: 'Covered',
      emergency: 'Covered',
      consultation: 'Covered',
      diagnostics: 'Covered',
      medicines: 'Covered',
      nursing: 'Covered'
    },
    claims: [],
    currentClaim: {
      claimId: 'CLM-2026-00481',
      insuranceId: 'INS-CARE-2026-77402',
      patientId: '91-7291-0394-1184@abdm',
      hospital: 'Fortis Memorial Research Institute',
      treatment: 'Laparoscopic Appendectomy & Inpatient Care',
      admissionDate: 'Sep 10, 2026',
      dischargeDate: 'Sep 12, 2026',
      submittedAmount: 62000,
      approvedAmount: 0,
      patientContribution: 0,
      status: 'Under Review',
      documents: [
        { id: 'd1', name: 'Hospital Pre-Auth Request Bill.pdf', uploadDate: 'Sep 10', uploadedBy: 'Hospital', status: 'Verified' },
        { id: 'd2', name: 'Doctor Surgical Prescription.pdf', uploadDate: 'Sep 10', uploadedBy: 'Doctor', status: 'Verified' },
        { id: 'd3', name: 'Ultrasound Scan Reports.pdf', uploadDate: 'Sep 10', uploadedBy: 'Patient', status: 'Verified' }
      ],
      timeline: [
        { id: 't1', date: 'Sep 10', time: '11:00 AM', action: 'Pre-Authorization Submitted by Fortis Hospital', role: 'Hospital', status: 'Completed' },
        { id: 't2', date: 'Sep 10', time: '01:30 PM', action: 'Medical Officer Documents Verified', role: 'Insurance Team', status: 'Completed' },
        { id: 't3', date: 'Sep 11', time: '09:00 AM', action: 'Cashless Desk Pre-Auth Under Review', role: 'Insurance Team', status: 'Current' }
      ]
    }
  },
  {
    insuranceId: 'INS-HDFC-2026-38190',
    patientId: '91-5582-9014-4412@abdm',
    patientName: 'Rahul Kumar',
    policyNumber: 'HDFC-ERGO-45910',
    policyName: 'HDFC ERGO Optima Secure',
    policyStatus: 'Active',
    policyStartDate: '15 Jan 2026',
    policyEndDate: '14 Jan 2027',
    coverageAmount: 750000,
    usedCoverage: 110000,
    remainingCoverage: 640000,
    benefits: {
      hospitalization: 'Covered',
      emergency: 'Covered',
      consultation: 'Covered',
      diagnostics: 'Covered',
      medicines: 'Covered',
      nursing: 'Covered'
    },
    claims: [
      {
        claimId: 'CLM-2026-00092',
        insuranceId: 'INS-HDFC-2026-38190',
        patientId: '91-5582-9014-4412@abdm',
        hospital: 'Manipal Hospital, Bangalore',
        treatment: 'Orthopedic Arthroscopy Treatment',
        admissionDate: 'May 05, 2026',
        dischargeDate: 'May 07, 2026',
        submittedAmount: 110000,
        approvedAmount: 110000,
        patientContribution: 0,
        status: 'Settled',
        documents: [
          { id: 'd1', name: 'Hospital_Invoice_110K.pdf', uploadDate: 'May 07', uploadedBy: 'Hospital', status: 'Verified' }
        ],
        timeline: [
          { id: 't1', date: 'May 05', time: '09:00 AM', action: 'Claim Submitted Online', role: 'Patient', status: 'Completed' },
          { id: 't2', date: 'May 08', time: '04:00 PM', action: 'Full Reimbursement Dispatched', role: 'Insurance Team', status: 'Completed' }
        ]
      }
    ],
    currentClaim: null
  }
];

import { insuranceApi } from '../services/dhrApis';
import { socketService } from '../services/socketService';
import { globalNotificationService } from '../services/globalNotificationService';

// Helper to safely read from localStorage
export const getStoredInsuranceRecords = (): InsurancePolicyRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INSURANCE);
    if (raw && raw !== 'undefined') {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading insurance records from storage:', e);
  }
  return INITIAL_MOCK_DATA;
};

// Helper to safely write to localStorage
export const persistInsuranceRecords = (data: InsurancePolicyRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_INSURANCE, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving insurance records to storage:', e);
  }
};

export const useInsuranceWorkflow = () => {
  const [records, setRecords] = useState<InsurancePolicyRecord[]>(() => getStoredInsuranceRecords());
  const [loading, setLoading] = useState(false);

  const loadBackendPolicies = async () => {
    try {
      setLoading(true);
      const [policiesRes, claimsRes] = await Promise.allSettled([
        insuranceApi.getPolicies(),
        insuranceApi.getClaims(),
      ]);

      const backendPolicies = policiesRes.status === 'fulfilled' && policiesRes.value?.data ? policiesRes.value.data : [];
      const backendClaims = claimsRes.status === 'fulfilled' && claimsRes.value?.data ? claimsRes.value.data : [];

      if (backendPolicies.length > 0 || backendClaims.length > 0) {
        const mapClaim = (c: any, defaultInsId?: string, defaultPatId?: string): InsuranceClaim => ({
          claimId: c.claimId || c.id,
          insuranceId: c.policy?.insuranceId || c.insuranceId || defaultInsId || '',
          patientId: c.patientId || c.patient?.id || defaultPatId || '',
          hospital: c.hospital,
          treatment: c.treatment,
          admissionDate: new Date(c.admissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dischargeDate: new Date(c.dischargeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          submittedAmount: Number(c.submittedAmount),
          approvedAmount: Number(c.approvedAmount),
          patientContribution: Number(c.patientContribution),
          status: c.status as any,
          documents: c.documents ? (typeof c.documents === 'string' ? JSON.parse(c.documents) : c.documents) : [],
          timeline: c.timeline ? (typeof c.timeline === 'string' ? JSON.parse(c.timeline) : c.timeline) : [],
        });

        const policyMap = new Map<string, InsurancePolicyRecord>();

        // 1. Process all backend policies
        backendPolicies.forEach((p: any) => {
          let benefitsObj = INITIAL_MOCK_DATA[0].benefits;
          try {
            if (p.benefits) benefitsObj = typeof p.benefits === 'string' ? JSON.parse(p.benefits) : p.benefits;
          } catch {}

          const rawClaims = Array.isArray(p.claims) ? p.claims : [];
          const activeClaim = rawClaims.find((c: any) => c.status === 'New' || c.status === 'Under Review') || null;
          const pastClaims = rawClaims.filter((c: any) => c.status !== 'New' && c.status !== 'Under Review');
          const realName = p.patient?.fullName || (p.patient?.user?.email ? p.patient.user.email.split('@')[0] : 'Patient');

          policyMap.set(p.insuranceId, {
            insuranceId: p.insuranceId,
            patientId: p.patientId,
            patientName: realName,
            policyNumber: p.policyNumber,
            policyName: p.policyName,
            policyStatus: p.policyStatus as any,
            policyStartDate: new Date(p.policyStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            policyEndDate: new Date(p.policyEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            coverageAmount: Number(p.coverageAmount),
            usedCoverage: Number(p.usedCoverage),
            remainingCoverage: Number(p.remainingCoverage),
            benefits: benefitsObj,
            claims: pastClaims.map((c: any) => mapClaim(c, p.insuranceId, p.patientId)),
            currentClaim: activeClaim ? mapClaim(activeClaim, p.insuranceId, p.patientId) : null,
          });
        });

        // 2. Process all backend claims to guarantee latest claimant info is bound
        backendClaims.forEach((c: any) => {
          const insId = c.policy?.insuranceId || c.insuranceId || (c.policyId ? `INS-${c.policyId}` : 'INS-DEFAULT');
          const claimantName = c.patient?.fullName || (c.patient?.user?.email ? c.patient.user.email.split('@')[0] : 'Patient');
          const mappedClaim = mapClaim(c, insId, c.patientId);

          if (policyMap.has(insId)) {
            const existing = policyMap.get(insId)!;
            if (claimantName && existing.patientName === 'Patient') {
              existing.patientName = claimantName;
            }
            if (c.status === 'New' || c.status === 'Under Review') {
              existing.currentClaim = mappedClaim;
            } else if (!existing.claims.some(x => x.claimId === mappedClaim.claimId)) {
              existing.claims.unshift(mappedClaim);
            }
          } else {
            policyMap.set(insId, {
              insuranceId: insId,
              patientId: c.patientId || `PAT-${c.id}`,
              patientName: claimantName,
              policyNumber: c.policy?.policyNumber || `POL-${Math.floor(100000 + Math.random() * 900000)}`,
              policyName: c.policy?.policyName || 'Star Health Premier Comprehensive Care',
              policyStatus: (c.policy?.policyStatus as any) || 'Active',
              policyStartDate: c.policy?.policyStartDate ? new Date(c.policy.policyStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '01 Jan 2026',
              policyEndDate: c.policy?.policyEndDate ? new Date(c.policy.policyEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '31 Dec 2026',
              coverageAmount: Number(c.policy?.coverageAmount || 1000000),
              usedCoverage: Number(c.policy?.usedCoverage || 0),
              remainingCoverage: Number(c.policy?.remainingCoverage || 1000000),
              benefits: INITIAL_MOCK_DATA[0].benefits,
              claims: c.status !== 'New' && c.status !== 'Under Review' ? [mappedClaim] : [],
              currentClaim: c.status === 'New' || c.status === 'Under Review' ? mappedClaim : null,
            });
          }
        });

        const mapped = Array.from(policyMap.values());

        // Sort so records with active pending claims appear first in work queue
        mapped.sort((a, b) => {
          const aPending = a.currentClaim && (a.currentClaim.status === 'New' || a.currentClaim.status === 'Under Review');
          const bPending = b.currentClaim && (b.currentClaim.status === 'New' || b.currentClaim.status === 'Under Review');
          if (aPending && !bPending) return -1;
          if (!aPending && bPending) return 1;
          return 0;
        });

        const stored = getStoredInsuranceRecords();
        stored.forEach(localRec => {
          if (!mapped.some(m => m.insuranceId === localRec.insuranceId)) {
            // Discard mock Ragul Kumar record once real policies exist
            if (localRec.insuranceId === 'INS-MC-2026-10245' && mapped.length > 0) {
              return;
            }
            mapped.push(localRec);
          }
        });

        setRecords(mapped);
        persistInsuranceRecords(mapped);
      }
    } catch (err: any) {
      console.error('Error loading backend policies/claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Initial check from localStorage
    const current = getStoredInsuranceRecords();
    setRecords(current);

    // 2. Load from backend
    loadBackendPolicies();

    // 3. Listen to in-app custom sync event
    const handleSyncEvent = () => {
      const fresh = getStoredInsuranceRecords();
      setRecords(fresh);
    };

    // 4. Listen to browser cross-tab storage changes
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_INSURANCE || e.key === 'medicare_insurance_sync_trigger') {
        const fresh = getStoredInsuranceRecords();
        setRecords(fresh);
      }
    };

    // 5. Real-time Socket.IO insurance events
    const unsubSocket = socketService.subscribeToInsuranceClaimEvents((payload: any) => {
      loadBackendPolicies();
      window.dispatchEvent(new CustomEvent('insurance_claim_submitted', { detail: payload }));
    });

    window.addEventListener('medicare_sync_insurance', handleSyncEvent);
    window.addEventListener('insurance_claim_submitted', handleSyncEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      unsubSocket();
      window.removeEventListener('medicare_sync_insurance', handleSyncEvent);
      window.removeEventListener('insurance_claim_submitted', handleSyncEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const triggerSync = () => {
    try {
      localStorage.setItem('medicare_insurance_sync_trigger', Date.now().toString());
    } catch {}
    window.dispatchEvent(new Event('medicare_sync_insurance'));
  };

  // Smart Search by Insurance ID, Patient ID, Patient Name, Policy Number, Claim ID
  const searchPolicy = (query: string): InsurancePolicyRecord | null => {
    if (!query) return null;
    const q = query.trim().toLowerCase();

    // Always query fresh stored records in case state hasn't flushed or across tabs
    const pool = getStoredInsuranceRecords();

    const exact = pool.find(r => 
      r.insuranceId.toLowerCase() === q ||
      r.policyNumber.toLowerCase() === q ||
      r.patientId.toLowerCase() === q ||
      r.patientName.toLowerCase() === q ||
      (r.currentClaim && r.currentClaim.claimId.toLowerCase() === q)
    );
    if (exact) return exact;

    const partial = pool.find(r => 
      r.insuranceId.toLowerCase().includes(q) ||
      r.policyNumber.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.patientId.toLowerCase().includes(q) ||
      (r.currentClaim && (
        r.currentClaim.claimId.toLowerCase().includes(q) ||
        r.currentClaim.hospital.toLowerCase().includes(q) ||
        r.currentClaim.treatment.toLowerCase().includes(q)
      )) ||
      r.claims.some(c => c.claimId.toLowerCase().includes(q) || c.hospital.toLowerCase().includes(q))
    );

    return partial || null;
  };

  // Patient Submits a New Claim (Bidirectional link to Insurance Desk)
  const submitPatientClaim = async (claimInput: {
    claimId?: string;
    insuranceId?: string;
    patientName?: string;
    hospital: string;
    treatment: string;
    submittedAmount: number;
    attachedFiles?: string[];
  }) => {
    const claimId = claimInput.claimId || `CLM-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Read fresh from storage to guarantee no stale closure
    const currentRecords = getStoredInsuranceRecords();

    const effectivePatientName = claimInput.patientName && claimInput.patientName.trim() && claimInput.patientName !== 'Ragul Kumar'
      ? claimInput.patientName.trim()
      : (claimInput.patientName || 'Patient');

    let targetPolicy = currentRecords.find(r => 
      (claimInput.insuranceId && r.insuranceId.toLowerCase() === claimInput.insuranceId.toLowerCase() && r.insuranceId !== 'INS-MC-2026-10245') ||
      (claimInput.insuranceId && r.policyNumber.toLowerCase() === claimInput.insuranceId.toLowerCase()) ||
      (effectivePatientName && r.patientName.toLowerCase() === effectivePatientName.toLowerCase())
    );

    if (!targetPolicy) {
      const newInsId = (claimInput.insuranceId && claimInput.insuranceId !== 'INS-MC-2026-10245')
        ? claimInput.insuranceId
        : `INS-MC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      targetPolicy = {
        insuranceId: newInsId,
        patientId: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}@abdm`,
        patientName: effectivePatientName,
        policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        policyName: 'Star Health Premier Comprehensive Care',
        policyStatus: 'Active',
        policyStartDate: '01 Jan 2026',
        policyEndDate: '31 Dec 2026',
        coverageAmount: 1000000,
        usedCoverage: 0,
        remainingCoverage: 1000000,
        benefits: INITIAL_MOCK_DATA[0].benefits,
        claims: [],
        currentClaim: null,
      };
      currentRecords.unshift(targetPolicy);
    } else {
      targetPolicy.patientName = effectivePatientName;
    }

    const newClaim: InsuranceClaim = {
      claimId,
      insuranceId: targetPolicy.insuranceId,
      patientId: targetPolicy.patientId,
      hospital: claimInput.hospital,
      treatment: claimInput.treatment,
      admissionDate: nowStr,
      dischargeDate: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      submittedAmount: claimInput.submittedAmount,
      approvedAmount: 0,
      patientContribution: 0,
      status: 'Under Review',
      documents: (claimInput.attachedFiles || ['Hospital_Bill_Receipt.pdf', 'Discharge_Summary.pdf', 'Doctor_Prescription.pdf']).map((f, i) => ({
        id: `doc-${Date.now()}-${i}`,
        name: f,
        uploadDate: nowStr,
        uploadedBy: 'Patient',
        status: 'Verified'
      })),
      timeline: [
        { id: 't1', date: nowStr, time: timeStr, action: 'Claim Submitted Online by Patient with OTP Verification', role: 'Patient', status: 'Completed' },
        { id: 't2', date: nowStr, time: timeStr, action: 'ABDM Medical Vault Health Documents Transmitted', role: 'System', status: 'Completed' },
        { id: 't3', date: 'Now', time: '', action: 'Insurance Incharge Medical Officer Review in Progress', role: 'Insurance Team', status: 'Current' }
      ]
    };

    // If there was an existing currentClaim on this policy, archive it into claims array so history is never lost
    const updated = currentRecords.map(r => {
      if (r.insuranceId === targetPolicy.insuranceId) {
        const archivedClaims = r.currentClaim && r.currentClaim.claimId !== newClaim.claimId
          ? [r.currentClaim, ...r.claims.filter(c => c.claimId !== r.currentClaim!.claimId)]
          : r.claims;

        return {
          ...r,
          patientName: effectivePatientName,
          claims: archivedClaims,
          currentClaim: newClaim
        };
      }
      return r;
    });

    // 1. Synchronously persist to localStorage
    persistInsuranceRecords(updated);
    try {
      localStorage.setItem('medicare_insurance_sync_trigger', Date.now().toString());
    } catch {}

    // 2. Update local state
    setRecords(updated);

    // 3. Dispatch in-app events with full metadata
    triggerSync();
    window.dispatchEvent(new CustomEvent('insurance_claim_submitted', { 
      detail: { 
        ...newClaim, 
        patientName: effectivePatientName,
        insuranceId: targetPolicy.insuranceId,
        policyNumber: targetPolicy.policyNumber
      } 
    }));

    // 4. Save notification for Insurance Desk & Global Service
    try {
      const rawNotifs = localStorage.getItem('medicare_notifications');
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      const newNotif = {
        id: `notif-ins-${Date.now()}`,
        title: `🚨 Incoming Cashless Claim: ${claimId}`,
        message: `${effectivePatientName} submitted a pre-auth claim for ₹${claimInput.submittedAmount.toLocaleString('en-IN')} at ${claimInput.hospital}. Action needed: Accept or Decline.`,
        category: 'Insurance Pre-Auth',
        createdAt: new Date().toISOString(),
        isRead: false,
        relatedModule: 'insurance',
        insuranceId: targetPolicy.insuranceId,
        claimId,
        patientName: effectivePatientName,
        hospital: claimInput.hospital,
        submittedAmount: claimInput.submittedAmount,
        status: 'Under Review'
      };
      localStorage.setItem('medicare_notifications', JSON.stringify([newNotif, ...notifs]));

      globalNotificationService.dispatchNotification({
        id: newNotif.id,
        recipientRole: 'INSURANCE_PROVIDER',
        title: newNotif.title,
        message: `${effectivePatientName} submitted a pre-auth claim for ₹${claimInput.submittedAmount.toLocaleString('en-IN')} at ${claimInput.hospital}. Process decision: Accept or Decline?`,
        type: 'ALERT',
        timestamp: 'Just now',
        read: false,
        relatedRoute: '/insurance',
        relatedEntityId: claimId,
        voiceEnabled: false
      });

      window.dispatchEvent(new Event('notifications_updated'));
    } catch {}

    // 5. Persist to MySQL backend
    try {
      const res = await insuranceApi.createClaim({
        claimId,
        insuranceId: targetPolicy.insuranceId,
        patientName: effectivePatientName,
        hospital: claimInput.hospital,
        treatment: claimInput.treatment,
        submittedAmount: claimInput.submittedAmount,
        status: 'Under Review',
        documents: newClaim.documents,
      });
      if (res && res.data) {
        if (res.data.claimId) newClaim.claimId = res.data.claimId;
        if (res.data.policy?.insuranceId) targetPolicy.insuranceId = res.data.policy.insuranceId;
        if (res.data.patient?.fullName) {
          targetPolicy.patientName = res.data.patient.fullName;
        }
      }
    } catch (e) {
      console.error('Error submitting claim to backend:', e);
    }

    return claimId;
  };

  // Insurance Officer Updates Claim Status (Approved, Rejected, Settled)
  const updateCurrentClaimStatus = async (
    insuranceId: string, 
    status: InsuranceClaim['status'], 
    approvedAmount?: number,
    timelineAction?: string
  ) => {
    const updated = await updateInsuranceClaimStatus(insuranceId, status, approvedAmount, timelineAction);
    setRecords(updated);
    triggerSync();
  };

  const updateDocumentStatus = (insuranceId: string, docId: string, status: InsuranceDocument['status']) => {
    const currentRecords = getStoredInsuranceRecords();
    const updated = currentRecords.map(r => {
      if (r.insuranceId === insuranceId && r.currentClaim) {
        return {
          ...r,
          currentClaim: {
            ...r.currentClaim,
            documents: r.currentClaim.documents.map(d => (d.id === docId ? { ...d, status } : d)),
          },
        };
      }
      return r;
    });
    persistInsuranceRecords(updated);
    try {
      localStorage.setItem('medicare_insurance_sync_trigger', Date.now().toString());
    } catch {}
    setRecords(updated);
    triggerSync();
  };

  return {
    records,
    loading,
    searchPolicy,
    submitPatientClaim,
    updateCurrentClaimStatus,
    updateDocumentStatus
  };
};

/**
 * Standalone helper to update claim status (Accept / Decline / Settle)
 * Dispatches notifications to the patient in real time with the decision.
 */
export const updateInsuranceClaimStatus = async (
  insuranceId: string, 
  status: InsuranceClaim['status'], 
  approvedAmount?: number,
  timelineAction?: string
): Promise<InsurancePolicyRecord[]> => {
  const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const currentRecords = getStoredInsuranceRecords();

  const updated = currentRecords.map(r => {
    if (r.insuranceId === insuranceId && r.currentClaim) {
      const finalApproved = approvedAmount !== undefined ? approvedAmount : (status === 'Approved' ? r.currentClaim.submittedAmount : 0);
      const finalContribution = Math.max(0, r.currentClaim.submittedAmount - finalApproved);
      
      const newTimelineEvent: InsuranceTimelineEvent = {
        id: `t-${Date.now()}`,
        date: nowStr,
        time: timeStr,
        action: timelineAction || `Claim ${status === 'Approved' ? 'ACCEPTED & Cashless Pre-Auth Approved' : status === 'Rejected' ? 'DECLINED' : 'Settled'}`,
        role: 'Insurance Incharge',
        status: 'Completed'
      };

      const hospPrefix = (r.currentClaim.hospital.split(' ')[0] || 'CARE').toUpperCase();
      const preAuthCode = r.currentClaim.preAuthCode || `AUTH-84920-${hospPrefix}`;
      const settlementTxnId = status === 'Settled' ? (r.currentClaim.settlementTxnId || `TXN-IRDAI-2026-${Math.floor(100000 + Math.random() * 900000)}`) : r.currentClaim.settlementTxnId;
      const settlementDate = status === 'Settled' ? (r.currentClaim.settlementDate || nowStr) : r.currentClaim.settlementDate;

      const updatedCurrentClaim: InsuranceClaim = {
        ...r.currentClaim,
        status,
        approvedAmount: finalApproved,
        patientContribution: finalContribution,
        preAuthCode,
        settlementTxnId,
        settlementDate,
        timeline: [...r.currentClaim.timeline.map(t => ({ ...t, status: 'Completed' as const })), newTimelineEvent]
      };

      // If settled, update coverage and past claims history
      if (status === 'Settled') {
        const newUsed = r.usedCoverage + finalApproved;
        return {
          ...r,
          usedCoverage: newUsed,
          remainingCoverage: Math.max(0, r.coverageAmount - newUsed),
          claims: [updatedCurrentClaim, ...r.claims.filter(c => c.claimId !== updatedCurrentClaim.claimId)],
          currentClaim: updatedCurrentClaim
        };
      }

      // If approved, update remaining coverage calculation
      if (status === 'Approved' || status === 'Partially Approved') {
        const newUsed = r.usedCoverage + finalApproved;
        return {
          ...r,
          usedCoverage: newUsed,
          remainingCoverage: Math.max(0, r.coverageAmount - newUsed),
          currentClaim: updatedCurrentClaim
        };
      }

      return {
        ...r,
        currentClaim: updatedCurrentClaim
      };
    }
    return r;
  });

  persistInsuranceRecords(updated);
  try {
    localStorage.setItem('medicare_insurance_sync_trigger', Date.now().toString());
  } catch {}
  window.dispatchEvent(new Event('medicare_sync_insurance'));

  // Notify patient about the decision (Accepted or Declined)
  const targetPolicy = updated.find(r => r.insuranceId === insuranceId);
  const targetClaim = targetPolicy?.currentClaim;
  if (targetClaim) {
    const isApproved = status === 'Approved' || status === 'Partially Approved';
    const isRejected = status === 'Rejected';
    const approvedAmt = targetClaim.approvedAmount || targetClaim.submittedAmount;

    let patientTitle = '';
    let patientMsg = '';

    if (isApproved) {
      patientTitle = `🎉 Cashless Pre-Auth Claim Approved: ${targetClaim.claimId}`;
      patientMsg = `Your cashless claim for ₹${approvedAmt.toLocaleString('en-IN')} at ${targetClaim.hospital} has been ACCEPTED & APPROVED by the insurance desk. Pre-Auth Code: ${targetClaim.preAuthCode || 'AUTH-84920'}.`;
    } else if (isRejected) {
      patientTitle = `❌ Cashless Claim Declined: ${targetClaim.claimId}`;
      patientMsg = `Your claim for ₹${targetClaim.submittedAmount.toLocaleString('en-IN')} at ${targetClaim.hospital} was DECLINED by the insurance desk. Reason: ${timelineAction || 'Missing itemized hospital pharmacy bills or waiting period exclusion'}.`;
    } else if (status === 'Settled') {
      patientTitle = `💰 Cashless Settlement Disbursed: ${targetClaim.claimId}`;
      patientMsg = `Direct cashless settlement of ₹${approvedAmt.toLocaleString('en-IN')} has been cleared with ${targetClaim.hospital}. Txn Ref: ${targetClaim.settlementTxnId}.`;
    }

    if (patientTitle) {
      try {
        const rawNotifs = localStorage.getItem('medicare_notifications');
        const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
        const notifItem = {
          id: `notif-ins-decision-${Date.now()}`,
          title: patientTitle,
          message: patientMsg,
          category: 'Insurance Pre-Auth',
          createdAt: new Date().toISOString(),
          isRead: false,
          relatedModule: 'insurance',
          claimId: targetClaim.claimId,
          insuranceId,
          status,
          approvedAmount: approvedAmt,
          preAuthCode: targetClaim.preAuthCode
        };
        localStorage.setItem('medicare_notifications', JSON.stringify([notifItem, ...notifs]));

        globalNotificationService.dispatchNotification({
          id: notifItem.id,
          recipientRole: 'PATIENT',
          title: patientTitle,
          message: patientMsg,
          type: isApproved ? 'SUCCESS' : isRejected ? 'ALERT' : 'INFO',
          timestamp: 'Just now',
          read: false,
          relatedRoute: '/insurance',
          relatedEntityId: targetClaim.claimId,
          voiceEnabled: true,
        });

        window.dispatchEvent(new Event('notifications_updated'));
        window.dispatchEvent(new CustomEvent('medicare_claim_status_changed', { detail: notifItem }));
      } catch (e) {
        console.error('Error saving decision notification:', e);
      }
    }

    // Persist status change to backend MySQL
    try {
      await insuranceApi.updateClaimStatus(targetClaim.claimId, {
        status,
        approvedAmount,
        reason: timelineAction,
      });
    } catch {}
  }

  return updated;
};



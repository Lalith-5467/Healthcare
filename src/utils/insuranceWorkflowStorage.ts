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

const STORAGE_KEY_INSURANCE = 'medicare_insurance_records_v3';

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
          { id: 't1', date: 'Aug 15', time: '10:00 AM', action: 'Claim Submitted', role: 'Patient', status: 'Completed' },
          { id: 't2', date: 'Aug 16', time: '11:30 AM', action: 'Documents Verified', role: 'Insurance Team', status: 'Completed' },
          { id: 't3', date: 'Aug 18', time: '02:15 PM', action: 'Cashless Payout Settled', role: 'Insurance Team', status: 'Completed' }
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
        { id: 't1', date: 'Aug 27', time: '09:00 AM', action: 'Claim Submitted Online by Patient', role: 'Patient', status: 'Completed' },
        { id: 't2', date: 'Aug 27', time: '11:00 AM', action: 'ABDM Health Records & Documents Received', role: 'System', status: 'Completed' },
        { id: 't3', date: 'Aug 28', time: '10:00 AM', action: 'Medical Officer Verification in Progress', role: 'Insurance Team', status: 'Current' }
      ]
    }
  },
  {
    insuranceId: 'INS-AK-2026-9901',
    patientId: 'MC-10245',
    patientName: 'Abinesh Kumar',
    policyNumber: 'POL-784521',
    policyName: 'MediCare Comprehensive Shield',
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
        insuranceId: 'INS-AK-2026-9901',
        patientId: 'MC-10245',
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
      insuranceId: 'INS-AK-2026-9901',
      patientId: 'MC-10245',
      hospital: 'City General Hospital',
      treatment: 'Emergency Care & Diagnostics',
      admissionDate: 'Aug 29, 2026',
      dischargeDate: 'Aug 30, 2026',
      submittedAmount: 45000,
      approvedAmount: 0,
      patientContribution: 0,
      status: 'New',
      documents: [
        { id: 'd1', name: 'Emergency Admission Note', uploadDate: 'Aug 29', uploadedBy: 'Hospital', status: 'Pending' },
        { id: 'd2', name: 'Pharmacy Receipt', uploadDate: 'Aug 30', uploadedBy: 'Patient', status: 'Pending' }
      ],
      timeline: [
        { id: 't1', date: 'Aug 30', time: '02:00 PM', action: 'Claim Submitted Online', role: 'Patient', status: 'Completed' }
      ]
    }
  }
];

import { insuranceApi } from '../services/dhrApis';

export const useInsuranceWorkflow = () => {
  const [records, setRecords] = useState<InsurancePolicyRecord[]>(INITIAL_MOCK_DATA);
  const [loading, setLoading] = useState(false);

  const loadBackendPolicies = async () => {
    try {
      setLoading(true);
      const res = await insuranceApi.getPolicies();
      if (res && res.data && res.data.length > 0) {
        const mapped: InsurancePolicyRecord[] = res.data.map((p: any) => {
          let benefitsObj = INITIAL_MOCK_DATA[0].benefits;
          try {
            if (p.benefits) benefitsObj = typeof p.benefits === 'string' ? JSON.parse(p.benefits) : p.benefits;
          } catch {}

          const rawClaims = Array.isArray(p.claims) ? p.claims : [];
          const activeClaim = rawClaims.find((c: any) => c.status === 'New' || c.status === 'Under Review') || null;
          const pastClaims = rawClaims.filter((c: any) => c.status !== 'New' && c.status !== 'Under Review');

          const mapClaim = (c: any): InsuranceClaim => ({
            claimId: c.claimId || c.id,
            insuranceId: p.insuranceId,
            patientId: p.patientId,
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

          return {
            insuranceId: p.insuranceId,
            patientId: p.patientId,
            patientName: p.patient?.fullName || 'Patient',
            policyNumber: p.policyNumber,
            policyName: p.policyName,
            policyStatus: p.policyStatus as any,
            policyStartDate: new Date(p.policyStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            policyEndDate: new Date(p.policyEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            coverageAmount: Number(p.coverageAmount),
            usedCoverage: Number(p.usedCoverage),
            remainingCoverage: Number(p.remainingCoverage),
            benefits: benefitsObj,
            claims: pastClaims.map(mapClaim),
            currentClaim: activeClaim ? mapClaim(activeClaim) : null,
          };
        });
        setRecords(mapped);
      }
    } catch (err: any) {
      console.error('Failed to load insurance policies from database:', err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackendPolicies();

    const handleCustomEvent = () => {
      loadBackendPolicies();
    };

    window.addEventListener('medicare_sync_insurance', handleCustomEvent);
    return () => {
      window.removeEventListener('medicare_sync_insurance', handleCustomEvent);
    };
  }, []);

  const triggerSync = () => {
    window.dispatchEvent(new Event('medicare_sync_insurance'));
  };

  // Smart Search by Insurance ID, Patient ID, Patient Name, Policy Number, Claim ID
  const searchPolicy = (query: string): InsurancePolicyRecord | null => {
    if (!query) return null;
    const q = query.trim().toLowerCase();

    const exact = records.find(r => 
      r.insuranceId.toLowerCase() === q ||
      r.policyNumber.toLowerCase() === q ||
      r.patientId.toLowerCase() === q ||
      r.patientName.toLowerCase() === q ||
      (r.currentClaim && r.currentClaim.claimId.toLowerCase() === q)
    );
    if (exact) return exact;

    const partial = records.find(r => 
      r.insuranceId.toLowerCase().includes(q) ||
      r.policyNumber.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.patientId.toLowerCase().includes(q) ||
      (r.currentClaim && r.currentClaim.claimId.toLowerCase().includes(q)) ||
      r.claims.some(c => c.claimId.toLowerCase().includes(q))
    );

    return partial || null;
  };

  // Patient Submits a New Claim
  const submitPatientClaim = async (claimInput: {
    insuranceId?: string;
    patientName?: string;
    hospital: string;
    treatment: string;
    submittedAmount: number;
    attachedFiles?: string[];
  }) => {
    const targetPolicy = records.find(r => r.insuranceId === claimInput.insuranceId) || records[0];
    const claimId = `CLM-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      await insuranceApi.createClaim({
        claimId,
        insuranceId: targetPolicy.insuranceId,
        hospital: claimInput.hospital,
        treatment: claimInput.treatment,
        submittedAmount: claimInput.submittedAmount,
        documents: (claimInput.attachedFiles || ['Hospital_Bill.pdf', 'Discharge_Summary.pdf']).map((f, i) => ({
          id: `doc-${Date.now()}-${i}`,
          name: f,
          uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          uploadedBy: 'Patient',
          status: 'Verified'
        })),
      });
      loadBackendPolicies();
      triggerSync();
    } catch (err: any) {
      console.error('Failed to submit claim to MySQL:', err?.message);
    }

    return claimId;
  };

  const updateCurrentClaimStatus = async (
    insuranceId: string, 
    status: InsuranceClaim['status'], 
    approvedAmount?: number,
    timelineAction?: string
  ) => {
    const targetPolicy = records.find(r => r.insuranceId === insuranceId);
    const targetClaim = targetPolicy?.currentClaim;

    if (targetClaim) {
      try {
        await insuranceApi.updateClaimStatus(targetClaim.claimId, {
          status,
          approvedAmount,
          reason: timelineAction,
        });
        loadBackendPolicies();
        triggerSync();
      } catch (err: any) {
        console.error('Failed to update claim status in MySQL:', err?.message);
      }
    }
  };

  const updateDocumentStatus = (insuranceId: string, docId: string, status: InsuranceDocument['status']) => {
    setRecords(prev =>
      prev.map(r => {
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
      })
    );
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

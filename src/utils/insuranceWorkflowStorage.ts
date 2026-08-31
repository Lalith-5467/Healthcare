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

const STORAGE_KEY_INSURANCE = 'medicare_insurance_records';

// Initial Mock Data representing Abinesh Kumar
const INITIAL_MOCK_DATA: InsurancePolicyRecord[] = [
  {
    insuranceId: 'INS-MC-2026-10245',
    patientId: 'MC-10245',
    patientName: 'Abinesh Kumar',
    policyNumber: 'POL-784521',
    policyName: 'MediCare Comprehensive',
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
        insuranceId: 'INS-MC-2026-10245',
        patientId: 'MC-10245',
        hospital: 'MediCare Hospital',
        treatment: 'Hospitalization',
        admissionDate: 'Aug 12, 2026',
        dischargeDate: 'Aug 16, 2026',
        submittedAmount: 75000,
        approvedAmount: 68500,
        patientContribution: 6500,
        status: 'Settled',
        documents: [],
        timeline: []
      }
    ],
    currentClaim: {
      claimId: 'CLM-2026-00231',
      insuranceId: 'INS-MC-2026-10245',
      patientId: 'MC-10245',
      hospital: 'MediCare Hospital',
      treatment: 'Hospitalization',
      admissionDate: 'Aug 26, 2026',
      dischargeDate: 'Aug 28, 2026',
      submittedAmount: 120000,
      approvedAmount: 0,
      patientContribution: 0,
      status: 'Under Review',
      documents: [
        { id: 'd1', name: 'Hospital Bill', uploadDate: 'Aug 27', uploadedBy: 'Hospital', status: 'Verified' },
        { id: 'd2', name: 'Prescription', uploadDate: 'Aug 27', uploadedBy: 'Doctor', status: 'Verified' },
        { id: 'd3', name: 'Lab Reports', uploadDate: 'Aug 27', uploadedBy: 'Patient', status: 'Verified' },
        { id: 'd4', name: 'Discharge Summary', uploadDate: 'Aug 28', uploadedBy: 'Hospital', status: 'Missing' }
      ],
      timeline: [
        { id: 't1', date: 'Aug 27', time: '09:00 AM', action: 'Claim Submitted', role: 'Patient', status: 'Completed' },
        { id: 't2', date: 'Aug 27', time: '11:00 AM', action: 'Documents Received', role: 'System', status: 'Completed' },
        { id: 't3', date: 'Aug 28', time: '10:00 AM', action: 'Verification Pending', role: 'Insurance Team', status: 'Current' }
      ]
    }
  }
];

const getInsuranceRecords = (): InsurancePolicyRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY_INSURANCE);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_INSURANCE, JSON.stringify(INITIAL_MOCK_DATA));
    return INITIAL_MOCK_DATA;
  }
  return JSON.parse(data);
};

export const useInsuranceWorkflow = () => {
  const [records, setRecords] = useState<InsurancePolicyRecord[]>([]);

  useEffect(() => {
    setRecords(getInsuranceRecords());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_INSURANCE) {
        setRecords(getInsuranceRecords());
      }
    };
    
    const handleCustomEvent = () => {
      setRecords(getInsuranceRecords());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('medicare_sync_insurance', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('medicare_sync_insurance', handleCustomEvent);
    };
  }, []);

  const triggerSync = () => {
    window.dispatchEvent(new Event('medicare_sync_insurance'));
  };

  const searchPolicy = (insuranceId: string) => {
    return records.find(r => r.insuranceId === insuranceId) || null;
  };

  const updateCurrentClaimStatus = (
    insuranceId: string, 
    status: InsuranceClaim['status'], 
    approvedAmount?: number,
    timelineAction?: string
  ) => {
    const current = getInsuranceRecords();
    
    const updated = current.map(record => {
      if (record.insuranceId === insuranceId && record.currentClaim) {
        const updatedClaim = { ...record.currentClaim, status };
        
        if (approvedAmount !== undefined) {
          updatedClaim.approvedAmount = approvedAmount;
          updatedClaim.patientContribution = updatedClaim.submittedAmount - approvedAmount;
        }

        if (timelineAction) {
          const newEvent: InsuranceTimelineEvent = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            action: timelineAction,
            role: 'Insurance Team',
            status: 'Completed'
          };
          updatedClaim.timeline = [...updatedClaim.timeline, newEvent];
        }

        // If settled, move to past claims and clear current
        if (status === 'Settled' || status === 'Rejected') {
          return {
            ...record,
            usedCoverage: status === 'Settled' ? record.usedCoverage + (approvedAmount || 0) : record.usedCoverage,
            remainingCoverage: status === 'Settled' ? record.remainingCoverage - (approvedAmount || 0) : record.remainingCoverage,
            claims: [updatedClaim, ...record.claims],
            currentClaim: null
          };
        }

        return {
          ...record,
          currentClaim: updatedClaim
        };
      }
      return record;
    });
    
    localStorage.setItem(STORAGE_KEY_INSURANCE, JSON.stringify(updated));
    triggerSync();
  };

  const updateDocumentStatus = (insuranceId: string, docId: string, status: InsuranceDocument['status']) => {
    const current = getInsuranceRecords();
    
    const updated = current.map(record => {
      if (record.insuranceId === insuranceId && record.currentClaim) {
        const updatedDocs = record.currentClaim.documents.map(d => 
          d.id === docId ? { ...d, status } : d
        );
        return {
          ...record,
          currentClaim: {
            ...record.currentClaim,
            documents: updatedDocs
          }
        };
      }
      return record;
    });
    
    localStorage.setItem(STORAGE_KEY_INSURANCE, JSON.stringify(updated));
    triggerSync();
  };

  return {
    records,
    searchPolicy,
    updateCurrentClaimStatus,
    updateDocumentStatus
  };
};

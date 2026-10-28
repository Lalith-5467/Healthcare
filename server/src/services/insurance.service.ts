import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';
import { emitInsuranceClaimEvent } from '../socket';
import { NotificationService } from './notification.service';

export class InsuranceService {
  /**
   * Get all insurance policies accessible to the user
   */
  static async getPolicies(userId: string, role: Role, search?: string) {
    let whereClause: any = {};

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      whereClause.patientId = patient.id;
    } else if (role === Role.INSURANCE_PROVIDER) {
      const provider = await prisma.insuranceProvider.findUnique({ where: { userId } });
      if (provider) {
        whereClause.providerId = provider.id;
      }
    }

    if (search) {
      whereClause.OR = [
        { policyNumber: { contains: search } },
        { policyName: { contains: search } },
        { insuranceId: { contains: search } },
      ];
    }

    return prisma.insurancePolicy.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true } },
          },
        },
        claims: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get policy by insurance ID or policy number
   */
  static async getPolicyById(idOrInsuranceId: string) {
    const policy = await prisma.insurancePolicy.findFirst({
      where: {
        OR: [
          { id: idOrInsuranceId },
          { insuranceId: idOrInsuranceId },
          { policyNumber: idOrInsuranceId },
        ],
      },
      include: {
        patient: true,
        claims: {
          include: {
            settlements: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        preAuthorizations: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!policy) throw new AppError('Insurance policy not found', 404);
    return policy;
  }

  /**
   * Create or link an insurance policy
   */
  static async createPolicy(userId: string, role: Role, data: any) {
    let patientId = data.patientId;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) {
      const firstPatient = await prisma.patient.findFirst();
      if (!firstPatient) throw new AppError('No patient found to link policy', 400);
      patientId = firstPatient.id;
    }

    const insuranceId = data.insuranceId || `INS-MC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const policyNumber = data.policyNumber || `POL-DHR-${Math.floor(100000 + Math.random() * 900000)}`;

    return prisma.insurancePolicy.create({
      data: {
        insuranceId,
        patientId,
        providerId: data.providerId || null,
        policyNumber,
        policyName: data.policyName || 'Star Health Premier Comprehensive',
        policyStatus: data.policyStatus || 'Active',
        policyStartDate: data.policyStartDate ? new Date(data.policyStartDate) : new Date('2026-01-01'),
        policyEndDate: data.policyEndDate ? new Date(data.policyEndDate) : new Date('2026-12-31'),
        coverageAmount: data.coverageAmount || 1000000.0,
        usedCoverage: data.usedCoverage || 0.0,
        remainingCoverage: data.remainingCoverage || (data.coverageAmount || 1000000.0),
        benefits: typeof data.benefits === 'object' ? JSON.stringify(data.benefits) : data.benefits || null,
      },
      include: {
        patient: true,
      },
    });
  }

  /**
   * Get all claims
   */
  static async getClaims(userId: string, role: Role, status?: string) {
    let whereClause: any = {};

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      whereClause.patientId = patient.id;
    }

    if (status && status !== 'All') {
      whereClause.status = status;
    }

    return prisma.insuranceClaim.findMany({
      where: whereClause,
      include: {
        policy: true,
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true } },
          },
        },
        settlements: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new claim
   */
  static async createClaim(userId: string, role: Role, data: any) {
    let patientId = data.patientId;
    let policyId = data.policyId;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    // If patientId is still not found, try to locate by patient name or default to first patient
    if (!patientId) {
      if (data.patientName) {
        const found = await prisma.patient.findFirst({
          where: { fullName: { contains: data.patientName } }
        });
        if (found) patientId = found.id;
      }
      if (!patientId) {
        const firstPatient = await prisma.patient.findFirst();
        if (firstPatient) patientId = firstPatient.id;
      }
    }

    if (!policyId && patientId) {
      let policy = await prisma.insurancePolicy.findFirst({
        where: data.insuranceId
          ? { insuranceId: data.insuranceId }
          : { patientId },
      });
      if (!policy) {
        policy = await prisma.insurancePolicy.findFirst({
          where: { patientId },
        });
      }

      if (policy) {
        policyId = policy.id;
        patientId = policy.patientId;
      } else {
        // Automatically create active policy for this patient in MySQL so foreign key constraint succeeds
        const insuranceId = data.insuranceId || `INS-MC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const policyNumber = data.policyNumber || `POL-DHR-${Math.floor(100000 + Math.random() * 900000)}`;
        const newPolicy = await prisma.insurancePolicy.create({
          data: {
            insuranceId,
            patientId,
            policyNumber,
            policyName: data.policyName || 'Star Health Premier Comprehensive',
            policyStatus: 'Active',
            policyStartDate: new Date('2026-01-01'),
            policyEndDate: new Date('2026-12-31'),
            coverageAmount: 1000000.0,
            usedCoverage: 0.0,
            remainingCoverage: 1000000.0,
            benefits: JSON.stringify({
              hospitalization: 'Covered',
              emergency: 'Covered',
              consultation: 'Covered',
              diagnostics: 'Covered',
              medicines: 'Covered',
              nursing: 'Covered',
            }),
          },
        });
        policyId = newPolicy.id;
      }
    }

    if (!policyId || !patientId) {
      throw new AppError('Policy and Patient references are required to create a claim', 400);
    }

    const claimId = data.claimId || `CLM-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`;

    // Prevent duplicate claim creation if submitted with identical claimId
    const existingClaim = await prisma.insuranceClaim.findUnique({
      where: { claimId },
      include: {
        policy: true,
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true } },
          },
        },
      },
    });
    if (existingClaim) {
      return existingClaim;
    }

    const defaultTimeline = [
      {
        id: 't-1',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'Claim Submitted Online by Patient with OTP Verification',
        role: 'Patient',
        status: 'Completed',
      },
      {
        id: 't-2',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: 'Claim Under Review by Insurance Desk',
        role: 'TPA Medical Officer',
        status: 'Current',
      },
    ];

    const createdClaim = await prisma.insuranceClaim.create({
      data: {
        claimId,
        policyId,
        patientId,
        hospital: data.hospital || 'Apollo Hospitals, Greams Road',
        treatment: data.treatment || 'Treatment & Observation',
        admissionDate: data.admissionDate ? new Date(data.admissionDate) : new Date(),
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : new Date(),
        submittedAmount: data.submittedAmount || 0,
        approvedAmount: data.approvedAmount || 0,
        patientContribution: data.patientContribution || 0,
        status: data.status || 'Under Review',
        documents: typeof data.documents === 'object' ? JSON.stringify(data.documents) : data.documents || null,
        timeline: JSON.stringify(data.timeline || defaultTimeline),
      },
      include: {
        policy: true,
        patient: {
          include: {
            user: { select: { email: true, phoneNumber: true } },
          },
        },
      },
    });

    // Broadcast real-time claim event and notify insurance providers
    try {
      emitInsuranceClaimEvent('insurance:claim-created', createdClaim);
      const insuranceUsers = await prisma.user.findMany({
        where: { role: Role.INSURANCE_PROVIDER },
        select: { id: true },
      });
      for (const insUser of insuranceUsers) {
        await NotificationService.createNotification({
          userId: insUser.id,
          title: `🚨 Incoming Cashless Claim: ${createdClaim.claimId}`,
          message: `${createdClaim.patient?.fullName || 'Patient'} submitted a pre-auth claim for ₹${Number(createdClaim.submittedAmount).toLocaleString('en-IN')} at ${createdClaim.hospital}. Accept or Decline?`,
          type: 'ALERT',
          category: 'Insurance Pre-Auth',
          relatedModule: 'insurance',
        });
      }
    } catch (e) {
      console.error('Socket emit / notification error in createClaim:', e);
    }

    return createdClaim;
  }

  /**
   * Update claim status (Approve, Reject, Settle)
   */
  static async updateClaimStatus(claimId: string, status: string, approvedAmount?: number, reason?: string) {
    const claim = await prisma.insuranceClaim.findFirst({
      where: {
        OR: [{ id: claimId }, { claimId }],
      },
      include: { policy: true },
    });

    if (!claim) throw new AppError('Claim not found', 404);

    let timeline = [];
    try {
      timeline = claim.timeline ? JSON.parse(claim.timeline) : [];
    } catch {
      timeline = [];
    }

    timeline.push({
      id: `t-${timeline.length + 1}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: reason || `Claim status updated to ${status}`,
      role: 'Insurance Approver',
      status: 'Completed',
    });

    const updateData: any = {
      status,
      timeline: JSON.stringify(timeline),
    };

    if (approvedAmount !== undefined) {
      updateData.approvedAmount = approvedAmount;
      const submitted = Number(claim.submittedAmount);
      updateData.patientContribution = Math.max(0, submitted - approvedAmount);
    }

    const updated = await prisma.insuranceClaim.update({
      where: { id: claim.id },
      data: updateData,
      include: {
        policy: true,
        patient: {
          include: {
            user: { select: { id: true, email: true, phoneNumber: true } },
          },
        },
        settlements: true,
      },
    });

    // Notify patient about claim acceptance or rejection in real time
    if (updated.patient?.userId || updated.patient?.user?.id) {
      const patientUserId = updated.patient.userId || updated.patient.user?.id;
      const isApproved = status === 'Approved' || status === 'Partially Approved';
      const isRejected = status === 'Rejected';
      const isSettled = status === 'Settled';

      let notifTitle = `Claim Update: ${updated.claimId}`;
      let notifMsg = `Your claim status is now ${status}.`;

      if (isApproved) {
        notifTitle = `🎉 Cashless Pre-Auth Claim Approved: ${updated.claimId}`;
        notifMsg = `Your cashless claim for ₹${Number(updated.approvedAmount || updated.submittedAmount).toLocaleString('en-IN')} at ${updated.hospital} has been ACCEPTED & APPROVED by the insurance desk.`;
      } else if (isRejected) {
        notifTitle = `❌ Cashless Claim Declined: ${updated.claimId}`;
        notifMsg = `Your claim for ₹${Number(updated.submittedAmount).toLocaleString('en-IN')} at ${updated.hospital} was DECLINED by the insurance desk. Reason: ${reason || 'Missing itemized hospital pharmacy bills or waiting period exclusion'}.`;
      } else if (isSettled) {
        notifTitle = `💰 Claim Settled: ${updated.claimId}`;
        notifMsg = `Direct hospital cashless settlement completed for ₹${Number(updated.approvedAmount).toLocaleString('en-IN')}.`;
      }

      try {
        await NotificationService.createNotification({
          userId: patientUserId,
          title: notifTitle,
          message: notifMsg,
          type: isApproved ? 'SUCCESS' : isRejected ? 'ALERT' : 'INFO',
          category: 'Insurance Pre-Auth',
          relatedModule: 'insurance',
        });
      } catch (err) {
        console.error('Failed to create notification for patient in updateClaimStatus:', err);
      }
    }

    // Broadcast real-time update event
    try {
      emitInsuranceClaimEvent('insurance:claim-updated', updated);
    } catch (e) {
      console.error('Socket emit error in updateClaimStatus:', e);
    }

    return updated;
  }

  /**
   * Get pre-authorizations
   */
  static async getPreAuthorizations(userId: string, role: Role) {
    return prisma.preAuthorization.findMany({
      include: {
        policy: {
          include: { patient: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get settlements
   */
  static async getSettlements(userId: string, role: Role) {
    return prisma.claimSettlement.findMany({
      include: {
        claim: {
          include: {
            policy: true,
            patient: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

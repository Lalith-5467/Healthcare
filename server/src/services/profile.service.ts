import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuditService } from './audit.service';

export interface PatientUpdateInput {
  fullName?: string;
  gender?: string;
  dateOfBirth?: string | Date;
  bloodGroup?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface DoctorUpdateInput {
  fullName?: string;
  speciality?: string;
  qualification?: string;
  licenseNumber?: string;
  hospital?: string;
  experienceYears?: number;
  consultationFee?: number;
  photoUrl?: string;
  about?: string;
}

export interface NurseUpdateInput {
  fullName?: string;
  hospital?: string;
  department?: string;
  licenseNumber?: string;
}

export interface PharmacistUpdateInput {
  fullName?: string;
  pharmacyName?: string;
  licenseNumber?: string;
}

export interface CaregiverUpdateInput {
  fullName?: string;
  relationship?: string;
  phone?: string;
}

export interface InsuranceUpdateInput {
  providerName?: string;
  licenseNumber?: string;
  supportPhone?: string;
  supportEmail?: string;
}

export class ProfileService {
  /**
   * Get the complete profile for the authenticated user
   */
  static async getCurrentUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        abhaId: true,
        isActive: true,
        createdAt: true,
        patient: true,
        doctor: true,
        nurse: true,
        pharmacist: true,
        caregiver: true,
        insuranceProvider: true,
      },
    });

    if (!user) {
      const err: AppError = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const roleProfile =
      user.patient ||
      user.doctor ||
      user.nurse ||
      user.pharmacist ||
      user.caregiver ||
      user.insuranceProvider ||
      {};

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phoneNumber,
      abhaId: user.abhaId,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      profile: roleProfile,
    };
  }

  // ==========================================
  // PATIENT PROFILE
  // ==========================================
  static async getPatientProfile(userId: string) {
    let patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      // Auto-create if user is a patient but row wasn't initialized
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        const err: AppError = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      patient = await prisma.patient.create({
        data: { userId, fullName: user.email.split('@')[0] },
      });
    }

    return patient;
  }

  static async updatePatientProfile(
    userId: string,
    data: PatientUpdateInput,
    actorId: string,
    ipAddress?: string
  ) {
    let patient = await prisma.patient.findUnique({ where: { userId } });

    if (!patient) {
      patient = await prisma.patient.create({
        data: { userId, fullName: data.fullName || 'Patient' },
      });
    }

    const updated = await prisma.patient.update({
      where: { userId },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.gender !== undefined ? { gender: data.gender } : {}),
        ...(data.dateOfBirth !== undefined
          ? { dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null }
          : {}),
        ...(data.bloodGroup !== undefined ? { bloodGroup: data.bloodGroup } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.emergencyContactName !== undefined
          ? { emergencyContactName: data.emergencyContactName }
          : {}),
        ...(data.emergencyContactPhone !== undefined
          ? { emergencyContactPhone: data.emergencyContactPhone }
          : {}),
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'PROFILE_UPDATED',
      entityType: 'patients',
      entityId: updated.id,
      ipAddress,
      details: { targetUserId: userId, updatedFields: Object.keys(data) },
    });

    return updated;
  }

  // ==========================================
  // DOCTOR PROFILE
  // ==========================================
  static async getDoctorProfile(userId: string) {
    let doctor = await prisma.doctor.findUnique({ where: { userId } });

    if (!doctor) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        const err: AppError = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      doctor = await prisma.doctor.create({
        data: {
          userId,
          fullName: user.email.split('@')[0],
          speciality: 'General Medicine',
        },
      });
    }

    return doctor;
  }

  static async updateDoctorProfile(
    userId: string,
    data: DoctorUpdateInput,
    actorId: string,
    ipAddress?: string
  ) {
    let doctor = await prisma.doctor.findUnique({ where: { userId } });

    if (!doctor) {
      doctor = await prisma.doctor.create({
        data: {
          userId,
          fullName: data.fullName || 'Doctor',
          speciality: data.speciality || 'General Medicine',
        },
      });
    }

    const updated = await prisma.doctor.update({
      where: { userId },
      data: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.speciality !== undefined ? { speciality: data.speciality } : {}),
        ...(data.qualification !== undefined ? { qualification: data.qualification } : {}),
        ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
        ...(data.hospital !== undefined ? { hospital: data.hospital } : {}),
        ...(data.experienceYears !== undefined
          ? { experienceYears: Number(data.experienceYears) }
          : {}),
        ...(data.consultationFee !== undefined
          ? { consultationFee: Number(data.consultationFee) }
          : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl } : {}),
        ...(data.about !== undefined ? { about: data.about } : {}),
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'PROFILE_UPDATED',
      entityType: 'doctors',
      entityId: updated.id,
      ipAddress,
      details: { targetUserId: userId, updatedFields: Object.keys(data) },
    });

    return updated;
  }

  // ==========================================
  // NURSE PROFILE
  // ==========================================
  static async getNurseProfile(userId: string) {
    let nurse = await prisma.nurse.findUnique({ where: { userId } });
    if (!nurse) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        const err: AppError = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      nurse = await prisma.nurse.create({
        data: { userId, fullName: user.email.split('@')[0] },
      });
    }
    return nurse;
  }

  static async updateNurseProfile(
    userId: string,
    data: NurseUpdateInput,
    actorId: string,
    ipAddress?: string
  ) {
    const updated = await prisma.nurse.upsert({
      where: { userId },
      create: {
        userId,
        fullName: data.fullName || 'Nurse',
        hospital: data.hospital,
        department: data.department,
        licenseNumber: data.licenseNumber,
      },
      update: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.hospital !== undefined ? { hospital: data.hospital } : {}),
        ...(data.department !== undefined ? { department: data.department } : {}),
        ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'PROFILE_UPDATED',
      entityType: 'nurses',
      entityId: updated.id,
      ipAddress,
      details: { targetUserId: userId, updatedFields: Object.keys(data) },
    });

    return updated;
  }

  // ==========================================
  // PHARMACIST PROFILE
  // ==========================================
  static async getPharmacistProfile(userId: string) {
    let pharmacist = await prisma.pharmacist.findUnique({ where: { userId } });
    if (!pharmacist) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        const err: AppError = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      pharmacist = await prisma.pharmacist.create({
        data: { userId, fullName: user.email.split('@')[0] },
      });
    }
    return pharmacist;
  }

  static async updatePharmacistProfile(
    userId: string,
    data: PharmacistUpdateInput,
    actorId: string,
    ipAddress?: string
  ) {
    const updated = await prisma.pharmacist.upsert({
      where: { userId },
      create: {
        userId,
        fullName: data.fullName || 'Pharmacist',
        pharmacyName: data.pharmacyName,
        licenseNumber: data.licenseNumber,
      },
      update: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.pharmacyName !== undefined ? { pharmacyName: data.pharmacyName } : {}),
        ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'PROFILE_UPDATED',
      entityType: 'pharmacists',
      entityId: updated.id,
      ipAddress,
      details: { targetUserId: userId, updatedFields: Object.keys(data) },
    });

    return updated;
  }

  // ==========================================
  // CAREGIVER PROFILE
  // ==========================================
  static async getCaregiverProfile(userId: string) {
    let caregiver = await prisma.caregiver.findUnique({ where: { userId } });
    if (!caregiver) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        const err: AppError = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      caregiver = await prisma.caregiver.create({
        data: { userId, fullName: user.email.split('@')[0] },
      });
    }
    return caregiver;
  }

  static async updateCaregiverProfile(
    userId: string,
    data: CaregiverUpdateInput,
    actorId: string,
    ipAddress?: string
  ) {
    const updated = await prisma.caregiver.upsert({
      where: { userId },
      create: {
        userId,
        fullName: data.fullName || 'Caregiver',
        relationship: data.relationship,
        phone: data.phone,
      },
      update: {
        ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
        ...(data.relationship !== undefined ? { relationship: data.relationship } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'PROFILE_UPDATED',
      entityType: 'caregivers',
      entityId: updated.id,
      ipAddress,
      details: { targetUserId: userId, updatedFields: Object.keys(data) },
    });

    return updated;
  }

  // ==========================================
  // INSURANCE PROVIDER PROFILE
  // ==========================================
  static async getInsuranceProfile(userId: string) {
    let provider = await prisma.insuranceProvider.findUnique({ where: { userId } });
    if (!provider) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        const err: AppError = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }
      provider = await prisma.insuranceProvider.create({
        data: { userId, providerName: user.email.split('@')[0] },
      });
    }
    return provider;
  }

  static async updateInsuranceProfile(
    userId: string,
    data: InsuranceUpdateInput,
    actorId: string,
    ipAddress?: string
  ) {
    const updated = await prisma.insuranceProvider.upsert({
      where: { userId },
      create: {
        userId,
        providerName: data.providerName || 'Insurance Provider',
        licenseNumber: data.licenseNumber,
        supportPhone: data.supportPhone,
        supportEmail: data.supportEmail,
      },
      update: {
        ...(data.providerName !== undefined ? { providerName: data.providerName } : {}),
        ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
        ...(data.supportPhone !== undefined ? { supportPhone: data.supportPhone } : {}),
        ...(data.supportEmail !== undefined ? { supportEmail: data.supportEmail } : {}),
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'PROFILE_UPDATED',
      entityType: 'insurance_providers',
      entityId: updated.id,
      ipAddress,
      details: { targetUserId: userId, updatedFields: Object.keys(data) },
    });

    return updated;
  }
}

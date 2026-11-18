import { Prisma, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuditService } from './audit.service';

export interface UserQueryOptions {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
  hospital?: string;
}

export interface HospitalRecord {
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

// Dynamic persistent hospital store
let customRegisteredHospitals: HospitalRecord[] = [];
let hospitalRegistryStore: HospitalRecord[] = [];

export class AdminService {
  /**
   * List users with pagination, filters, and safe projection
   */
  static async getUsers(options: UserQueryOptions) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    // Filter by role if specified
    if (options.role && Object.values(Role).includes(options.role.toUpperCase() as Role)) {
      where.role = options.role.toUpperCase() as Role;
    }

    // Filter by status (ACTIVE / INACTIVE)
    if (options.status) {
      const upper = options.status.toUpperCase();
      if (upper === 'ACTIVE') where.isActive = true;
      if (upper === 'INACTIVE') where.isActive = false;
    }

    // Search by email
    if (options.search) {
      where.email = { contains: options.search };
    }

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          phoneNumber: true,
          abhaId: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          patient: true,
          doctor: true,
          nurse: true,
          pharmacist: true,
          caregiver: true,
          insuranceProvider: true,
        },
      }),
    ]);

    const formattedUsers = users.map((u) => {
      const profile =
        u.patient ||
        u.doctor ||
        u.nurse ||
        u.pharmacist ||
        u.caregiver ||
        u.insuranceProvider ||
        null;

      return {
        id: u.id,
        email: u.email,
        role: u.role,
        phone: u.phoneNumber,
        phoneNumber: u.phoneNumber,
        abhaId: u.abhaId,
        isActive: u.isActive,
        status: u.isActive ? 'ACTIVE' : 'INACTIVE',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        profile,
        patient: u.patient,
        doctor: u.doctor,
        nurse: u.nurse,
        pharmacist: u.pharmacist,
        caregiver: u.caregiver,
        insuranceProvider: u.insuranceProvider,
      };
    });

    return {
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Get single user with profile (excluding passwordHash)
   */
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        abhaId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        patient: true,
        doctor: true,
        nurse: true,
        pharmacist: true,
        caregiver: true,
        insuranceProvider: true,
      },
    });

    if (!user) {
      const err: AppError = new Error(`User with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    const profile =
      user.patient ||
      user.doctor ||
      user.nurse ||
      user.pharmacist ||
      user.caregiver ||
      user.insuranceProvider ||
      null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phoneNumber,
      abhaId: user.abhaId,
      status: user.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile,
    };
  }

  /**
   * Activate or deactivate a user account
   */
  static async updateUserStatus(
    targetUserId: string,
    statusInput: string | boolean,
    actorId: string,
    ipAddress?: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      const err: AppError = new Error(`User with ID ${targetUserId} not found`);
      err.statusCode = 404;
      throw err;
    }

    let isActive = true;
    if (typeof statusInput === 'boolean') {
      isActive = statusInput;
    } else if (typeof statusInput === 'string') {
      const upper = statusInput.toUpperCase();
      if (upper === 'INACTIVE') isActive = false;
      else if (upper === 'ACTIVE') isActive = true;
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        abhaId: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await AuditService.log({
      userId: actorId,
      action: 'USER_STATUS_CHANGED',
      entityType: 'users',
      entityId: targetUserId,
      ipAddress,
      details: {
        previousStatus: user.isActive ? 'ACTIVE' : 'INACTIVE',
        newStatus: isActive ? 'ACTIVE' : 'INACTIVE',
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      phone: updated.phoneNumber,
      abhaId: updated.abhaId,
      status: updated.isActive ? 'ACTIVE' : 'INACTIVE',
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Change user role (SUPER_ADMIN ONLY)
   */
  static async updateUserRole(
    targetUserId: string,
    newRole: Role,
    actorRole: Role,
    actorId: string,
    ipAddress?: string
  ) {
    // Strict enforcement: Only SUPER_ADMIN can change roles
    if (actorRole !== Role.SUPER_ADMIN) {
      const err: AppError = new Error('Access denied: Only SUPER_ADMIN is authorized to change user roles');
      err.statusCode = 403;
      throw err;
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      const err: AppError = new Error(`User with ID ${targetUserId} not found`);
      err.statusCode = 404;
      throw err;
    }

    if (!Object.values(Role).includes(newRole)) {
      const err: AppError = new Error(`Invalid role. Allowed values: ${Object.values(Role).join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    const previousRole = user.role;

    // Update role
    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        role: true,
        phoneNumber: true,
        abhaId: true,
        isActive: true,
        updatedAt: true,
      },
    });

    // Auto-create corresponding profile row if missing for the new role
    const name = user.email.split('@')[0];
    switch (newRole) {
      case Role.DOCTOR:
        await prisma.doctor.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, fullName: name, speciality: 'General Practice' },
          update: {},
        });
        break;
      case Role.NURSE:
        await prisma.nurse.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, fullName: name },
          update: {},
        });
        break;
      case Role.PHARMACIST:
        await prisma.pharmacist.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, fullName: name },
          update: {},
        });
        break;
      case Role.CAREGIVER:
        await prisma.caregiver.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, fullName: name },
          update: {},
        });
        break;
      case Role.INSURANCE_PROVIDER:
        await prisma.insuranceProvider.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, providerName: name },
          update: {},
        });
        break;
      case Role.PATIENT:
        await prisma.patient.upsert({
          where: { userId: targetUserId },
          create: { userId: targetUserId, fullName: name },
          update: {},
        });
        break;
      default:
        break;
    }

    await AuditService.log({
      userId: actorId,
      action: 'USER_ROLE_CHANGED',
      entityType: 'users',
      entityId: targetUserId,
      ipAddress,
      details: { previousRole, newRole },
    });

    return {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      phone: updated.phoneNumber,
      abhaId: updated.abhaId,
      status: updated.isActive ? 'ACTIVE' : 'INACTIVE',
      updatedAt: updated.updatedAt,
    };
  }

  /**
   * Create a new user with role profile in MySQL
   */
  static async createUser(data: {
    email: string;
    password?: string;
    role: Role;
    fullName?: string;
    phoneNumber?: string;
    abhaId?: string;
    isActive?: boolean | string;
    gender?: string;
    dateOfBirth?: string | Date;
    bloodGroup?: string;
    address?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    familyPhone?: string;
    // Patient vitals
    heightCm?: number | string;
    weightKg?: number | string;
    systolicBp?: number | string;
    diastolicBp?: number | string;
    heartRate?: number | string;
    temperature?: number | string;
    // Doctor
    speciality?: string;
    qualification?: string;
    licenseNumber?: string;
    hospital?: string;
    experienceYears?: number | string;
    consultationFee?: number | string;
    about?: string;
    // Nurse
    department?: string;
    // Pharmacist
    pharmacyName?: string;
    // Caregiver
    relationship?: string;
    // InsuranceProvider
    providerName?: string;
    supportPhone?: string;
    supportEmail?: string;
    // Actor info
    actorId: string;
    actorRole?: Role;
    ipAddress?: string;
  }) {
    const {
      email,
      password = 'Password@123',
      role = Role.PATIENT,
      fullName,
      phoneNumber,
      abhaId,
      isActive = true,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      emergencyContactName,
      emergencyContactPhone,
      familyPhone,
      heightCm,
      weightKg,
      systolicBp,
      diastolicBp,
      heartRate,
      temperature,
      speciality,
      qualification,
      licenseNumber,
      hospital,
      experienceYears,
      consultationFee,
      about,
      department,
      pharmacyName,
      relationship,
      providerName,
      supportPhone,
      supportEmail,
      actorRole,
    } = data;

    // Security check: Only SUPER_ADMIN can create another SUPER_ADMIN
    if (role === Role.SUPER_ADMIN && actorRole !== Role.SUPER_ADMIN) {
      const err: AppError = new Error('Access denied: Only Super Admin can provision another Super Admin account');
      err.statusCode = 403;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      const err: AppError = new Error('An account with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    // Check duplicate abhaId
    const trimmedAbha = abhaId && abhaId.trim().length > 0 ? abhaId.trim() : null;
    if (trimmedAbha) {
      const existingAbha = await prisma.user.findUnique({ where: { abhaId: trimmedAbha } });
      if (existingAbha) {
        const err: AppError = new Error('This ABHA ID is already linked to another account');
        err.statusCode = 409;
        throw err;
      }
    }

    const trimmedLicense = licenseNumber && licenseNumber.trim().length > 0 ? licenseNumber.trim() : null;
    const name = fullName?.trim() || normalizedEmail.split('@')[0];
    const passwordHash = await bcrypt.hash(password, 10);
    const parsedDob = dateOfBirth ? new Date(dateOfBirth) : null;
    const activeBool = typeof isActive === 'string' ? isActive.toUpperCase() === 'ACTIVE' : Boolean(isActive);

    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          role,
          phoneNumber: phoneNumber?.trim() || null,
          abhaId: trimmedAbha,
          isActive: activeBool,
        },
      });

      switch (role) {
        case Role.PATIENT: {
          const patient = await tx.patient.create({
            data: {
              userId: user.id,
              fullName: name,
              gender: gender || null,
              dateOfBirth: parsedDob && !isNaN(parsedDob.getTime()) ? parsedDob : null,
              bloodGroup: bloodGroup || null,
              address: address?.trim() || null,
              emergencyContactName: emergencyContactName?.trim() || null,
              emergencyContactPhone: emergencyContactPhone?.trim() || null,
              familyPhone: familyPhone?.trim() || null,
              heightCm: heightCm ? parseFloat(String(heightCm)) : null,
            },
          });

          // Create initial Vital record if any vitals provided
          const hasVitals =
            weightKg != null ||
            systolicBp != null ||
            diastolicBp != null ||
            heartRate != null ||
            temperature != null;

          if (hasVitals) {
            await tx.vital.create({
              data: {
                patientId: patient.id,
                recordedById: user.id,
                weightKg: weightKg ? parseFloat(String(weightKg)) : null,
                systolicBp: systolicBp ? Math.round(Number(systolicBp)) : null,
                diastolicBp: diastolicBp ? Math.round(Number(diastolicBp)) : null,
                heartRate: heartRate ? Math.round(Number(heartRate)) : null,
                temperature: temperature ? parseFloat(String(temperature)) : null,
                notes: 'Initial clinical health vitals recorded via Admin',
              },
            });
          }
          break;
        }
        case Role.DOCTOR: {
          await tx.doctor.create({
            data: {
              userId: user.id,
              fullName: name,
              speciality: speciality?.trim() || 'General Medicine',
              qualification: qualification?.trim() || null,
              licenseNumber: trimmedLicense,
              hospital: hospital?.trim() || null,
              experienceYears: experienceYears ? parseInt(String(experienceYears), 10) : 0,
              consultationFee: consultationFee ? parseFloat(String(consultationFee)) : 0.0,
              about: about?.trim() || null,
            },
          });
          break;
        }
        case Role.NURSE: {
          await tx.nurse.create({
            data: {
              userId: user.id,
              fullName: name,
              hospital: hospital?.trim() || null,
              department: department?.trim() || null,
              licenseNumber: trimmedLicense,
            },
          });
          break;
        }
        case Role.PHARMACIST: {
          await tx.pharmacist.create({
            data: {
              userId: user.id,
              fullName: name,
              pharmacyName: pharmacyName?.trim() || hospital?.trim() || null,
              licenseNumber: trimmedLicense,
            },
          });
          break;
        }
        case Role.CAREGIVER: {
          await tx.caregiver.create({
            data: {
              userId: user.id,
              fullName: name,
              relationship: relationship?.trim() || 'Primary Caregiver',
              phone: phoneNumber?.trim() || null,
            },
          });
          break;
        }
        case Role.INSURANCE_PROVIDER: {
          await tx.insuranceProvider.create({
            data: {
              userId: user.id,
              providerName: providerName?.trim() || name,
              licenseNumber: trimmedLicense,
              supportPhone: supportPhone?.trim() || phoneNumber?.trim() || null,
              supportEmail: supportEmail?.trim() || normalizedEmail,
            },
          });
          break;
        }
        default:
          break;
      }

      return user;
    });

    await AuditService.log({
      userId: data.actorId,
      action: 'USER_CREATED_BY_ADMIN',
      entityType: 'users',
      entityId: createdUser.id,
      ipAddress: data.ipAddress,
      details: { email: createdUser.email, role: createdUser.role },
    });

    return this.getUserById(createdUser.id);
  }

  /**
   * Update user info, profile name, and status in MySQL
   */
  static async updateUser(
    id: string,
    data: {
      email?: string;
      fullName?: string;
      phoneNumber?: string;
      abhaId?: string;
      password?: string;
      role?: Role;
      status?: string | boolean;
      actorId: string;
      actorRole?: Role;
      ipAddress?: string;
    }
  ) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        nurse: true,
        pharmacist: true,
        caregiver: true,
        insuranceProvider: true,
      },
    });

    if (!user) {
      const err: AppError = new Error(`User with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    const updateData: any = {};
    if (data.email && data.email.toLowerCase().trim() !== user.email) {
      const normalizedEmail = data.email.toLowerCase().trim();
      const existingEmail = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existingEmail && existingEmail.id !== id) {
        const err: AppError = new Error('An account with this email already exists');
        err.statusCode = 409;
        throw err;
      }
      updateData.email = normalizedEmail;
    }

    if (data.phoneNumber !== undefined) {
      updateData.phoneNumber = data.phoneNumber?.trim() || null;
    }

    if (data.abhaId !== undefined) {
      const trimmedAbha = data.abhaId && data.abhaId.trim().length > 0 ? data.abhaId.trim() : null;
      if (trimmedAbha && trimmedAbha !== user.abhaId) {
        const existingAbha = await prisma.user.findUnique({ where: { abhaId: trimmedAbha } });
        if (existingAbha && existingAbha.id !== id) {
          const err: AppError = new Error('This ABHA ID is already linked to another account');
          err.statusCode = 409;
          throw err;
        }
      }
      updateData.abhaId = trimmedAbha;
    }

    if (data.status !== undefined) {
      if (typeof data.status === 'boolean') updateData.isActive = data.status;
      else if (typeof data.status === 'string') updateData.isActive = data.status.toUpperCase() === 'ACTIVE';
    }

    if (data.password && data.password.trim().length > 0) {
      updateData.passwordHash = await bcrypt.hash(data.password.trim(), 10);
    }

    if (data.role && Object.values(Role).includes(data.role)) {
      if (data.role !== user.role && data.actorRole !== Role.SUPER_ADMIN) {
        const err: AppError = new Error('Access denied: Only Super Admin is authorized to change user roles');
        err.statusCode = 403;
        throw err;
      }
      updateData.role = data.role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Update profile fullName if provided
    if (data.fullName && data.fullName.trim()) {
      const name = data.fullName.trim();
      if (user.patient) await prisma.patient.update({ where: { id: user.patient.id }, data: { fullName: name } });
      else if (user.doctor) await prisma.doctor.update({ where: { id: user.doctor.id }, data: { fullName: name } });
      else if (user.nurse) await prisma.nurse.update({ where: { id: user.nurse.id }, data: { fullName: name } });
      else if (user.pharmacist) await prisma.pharmacist.update({ where: { id: user.pharmacist.id }, data: { fullName: name } });
      else if (user.caregiver) await prisma.caregiver.update({ where: { id: user.caregiver.id }, data: { fullName: name } });
      else if (user.insuranceProvider) await prisma.insuranceProvider.update({ where: { id: user.insuranceProvider.id }, data: { providerName: name } });
      else {
        if (updatedUser.role === Role.PATIENT) await prisma.patient.create({ data: { userId: id, fullName: name } });
        else if (updatedUser.role === Role.DOCTOR) await prisma.doctor.create({ data: { userId: id, fullName: name, speciality: 'General Practice' } });
      }
    }

    await AuditService.log({
      userId: data.actorId,
      action: 'USER_UPDATED_BY_ADMIN',
      entityType: 'users',
      entityId: id,
      ipAddress: data.ipAddress,
      details: { updateData, fullName: data.fullName },
    });

    return this.getUserById(id);
  }

  /**
   * Delete user from MySQL (cascades to profile)
   */
  static async deleteUser(id: string, actorId: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      const err: AppError = new Error(`User with ID ${id} not found`);
      err.statusCode = 404;
      throw err;
    }

    if (user.role === Role.SUPER_ADMIN && user.email === 'superadmin@dhr-medicare.in') {
      const err: AppError = new Error('Cannot delete root system Super Admin');
      err.statusCode = 403;
      throw err;
    }

    await prisma.user.delete({ where: { id } });

    await AuditService.log({
      userId: actorId,
      action: 'USER_DELETED_BY_ADMIN',
      entityType: 'users',
      entityId: id,
      ipAddress,
      details: { email: user.email, role: user.role },
    });

    return { id, email: user.email, message: 'User deleted successfully' };
  }

  /**
   * Reset user password (ADMIN & SUPER_ADMIN)
   */
  static async resetPassword(targetUserId: string, newPassword?: string, actorId?: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      const err: AppError = new Error(`User with ID ${targetUserId} not found`);
      err.statusCode = 404;
      throw err;
    }

    const passwordToSet = newPassword && newPassword.trim().length > 0 ? newPassword.trim() : 'Password@123';
    const passwordHash = await bcrypt.hash(passwordToSet, 10);

    await prisma.user.update({
      where: { id: targetUserId },
      data: { passwordHash },
    });

    await AuditService.log({
      userId: actorId || null,
      action: 'USER_PASSWORD_RESET',
      entityType: 'users',
      entityId: targetUserId,
      ipAddress,
      details: { email: user.email },
    });

    return {
      id: user.id,
      email: user.email,
      message: 'Password reset successfully',
    };
  }

  /**
   * Paginated audit logs with search and filtering
   */
  static async getAuditLogs(options: {
    page?: number;
    limit?: number;
    search?: string;
    module?: string;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {};

    if (options.module && options.module !== 'All') {
      where.entityType = { contains: options.module };
    }

    if (options.action && options.action !== 'All') {
      where.action = { contains: options.action };
    }

    if (options.userId) {
      where.userId = options.userId;
    }

    if (options.startDate || options.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = new Date(options.startDate);
      }
      if (options.endDate) {
        where.createdAt.lte = new Date(options.endDate);
      }
    }

    if (options.search && options.search.trim()) {
      const q = options.search.trim();
      where.OR = [
        { action: { contains: q } },
        { entityType: { contains: q } },
        { details: { contains: q } },
        { ipAddress: { contains: q } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              patient: { select: { fullName: true } },
              doctor: { select: { fullName: true } },
              nurse: { select: { fullName: true } },
              pharmacist: { select: { fullName: true } },
              caregiver: { select: { fullName: true } },
              insuranceProvider: { select: { providerName: true } },
            },
          },
        },
      }),
    ]);

    const sanitizedLogs = logs.map((log) => {
      let safeDetails = log.details;
      if (safeDetails) {
        try {
          const parsed = JSON.parse(safeDetails);
          if (typeof parsed === 'object' && parsed !== null) {
            delete parsed.password;
            delete parsed.passwordHash;
            delete parsed.token;
            delete parsed.pin;
            delete parsed.otp;
            safeDetails = JSON.stringify(parsed);
          }
        } catch {
          // ignore non-json
        }
      }

      const userName =
        log.user?.patient?.fullName ||
        log.user?.doctor?.fullName ||
        log.user?.nurse?.fullName ||
        log.user?.pharmacist?.fullName ||
        log.user?.caregiver?.fullName ||
        log.user?.insuranceProvider?.providerName ||
        (log.user ? log.user.email.split('@')[0] : 'System Gateway');

      return {
        id: log.id,
        userId: log.userId,
        userName,
        userEmail: log.user?.email || null,
        userRole: log.user?.role || 'SYSTEM',
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        ipAddress: log.ipAddress || '127.0.0.1',
        details: safeDetails,
        createdAt: log.createdAt,
      };
    });

    return {
      logs: sanitizedLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // --- Database-Backed Hospital Management Methods ---
  static async getHospitals() {
    try {
      // 1. Fetch hospitals permanently stored in MySQL
      const dbHospitals = await prisma.hospital.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // 2. Fetch associated practitioners and patients to compute live metrics per hospital
      const [docs, nurses, pharm, cg, ins, patients] = await Promise.all([
        prisma.doctor.findMany({ select: { fullName: true, hospital: true } }),
        prisma.nurse.findMany({ select: { fullName: true, hospital: true } }),
        prisma.pharmacist.findMany({ select: { fullName: true, pharmacyName: true } }),
        prisma.caregiver.findMany({ select: { fullName: true } }),
        prisma.insuranceProvider.findMany({ select: { providerName: true } }),
        prisma.patient.findMany({
          select: {
            fullName: true,
            appointments: { select: { doctor: { select: { hospital: true } } } },
            medicalRecords: { select: { hospital: true } },
          },
        }),
      ]);

      const hospMap = new Map<string, HospitalRecord>();

      // Populate map with database-backed hospitals first
      for (const h of dbHospitals) {
        let depts: string[] = ['General OPD', 'Emergency Care', 'In-Patient Ward', 'Diagnostic Lab'];
        if (h.departments) {
          try {
            depts = JSON.parse(h.departments);
          } catch {}
        }

        // Map HospitalStatus to UI string
        let uiStatus: 'Active' | 'Under Review' | 'Suspended' = 'Under Review';
        if (h.status === 'ACTIVE') uiStatus = 'Active';
        else if (h.status === 'SUSPENDED' || h.status === 'REJECTED') uiStatus = 'Suspended';

        const record: HospitalRecord = {
          id: h.id,
          hospitalId: `HOSP-${h.code}-${h.id.slice(-4).toUpperCase()}`,
          name: h.name,
          code: h.code,
          city: h.city,
          state: h.state,
          address: h.address || `${h.city}, ${h.state}`,
          contactPhone: h.contactPhone || '+91 80 0000 0000',
          email: h.email,
          adminName: h.adminName,
          adminEmail: h.adminEmail,
          bedCapacity: h.bedCapacity || 0,
          activeDoctors: 0,
          activeNurses: 0,
          activePatients: 0,
          activePharmacists: 0,
          activeCaregivers: 0,
          insurancePartnersCount: 0,
          status: uiStatus,
          establishedYear: h.createdAt.getFullYear(),
          accreditation: h.accreditation || 'NABH Accredited',
          departments: depts,
        };
        hospMap.set(h.name.trim().toLowerCase(), record);
      }

      // Also ensure any affiliated hospitals from existing doctors/nurses are present
      const getOrInitHospital = (hospName: string): HospitalRecord => {
        const key = hospName.trim().toLowerCase();
        if (hospMap.has(key)) return hospMap.get(key)!;

        const code = hospName.trim().length >= 3 ? hospName.trim().slice(0, 3).toUpperCase() : 'HOS';
        const nextId = hospMap.size + 1;

        const record: HospitalRecord = {
          id: `HOSP-${String(nextId).padStart(2, '0')}`,
          hospitalId: `HOSP-${code}-${String(nextId).padStart(3, '0')}`,
          name: hospName.trim(),
          code,
          city: 'Chennai',
          state: 'Tamil Nadu',
          address: `${hospName.trim()}, Tamil Nadu`,
          contactPhone: '+91 44 2800 0000',
          email: `admin@${hospName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
          adminName: 'Medical Director',
          adminEmail: `director@${hospName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
          bedCapacity: 0,
          activeDoctors: 0,
          activeNurses: 0,
          activePatients: 0,
          activePharmacists: 0,
          activeCaregivers: 0,
          insurancePartnersCount: 0,
          status: 'Active',
          establishedYear: new Date().getFullYear(),
          accreditation: 'NABH Accredited',
          departments: ['General OPD', 'Emergency Care', 'In-Patient Ward'],
        };
        hospMap.set(key, record);
        return record;
      };

      // Tally practitioner affiliations
      docs.forEach((d) => {
        if (d.hospital) {
          const h = getOrInitHospital(d.hospital);
          h.activeDoctors++;
        }
      });

      nurses.forEach((n) => {
        if (n.hospital) {
          const h = getOrInitHospital(n.hospital);
          h.activeNurses++;
        }
      });

      pharm.forEach((p) => {
        if (p.pharmacyName) {
          const h = getOrInitHospital(p.pharmacyName);
          h.activePharmacists++;
        }
      });

      patients.forEach((pt) => {
        const ptHospitals = new Set([
          ...pt.appointments.map((a) => a.doctor?.hospital),
          ...pt.medicalRecords.map((m) => m.hospital),
        ].filter(Boolean) as string[]);

        ptHospitals.forEach((hName) => {
          const h = getOrInitHospital(hName);
          h.activePatients++;
        });
      });

      const liveList = Array.from(hospMap.values());
      hospitalRegistryStore = liveList;
      return liveList;
    } catch (e: any) {
      console.warn('Error reading hospitals from database:', e?.message);
      return hospitalRegistryStore;
    }
  }

  static async getHospitalById(id: string) {
    const cleanId = String(id).trim();
    // Try database by id, code, or email
    const dbHosp = await prisma.hospital.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { code: cleanId },
          { email: cleanId.toLowerCase() },
          { adminEmail: cleanId.toLowerCase() },
          { name: cleanId },
        ],
      },
    });

    if (dbHosp) {
      let uiStatus: 'Active' | 'Under Review' | 'Suspended' = 'Under Review';
      if (dbHosp.status === 'ACTIVE') uiStatus = 'Active';
      else if (dbHosp.status === 'SUSPENDED' || dbHosp.status === 'REJECTED') uiStatus = 'Suspended';

      let depts = ['General OPD', 'Emergency Care', 'In-Patient Ward'];
      if (dbHosp.departments) {
        try { depts = JSON.parse(dbHosp.departments); } catch {}
      }

      return {
        id: dbHosp.id,
        hospitalId: `HOSP-${dbHosp.code}-${dbHosp.id.slice(-4).toUpperCase()}`,
        name: dbHosp.name,
        code: dbHosp.code,
        city: dbHosp.city,
        state: dbHosp.state,
        address: dbHosp.address || '',
        contactPhone: dbHosp.contactPhone || '',
        email: dbHosp.email,
        adminName: dbHosp.adminName,
        adminEmail: dbHosp.adminEmail,
        bedCapacity: dbHosp.bedCapacity,
        activeDoctors: 0,
        activeNurses: 0,
        activePatients: 0,
        activePharmacists: 0,
        activeCaregivers: 0,
        insurancePartnersCount: 0,
        status: uiStatus,
        establishedYear: dbHosp.createdAt.getFullYear(),
        accreditation: dbHosp.accreditation || 'NABH Accredited',
        departments: depts,
      };
    }

    const inMemory = hospitalRegistryStore.find((h) => h.id === id || h.hospitalId === id || h.name.toLowerCase() === cleanId.toLowerCase());
    if (inMemory) return inMemory;

    throw new AppError('Hospital record not found', 404);
  }

  static async createHospital(data: Partial<HospitalRecord>) {
    if (!data.name?.trim()) throw new AppError('Hospital name is required', 400);
    if (!data.adminEmail?.trim()) throw new AppError('Administrator email is required', 400);

    const normName = data.name.trim();
    const normAdminEmail = data.adminEmail.trim().toLowerCase();
    const normEmail = (data.email?.trim() || normAdminEmail).toLowerCase();
    const code = (data.code?.trim() || normName.slice(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900)).toUpperCase();

    // Check duplicate in MySQL
    const existing = await prisma.hospital.findFirst({
      where: {
        OR: [
          { email: normEmail },
          { adminEmail: normAdminEmail },
          { code },
          { name: normName },
        ],
      },
    });

    let dbStatus: 'UNDER_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' = 'UNDER_REVIEW';
    if (data.status === 'Active') dbStatus = 'ACTIVE';
    else if (data.status === 'Suspended') dbStatus = 'SUSPENDED';

    const deptsJson = JSON.stringify(data.departments && data.departments.length > 0 ? data.departments : ['General OPD', 'Emergency Care', 'In-Patient Ward', 'Diagnostic Lab']);

    let record: any;
    if (existing) {
      // Update existing record safely
      record = await prisma.hospital.update({
        where: { id: existing.id },
        data: {
          name: normName,
          city: data.city?.trim() || existing.city,
          state: data.state?.trim() || existing.state,
          address: data.address?.trim() || existing.address,
          contactPhone: data.contactPhone?.trim() || existing.contactPhone,
          adminName: data.adminName?.trim() || existing.adminName,
          bedCapacity: Number(data.bedCapacity) || existing.bedCapacity,
          accreditation: data.accreditation?.trim() || existing.accreditation,
          status: dbStatus,
          departments: deptsJson,
        },
      });
    } else {
      // Create new hospital row in MySQL
      record = await prisma.hospital.create({
        data: {
          name: normName,
          code,
          city: data.city?.trim() || 'Chennai',
          state: data.state?.trim() || 'Tamil Nadu',
          address: data.address?.trim() || `${normName}, Tamil Nadu`,
          contactPhone: data.contactPhone?.trim() || '+91 80 0000 0000',
          email: normEmail,
          adminName: data.adminName?.trim() || 'Hospital Administrator',
          adminEmail: normAdminEmail,
          bedCapacity: Number(data.bedCapacity) || 0,
          accreditation: data.accreditation?.trim() || 'NABH Accredited',
          status: dbStatus,
          departments: deptsJson,
        },
      });
    }

    let uiStatus: 'Active' | 'Under Review' | 'Suspended' = 'Under Review';
    if (record.status === 'ACTIVE') uiStatus = 'Active';
    else if (record.status === 'SUSPENDED' || record.status === 'REJECTED') uiStatus = 'Suspended';

    const newHospital: HospitalRecord = {
      id: record.id,
      hospitalId: `HOSP-${record.code}-${record.id.slice(-4).toUpperCase()}`,
      name: record.name,
      code: record.code,
      city: record.city,
      state: record.state,
      address: record.address || '',
      contactPhone: record.contactPhone || '',
      email: record.email,
      adminName: record.adminName,
      adminEmail: record.adminEmail,
      bedCapacity: record.bedCapacity,
      activeDoctors: 0,
      activeNurses: 0,
      activePatients: 0,
      activePharmacists: 0,
      activeCaregivers: 0,
      insurancePartnersCount: 0,
      status: uiStatus,
      establishedYear: record.createdAt.getFullYear(),
      accreditation: record.accreditation || 'NABH Accredited',
      departments: ['General OPD', 'Emergency Care', 'In-Patient Ward', 'Diagnostic Lab'],
    };

    return newHospital;
  }

  static async updateHospital(id: string, updates: Partial<HospitalRecord>) {
    const cleanId = String(id).trim();

    // Map status from UI string to DB enum
    let dbStatus: 'UNDER_REVIEW' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED' | undefined;
    if (updates.status) {
      const s = String(updates.status).toUpperCase();
      if (s === 'ACTIVE') dbStatus = 'ACTIVE';
      else if (s === 'UNDER REVIEW' || s === 'UNDER_REVIEW' || s === 'PENDING') dbStatus = 'UNDER_REVIEW';
      else if (s === 'SUSPENDED') dbStatus = 'SUSPENDED';
      else if (s === 'REJECTED') dbStatus = 'REJECTED';
    }

    // Find in database by id, code, email, adminEmail, or name
    let existing = await prisma.hospital.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { code: cleanId },
          { adminEmail: cleanId.toLowerCase() },
          { email: cleanId.toLowerCase() },
          { name: cleanId },
        ],
      },
    });

    if (!existing && updates.name) {
      existing = await prisma.hospital.findFirst({
        where: { name: updates.name.trim() },
      });
    }

    if (existing) {
      const updated = await prisma.hospital.update({
        where: { id: existing.id },
        data: {
          ...(updates.name ? { name: updates.name.trim() } : {}),
          ...(updates.city ? { city: updates.city.trim() } : {}),
          ...(updates.state ? { state: updates.state.trim() } : {}),
          ...(updates.address ? { address: updates.address.trim() } : {}),
          ...(updates.contactPhone ? { contactPhone: updates.contactPhone.trim() } : {}),
          ...(updates.adminName ? { adminName: updates.adminName.trim() } : {}),
          ...(updates.bedCapacity !== undefined ? { bedCapacity: Number(updates.bedCapacity) } : {}),
          ...(updates.accreditation ? { accreditation: updates.accreditation.trim() } : {}),
          ...(dbStatus ? { status: dbStatus } : {}),
          ...(updates.departments ? { departments: JSON.stringify(updates.departments) } : {}),
        },
      });

      let uiStatus: 'Active' | 'Under Review' | 'Suspended' = 'Under Review';
      if (updated.status === 'ACTIVE') uiStatus = 'Active';
      else if (updated.status === 'SUSPENDED' || updated.status === 'REJECTED') uiStatus = 'Suspended';

      let depts = ['General OPD', 'Emergency Care', 'In-Patient Ward'];
      if (updated.departments) {
        try { depts = JSON.parse(updated.departments); } catch {}
      }

      return {
        id: updated.id,
        hospitalId: `HOSP-${updated.code}-${updated.id.slice(-4).toUpperCase()}`,
        name: updated.name,
        code: updated.code,
        city: updated.city,
        state: updated.state,
        address: updated.address || '',
        contactPhone: updated.contactPhone || '',
        email: updated.email,
        adminName: updated.adminName,
        adminEmail: updated.adminEmail,
        bedCapacity: updated.bedCapacity,
        activeDoctors: updates.activeDoctors || 0,
        activeNurses: updates.activeNurses || 0,
        activePatients: updates.activePatients || 0,
        activePharmacists: updates.activePharmacists || 0,
        activeCaregivers: updates.activeCaregivers || 0,
        insurancePartnersCount: updates.insurancePartnersCount || 0,
        status: uiStatus,
        establishedYear: updated.createdAt.getFullYear(),
        accreditation: updated.accreditation || 'NABH Accredited',
        departments: depts,
      };
    }

    // If record did not exist in MySQL yet (e.g. legacy name), create it directly
    const name = updates.name || cleanId;
    const code = updates.code || name.slice(0, 3).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    const created = await prisma.hospital.create({
      data: {
        name,
        code,
        city: updates.city || 'Chennai',
        state: updates.state || 'Tamil Nadu',
        address: updates.address || `${name}, Tamil Nadu`,
        contactPhone: updates.contactPhone || '+91 80 0000 0000',
        email: updates.email || updates.adminEmail || `admin@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        adminName: updates.adminName || 'Hospital Administrator',
        adminEmail: updates.adminEmail || updates.email || `director@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.in`,
        bedCapacity: updates.bedCapacity || 0,
        accreditation: updates.accreditation || 'NABH Accredited',
        status: dbStatus || 'ACTIVE',
        departments: JSON.stringify(updates.departments || ['General OPD', 'Emergency Care', 'In-Patient Ward']),
      },
    });

    return {
      id: created.id,
      hospitalId: `HOSP-${created.code}-${created.id.slice(-4).toUpperCase()}`,
      name: created.name,
      code: created.code,
      city: created.city,
      state: created.state,
      address: created.address || '',
      contactPhone: created.contactPhone || '',
      email: created.email,
      adminName: created.adminName,
      adminEmail: created.adminEmail,
      bedCapacity: created.bedCapacity,
      activeDoctors: 0,
      activeNurses: 0,
      activePatients: 0,
      activePharmacists: 0,
      activeCaregivers: 0,
      insurancePartnersCount: 0,
      status: created.status === 'ACTIVE' ? 'Active' : 'Suspended',
      establishedYear: created.createdAt.getFullYear(),
      accreditation: created.accreditation || 'NABH Accredited',
      departments: updates.departments || ['General OPD', 'Emergency Care', 'In-Patient Ward'],
    };
  }

  static async deleteHospital(id: string) {
    const cleanId = String(id).trim();
    const existing = await prisma.hospital.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { code: cleanId },
          { adminEmail: cleanId.toLowerCase() },
          { email: cleanId.toLowerCase() },
          { name: cleanId },
        ],
      },
    });

    if (existing) {
      await prisma.hospital.delete({ where: { id: existing.id } });
      return { id: existing.id, name: existing.name };
    }

    const index = hospitalRegistryStore.findIndex((h) => h.id === id || h.hospitalId === id);
    if (index === -1) throw new AppError('Hospital record not found', 404);
    const removed = hospitalRegistryStore.splice(index, 1)[0];
    return removed;
  }
}

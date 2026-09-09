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
}

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
        abhaId: u.abhaId,
        status: u.isActive ? 'ACTIVE' : 'INACTIVE',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        profile,
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
    } = data;

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
      role?: Role;
      status?: string | boolean;
      actorId: string;
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

    if (data.role && Object.values(Role).includes(data.role)) {
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
}

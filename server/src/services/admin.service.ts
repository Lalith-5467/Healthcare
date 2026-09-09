import { Prisma, Role } from '@prisma/client';
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
}

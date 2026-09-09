import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthUser } from '../@types/express';
import { AuditService } from './audit.service';

export interface CreatePharmacyInput {
  pharmacyId: string;
  name: string;
  licenseNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  isVerified?: boolean;
  isActive?: boolean;
  tieUpStatus?: string;
}

export interface UpdatePharmacyInput {
  name?: string;
  licenseNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  isVerified?: boolean;
  isActive?: boolean;
  tieUpStatus?: string;
}

export interface PharmacyQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: boolean | string;
  isActive?: boolean | string;
  tieUpStatus?: string;
}

export class PharmacyService {
  /**
   * Register a new pharmacy network partner (Admin/SuperAdmin)
   */
  static async createPharmacy(
    data: CreatePharmacyInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    // 1. Check for duplicate pharmacyId
    const existingById = await prisma.pharmacy.findUnique({
      where: { pharmacyId: data.pharmacyId },
    });
    if (existingById) {
      const err: AppError = new Error(`Pharmacy with ID "${data.pharmacyId}" is already registered`);
      err.statusCode = 409;
      throw err;
    }

    // 2. Check for duplicate licenseNumber if provided
    if (data.licenseNumber) {
      const existingByLic = await prisma.pharmacy.findUnique({
        where: { licenseNumber: data.licenseNumber },
      });
      if (existingByLic) {
        const err: AppError = new Error(`Pharmacy with license number "${data.licenseNumber}" is already registered`);
        err.statusCode = 409;
        throw err;
      }
    }

    // 3. Create Pharmacy
    const pharmacy = await prisma.pharmacy.create({
      data: {
        pharmacyId: data.pharmacyId,
        name: data.name,
        licenseNumber: data.licenseNumber || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        pincode: data.pincode || null,
        phone: data.phone || null,
        email: data.email || null,
        isVerified: data.isVerified ?? false,
        isActive: data.isActive ?? true,
        tieUpStatus: data.tieUpStatus || 'ACTIVE',
      },
    });

    // 4. Audit Log
    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_CREATED',
      entityType: 'pharmacies',
      entityId: pharmacy.id,
      ipAddress,
      details: {
        pharmacyId: pharmacy.pharmacyId,
        name: pharmacy.name,
      },
    });

    return pharmacy;
  }

  /**
   * Get all registered pharmacies (Admin/SuperAdmin) with pagination & filters
   */
  static async getPharmacies(options: PharmacyQueryOptions) {
    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));
    const skip = (page - 1) * limit;

    const where: Prisma.PharmacyWhereInput = {};

    if (options.isVerified !== undefined) {
      where.isVerified = options.isVerified === true || options.isVerified === 'true';
    }
    if (options.isActive !== undefined) {
      where.isActive = options.isActive === true || options.isActive === 'true';
    }
    if (options.tieUpStatus) {
      where.tieUpStatus = options.tieUpStatus.toUpperCase();
    }
    if (options.search) {
      where.OR = [
        { name: { contains: options.search } },
        { pharmacyId: { contains: options.search } },
        { city: { contains: options.search } },
        { licenseNumber: { contains: options.search } },
      ];
    }

    const [total, pharmacies] = await Promise.all([
      prisma.pharmacy.count({ where }),
      prisma.pharmacy.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { pharmacists: true, orders: true },
          },
        },
      }),
    ]);

    return {
      pharmacies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Validate pharmacy eligibility for receiving DHR prescription orders
   * Checks:
   * 1. Pharmacy exists in database
   * 2. isVerified === true
   * 3. isActive === true
   * 4. tieUpStatus === 'ACTIVE'
   * 5. At least one active pharmacist is associated with it
   */
  static async validatePharmacyEligibility(idOrPharmacyId: string) {
    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [{ id: idOrPharmacyId }, { pharmacyId: idOrPharmacyId }],
      },
      include: {
        pharmacists: {
          include: {
            user: {
              select: {
                id: true,
                isActive: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!pharmacy) {
      const err: AppError = new Error(`Pharmacy with ID "${idOrPharmacyId}" not found in registered DHR network`);
      err.statusCode = 404;
      (err as any).code = 'PHARMACY_NOT_FOUND';
      throw err;
    }

    if (!pharmacy.isVerified) {
      const err: AppError = new Error(`Pharmacy "${pharmacy.name}" (${pharmacy.pharmacyId}) is not yet verified by DHR administrators`);
      err.statusCode = 400;
      (err as any).code = 'PHARMACY_NOT_VERIFIED';
      throw err;
    }

    if (!pharmacy.isActive) {
      const err: AppError = new Error(`Pharmacy "${pharmacy.name}" (${pharmacy.pharmacyId}) is currently inactive`);
      err.statusCode = 400;
      (err as any).code = 'PHARMACY_INACTIVE';
      throw err;
    }

    if (pharmacy.tieUpStatus !== 'ACTIVE') {
      const err: AppError = new Error(`Pharmacy "${pharmacy.name}" (${pharmacy.pharmacyId}) tie-up status is "${pharmacy.tieUpStatus}". Only ACTIVE tie-up pharmacies can receive orders`);
      err.statusCode = 400;
      (err as any).code = 'PHARMACY_TIEUP_NOT_ACTIVE';
      throw err;
    }

    const hasActivePharmacist =
      pharmacy.pharmacists &&
      pharmacy.pharmacists.some((p) => p.user && p.user.isActive);

    if (!hasActivePharmacist) {
      const err: AppError = new Error(`Pharmacy "${pharmacy.name}" (${pharmacy.pharmacyId}) has no active registered pharmacist associated`);
      err.statusCode = 400;
      (err as any).code = 'NO_ACTIVE_PHARMACIST';
      throw err;
    }

    return pharmacy;
  }

  /**
   * Patient Pharmacy Selection: Get ONLY verified + active + ACTIVE tie-up pharmacies with active pharmacists
   */
  static async getAvailablePharmacies() {
    const pharmacies = await prisma.pharmacy.findMany({
      where: {
        isVerified: true,
        isActive: true,
        tieUpStatus: 'ACTIVE',
        pharmacists: {
          some: {
            user: {
              isActive: true,
            },
          },
        },
      },
      select: {
        id: true,
        pharmacyId: true,
        name: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        phone: true,
        email: true,
        isVerified: true,
        isActive: true,
        tieUpStatus: true,
      },
      orderBy: { name: 'asc' },
    });

    return pharmacies;
  }

  /**
   * Get single pharmacy by ID or public pharmacyId
   */
  static async getPharmacyById(idOrPharmacyId: string) {
    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        OR: [{ id: idOrPharmacyId }, { pharmacyId: idOrPharmacyId }],
      },
      include: {
        pharmacists: {
          select: {
            id: true,
            fullName: true,
            licenseNumber: true,
          },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!pharmacy) {
      const err: AppError = new Error(`Pharmacy with ID "${idOrPharmacyId}" not found`);
      err.statusCode = 404;
      throw err;
    }

    return pharmacy;
  }

  /**
   * Update pharmacy details (Admin/SuperAdmin)
   */
  static async updatePharmacy(
    id: string,
    data: UpdatePharmacyInput,
    user: AuthUser,
    ipAddress?: string
  ) {
    const existing = await prisma.pharmacy.findUnique({ where: { id } });
    if (!existing) {
      const err: AppError = new Error(`Pharmacy with ID "${id}" not found`);
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.pharmacy.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_UPDATED',
      entityType: 'pharmacies',
      entityId: updated.id,
      ipAddress,
      details: { updatedFields: Object.keys(data), pharmacyId: updated.pharmacyId },
    });

    return updated;
  }

  /**
   * Verify pharmacy (Admin/SuperAdmin)
   */
  static async verifyPharmacy(
    id: string,
    isVerified: boolean,
    user: AuthUser,
    ipAddress?: string
  ) {
    const existing = await prisma.pharmacy.findUnique({ where: { id } });
    if (!existing) {
      const err: AppError = new Error(`Pharmacy with ID "${id}" not found`);
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.pharmacy.update({
      where: { id },
      data: { isVerified },
    });

    await AuditService.log({
      userId: user.id,
      action: 'PHARMACY_VERIFIED',
      entityType: 'pharmacies',
      entityId: updated.id,
      ipAddress,
      details: {
        pharmacyId: updated.pharmacyId,
        previousState: existing.isVerified,
        newState: isVerified,
      },
    });

    return updated;
  }

  /**
   * Update pharmacy active status & tie-up status (Admin/SuperAdmin)
   */
  static async updatePharmacyStatus(
    id: string,
    data: { isActive?: boolean; tieUpStatus?: string },
    user: AuthUser,
    ipAddress?: string
  ) {
    const existing = await prisma.pharmacy.findUnique({ where: { id } });
    if (!existing) {
      const err: AppError = new Error(`Pharmacy with ID "${id}" not found`);
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.pharmacy.update({
      where: { id },
      data: {
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        ...(data.tieUpStatus !== undefined ? { tieUpStatus: data.tieUpStatus.toUpperCase() } : {}),
      },
    });

    const action =
      data.isActive === false || data.tieUpStatus === 'SUSPENDED'
        ? 'PHARMACY_SUSPENDED'
        : 'PHARMACY_ACTIVATED';

    await AuditService.log({
      userId: user.id,
      action,
      entityType: 'pharmacies',
      entityId: updated.id,
      ipAddress,
      details: {
        pharmacyId: updated.pharmacyId,
        isActive: updated.isActive,
        tieUpStatus: updated.tieUpStatus,
      },
    });

    return updated;
  }
}

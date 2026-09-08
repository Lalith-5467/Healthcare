import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { config } from '../config/env';
import { AppError } from '../middleware/errorHandler';

export interface RegisterDTO {
  email: string;
  password: string;
  role?: Role;
  fullName?: string;
  phoneNumber?: string;
  abhaId?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  familyPhone?: string;
  heightCm?: number;
  weightKg?: number;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  temperature?: number;
  speciality?: string;
  hospital?: string;
  providerName?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface SafeUser {
  id: string;
  email: string;
  role: Role;
  abhaId?: string | null;
  phoneNumber?: string | null;
  isActive: boolean;
  createdAt: Date;
  profile?: unknown;
  vitals?: unknown;
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

interface OtpEntry {
  otp: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpEntry>();

const SALT_ROUNDS = 10;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class AuthService {
  /**
   * Hash a plain-text password using bcryptjs
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare a plain-text password against a bcrypt hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a signed JWT token
   */
  static generateToken(user: { id: string; email: string; role: Role }): string {
    const secret = config.jwtSecret as jwt.Secret;
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
      }
    );
  }

  /**
   * Send Email Verification OTP (For when email verification is enabled)
   */
  static async sendEmailOtp(email: string): Promise<{ success: boolean; message: string; previewCode?: string }> {
    if (!email || !EMAIL_REGEX.test(email)) {
      const err: AppError = new Error('A valid email address is required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already registered
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      const err: AppError = new Error('An account with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    // Generate secure 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(normalizedEmail, {
      otp: code,
      expiresAt,
      attempts: 0,
    });

    console.log(`[Email Verification OTP] Generated code for ${normalizedEmail}: ${code}`);

    return {
      success: true,
      message: `Verification code sent to ${normalizedEmail}`,
      previewCode: code,
    };
  }

  /**
   * Verify Email OTP
   */
  static async verifyEmailOtp(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    if (!email || !otp) {
      const err: AppError = new Error('Email and verification code are required');
      err.statusCode = 400;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const entry = otpStore.get(normalizedEmail);

    if (!entry) {
      const err: AppError = new Error('No verification code requested for this email or it has expired. Please request a new code.');
      err.statusCode = 400;
      throw err;
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(normalizedEmail);
      const err: AppError = new Error('Verification code has expired. Please request a new code.');
      err.statusCode = 400;
      throw err;
    }

    if (entry.otp !== otp.trim()) {
      entry.attempts += 1;
      if (entry.attempts >= 5) {
        otpStore.delete(normalizedEmail);
        const err: AppError = new Error('Too many invalid attempts. Please request a new verification code.');
        err.statusCode = 429;
        throw err;
      }
      const err: AppError = new Error('Invalid verification code. Please check and try again.');
      err.statusCode = 400;
      throw err;
    }

    // Successfully verified -> clean up OTP
    otpStore.delete(normalizedEmail);
    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  /**
   * Register a new user with atomic transaction safety across User, Profile, and Vitals
   */
  static async register(data: RegisterDTO): Promise<AuthResponse> {
    const { email, password, role = Role.PATIENT, fullName, phoneNumber, abhaId } = data;

    // 1. Validation
    if (!email || !password) {
      const err: AppError = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    if (!EMAIL_REGEX.test(email)) {
      const err: AppError = new Error('Invalid email format');
      err.statusCode = 400;
      throw err;
    }

    if (password.length < 8) {
      const err: AppError = new Error('Password must be at least 8 characters long');
      err.statusCode = 400;
      throw err;
    }

    if (!Object.values(Role).includes(role)) {
      const err: AppError = new Error(`Invalid role. Allowed roles: ${Object.values(Role).join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    // 2. Prevent duplicate email
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      const err: AppError = new Error('An account with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    // 2b. Prevent duplicate ABHA ID if provided
    const trimmedAbhaId = abhaId && abhaId.trim().length > 0 ? abhaId.trim() : null;
    if (trimmedAbhaId) {
      const existingAbha = await prisma.user.findUnique({
        where: { abhaId: trimmedAbhaId },
      });

      if (existingAbha) {
        const err: AppError = new Error('This ABHA ID is already linked to another account. Please provide a different ABHA ID or leave it blank.');
        err.statusCode = 409;
        throw err;
      }
    }

    // 3. Hash password
    const passwordHash = await this.hashPassword(password);
    const name = fullName || email.split('@')[0];

    // 4. Atomic Transaction across User + Role Profile + Initial Vitals
    const result = await prisma.$transaction(async (tx) => {
      // 4a. Create User
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          role,
          phoneNumber: phoneNumber?.trim() || null,
          abhaId: trimmedAbhaId,
        },
      });

      let profileData: any = null;
      let vitalData: any = null;

      // 4b. Create Role-specific Profile
      switch (role) {
        case Role.PATIENT: {
          profileData = await tx.patient.create({
            data: {
              userId: user.id,
              fullName: name,
              gender: data.gender || null,
              dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
              bloodGroup: data.bloodGroup || null,
              address: data.address || null,
              emergencyContactName: data.emergencyContactName || null,
              emergencyContactPhone: data.emergencyContactPhone || null,
              familyPhone: data.familyPhone || null,
              heightCm: data.heightCm ? Number(data.heightCm) : null,
            },
          });

          // 4c. Create initial Vital record if any health measurements are provided
          const hasVitals =
            data.weightKg != null ||
            data.systolicBp != null ||
            data.diastolicBp != null ||
            data.heartRate != null ||
            data.temperature != null;

          if (hasVitals) {
            vitalData = await tx.vital.create({
              data: {
                patientId: profileData.id,
                recordedById: user.id,
                weightKg: data.weightKg ? Number(data.weightKg) : null,
                systolicBp: data.systolicBp ? Math.round(Number(data.systolicBp)) : null,
                diastolicBp: data.diastolicBp ? Math.round(Number(data.diastolicBp)) : null,
                heartRate: data.heartRate ? Math.round(Number(data.heartRate)) : null,
                temperature: data.temperature ? Number(data.temperature) : null,
                notes: 'Initial registration health vitals',
              },
            });
          }
          break;
        }
        case Role.DOCTOR:
          profileData = await tx.doctor.create({
            data: {
              userId: user.id,
              fullName: name,
              speciality: data.speciality || 'General Medicine',
              hospital: data.hospital || null,
            },
          });
          break;
        case Role.NURSE:
          profileData = await tx.nurse.create({
            data: { userId: user.id, fullName: name },
          });
          break;
        case Role.PHARMACIST:
          profileData = await tx.pharmacist.create({
            data: { userId: user.id, fullName: name },
          });
          break;
        case Role.CAREGIVER:
          profileData = await tx.caregiver.create({
            data: { userId: user.id, fullName: name },
          });
          break;
        case Role.INSURANCE_PROVIDER:
          profileData = await tx.insuranceProvider.create({
            data: { userId: user.id, providerName: data.providerName || name },
          });
          break;
        default:
          break;
      }

      return { user, profileData, vitalData };
    });

    // 5. Generate token & safe user response
    const token = this.generateToken({ id: result.user.id, email: result.user.email, role: result.user.role });

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        abhaId: result.user.abhaId,
        phoneNumber: result.user.phoneNumber,
        isActive: result.user.isActive,
        createdAt: result.user.createdAt,
        profile: result.profileData,
        vitals: result.vitalData,
      },
      token,
    };
  }

  /**
   * Authenticate a user by email & password and return a JWT
   */
  static async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    if (!email || !password) {
      const err: AppError = new Error('Email/ID and password are required');
      err.statusCode = 400;
      throw err;
    }

    const cleanIdentifier = email.trim();

    // 1. Find user by email, abhaId, or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier.toLowerCase() },
          { abhaId: cleanIdentifier },
          { phoneNumber: cleanIdentifier },
        ],
      },
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
      const err: AppError = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    // 2. Verify account status
    if (!user.isActive) {
      const err: AppError = new Error('Account is deactivated. Please contact support.');
      err.statusCode = 403;
      throw err;
    }

    // 3. Verify password
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const err: AppError = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    // 4. Generate JWT
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });

    // Determine relevant profile
    const profile =
      user.patient ||
      user.doctor ||
      user.nurse ||
      user.pharmacist ||
      user.caregiver ||
      user.insuranceProvider ||
      null;

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        abhaId: user.abhaId,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        createdAt: user.createdAt,
        profile,
      },
      token,
    };
  }

  /**
   * Get safe profile of currently authenticated user
   */
  static async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      const err: AppError = new Error('User not found');
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
      abhaId: user.abhaId,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile,
    };
  }
}

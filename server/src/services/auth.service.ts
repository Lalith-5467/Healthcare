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
}

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

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
   * Register a new user with secure password hashing and profile creation
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
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      const err: AppError = new Error('An account with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    // 3. Hash password
    const passwordHash = await this.hashPassword(password);

    // 4. Create user record
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role,
        phoneNumber: phoneNumber || null,
        abhaId: abhaId || null,
      },
    });

    // 5. Create associated role profile if fullName is provided
    let profileData: unknown = null;
    const name = fullName || email.split('@')[0];

    switch (role) {
      case Role.PATIENT:
        profileData = await prisma.patient.create({
          data: { userId: user.id, fullName: name },
        });
        break;
      case Role.DOCTOR:
        profileData = await prisma.doctor.create({
          data: { userId: user.id, fullName: name, speciality: 'General Medicine' },
        });
        break;
      case Role.NURSE:
        profileData = await prisma.nurse.create({
          data: { userId: user.id, fullName: name },
        });
        break;
      case Role.PHARMACIST:
        profileData = await prisma.pharmacist.create({
          data: { userId: user.id, fullName: name },
        });
        break;
      case Role.CAREGIVER:
        profileData = await prisma.caregiver.create({
          data: { userId: user.id, fullName: name },
        });
        break;
      case Role.INSURANCE_PROVIDER:
        profileData = await prisma.insuranceProvider.create({
          data: { userId: user.id, providerName: name },
        });
        break;
      default:
        break;
    }

    // 6. Generate token & safe user
    const token = this.generateToken({ id: user.id, email: user.email, role: user.role });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        abhaId: user.abhaId,
        phoneNumber: user.phoneNumber,
        isActive: user.isActive,
        createdAt: user.createdAt,
        profile: profileData,
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
      const err: AppError = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
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

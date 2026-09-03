import { z } from 'zod';
import { Role, RecordType, PrescriptionStatus } from '@prisma/client';

export const patientUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  gender: z.string().max(20).optional(),
  dateOfBirth: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  bloodGroup: z.string().max(10).optional(),
  address: z.string().max(500).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(30).optional(),
});

export const doctorUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  speciality: z.string().min(1).max(100).optional(),
  qualification: z.string().max(200).optional(),
  licenseNumber: z.string().max(100).optional(),
  hospital: z.string().max(200).optional(),
  experienceYears: z.number().int().min(0).max(80).optional(),
  consultationFee: z.number().min(0).optional(),
  photoUrl: z.string().url().or(z.string().max(500)).optional(),
  about: z.string().max(2000).optional(),
});

export const nurseUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  hospital: z.string().max(200).optional(),
  department: z.string().max(100).optional(),
  licenseNumber: z.string().max(100).optional(),
});

export const pharmacistUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  pharmacyName: z.string().max(200).optional(),
  licenseNumber: z.string().max(100).optional(),
  pharmacyId: z.string().optional(),
});

export const caregiverUpdateSchema = z.object({
  fullName: z.string().min(1).max(100).optional(),
  relationship: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
});

export const insuranceUpdateSchema = z.object({
  providerName: z.string().min(1).max(200).optional(),
  licenseNumber: z.string().max(100).optional(),
  supportPhone: z.string().max(30).optional(),
  supportEmail: z.string().email().optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']).or(z.boolean()),
});

export const roleUpdateSchema = z.object({
  role: z.nativeEnum(Role),
});

// ==========================================
// MEDICAL RECORD VALIDATION SCHEMAS
// ==========================================
export const createMedicalRecordSchema = z.object({
  patientId: z.string().min(1, 'patientId is required'),
  title: z.string().min(1, 'title is required').max(200),
  type: z.nativeEnum(RecordType).optional(),
  hospital: z.string().max(200).optional(),
  status: z.string().max(50).optional(),
  isImportant: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
  recordDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  fileUrl: z.string().url().or(z.string().max(500)).optional(),
  fileName: z.string().max(255).optional(),
  fileSize: z.string().max(50).optional(),
});

export const updateMedicalRecordSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  type: z.nativeEnum(RecordType).optional(),
  hospital: z.string().max(200).optional(),
  status: z.string().max(50).optional(),
  isImportant: z.boolean().optional(),
  notes: z.string().max(5000).optional(),
  recordDate: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  fileUrl: z.string().url().or(z.string().max(500)).optional(),
  fileName: z.string().max(255).optional(),
  fileSize: z.string().max(50).optional(),
});

// ==========================================
// PRESCRIPTION VALIDATION SCHEMAS
// ==========================================
export const prescriptionItemInputSchema = z.object({
  medicineId: z.string().optional(),
  medicineName: z.string().min(1, 'medicineName is required').max(200),
  dosage: z.string().min(1, 'dosage is required').max(100),
  unit: z.string().min(1, 'unit is required').max(50),
  frequency: z.string().min(1, 'frequency is required').max(100),
  route: z.string().max(100).optional(),
  durationDays: z.number().int().positive().optional(),
  instructions: z.string().max(1000).optional(),
  foodInstruction: z.string().max(100).optional(),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, 'patientId is required'),
  diagnosis: z.string().max(2000).optional(),
  notes: z.string().max(5000).optional(),
  validUntil: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  items: z.array(prescriptionItemInputSchema).min(1, 'At least one prescription item is required'),
});

export const updatePrescriptionSchema = z.object({
  diagnosis: z.string().max(2000).optional(),
  notes: z.string().max(5000).optional(),
  validUntil: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
});

export const prescriptionStatusSchema = z.object({
  status: z.nativeEnum(PrescriptionStatus),
});

// ==========================================
// PHARMACY NETWORK VALIDATION SCHEMAS
// ==========================================
export const createPharmacySchema = z.object({
  pharmacyId: z.string().min(1, 'pharmacyId is required').max(50),
  name: z.string().min(1, 'name is required').max(200),
  licenseNumber: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tieUpStatus: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).optional(),
});

export const updatePharmacySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  licenseNumber: z.string().max(100).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.boolean().optional(),
  tieUpStatus: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).optional(),
});

export const verifyPharmacySchema = z.object({
  isVerified: z.boolean(),
});

export const pharmacyStatusSchema = z.object({
  isActive: z.boolean().optional(),
  tieUpStatus: z.enum(['ACTIVE', 'PENDING', 'SUSPENDED']).optional(),
});

// ==========================================
// PHARMACY ORDER VALIDATION SCHEMAS
// ==========================================
export const createPharmacyOrderSchema = z.object({
  prescriptionId: z.string().min(1, 'prescriptionId is required'),
  pharmacyId: z.string().min(1, 'pharmacyId is required'),
  deliveryAddress: z.string().max(500).optional(),
  deliveryType: z.string().max(50).optional(),
});

export const declinePharmacyOrderSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const updatePharmacyOrderStatusSchema = z.object({
  status: z.string().min(1, 'status is required'),
});

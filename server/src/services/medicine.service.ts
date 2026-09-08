import { prisma } from '../config/prisma';
import { Role } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export interface CreateMedicineDTO {
  name: string;
  genericName?: string;
  category?: string;
  manufacturer?: string;
  dosage?: string;
  unit?: string;
  stockQuantity?: number;
  unitPrice?: number;
  expiryDate?: string | Date;
}

export class MedicineService {
  /**
   * Search / List catalog medicines
   */
  static async getMedicines(search?: string, category?: string) {
    return prisma.medicine.findMany({
      where: {
        ...(search && {
          OR: [
            { name: { contains: search } },
            { genericName: { contains: search } },
          ],
        }),
        ...(category && { category: { contains: category } }),
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get active prescribed & scheduled medications and today's doses from MySQL
   */
  static async getActiveMedications(userId: string, role: Role, patientIdQuery?: string) {
    let patientId = patientIdQuery;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) {
      const firstPatient = await prisma.patient.findFirst();
      if (firstPatient) patientId = firstPatient.id;
    }

    if (!patientId) throw new AppError('Patient ID is required', 400);

    // 1. Fetch direct PatientMedications from MySQL
    const dbPatientMeds = await prisma.patientMedication.findMany({
      where: {
        patientId,
      },
      include: {
        doseLogs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const activeMeds: any[] = [];
    const todayDoses: any[] = [];

    dbPatientMeds.forEach((pm) => {
      let times: string[] = ['08:30 AM', '08:30 PM'];
      try {
        if (pm.doseTimes) {
          times = JSON.parse(pm.doseTimes);
        }
      } catch {
        times = ['08:30 AM', '08:30 PM'];
      }

      activeMeds.push({
        id: pm.id,
        name: pm.name,
        dosage: pm.dosage,
        unit: pm.unit,
        frequency: pm.frequency,
        route: pm.route || 'Oral',
        times,
        startDate: pm.startDate ? pm.startDate.toISOString() : new Date().toISOString(),
        endDate: pm.endDate ? pm.endDate.toISOString() : null,
        prescribedBy: pm.prescribedBy || 'Dr. Rajesh Varma',
        hospital: pm.hospital || 'Apollo Multispeciality Hospitals',
        purpose: pm.instructions || 'Prescribed treatment',
        instructions: pm.instructions || 'Take after food with warm water',
        foodInstruction: pm.foodInstruction || 'After Food',
        status: pm.status === 'active' ? 'Active' : pm.status === 'completed' ? 'Completed' : 'Paused',
        stockRemaining: pm.remainingDoses,
        totalStock: pm.totalDoses,
        takenDoses: pm.takenDoses,
        skippedDoses: pm.skippedDoses,
        reminderEnabled: true,
        sourcePrescriptionId: pm.prescriptionNo || `RX-${pm.id.slice(-4)}`,
        notes: pm.instructions || '',
      });

      times.forEach((t, tIdx) => {
        // Find existing log for this time slot
        const existingLog = pm.doseLogs.find((l) => l.doseTime === t);

        todayDoses.push({
          id: existingLog ? existingLog.id : `DOSE-${pm.id}-${tIdx + 1}`,
          medicineId: pm.id,
          medicineName: `${pm.name} (${pm.dosage}${pm.unit})`,
          dosage: `${pm.dosage}${pm.unit}`,
          scheduledTime: t,
          actualTime: existingLog?.takenAt || null,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: existingLog ? (existingLog.status === 'taken' ? 'Taken' : existingLog.status === 'skipped' ? 'Skipped' : 'Upcoming') : 'Upcoming',
          skipReason: existingLog?.skippedReason || undefined,
        });
      });
    });

    // 2. Also check prescriptions from Doctor
    const prescriptions = await prisma.prescription.findMany({
      where: {
        patientId,
        status: { notIn: ['CANCELLED'] },
      },
      include: {
        doctor: true,
        items: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    prescriptions.forEach((rx) => {
      rx.items.forEach((item, idx) => {
        const medId = `RX-MED-${rx.id}-${idx + 1}`;
        if (!activeMeds.some((m) => m.name.toLowerCase() === item.medicineName.toLowerCase())) {
          const isTwiceDaily = item.frequency.toLowerCase().includes('twice');
          const isThriceDaily = item.frequency.toLowerCase().includes('three') || item.frequency.toLowerCase().includes('thrice');
          const times = isThriceDaily
            ? ['08:00 AM', '01:30 PM', '09:00 PM']
            : isTwiceDaily
            ? ['08:30 AM', '08:30 PM']
            : ['09:00 AM'];

          activeMeds.push({
            id: medId,
            name: item.medicineName,
            dosage: item.dosage.replace(/[^0-9.]/g, '') || item.dosage,
            unit: item.dosage.toLowerCase().includes('mg') ? 'mg' : item.unit || 'tablet',
            frequency: item.frequency,
            route: item.route || 'Oral',
            times,
            startDate: rx.issuedAt.toISOString(),
            endDate: rx.validUntil ? rx.validUntil.toISOString() : null,
            prescribedBy: rx.doctor.fullName,
            hospital: rx.doctor.hospital || 'Apollo Multispeciality Hospitals',
            purpose: item.instructions || 'Prescribed clinical therapy',
            instructions: `${item.instructions || 'Take as directed'} (${item.foodInstruction || 'After Food'})`,
            foodInstruction: item.foodInstruction || 'After Food',
            status: 'Active',
            stockRemaining: (item.durationDays || 5) * (isThriceDaily ? 3 : isTwiceDaily ? 2 : 1),
            totalStock: (item.durationDays || 5) * (isThriceDaily ? 3 : isTwiceDaily ? 2 : 1),
            reminderEnabled: true,
            sourcePrescriptionId: rx.id,
            notes: `From Doctor Prescription ${rx.id}`,
          });

          times.forEach((t, tIdx) => {
            todayDoses.push({
              id: `DOSE-${medId}-${tIdx + 1}`,
              medicineId: medId,
              medicineName: `${item.medicineName} (${item.dosage})`,
              dosage: item.dosage,
              scheduledTime: t,
              actualTime: null,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              status: 'Upcoming',
            });
          });
        }
      });
    });

    return {
      medications: activeMeds,
      todayDoses,
    };
  }

  /**
   * Create patient medication schedule in MySQL
   */
  static async createPatientMedication(userId: string, role: Role, data: any) {
    let patientId = data.patientId;

    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);
      patientId = patient.id;
    }

    if (!patientId) {
      const firstPatient = await prisma.patient.findFirst();
      if (!firstPatient) throw new AppError('Patient required', 400);
      patientId = firstPatient.id;
    }

    const doseTimes = Array.isArray(data.doseTimes || data.times)
      ? JSON.stringify(data.doseTimes || data.times)
      : JSON.stringify(['08:00 AM', '08:00 PM']);

    return prisma.patientMedication.create({
      data: {
        patientId,
        medicineId: data.medicineId || null,
        name: data.name,
        dosage: data.dosage || '500',
        unit: data.unit || 'mg',
        frequency: data.frequency || 'Twice daily',
        route: data.route || 'Oral',
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : null,
        prescribedBy: data.prescribedBy || data.doctor || 'Dr. Rajesh Varma',
        hospital: data.hospital || 'Apollo Multispeciality Hospitals',
        prescriptionNo: data.prescriptionNo || `RX-${Math.floor(1000 + Math.random() * 9000)}`,
        instructions: data.instructions || 'Take after food with warm water',
        foodInstruction: data.foodInstruction || 'After Food',
        doseTimes,
        status: data.status ? data.status.toLowerCase() : 'active',
        totalDoses: data.totalDoses || data.totalStock || 30,
        takenDoses: data.takenDoses || 0,
        skippedDoses: data.skippedDoses || 0,
        remainingDoses: data.remainingDoses || data.stockRemaining || 30,
      },
    });
  }

  /**
   * Record Dose Taken / Skipped in MySQL
   */
  static async recordDoseLog(userId: string, role: Role, data: { doseId: string; medicineId: string; status: 'taken' | 'skipped'; skipReason?: string }) {
    let patientId = '';
    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (patient) patientId = patient.id;
    }

    // Check if patientMedication exists in DB
    const med = await prisma.patientMedication.findFirst({
      where: {
        OR: [{ id: data.medicineId }, { name: { contains: data.medicineId } }],
      },
    });

    if (med) {
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create or update DoseLog
      const log = await prisma.doseLog.create({
        data: {
          patientId: med.patientId,
          patientMedicationId: med.id,
          doseTime: nowTime,
          status: data.status,
          takenAt: data.status === 'taken' ? nowTime : null,
          skippedReason: data.skipReason || null,
        },
      });

      // Update counts
      await prisma.patientMedication.update({
        where: { id: med.id },
        data: {
          takenDoses: data.status === 'taken' ? { increment: 1 } : undefined,
          skippedDoses: data.status === 'skipped' ? { increment: 1 } : undefined,
          remainingDoses: data.status === 'taken' ? { decrement: 1 } : undefined,
        },
      });

      return log;
    }

    return { success: true, message: 'Dose state recorded' };
  }

  /**
   * Update Patient Medication
   */
  static async updatePatientMedication(id: string, data: any) {
    return prisma.patientMedication.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.dosage && { dosage: data.dosage }),
        ...(data.unit && { unit: data.unit }),
        ...(data.frequency && { frequency: data.frequency }),
        ...(data.status && { status: data.status.toLowerCase() }),
        ...(data.instructions && { instructions: data.instructions }),
        ...(data.remainingDoses !== undefined && { remainingDoses: data.remainingDoses }),
      },
    });
  }

  /**
   * Delete Patient Medication
   */
  static async deletePatientMedication(id: string) {
    return prisma.patientMedication.delete({
      where: { id },
    });
  }

  /**
   * Create medicine in catalog
   */
  static async createMedicine(data: CreateMedicineDTO) {
    return prisma.medicine.create({
      data: {
        name: data.name,
        genericName: data.genericName || null,
        category: data.category || null,
        manufacturer: data.manufacturer || null,
        dosage: data.dosage || null,
        unit: data.unit || 'tablet',
        stockQuantity: data.stockQuantity || 0,
        unitPrice: data.unitPrice || 0,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      },
    });
  }
}

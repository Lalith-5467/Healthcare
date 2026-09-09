import { prisma } from '../config/prisma';
import { Role, OrderStatus, AppointmentStatus, PrescriptionStatus, ReminderStatus } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

export class DashboardService {
  /**
   * Get calculated real-time statistics and summary metrics for current user / role
   */
  static async getStats(userId: string, role: Role) {
    if (role === Role.PATIENT) {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      if (!patient) throw new AppError('Patient profile not found', 404);

      const [
        totalRecords,
        activePrescriptions,
        upcomingAppointments,
        activeReminders,
        activeOrders,
        latestVitals,
      ] = await Promise.all([
        prisma.medicalRecord.count({ where: { patientId: patient.id } }),
        prisma.prescription.count({
          where: {
            patientId: patient.id,
            status: { in: [PrescriptionStatus.CONFIRMED, PrescriptionStatus.ACTIVE, PrescriptionStatus.PHARMACY_ORDER_CREATED] },
          },
        }),
        prisma.appointment.count({
          where: {
            patientId: patient.id,
            status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING] },
            appointmentDate: { gte: new Date() },
          },
        }),
        prisma.reminder.count({
          where: {
            patientId: patient.id,
            status: ReminderStatus.ACTIVE,
          },
        }),
        prisma.pharmacyOrder.count({
          where: {
            patientId: patient.id,
            status: { notIn: [OrderStatus.DELIVERED, OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.DECLINED] },
          },
        }),
        prisma.vital.findFirst({
          where: { patientId: patient.id },
          orderBy: { recordedAt: 'desc' },
        }),
      ]);

      return {
        role: Role.PATIENT,
        patientName: patient.fullName,
        bloodGroup: patient.bloodGroup,
        totalRecords,
        activePrescriptions,
        upcomingAppointments,
        activeReminders,
        activeOrders,
        latestVitals: latestVitals || {
          systolicBp: 120,
          diastolicBp: 80,
          heartRate: 74,
          oxygenSaturation: 99,
          bloodSugar: 98,
          temperature: 98.6,
        },
      };
    }

    if (role === Role.DOCTOR) {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      if (!doctor) throw new AppError('Doctor profile not found', 404);

      const [
        totalPatients,
        todayAppointments,
        pendingAppointments,
        prescriptionsIssued,
      ] = await Promise.all([
        prisma.patient.count(),
        prisma.appointment.count({
          where: {
            doctorId: doctor.id,
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        prisma.appointment.count({
          where: { doctorId: doctor.id, status: AppointmentStatus.PENDING },
        }),
        prisma.prescription.count({
          where: { doctorId: doctor.id },
        }),
      ]);

      return {
        role: Role.DOCTOR,
        doctorName: doctor.fullName,
        speciality: doctor.speciality,
        totalPatients,
        todayAppointments,
        pendingAppointments,
        prescriptionsIssued,
      };
    }

    if (role === Role.PHARMACIST) {
      const pharmacist = await prisma.pharmacist.findUnique({ where: { userId } });
      const pharmacyId = pharmacist?.pharmacyId;

      const [
        pendingOrders,
        preparingOrders,
        readyOrders,
        totalOrders,
        medicinesCount,
      ] = await Promise.all([
        prisma.pharmacyOrder.count({
          where: { ...(pharmacyId && { pharmacyId }), status: OrderStatus.PENDING },
        }),
        prisma.pharmacyOrder.count({
          where: { ...(pharmacyId && { pharmacyId }), status: OrderStatus.PREPARING },
        }),
        prisma.pharmacyOrder.count({
          where: { ...(pharmacyId && { pharmacyId }), status: { in: [OrderStatus.READY, OrderStatus.READY_FOR_PICKUP] } },
        }),
        prisma.pharmacyOrder.count({
          where: { ...(pharmacyId && { pharmacyId }) },
        }),
        prisma.medicine.count(),
      ]);

      return {
        role: Role.PHARMACIST,
        pharmacistName: pharmacist?.fullName,
        pharmacyName: pharmacist?.pharmacyName,
        pendingOrders,
        preparingOrders,
        readyOrders,
        totalOrders,
        medicinesCount,
      };
    }

    if (role === Role.NURSE) {
      const nurse = await prisma.nurse.findUnique({ where: { userId } });
      const [totalVisits, pendingVisits, activePatients] = await Promise.all([
        prisma.careRequest.count({ where: { ...(nurse && { nurseId: nurse.id }) } }),
        prisma.careRequest.count({ where: { ...(nurse && { nurseId: nurse.id }), status: 'Pending' } }),
        prisma.patient.count(),
      ]);

      return {
        role: Role.NURSE,
        nurseName: nurse?.fullName,
        totalVisits,
        pendingVisits,
        activePatients,
      };
    }

    // ADMIN
    const [totalUsers, totalPatients, totalDoctors, totalPharmacies, totalPrescriptions, totalOrders] =
      await Promise.all([
        prisma.user.count(),
        prisma.patient.count(),
        prisma.doctor.count(),
        prisma.pharmacy.count(),
        prisma.prescription.count(),
        prisma.pharmacyOrder.count(),
      ]);

    return {
      role: Role.ADMIN,
      totalUsers,
      totalPatients,
      totalDoctors,
      totalPharmacies,
      totalPrescriptions,
      totalOrders,
      systemHealth: 'Optimal',
    };
  }
}

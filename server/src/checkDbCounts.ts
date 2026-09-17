import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCounts() {
  try {
    const counts = {
      users: await prisma.user.count(),
      patients: await prisma.patient.count(),
      doctors: await prisma.doctor.count(),
      nurses: await prisma.nurse.count(),
      pharmacists: await prisma.pharmacist.count(),
      caregivers: await prisma.caregiver.count(),
      insuranceProviders: await prisma.insuranceProvider.count(),
      medicalRecords: await prisma.medicalRecord.count(),
      prescriptions: await prisma.prescription.count(),
      prescriptionItems: await prisma.prescriptionItem.count(),
      medicines: await prisma.medicine.count(),
      appointments: await prisma.appointment.count(),
      vitals: await prisma.vital.count(),
      reminders: await prisma.reminder.count(),
      notifications: await prisma.notification.count(),
      pharmacies: await prisma.pharmacy.count(),
      pharmacyOrders: await prisma.pharmacyOrder.count(),
      pharmacyOrderItems: await prisma.pharmacyOrderItem.count(),
      careRequests: await prisma.careRequest.count(),
      auditLogs: await prisma.auditLog.count(),
    };

    console.log('=== MYSQL DATABASE AUDIT COUNTS ===');
    console.log(JSON.stringify(counts, null, 2));
  } catch (error) {
    console.error('Error querying MySQL database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCounts();

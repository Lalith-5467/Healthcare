import { PrismaClient, Role, AppointmentType, AppointmentStatus, RecordType, PrescriptionStatus, ReminderType, ReminderStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting comprehensive database seed...');

  // Clean existing data
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.pharmacyOrderItem.deleteMany({});
  await prisma.pharmacyOrder.deleteMany({});
  await prisma.prescriptionItem.deleteMany({});
  await prisma.prescription.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.vital.deleteMany({});
  await prisma.medicalRecord.deleteMany({});
  await prisma.appointment.deleteMany({});
  
  await prisma.medicine.deleteMany({});
  await prisma.pharmacist.deleteMany({});
  await prisma.pharmacy.deleteMany({});
  
  await prisma.patient.deleteMany({});
  await prisma.doctor.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create a Doctor
  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@medicare.com',
      passwordHash,
      role: Role.DOCTOR,
      phoneNumber: '9876543210',
      doctor: {
        create: {
          fullName: 'Dr. Rajesh',
          speciality: 'General Medicine',
          experienceYears: 12,
          hospital: 'Apollo Central - OPD Suite 402',
          consultationFee: 500.0,
        }
      }
    },
    include: { doctor: true }
  });

  const doctorId = doctorUser.doctor!.id;
  console.log(`Created Doctor: ${doctorUser.doctor!.fullName}`);

  // 2. Create Medicines & Pharmacies
  const dolo = await prisma.medicine.create({ data: { name: 'Dolo 650', genericName: 'Paracetamol', category: 'Analgesic', stockQuantity: 100, unitPrice: 2.50 } });
  const augmentin = await prisma.medicine.create({ data: { name: 'Augmentin 625', genericName: 'Amoxicillin', category: 'Antibiotic', stockQuantity: 50, unitPrice: 15.00 } });
  const thyronorm = await prisma.medicine.create({ data: { name: 'Thyronorm 50mcg', genericName: 'Thyroxine', category: 'Hormone', stockQuantity: 200, unitPrice: 3.50 } });
  
  const pharmacy = await prisma.pharmacy.create({
    data: {
      pharmacyId: 'PH-001',
      name: 'Apollo Pharmacy Central',
      city: 'Chennai',
      isVerified: true
    }
  });

  // 3. Create Other Staff Profiles
  const nurseUser = await prisma.user.create({
    data: {
      email: 'nurse@medicare.com',
      passwordHash,
      role: Role.NURSE,
      nurse: { create: { fullName: 'Sister Mary', hospital: 'Apollo Central', department: 'OPD' } }
    }, include: { nurse: true }
  });

  const pharmacistUser = await prisma.user.create({
    data: {
      email: 'pharmacist@medicare.com',
      passwordHash,
      role: Role.PHARMACIST,
      pharmacist: { create: { fullName: 'Ramesh Pharmacy', pharmacyId: pharmacy.id } }
    }, include: { pharmacist: true }
  });

  // Insurance Provider
  const insuranceUser = await prisma.user.create({
    data: {
      email: 'insurance@starhealth.com',
      passwordHash,
      role: Role.INSURANCE_PROVIDER,
      insuranceProvider: { create: { providerName: 'Star Health Insurance', supportPhone: '1800-425-2255' } }
    }, include: { insuranceProvider: true }
  });

  const getDob = (age: number) => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - age);
    return date;
  };

  const today = new Date();
  
  // 4. Mock Patients Data
  const mockPatients = [
    {
      name: 'Arun Raj', age: 41, gender: 'Male', bloodGroup: 'O+',
      uiStatus: 'Completed', time: '09:00 AM', type: AppointmentType.VIDEO, 
      reason: 'Thyroid Level Review', backendStatus: AppointmentStatus.COMPLETED
    },
    {
      name: 'Abinesh Kumar', age: 28, gender: 'Male', bloodGroup: 'O+',
      uiStatus: 'Scheduled', time: '10:30 AM', type: AppointmentType.IN_PERSON, 
      reason: 'Post-Appendectomy Suture Review', backendStatus: AppointmentStatus.CONFIRMED
    },
    {
      name: 'Ragul Kumar', age: 45, gender: 'Male', bloodGroup: 'O+',
      uiStatus: 'Delayed', time: '10:45 AM', type: AppointmentType.VIDEO, 
      reason: 'Hypertension Medication Check', backendStatus: AppointmentStatus.CONFIRMED, delay: '20 min'
    },
    {
      name: 'Mrs. Meenakshi Sundaram', age: 62, gender: 'Female', bloodGroup: 'O+',
      uiStatus: 'In Consultation', time: '11:15 AM', type: AppointmentType.VIDEO, 
      reason: 'Diabetes Vitals & Routine Adherence', backendStatus: AppointmentStatus.CONFIRMED
    },
    {
      name: 'Suresh Menon', age: 55, gender: 'Male', bloodGroup: 'O+',
      uiStatus: 'No-show', time: '12:00 PM', type: AppointmentType.IN_PERSON, 
      reason: 'General Executive Health Checkup', backendStatus: AppointmentStatus.CANCELLED, cancelReason: 'No-show'
    },
    {
      name: 'Priya S', age: 31, gender: 'Female', bloodGroup: 'O+',
      uiStatus: 'Cancelled', time: '01:30 PM', type: AppointmentType.IN_PERSON, 
      reason: 'Migraine Follow-up', backendStatus: AppointmentStatus.CANCELLED, cancelReason: 'Cancelled by Patient'
    }
  ];

  // 5. Create Patients & All Records
  for (let i = 0; i < mockPatients.length; i++) {
    const mp = mockPatients[i];
    const email = `patient${i+1}@example.com`;

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: Role.PATIENT,
        patient: {
          create: {
            fullName: mp.name,
            gender: mp.gender,
            dateOfBirth: getDob(mp.age),
            bloodGroup: mp.bloodGroup
          }
        }
      },
      include: { patient: true }
    });

    const patientId = user.patient!.id;

    // Appointment
    const notesPayload = JSON.stringify({ uiStatus: mp.uiStatus, delay: mp.delay || null });
    await prisma.appointment.create({
      data: {
        patientId, doctorId, appointmentDate: today, slotTime: mp.time, type: mp.type,
        status: mp.backendStatus, reason: mp.reason, notes: notesPayload, cancellationReason: mp.cancelReason || null,
      }
    });

    // Medical Record
    await prisma.medicalRecord.create({
      data: {
        patientId, doctorId, title: `${mp.name} - Initial Checkup`, type: RecordType.CONSULTATION,
        hospital: 'Apollo Central', notes: 'Patient is stable. Continue prescribed medicines.',
      }
    });

    // Vital
    await prisma.vital.create({
      data: {
        patientId, systolicBp: 120, diastolicBp: 80, heartRate: 72, respiratoryRate: 16,
        oxygenSaturation: 98, temperature: 98.6, weightKg: 70
      }
    });

    // Prescription & Items
    const prescription = await prisma.prescription.create({
      data: {
        patientId, doctorId, diagnosis: mp.reason, status: PrescriptionStatus.ACTIVE,
      }
    });

    await prisma.prescriptionItem.create({
      data: {
        prescriptionId: prescription.id, medicineId: dolo.id, medicineName: dolo.name,
        dosage: '650mg', unit: 'Tablet', frequency: '1-0-1', durationDays: 5,
      }
    });

    // Reminder
    await prisma.reminder.create({
      data: {
        patientId, title: 'Take Dolo 650', type: ReminderType.MEDICATION, scheduledTime: '08:00 AM',
        status: ReminderStatus.ACTIVE
      }
    });

    // Caregiver
    if (i === 0) { // Add caregiver for first patient only
      await prisma.user.create({
        data: {
          email: 'caregiver@example.com',
          passwordHash,
          role: Role.CAREGIVER,
          caregiver: {
            create: {
              fullName: 'Lakshmi Raj',
              relationship: 'Wife',
              patients: { connect: [{ id: patientId }] }
            }
          }
        }
      });
    }

    // Pharmacy Order & Items
    if (i % 2 === 0) { // Create orders for every alternate patient
      const order = await prisma.pharmacyOrder.create({
        data: {
          patientId, prescriptionId: prescription.id, pharmacyId: pharmacy.id,
          totalAmount: 150.0, deliveryAddress: 'No 15, Cross Street, Chennai'
        }
      });
      await prisma.pharmacyOrderItem.create({
        data: {
          orderId: order.id, medicineId: dolo.id, medicineName: dolo.name,
          quantity: 2, unitPrice: 2.50, subtotal: 5.00
        }
      });
    }

    // Notification
    await prisma.notification.create({
      data: {
        userId: user.id, title: 'Appointment Confirmed',
        message: `Your appointment with Dr. Rajesh is confirmed for ${mp.time}.`
      }
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id, action: 'PATIENT_REGISTERED', entityType: 'PATIENT', entityId: patientId,
        details: 'Patient registered successfully.'
      }
    });

    console.log(`Created Full Records for: ${mp.name}`);
  }

  console.log('Comprehensive Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

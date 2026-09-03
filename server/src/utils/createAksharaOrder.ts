import { prisma } from '../config/prisma';
import { AuthService } from '../services/auth.service';
import { emitOrderStatusUpdate } from '../socket';

async function main() {
  console.log('Creating Akshara prescription and pharmacy order in MySQL...');

  // 1. Get or create patient Akshara
  let patientUser = await prisma.user.findFirst({
    where: { email: 'akshara.patient@example.test' },
    include: { patient: true },
  });

  if (!patientUser) {
    const reg = await AuthService.register({
      email: 'akshara.patient@example.test',
      password: 'DemoPassword123!',
      role: 'PATIENT' as any,
      fullName: 'Akshara',
      phoneNumber: '+919876500088',
    });
    patientUser = (await prisma.user.findUnique({
      where: { id: reg.user.id },
      include: { patient: true },
    })) as any;
  }

  // 2. Get Apollo Central Dispensary
  const pharmacy = await prisma.pharmacy.findFirst({
    where: {
      OR: [{ pharmacyId: 'DHR-PH-APOLLO' }, { name: 'Apollo Central Dispensary' }],
    },
  });

  if (!pharmacy) {
    console.error('Apollo pharmacy not found');
    return;
  }

  // 3. Get doctor
  const doctor = await prisma.doctor.findFirst();
  if (!doctor) {
    console.error('No doctor found');
    return;
  }

  // 4. Create confirmed prescription with Akshara medicines
  const rx = await prisma.prescription.create({
    data: {
      patientId: patientUser!.patient!.id,
      doctorId: doctor.id,
      diagnosis: 'Malaria & Infection Care (SMS Hospital Pune - Dr. Akshara)',
      notes: 'Prescription verified via Optical AI Engine. Doctor: Dr. Akshara, M.S. (Reg. No: MMC 2018)',
      status: 'PHARMACY_ORDER_CREATED' as any,
      items: {
        create: [
          {
            medicineName: 'Tab. Abciximab',
            dosage: '1 Morning',
            unit: 'mg',
            frequency: 'Once daily',
            durationDays: 8,
            instructions: 'Take 1 tablet in the morning before food',
            foodInstruction: 'Before Food',
          },
          {
            medicineName: 'Tab. Vomilast (Doxylamine + Pyridoxine + Folic Acid)',
            dosage: '1 Morning, 1 Night',
            unit: 'mg',
            frequency: 'Twice daily',
            durationDays: 8,
            instructions: 'Take 1 morning and 1 night after meals',
            foodInstruction: 'After Food',
          },
          {
            medicineName: 'Cap. Zoclar 500 (Clarithromycin 500mg)',
            dosage: '1 Morning',
            unit: 'mg',
            frequency: 'Once daily',
            durationDays: 3,
            instructions: 'Take 1 capsule in the morning after breakfast',
            foodInstruction: 'After Food',
          },
          {
            medicineName: 'Tab. Gestakind 10/SR (Isoxsuprine 10mg)',
            dosage: '1 Night',
            unit: 'mg',
            frequency: 'Once daily',
            durationDays: 4,
            instructions: 'Take 1 tablet at night before bedtime',
            foodInstruction: 'After Food',
          },
        ],
      },
    },
  });

  // 5. Create Pharmacy Order in PENDING status
  const order = await prisma.pharmacyOrder.create({
    data: {
      patientId: patientUser!.patient!.id,
      prescriptionId: rx.id,
      pharmacyId: pharmacy.id,
      status: 'PENDING' as any,
      deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
      deliveryType: 'Home Delivery',
      totalAmount: 422.0,
      items: {
        create: [
          {
            medicineName: 'Tab. Abciximab (1 Morning)',
            dosage: '1 Morning',
            quantity: 8,
            unitPrice: 15.0,
            subtotal: 120.0,
          },
          {
            medicineName: 'Tab. Vomilast (Doxylamine + Pyridoxine + Folic Acid)',
            dosage: '1 Morning, 1 Night',
            quantity: 16,
            unitPrice: 8.0,
            subtotal: 128.0,
          },
          {
            medicineName: 'Cap. Zoclar 500 (Clarithromycin 500mg)',
            dosage: '1 Morning',
            quantity: 3,
            unitPrice: 32.0,
            subtotal: 96.0,
          },
          {
            medicineName: 'Tab. Gestakind 10/SR (Isoxsuprine 10mg)',
            dosage: '1 Night',
            quantity: 4,
            unitPrice: 19.5,
            subtotal: 78.0,
          },
        ],
      },
    },
    include: {
      items: true,
      patient: true,
    },
  });

  console.log('Created Akshara Pharmacy Order:', order.id, 'for Patient:', order.patient?.fullName);

  // 6. Emit realtime socket update to pharmacy room
  emitOrderStatusUpdate({
    orderId: order.id,
    patientId: order.patientId,
    pharmacyId: order.pharmacyId,
    status: 'PENDING',
    previousStatus: 'NEW',
    updatedAt: order.orderedAt.toISOString(),
    message: `🔔 New Prescription Order received from ${order.patient?.fullName || 'Akshara'} (#${order.id})`,
  });

  console.log('Realtime event emitted to pharmacy room successfully!');
}

main().finally(async () => {
  await prisma.$disconnect();
});

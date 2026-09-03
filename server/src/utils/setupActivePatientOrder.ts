import { prisma } from '../config/prisma';
import { emitOrderStatusUpdate } from '../socket';

async function main() {
  console.log('Setting up active pending prescription order for logged-in patient...');

  // 1. Get logged-in patient
  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo.patient@example.test' },
    include: { patient: true },
  });

  if (!demoUser || !demoUser.patient) {
    console.error('Demo patient not found');
    return;
  }

  // 2. Update patient full name to reflect scanned patient
  await prisma.patient.update({
    where: { id: demoUser.patient.id },
    data: { fullName: 'Akshara' },
  });

  // 3. Get Apollo Central Dispensary
  const pharmacy = await prisma.pharmacy.findFirst({
    where: {
      OR: [{ pharmacyId: 'DHR-PH-APOLLO' }, { name: 'Apollo Central Dispensary' }],
    },
  });

  if (!pharmacy) {
    console.error('Apollo pharmacy not found');
    return;
  }

  // 4. Get or create doctor
  let doctor = await prisma.doctor.findFirst();
  if (!doctor) {
    doctor = await prisma.doctor.create({
      data: {
        userId: demoUser.id,
        fullName: 'Dr. Akshara, M.S.',
        speciality: 'General & Internal Medicine',
        hospital: 'SMS Hospital, Pune',
      },
    });
  }

  // 5. Create fresh active prescription for Akshara
  const rx = await prisma.prescription.create({
    data: {
      patientId: demoUser.patient.id,
      doctorId: doctor.id,
      diagnosis: 'Malaria & Infection Care (SMS Hospital Pune - Dr. Akshara)',
      notes: 'Prescription verified via Optical AI Engine. Clinical diagnosis: Malaria.',
      status: 'PHARMACY_ORDER_CREATED' as any,
      items: {
        create: [
          {
            medicineName: 'Tab. Abciximab (1 Morning)',
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

  // 6. Create Pharmacy Order in PENDING status with orderedAt = NOW
  const order = await prisma.pharmacyOrder.create({
    data: {
      patientId: demoUser.patient.id,
      prescriptionId: rx.id,
      pharmacyId: pharmacy.id,
      status: 'PENDING' as any,
      deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
      deliveryType: 'Home Delivery',
      totalAmount: 422.0,
      orderedAt: new Date(),
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
      pharmacy: true,
      prescription: true,
    },
  });

  console.log('Created fresh PENDING order:', order.id);
  console.log('Patient:', order.patient?.fullName);
  console.log('Pharmacy:', order.pharmacy?.name);
  console.log('Status:', order.status);
  console.log('Total Amount: ₹' + order.totalAmount);
  console.log('Medicines:', order.items.map((i: any) => i.medicineName).join(', '));

  // 7. Emit realtime Socket.IO event to pharmacy room and patient room
  emitOrderStatusUpdate({
    orderId: order.id,
    patientId: order.patientId,
    pharmacyId: order.pharmacyId,
    status: 'PENDING',
    previousStatus: 'NEW',
    updatedAt: order.orderedAt.toISOString(),
    message: `🔔 New Prescription Order received from ${order.patient?.fullName || 'Akshara'} (#${order.id})`,
  });

  console.log('Realtime event emitted successfully!');
}

main().finally(() => prisma.$disconnect());

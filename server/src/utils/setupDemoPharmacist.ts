import { prisma } from '../config/prisma';
import { AuthService } from '../services/auth.service';
import { Role } from '@prisma/client';

async function main() {
  // 1. Ensure demo.pharmacist exists
  let user = await prisma.user.findUnique({
    where: { email: 'demo.pharmacist@example.test' },
  });

  if (!user) {
    const reg = await AuthService.register({
      email: 'demo.pharmacist@example.test',
      password: 'DemoPassword123!',
      role: Role.PHARMACIST,
      fullName: 'Suresh Nair (Reg. Pharmacist)',
      phoneNumber: '+919876500003',
    });
    user = reg.user as any;
  }

  // 2. Ensure Apollo Central Dispensary pharmacy exists
  let pharmacy = await prisma.pharmacy.findFirst({
    where: {
      OR: [
        { pharmacyId: 'DHR-PH-APOLLO' },
        { name: 'Apollo Central Dispensary' },
      ],
    },
  });

  if (!pharmacy) {
    pharmacy = await prisma.pharmacy.create({
      data: {
        pharmacyId: 'DHR-PH-APOLLO',
        name: 'Apollo Central Dispensary',
        licenseNumber: 'TN-CH-PH-2024-8841',
        address: 'No. 21, Greams Road, Thousand Lights',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600006',
        phone: '+91 44 2829 0200',
        email: 'apollo.central@dispensary.in',
        isVerified: true,
        isActive: true,
        tieUpStatus: 'ACTIVE',
      },
    });
    console.log('Created Apollo Central Dispensary pharmacy:', pharmacy.id);
  } else {
    // Ensure verified and active
    pharmacy = await prisma.pharmacy.update({
      where: { id: pharmacy.id },
      data: { isVerified: true, isActive: true, tieUpStatus: 'ACTIVE' },
    });
    console.log('Updated Apollo Central Dispensary pharmacy:', pharmacy.id);
  }

  // 3. Link demo.pharmacist profile to Apollo Central Dispensary
  let pharmacist = await prisma.pharmacist.findUnique({
    where: { userId: user!.id },
  });

  if (!pharmacist) {
    pharmacist = await prisma.pharmacist.create({
      data: {
        userId: user!.id,
        fullName: 'Suresh Nair',
        pharmacyName: 'Apollo Central Dispensary',
        licenseNumber: 'PCI-TN-89412',
        pharmacyId: pharmacy.id,
      },
    });
    console.log('Created pharmacist profile for demo.pharmacist linked to Apollo');
  } else {
    pharmacist = await prisma.pharmacist.update({
      where: { id: pharmacist.id },
      data: {
        pharmacyId: pharmacy.id,
        pharmacyName: 'Apollo Central Dispensary',
      },
    });
    console.log('Updated pharmacist profile for demo.pharmacist linked to Apollo');
  }

  // 4. Also associate any orphaned orders to this pharmacy, or create sample realistic orders if empty
  const ordersCount = await prisma.pharmacyOrder.count({
    where: { pharmacyId: pharmacy.id },
  });

  console.log(`Current orders for Apollo Central Dispensary: ${ordersCount}`);

  if (ordersCount === 0) {
    // Check for demo patient and prescription
    const patientUser = await prisma.user.findUnique({
      where: { email: 'demo.patient@example.test' },
      include: { patient: true },
    });

    const doctorUser = await prisma.user.findUnique({
      where: { email: 'demo.doctor@example.test' },
      include: { doctor: true },
    });

    if (patientUser?.patient && doctorUser?.doctor) {
      // Create confirmed prescription
      const rx = await prisma.prescription.create({
        data: {
          patientId: patientUser.patient.id,
          doctorId: doctorUser.doctor.id,
          diagnosis: 'Acute Bronchial Asthma & Seasonal Allergy',
          status: 'PHARMACY_ORDER_CREATED' as any,
          notes: 'Standard 7-day course with clinical hydration',
          items: {
            create: [
              {
                medicineName: 'Salbutamol Inhaler 100mcg',
                dosage: '100mcg',
                unit: 'mcg',
                frequency: '2 puffs PRN',
                durationDays: 30,
              },
              {
                medicineName: 'Amoxicillin 500mg',
                dosage: '500mg',
                unit: 'mg',
                frequency: 'Three times daily',
                durationDays: 7,
              },
              {
                medicineName: 'Cetirizine 10mg',
                dosage: '10mg',
                unit: 'mg',
                frequency: 'Once daily at bedtime',
                durationDays: 10,
              },
            ],
          },
        },
      });

      // Create PENDING order
      const newOrder = await prisma.pharmacyOrder.create({
        data: {
          patientId: patientUser.patient.id,
          prescriptionId: rx.id,
          pharmacyId: pharmacy.id,
          status: 'PENDING' as any,
          deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
          deliveryType: 'Home Delivery',
          totalAmount: 380.0,
          items: {
            create: [
              {
                medicineName: 'Salbutamol Inhaler 100mcg',
                dosage: '100mcg',
                quantity: 1,
                unitPrice: 160.0,
                subtotal: 160.0,
              },
              {
                medicineName: 'Amoxicillin 500mg',
                dosage: '500mg',
                quantity: 14,
                unitPrice: 10.0,
                subtotal: 140.0,
              },
              {
                medicineName: 'Cetirizine 10mg',
                dosage: '10mg',
                quantity: 10,
                unitPrice: 8.0,
                subtotal: 80.0,
              },
            ],
          },
        },
      });
      console.log('Created sample pending order for Apollo:', newOrder.id);
    }
  }

  // 5. Generate a fresh JWT for demo.pharmacist
  const loginRes = await AuthService.login({
    email: 'demo.pharmacist@example.test',
    password: 'DemoPassword123!',
  });
  console.log('\n=========================================');
  console.log('DEMO PHARMACIST JWT TOKEN:');
  console.log(loginRes.token);
  console.log('=========================================\n');
}

main().finally(async () => {
  await prisma.$disconnect();
});

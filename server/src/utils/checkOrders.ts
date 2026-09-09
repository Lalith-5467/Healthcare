import { prisma } from '../config/prisma';

async function main() {
  const orders = await prisma.pharmacyOrder.findMany({
    orderBy: { orderedAt: 'desc' },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      pharmacy: true,
      items: true,
    },
  });

  const demoUser = await prisma.user.findFirst({
    where: { email: 'demo.patient@example.test' },
    include: { patient: true },
  });
  console.log('Demo Patient Info:', {
    userId: demoUser?.id,
    patientId: demoUser?.patient?.id,
    fullName: demoUser?.patient?.fullName,
  });

  const pharmacistUser = await prisma.user.findFirst({
    where: { email: 'demo.pharmacist@example.test' },
    include: { pharmacist: true },
  });
  console.log('Demo Pharmacist PharmacyId:', pharmacistUser?.pharmacist?.pharmacyId);

  const res = await prisma.pharmacyOrder.findMany({
    where: { pharmacyId: pharmacistUser?.pharmacist?.pharmacyId },
    include: {
      patient: { select: { id: true, fullName: true } },
      prescription: { select: { diagnosis: true } },
    },
  });
  console.log(`Found ${res.length} orders for pharmacist:`);
  for (const o of res) {
    console.log(`- Order: #${o.id} | Status: ${o.status} | Patient: "${o.patient?.fullName}" | Diagnosis: "${o.prescription?.diagnosis}"`);
  }
}

main().finally(() => prisma.$disconnect());

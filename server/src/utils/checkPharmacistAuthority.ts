import { prisma } from '../config/prisma';

async function check() {
  console.log('=== PHARMACISTS IN DB ===');
  const pharmacists = await prisma.pharmacist.findMany({
    include: {
      user: true,
      pharmacy: true,
    }
  });
  for (const p of pharmacists) {
    console.log(`Pharmacist ID: ${p.id} | User: ${p.user.email} (ID: ${p.user.id}, Role: ${p.user.role}) | Name: ${p.fullName} | PharmacyId: ${p.pharmacyId} | Pharmacy: ${p.pharmacy?.name} (${p.pharmacy?.pharmacyId})`);
  }

  console.log('\n=== RECENT ORDERS IN DB ===');
  const orders = await prisma.pharmacyOrder.findMany({
    orderBy: { orderedAt: 'desc' },
    take: 10,
    include: {
      patient: true,
      pharmacy: true,
      items: true,
    }
  });

  for (const o of orders) {
    console.log(`Order ID: ${o.id} | Status: ${o.status} | Patient: ${o.patient?.fullName} | PharmacyId: ${o.pharmacyId} | Pharmacy: ${o.pharmacy?.name} (${o.pharmacy?.pharmacyId})`);
  }
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

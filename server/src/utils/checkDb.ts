import { prisma } from '../config/prisma';

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'PHARMACIST' },
    select: { id: true, email: true, role: true },
  });
  console.log('Pharmacist Users in DB:', users);

  const pharmacists = await prisma.pharmacist.findMany({
    include: { pharmacy: true },
  });
  console.log('Pharmacist Profiles:', pharmacists);

  const pharms = await prisma.pharmacy.findMany();
  console.log('Pharmacies:', pharms.map((p) => ({ id: p.id, pharmacyId: p.pharmacyId, name: p.name, isVerified: p.isVerified, isActive: p.isActive, tieUpStatus: p.tieUpStatus })));

  const orders = await prisma.pharmacyOrder.findMany({
    select: { id: true, status: true, pharmacyId: true },
  });
  console.log(`Total Orders in DB: ${orders.length}`, orders);
}

main().finally(async () => {
  await prisma.$disconnect();
});

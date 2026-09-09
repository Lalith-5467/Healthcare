import { prisma } from '../config/prisma';

async function main() {
  console.log('Restoring Demo Patient name in MySQL...');

  const user = await prisma.user.findFirst({
    where: { email: 'demo.patient@example.test' },
    include: { patient: true },
  });

  if (user && user.patient) {
    const updated = await prisma.patient.update({
      where: { id: user.patient.id },
      data: { fullName: 'Demo Patient' },
    });
    console.log('✓ Restored patient fullName to:', updated.fullName, 'for user:', user.email);
  }

  // Update any prescriptions where diagnosis had doctor name baked in
  const rx = await prisma.prescription.updateMany({
    where: { diagnosis: { contains: 'Dr. Akshara' } },
    data: { diagnosis: 'Malaria & Infection Care' },
  });
  console.log('✓ Updated prescriptions with clean diagnosis:', rx.count);
}

main().finally(() => prisma.$disconnect());

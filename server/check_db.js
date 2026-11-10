const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- PATIENTS ---');
  const patients = await prisma.patient.findMany({
    select: { id: true, fullName: true, userId: true, user: { select: { email: true, role: true } } }
  });
  console.log(JSON.stringify(patients, null, 2));

  console.log('--- POLICIES ---');
  const policies = await prisma.insurancePolicy.findMany({
    include: { patient: true }
  });
  console.log(JSON.stringify(policies, null, 2));

  console.log('--- CLAIMS ---');
  const claims = await prisma.insuranceClaim.findMany({
    include: { patient: true, policy: true }
  });
  console.log(JSON.stringify(claims, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

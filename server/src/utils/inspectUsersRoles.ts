import { prisma } from '../config/prisma';

async function main() {
  const nurses = await prisma.nurse.findMany({
    include: { user: { select: { id: true, email: true, role: true } } }
  });
  console.log('=== NURSES IN DATABASE ===');
  for (const n of nurses) {
    console.log(`NurseId: ${n.id} | UserId: ${n.userId} | Email: ${n.user?.email} | Name: ${n.fullName} | Spec: ${n.specialization}`);
  }
  
  const patients = await prisma.patient.findMany({
    include: { user: { select: { id: true, email: true, role: true } } }
  });
  console.log('\n=== PATIENTS IN DATABASE ===');
  for (const p of patients) {
    console.log(`PatientId: ${p.id} | UserId: ${p.userId} | Email: ${p.user?.email} | Name: ${p.fullName}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

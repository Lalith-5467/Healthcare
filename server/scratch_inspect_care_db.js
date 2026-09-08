const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ 
    include: { patient: true, nurse: true } 
  });
  console.log('USERS & PROFILES:');
  users.forEach(u => {
    console.log(`- User [${u.id}] Email: ${u.email}, Role: ${u.role}, Patient: ${u.patient?.fullName} (${u.patient?.id}), Nurse: ${u.nurse?.fullName} (${u.nurse?.id})`);
  });

  const careRequests = await prisma.careRequest.findMany({ 
    include: { 
      patient: { include: { user: true } }, 
      nurse: true 
    } 
  });
  console.log('\nCARE REQUESTS IN DB:');
  careRequests.forEach(c => {
    console.log(`- CareReq [${c.id}] Patient: "${c.patient?.fullName}" (UserID: ${c.patient?.userId}), Service: ${c.serviceType}, Status: ${c.status}, Nurse: ${c.nurse?.fullName}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());

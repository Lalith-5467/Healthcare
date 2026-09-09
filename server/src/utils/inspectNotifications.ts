import { prisma } from '../config/prisma';

async function inspect() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      patient: { select: { fullName: true } },
      doctor: { select: { fullName: true } },
      nurse: { select: { fullName: true } },
      pharmacist: { select: { fullName: true } },
    },
  });
  console.log('=== USERS IN DATABASE ===');
  for (const u of users) {
    const name = u.patient?.fullName || u.doctor?.fullName || u.nurse?.fullName || u.pharmacist?.fullName || 'N/A';
    console.log(`User: ${u.id} | Email: ${u.email} | Role: ${u.role} | Name: ${name}`);
  }

  const notifs = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`\n=== ALL NOTIFICATIONS IN DATABASE (${notifs.length}) ===`);
  for (const n of notifs) {
    const u = users.find((x) => x.id === n.userId);
    console.log(
      `[${n.id}] Recipient: ${u?.email || 'UNKNOWN'} (${u?.role || 'NO_ROLE'}) [${n.userId}] | Title: "${n.title}" | Read: ${n.isRead} | Created: ${n.createdAt.toISOString()}`
    );
  }
}

inspect()
  .catch(console.error)
  .finally(() => prisma.$disconnect());


import { prisma } from '../config/prisma';

async function inspect() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      abhaId: true,
      phoneNumber: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Found ${users.length} users in database:`);
  console.table(users);

  await prisma.$disconnect();
}

inspect().catch((err) => {
  console.error(err);
  process.exit(1);
});

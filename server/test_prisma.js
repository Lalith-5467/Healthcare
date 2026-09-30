const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const topics = await prisma.healthTopic.count();
    const videos = await prisma.healthVideo.count();
    console.log(`Topics: ${topics}`);
    console.log(`Videos: ${videos}`);
  } catch(e) {
    console.error("PRISMA_ERROR:", e.message);
  }
}

main().finally(() => prisma.$disconnect());

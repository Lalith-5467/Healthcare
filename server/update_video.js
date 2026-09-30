const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function update() {
  await prisma.healthVideo.updateMany({
    where: { youtubeVideoId: 'dQw4w9WgXcQ' },
    data: {
      youtubeVideoId: 'xhqI5Mt-gc8',
      title: 'Benefits of Drinking Water Daily - Health Tip',
      channelName: 'Health & Wellness',
      durationSeconds: 10
    }
  });
  console.log('Video updated to a real health video!');
  await prisma.$disconnect();
}
update();

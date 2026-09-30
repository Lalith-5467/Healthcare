const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const videos = [
  { id: 'xhqI5Mt-gc8', topic: 'hydration', title: 'Benefits of Drinking Water Daily', channel: 'Health Coach' },
  { id: 'dzHlPszxGM0', topic: 'hydration', title: 'Why You Need More Water', channel: 'Wellness Daily' },
  { id: 'THuKHYzfeYc', topic: 'hydration', title: 'Hydration Health Tips', channel: 'Doctor Tips' },
  
  { id: 'UNH1wmBkBCQ', topic: 'sleep', title: 'Healthy Sleep Tips', channel: 'Sleep Foundation' },
  { id: 'jge1zsyI-Yk', topic: 'sleep', title: 'How to Sleep Better', channel: 'Wellness Daily' },
  { id: 'r6ob3honOHg', topic: 'sleep', title: 'Better Sleep Routine', channel: 'Health Coach' },
  { id: 'Z14B8_s7D_4', topic: 'sleep', title: 'Fix Your Sleep Schedule', channel: 'Doctor Tips' },
  
  { id: 'Ao1tzPTm-40', topic: 'exercise', title: 'Morning Exercise Routine', channel: 'Fitness Pro' },
  { id: 'Av-XvtVjVSs', topic: 'exercise', title: 'Daily Workout Benefits', channel: 'Health Coach' },
  { id: 'p706o40Qz8Q', topic: 'exercise', title: 'Quick Morning Stretches', channel: 'Fitness Pro' },
  { id: 'vI1aQGqHDBs', topic: 'exercise', title: 'Stay Active Daily', channel: 'Wellness Daily' },
  
  { id: '4eBEAsMGLFA', topic: 'nutrition', title: 'Healthy Food Diet', channel: 'Nutrition Expert' },
  { id: 'SNOknWXvIL4', topic: 'nutrition', title: 'Nutrition Basics', channel: 'Health Coach' },
  { id: 'lVFY_zYnBTM', topic: 'nutrition', title: 'Eat Healthy Every Day', channel: 'Nutrition Expert' },
  { id: '1v6R_46lQ7g', topic: 'nutrition', title: 'Balanced Diet Guide', channel: 'Doctor Tips' }
];

const topicsInfo = {
  hydration: { name: 'Hydration', keywords: '["water", "hydration"]' },
  sleep: { name: 'Sleep Health', keywords: '["sleep", "rest"]' },
  exercise: { name: 'Exercise & Fitness', keywords: '["exercise", "fitness"]' },
  nutrition: { name: 'Nutrition', keywords: '["diet", "food"]' }
};

async function seed() {
  try {
    const patients = await prisma.patient.findMany();
    
    for (const v of videos) {
      // Ensure Topic
      let topic = await prisma.healthTopic.findFirst({ where: { topicKey: v.topic } });
      if (!topic) {
        topic = await prisma.healthTopic.create({
          data: {
            topicKey: v.topic,
            displayName: topicsInfo[v.topic].name,
            description: topicsInfo[v.topic].name + ' tips',
            searchKeywords: topicsInfo[v.topic].keywords
          }
        });
      }

      // Link Patients to Topic
      for (const p of patients) {
        let ptTopic = await prisma.patientHealthTopic.findFirst({ where: { patientId: p.id, healthTopicId: topic.id } });
        if (!ptTopic) {
           await prisma.patientHealthTopic.create({
             data: {
               patientId: p.id,
               healthTopicId: topic.id,
               sourceType: 'PRESCRIPTION',
               sourceRecordId: 'system'
             }
           });
        }
      }

      // Create Video
      let dbVideo = await prisma.healthVideo.findUnique({ where: { youtubeVideoId: v.id } });
      if (!dbVideo) {
        dbVideo = await prisma.healthVideo.create({
          data: {
            youtubeVideoId: v.id,
            title: v.title,
            channelName: v.channel,
            durationSeconds: 10,
            status: 'APPROVED',
            enabled: true,
            createdBy: 'SUPER_ADMIN',
            approvedBy: 'SUPER_ADMIN',
            approvedAt: new Date()
          }
        });
      }

      // Link Video to Topic
      let vt = await prisma.healthVideoTopic.findFirst({ where: { videoId: dbVideo.id, topicId: topic.id } });
      if (!vt) {
        await prisma.healthVideoTopic.create({
          data: { videoId: dbVideo.id, topicId: topic.id }
        });
      }
    }

    console.log('Successfully seeded 15 videos!');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

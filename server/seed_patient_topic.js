const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    // Get all patients
    const patients = await prisma.patient.findMany();
    if (!patients.length) return console.log('No patients found');

    // Get the video that exists
    const video = await prisma.healthVideo.findFirst();
    if (!video) return console.log('Video not found');

    // Create a topic
    let topic = await prisma.healthTopic.findFirst({ where: { topicKey: 'diabetes' } });
    if (!topic) {
      topic = await prisma.healthTopic.create({
        data: {
          topicKey: 'diabetes',
          displayName: 'Diabetes Management',
          description: 'Information about managing diabetes.',
          searchKeywords: '["diabetes", "sugar"]'
        }
      });
    }

    for (const patient of patients) {
      // Link topic to patient
      let ptTopic = await prisma.patientHealthTopic.findFirst({ where: { patientId: patient.id, healthTopicId: topic.id } });
      if (!ptTopic) {
         await prisma.patientHealthTopic.create({
           data: {
             patientId: patient.id,
             healthTopicId: topic.id,
             sourceType: 'PRESCRIPTION',
             sourceRecordId: 'system'
           }
         });
      }
    }

    // Link video to topic
    let videoTopic = await prisma.healthVideoTopic.findFirst({ where: { videoId: video.id, topicId: topic.id } });
    if (!videoTopic) {
       await prisma.healthVideoTopic.create({
         data: {
           videoId: video.id,
           topicId: topic.id
         }
       });
    }

    console.log('Seeded successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

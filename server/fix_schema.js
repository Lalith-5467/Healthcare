import fs from 'fs';

const schemaPath = 'd:/MediCare/Healthcare/server/prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('model PatientHealthTopic')) {
  const modelStr = `
model PatientHealthTopic {
  id             String      @id @default(cuid())
  patientId      String
  healthTopicId  String
  sourceType     String      @default("CLINICIAN_SELECTED")
  sourceRecordId String?
  assignedBy     String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  patient        Patient     @relation(fields: [patientId], references: [id], onDelete: Cascade)
  healthTopic    HealthTopic @relation(fields: [healthTopicId], references: [id], onDelete: Cascade)

  @@unique([patientId, healthTopicId])
  @@index([patientId])
  @@index([healthTopicId])
  @@map("patient_health_topics")
}
`;
  schema += modelStr;

  // Add relations
  schema = schema.replace(
    /model Patient \{[\s\S]*?createdAt/m, 
    match => match.replace('createdAt', 'healthTopics PatientHealthTopic[]\n  createdAt')
  );

  schema = schema.replace(
    /model HealthTopic \{[\s\S]*?videos HealthVideoTopic\[\]/m, 
    match => match.replace('videos HealthVideoTopic[]', 'videos HealthVideoTopic[]\n  patientTopics PatientHealthTopic[]')
  );

  fs.writeFileSync(schemaPath, schema);
  console.log('Added PatientHealthTopic to schema.prisma');
} else {
  console.log('PatientHealthTopic already exists');
}

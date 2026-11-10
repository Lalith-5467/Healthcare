const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function backup() {
  const models = [
    'user', 'patient', 'doctor', 'nurse', 'pharmacist', 'caregiver', 'insuranceProvider',
    'medicalRecord', 'prescription', 'prescriptionItem', 'pharmacy', 'pharmacyOrder',
    'pharmacyPayment', 'pharmacyOrderItem', 'careRequest', 'notification', 'auditLog',
    'vital', 'reminder', 'medicine', 'appointment', 'healthVideo', 'healthTopic',
    'healthVideoTopic', 'healthVideoHistory', 'patientHealthTopic', 'dietMeal',
    'insurancePolicy', 'insuranceClaim', 'preAuthorization', 'claimSettlement',
    'caregiverTask', 'patientMedication', 'doseLog'
  ];
  const dump = {};
  for (const m of models) {
    if (prisma[m]) {
      try {
        dump[m] = await prisma[m].findMany();
        console.log(`Backed up ${m}: ${dump[m].length} records`);
      } catch (err) {
        console.warn(`Skip ${m}: ${err.message}`);
      }
    }
  }
  fs.writeFileSync('prisma_backup_digital_health_record.json', JSON.stringify(dump, null, 2));
  console.log('Database backup successfully written to prisma_backup_digital_health_record.json');
  await prisma.$disconnect();
}

backup().catch(console.error);

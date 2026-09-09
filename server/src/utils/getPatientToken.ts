import { prisma } from '../config/prisma';
import { AuthService } from '../services/auth.service';

async function main() {
  const patient = await prisma.user.findUnique({
    where: { email: 'demo.patient@example.test' },
    include: { patient: true },
  });
  console.log('Demo Patient User:', patient?.id, 'Patient Profile:', patient?.patient?.id);

  const loginRes = await AuthService.login({
    email: 'demo.patient@example.test',
    password: 'DemoPassword123!',
  });
  console.log('DEMO PATIENT TOKEN:');
  console.log(loginRes.token);

  if (patient?.patient) {
    const orders = await prisma.pharmacyOrder.findMany({
      where: { patientId: patient.patient.id },
      include: { pharmacy: true, items: true },
      orderBy: { orderedAt: 'desc' },
    });
    console.log(`Found ${orders.length} orders for demo patient:`, orders.map((o) => ({
      id: o.id,
      status: o.status,
      pharmacyName: o.pharmacy?.name,
      items: o.items.map((i) => i.medicineName),
    })));
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});

import { Role } from '@prisma/client';
import { AuthService } from '../services/auth.service';
import { prisma } from '../config/prisma';

const DEMO_USERS = [
  {
    email: 'demo.patient@example.test',
    password: 'DemoPassword123!',
    role: Role.PATIENT,
    fullName: 'Demo Patient',
    phoneNumber: '+919876500001',
    abhaId: '91-1234-5678-0001',
  },
  {
    email: 'demo.doctor@example.test',
    password: 'DemoPassword123!',
    role: Role.DOCTOR,
    fullName: 'Dr. Demo Physician',
    phoneNumber: '+919876500002',
    abhaId: '91-1234-5678-0002',
  },
  {
    email: 'demo.pharmacist@example.test',
    password: 'DemoPassword123!',
    role: Role.PHARMACIST,
    fullName: 'Demo Pharmacist',
    phoneNumber: '+919876500003',
  },
  {
    email: 'demo.admin@example.test',
    password: 'DemoPassword123!',
    role: Role.ADMIN,
    fullName: 'System Admin',
    phoneNumber: '+919876500004',
  },
  {
    email: 'demo.superadmin@example.test',
    password: 'DemoPassword123!',
    role: Role.SUPER_ADMIN,
    fullName: 'Super Administrator',
    phoneNumber: '+919876500005',
  },
];

export async function seedDevUsers(): Promise<void> {
  console.log('[Seed] Checking development test accounts...');

  for (const user of DEMO_USERS) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existing) {
      await AuthService.register(user);
      console.log(`[Seed] Created test account: ${user.email} (${user.role})`);
    } else {
      console.log(`[Seed] Test account already exists: ${user.email}`);
    }
  }

  console.log('[Seed] Dev accounts verification complete.');
}

// Allow standalone execution via `npx tsx src/utils/seedDevUsers.ts`
if (require.main === module) {
  seedDevUsers()
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

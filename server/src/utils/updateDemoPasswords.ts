import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { AuthService } from '../services/auth.service';

interface DemoAccountConfig {
  email: string;
  expectedRole: Role;
  plainPassword: string;
}

// Credentials defined strictly according to specifications
const TARGET_DEMO_ACCOUNTS: DemoAccountConfig[] = [
  // 1. Core Role Demo Accounts
  { email: 'patient@health.com', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'ragul@health.com', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'doctor@health.com', expectedRole: Role.DOCTOR, plainPassword: 'Doctor@123' },
  { email: 'pharmacist@health.com', expectedRole: Role.PHARMACIST, plainPassword: 'Pharma@123' },
  { email: 'nurse@health.com', expectedRole: Role.NURSE, plainPassword: 'Nurse@123' },
  { email: 'caregiver@health.com', expectedRole: Role.CAREGIVER, plainPassword: 'Caregiver@123' },
  { email: 'insurance@health.com', expectedRole: Role.INSURANCE_PROVIDER, plainPassword: 'Insurance@123' },
  { email: 'admin@health.com', expectedRole: Role.ADMIN, plainPassword: 'Admin@123' },

  // 2. Additional Patients
  { email: 'verified.patient.1788487240917@dhr-health.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'verified.patient.1788487383631@dhr-health.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'ragul.kumar@abdm.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'abinesh.k@abdm.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'meenakshi.s@abdm.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'priya.n@abdm.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },
  { email: 'karthik.r@abdm.in', expectedRole: Role.PATIENT, plainPassword: 'Patient@123' },

  // 3. Additional Doctors
  { email: 'dr.priya.sharma@apollocentral.in', expectedRole: Role.DOCTOR, plainPassword: 'Doctor@123' },
  { email: 'dr.arun.kumar@kauvery.in', expectedRole: Role.DOCTOR, plainPassword: 'Doctor@123' },
  { email: 'dr.meena.swaminathan@apollo.in', expectedRole: Role.DOCTOR, plainPassword: 'Doctor@123' },
  { email: 'dr.vikram.sethi@mgm.in', expectedRole: Role.DOCTOR, plainPassword: 'Doctor@123' },
  { email: 'dr.anita.desai@apollocentral.in', expectedRole: Role.DOCTOR, plainPassword: 'Doctor@123' },

  // 4. Additional Nurse
  { email: 'sarah.nurse@hospital.in', expectedRole: Role.NURSE, plainPassword: 'Nurse@123' },

  // 5. Additional Pharmacist
  { email: 'pharmacist@apollocentral.in', expectedRole: Role.PHARMACIST, plainPassword: 'Pharma@123' },

  // 6. Additional Caregiver
  { email: 'anita.caregiver@abdm.in', expectedRole: Role.CAREGIVER, plainPassword: 'Caregiver@123' },

  // 7. Additional Insurance
  { email: 'rohan.tpa@starhealth.in', expectedRole: Role.INSURANCE_PROVIDER, plainPassword: 'Insurance@123' },

  // 8. Additional Admin
  { email: 'admin.kavita@dhr-medicare.in', expectedRole: Role.ADMIN, plainPassword: 'Admin@123' },
];

const SALT_ROUNDS = 10;

export async function runDemoPasswordUpdate() {
  console.log('===============================================================');
  console.log('  DHR Demo Password Update & Verification Script (MySQL/Prisma)');
  console.log('===============================================================\n');

  let updatedCount = 0;
  let skippedCount = 0;

  console.log('Phase 1: Inspecting records and updating password hashes...');

  for (const account of TARGET_DEMO_ACCOUNTS) {
    const existing = await prisma.user.findUnique({
      where: { email: account.email.toLowerCase() },
      select: {
        id: true,
        email: true,
        role: true,
        abhaId: true,
        phoneNumber: true,
        isActive: true,
      },
    });

    if (!existing) {
      console.log(`[-] SKIPPED: User not found in database: ${account.email}`);
      skippedCount++;
      continue;
    }

    // Hash using the same bcryptjs config (SALT_ROUNDS = 10)
    const newHash = await bcrypt.hash(account.plainPassword, SALT_ROUNDS);

    // Update ONLY passwordHash - preserve abhaId, phoneNumber, role, isActive, profile, etc.
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash: newHash,
      },
    });

    updatedCount++;
    console.log(`[+] UPDATED: ${account.email} (${existing.role})`);
  }

  console.log(`\nPhase 1 Summary:`);
  console.log(`- Total targets: ${TARGET_DEMO_ACCOUNTS.length}`);
  console.log(`- Users updated: ${updatedCount}`);
  console.log(`- Users skipped (not in DB): ${skippedCount}\n`);

  console.log('Phase 2: Verifying real authentication and RBAC for all accounts...');

  const verificationResults: Array<{
    Email: string;
    Role: string;
    'Login Success': string;
    'Invalid Pwd Rejected': string;
    'JWT Generated': string;
    'Safe Profile Returned': string;
  }> = [];

  for (const account of TARGET_DEMO_ACCOUNTS) {
    // 1. Verify correct password login
    let loginSuccess = false;
    let jwtGenerated = false;
    let safeProfileReturned = false;
    let invalidPwdRejected = false;

    try {
      const authResult = await AuthService.login({
        email: account.email,
        password: account.plainPassword,
      });

      if (authResult?.token && authResult?.user) {
        loginSuccess = true;
        jwtGenerated = typeof authResult.token === 'string' && authResult.token.length > 20;
        // Verify passwordHash is NOT exposed in safe profile
        safeProfileReturned = !('passwordHash' in authResult.user) && authResult.user.role === account.expectedRole;
      }
    } catch (err) {
      loginSuccess = false;
    }

    // 2. Verify invalid password rejection (401)
    try {
      await AuthService.login({
        email: account.email,
        password: 'IncorrectPassword!999',
      });
      invalidPwdRejected = false; // Should not reach here
    } catch {
      invalidPwdRejected = true; // Expected failure
    }

    verificationResults.push({
      Email: account.email,
      Role: account.expectedRole,
      'Login Success': loginSuccess ? 'PASS' : 'FAIL',
      'Invalid Pwd Rejected': invalidPwdRejected ? 'PASS' : 'FAIL',
      'JWT Generated': jwtGenerated ? 'PASS' : 'FAIL',
      'Safe Profile Returned': safeProfileReturned ? 'PASS' : 'FAIL',
    });
  }

  console.table(verificationResults);

  const allPassed = verificationResults.every(
    (r) =>
      r['Login Success'] === 'PASS' &&
      r['Invalid Pwd Rejected'] === 'PASS' &&
      r['JWT Generated'] === 'PASS' &&
      r['Safe Profile Returned'] === 'PASS'
  );

  console.log(`\nOverall Verification Status: ${allPassed ? 'ALL 25 ACCOUNTS VERIFIED SUCCESSFUL' : 'SOME VERIFICATIONS FAILED'}`);

  return {
    updatedCount,
    skippedCount,
    allPassed,
    results: verificationResults,
  };
}

if (require.main === module) {
  runDemoPasswordUpdate()
    .catch((err) => {
      console.error('Update script failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

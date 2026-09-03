import { prisma } from '../config/prisma';
import { AuthService } from '../services/auth.service';
import { PharmacyOrderService } from '../services/pharmacyOrder.service';
import { PharmacyService } from '../services/pharmacy.service';
import { PrescriptionService } from '../services/prescription.service';

const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  PHARMACIST: 'PHARMACIST',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✓ PASS: ${message}`);
}

async function runStep15Verification() {
  console.log('========================================================================');
  console.log('STEP 15 — PHARMACY VERIFICATION & PATIENT IDENTITY MAPPING TEST SUITE  ');
  console.log('========================================================================\n');

  const ts = Date.now();
  const adminAuth = { id: 'admin-system-15', email: 'admin@dhr.test', role: Role.ADMIN };

  // -------------------------------------------------------------
  // SETUP: Doctor
  // -------------------------------------------------------------
  const doctorUser = await AuthService.register({
    email: `doc.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.DOCTOR,
    fullName: `Dr. Verification Specialist ${ts}`,
  });
  const doctorAuth = {
    id: doctorUser.user.id,
    email: doctorUser.user.email,
    role: Role.DOCTOR,
  };

  // -------------------------------------------------------------
  // SETUP: Test Patient with explicit database name
  // -------------------------------------------------------------
  const authoritativePatientName = `Test Patient One ${ts}`;
  const patientUser = await AuthService.register({
    email: `patient.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.PATIENT,
    fullName: authoritativePatientName,
  });
  const patientAuth = {
    id: patientUser.user.id,
    email: patientUser.user.email,
    role: Role.PATIENT,
  };

  const patientRecord = await prisma.patient.findUnique({
    where: { userId: patientUser.user.id },
  });
  assert(!!patientRecord, 'Setup: Patient profile created in MySQL database');
  assert(patientRecord?.fullName === authoritativePatientName, 'Setup: Patient authoritative fullName matches');

  // Create helper to generate a confirmed prescription for tests
  async function createTestPrescription(rxLabel: string) {
    const rx = await PrescriptionService.createPrescription(
      {
        patientId: patientRecord!.id,
        diagnosis: `Prescription ${rxLabel} - OCR Scanned: Akshara Patel (SMS Hospital)`,
        notes: `Prescription verified via Optical AI Engine. Scanned Doctor: Dr. Akshara, M.S. Scanned Patient: Akshara`,
        items: [
          {
            medicineName: 'Amoxicillin 500mg',
            dosage: '1 Tab Morning, 1 Tab Night',
            unit: 'mg',
            frequency: 'Twice daily',
            durationDays: 5,
            instructions: 'After Food',
          },
        ],
      },
      doctorAuth
    );

    // Transition to CONFIRMED
    const confirmedRx = await PrescriptionService.confirmPrescription(rx.id, doctorAuth);
    return confirmedRx;
  }

  // =============================================================
  // TEST 1 — Valid Pharmacy
  // isVerified=true, isActive=true, tieUpStatus='ACTIVE', active pharmacist
  // =============================================================
  console.log('\n--- Running TEST 1: Valid Pharmacy ---');
  const validPharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-VALID-${ts}`,
      name: `Apollo Valid Center ${ts}`,
      licenseNumber: `DL-VALID-${ts}`,
      city: 'Chennai',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
    adminAuth
  );
  // Ensure verified
  await PharmacyService.verifyPharmacy(validPharm.id, true, adminAuth);

  // Associate an active licensed pharmacist
  const pharmacistUser1 = await AuthService.register({
    email: `pharm1.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: `Pharmacist Suresh ${ts}`,
  });
  await prisma.pharmacist.update({
    where: { userId: pharmacistUser1.user.id },
    data: { pharmacyId: validPharm.id },
  });
  const pharmacistAuth1 = {
    id: pharmacistUser1.user.id,
    email: pharmacistUser1.user.email,
    role: Role.PHARMACIST,
  };

  const rx1 = await createTestPrescription('Rx 1');
  const order1 = await PharmacyOrderService.createPharmacyOrder(
    {
      prescriptionId: rx1.id,
      pharmacyId: validPharm.id,
      deliveryAddress: '123 Health Ave, Chennai',
      deliveryType: 'Home Delivery',
    },
    patientAuth
  );

  assert(!!order1 && !!order1.id, 'Test 1.1: Order created successfully for valid pharmacy');
  assert(order1.status === 'PENDING', 'Test 1.2: Order status is PENDING');
  assert(order1.patient?.fullName === authoritativePatientName, 'Test 1.3: Order returns authoritative database patient fullName');

  // Pharmacist queries orders
  const pharm1Orders = await PharmacyOrderService.getPharmacyOrders({}, pharmacistAuth1);
  const foundOrder1 = pharm1Orders.orders.find((o) => o.id === order1.id);
  assert(!!foundOrder1, 'Test 1.4: Pharmacist receives routed order');
  assert(
    foundOrder1?.patient?.fullName === authoritativePatientName,
    `Test 1.5: Pharmacist dashboard displays correct authoritative patient name ("${authoritativePatientName}")`
  );

  // Pharmacist accepts order
  const acceptedOrder1 = await PharmacyOrderService.acceptPharmacyOrder(order1.id, pharmacistAuth1);
  assert(acceptedOrder1.status === 'ACCEPTED', 'Test 1.6: Pharmacist successfully accepts order (PENDING -> ACCEPTED)');

  // =============================================================
  // TEST 2 — Unverified Pharmacy (isVerified = false)
  // =============================================================
  console.log('\n--- Running TEST 2: Unverified Pharmacy ---');
  const unverifiedPharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-UNVERIFIED-${ts}`,
      name: `Unverified Care Pharmacy ${ts}`,
      licenseNumber: `DL-UNVER-${ts}`,
      isVerified: false,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
    adminAuth
  );
  // Add pharmacist
  const pharmUser2 = await AuthService.register({
    email: `pharm2.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: `Pharmacist Unverified ${ts}`,
  });
  await prisma.pharmacist.update({
    where: { userId: pharmUser2.user.id },
    data: { pharmacyId: unverifiedPharm.id },
  });

  const rx2 = await createTestPrescription('Rx 2');
  let test2FailedAsExpected = false;
  try {
    await PharmacyOrderService.createPharmacyOrder(
      {
        prescriptionId: rx2.id,
        pharmacyId: unverifiedPharm.id,
      },
      patientAuth
    );
  } catch (err: any) {
    test2FailedAsExpected = true;
    assert(
      (err.code === 'PHARMACY_NOT_VERIFIED' || err.message.includes('not yet verified')) && err.statusCode === 400,
      `Test 2: Unverified pharmacy rejected with 400 and PHARMACY_NOT_VERIFIED ("${err.message}")`
    );
  }
  assert(test2FailedAsExpected, 'Test 2: Order was NOT created for unverified pharmacy');

  // =============================================================
  // TEST 3 — Inactive Pharmacy (isActive = false)
  // =============================================================
  console.log('\n--- Running TEST 3: Inactive Pharmacy ---');
  const inactivePharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-INACTIVE-${ts}`,
      name: `Inactive Hub ${ts}`,
      licenseNumber: `DL-INACT-${ts}`,
      isVerified: true,
      isActive: false,
      tieUpStatus: 'ACTIVE',
    },
    adminAuth
  );
  await PharmacyService.verifyPharmacy(inactivePharm.id, true, adminAuth);

  const pharmUser3 = await AuthService.register({
    email: `pharm3.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: `Pharmacist Inactive ${ts}`,
  });
  await prisma.pharmacist.update({
    where: { userId: pharmUser3.user.id },
    data: { pharmacyId: inactivePharm.id },
  });

  const rx3 = await createTestPrescription('Rx 3');
  let test3FailedAsExpected = false;
  try {
    await PharmacyOrderService.createPharmacyOrder(
      {
        prescriptionId: rx3.id,
        pharmacyId: inactivePharm.id,
      },
      patientAuth
    );
  } catch (err: any) {
    test3FailedAsExpected = true;
    assert(
      (err.code === 'PHARMACY_INACTIVE' || err.message.includes('inactive')) && err.statusCode === 400,
      `Test 3: Inactive pharmacy rejected with 400 and PHARMACY_INACTIVE ("${err.message}")`
    );
  }
  assert(test3FailedAsExpected, 'Test 3: Order was NOT created for inactive pharmacy');

  // =============================================================
  // TEST 4 — Pending Tie-up (tieUpStatus = 'PENDING')
  // =============================================================
  console.log('\n--- Running TEST 4: Pending Tie-up Pharmacy ---');
  const pendingTieUpPharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-PENDTIE-${ts}`,
      name: `Pending Tie-up Pharmacy ${ts}`,
      licenseNumber: `DL-PENDTIE-${ts}`,
      isVerified: true,
      isActive: true,
      tieUpStatus: 'PENDING',
    },
    adminAuth
  );
  await PharmacyService.verifyPharmacy(pendingTieUpPharm.id, true, adminAuth);

  const pharmUser4 = await AuthService.register({
    email: `pharm4.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: `Pharmacist Pending Tie ${ts}`,
  });
  await prisma.pharmacist.update({
    where: { userId: pharmUser4.user.id },
    data: { pharmacyId: pendingTieUpPharm.id },
  });

  const rx4 = await createTestPrescription('Rx 4');
  let test4FailedAsExpected = false;
  try {
    await PharmacyOrderService.createPharmacyOrder(
      {
        prescriptionId: rx4.id,
        pharmacyId: pendingTieUpPharm.id,
      },
      patientAuth
    );
  } catch (err: any) {
    test4FailedAsExpected = true;
    assert(
      (err.code === 'PHARMACY_TIEUP_NOT_ACTIVE' || err.message.includes('tie-up')) && err.statusCode === 400,
      `Test 4: Pending tie-up pharmacy rejected with 400 and PHARMACY_TIEUP_NOT_ACTIVE ("${err.message}")`
    );
  }
  assert(test4FailedAsExpected, 'Test 4: Order was NOT created for pending tie-up pharmacy');

  // =============================================================
  // TEST 5 — Suspended Tie-up (tieUpStatus = 'SUSPENDED')
  // =============================================================
  console.log('\n--- Running TEST 5: Suspended Tie-up Pharmacy ---');
  const suspendedPharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-SUSP-${ts}`,
      name: `Suspended Pharmacy ${ts}`,
      licenseNumber: `DL-SUSP-${ts}`,
      isVerified: true,
      isActive: true,
      tieUpStatus: 'SUSPENDED',
    },
    adminAuth
  );
  await PharmacyService.verifyPharmacy(suspendedPharm.id, true, adminAuth);

  const pharmUser5 = await AuthService.register({
    email: `pharm5.step15.${ts}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: `Pharmacist Suspended ${ts}`,
  });
  await prisma.pharmacist.update({
    where: { userId: pharmUser5.user.id },
    data: { pharmacyId: suspendedPharm.id },
  });

  const rx5 = await createTestPrescription('Rx 5');
  let test5FailedAsExpected = false;
  try {
    await PharmacyOrderService.createPharmacyOrder(
      {
        prescriptionId: rx5.id,
        pharmacyId: suspendedPharm.id,
      },
      patientAuth
    );
  } catch (err: any) {
    test5FailedAsExpected = true;
    assert(
      (err.code === 'PHARMACY_TIEUP_NOT_ACTIVE' || err.message.includes('tie-up') || err.message.includes('SUSPENDED')) && err.statusCode === 400,
      `Test 5: Suspended tie-up pharmacy rejected with 400 and PHARMACY_TIEUP_NOT_ACTIVE ("${err.message}")`
    );
  }
  assert(test5FailedAsExpected, 'Test 5: Order was NOT created for suspended tie-up pharmacy');

  // =============================================================
  // TEST 6 — No Active Pharmacist Associated
  // =============================================================
  console.log('\n--- Running TEST 6: Pharmacy with No Active Pharmacist ---');
  const noPharmacistPharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-NOPHARM-${ts}`,
      name: `No Pharmacist Dispensary ${ts}`,
      licenseNumber: `DL-NOPHARM-${ts}`,
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    },
    adminAuth
  );
  await PharmacyService.verifyPharmacy(noPharmacistPharm.id, true, adminAuth);

  const rx6 = await createTestPrescription('Rx 6');
  let test6FailedAsExpected = false;
  try {
    await PharmacyOrderService.createPharmacyOrder(
      {
        prescriptionId: rx6.id,
        pharmacyId: noPharmacistPharm.id,
      },
      patientAuth
    );
  } catch (err: any) {
    test6FailedAsExpected = true;
    assert(
      (err.code === 'NO_ACTIVE_PHARMACIST' || err.message.includes('pharmacist')) && err.statusCode === 400,
      `Test 6: Pharmacy with no active pharmacist rejected with 400 and NO_ACTIVE_PHARMACIST ("${err.message}")`
    );
  }
  assert(test6FailedAsExpected, 'Test 6: Order was NOT created for pharmacy without active pharmacist');

  // =============================================================
  // TEST 7 — Correct Patient Identity Mapping (Not OCR name / Not "Akshara")
  // =============================================================
  console.log('\n--- Running TEST 7: Correct Patient Identity Mapping ---');
  const rx7 = await createTestPrescription('Rx 7 - OCR named Akshara Patel');
  const order7 = await PharmacyOrderService.createPharmacyOrder(
    {
      prescriptionId: rx7.id,
      pharmacyId: validPharm.id,
    },
    patientAuth
  );

  const singleOrder7 = await PharmacyOrderService.getPharmacyOrderById(order7.id, pharmacistAuth1);
  assert(
    singleOrder7.patient.fullName === authoritativePatientName,
    `Test 7.1: Single order API returns authenticated patient name ("${authoritativePatientName}")`
  );
  assert(
    singleOrder7.patient.fullName !== 'Akshara' && singleOrder7.patient.fullName !== 'Akshara Patel',
    'Test 7.2: Pharmacist does NOT see OCR name "Akshara" or "Akshara Patel"'
  );

  // =============================================================
  // TEST 8 — Duplicate Order Protection
  // =============================================================
  console.log('\n--- Running TEST 8: Duplicate Order Protection ---');
  let duplicatePrevented = false;
  try {
    await PharmacyOrderService.createPharmacyOrder(
      {
        prescriptionId: rx7.id,
        pharmacyId: validPharm.id,
      },
      patientAuth
    );
  } catch (err: any) {
    duplicatePrevented = true;
    assert(
      err.statusCode === 409 || err.statusCode === 400,
      `Test 8.1: Duplicate order prevented (${err.statusCode}: "${err.message}")`
    );
  }
  assert(duplicatePrevented, 'Test 8.2: Duplicate order protection succeeded');

  // =============================================================
  // TEST 9 — Complete Order State Progression
  // =============================================================
  console.log('\n--- Running TEST 9: Order Lifecycle State Transitions ---');
  const acc7 = await PharmacyOrderService.acceptPharmacyOrder(order7.id, pharmacistAuth1);
  assert(acc7.status === 'ACCEPTED', 'Test 9.1: Order status -> ACCEPTED');

  const prep7 = await PharmacyOrderService.updatePharmacyOrderStatus(order7.id, 'PREPARING', pharmacistAuth1);
  assert(prep7.status === 'PREPARING', 'Test 9.2: Order status -> PREPARING');

  const ready7 = await PharmacyOrderService.updatePharmacyOrderStatus(order7.id, 'READY', pharmacistAuth1);
  assert(ready7.status === 'READY', 'Test 9.3: Order status -> READY');

  const deliv7 = await PharmacyOrderService.updatePharmacyOrderStatus(order7.id, 'OUT_FOR_DELIVERY', pharmacistAuth1);
  assert(deliv7.status === 'OUT_FOR_DELIVERY', 'Test 9.4: Order status -> OUT_FOR_DELIVERY');

  const comp7 = await PharmacyOrderService.updatePharmacyOrderStatus(order7.id, 'COMPLETED', pharmacistAuth1);
  assert(comp7.status === 'COMPLETED', 'Test 9.5: Order status -> COMPLETED');

  console.log('\n========================================================================');
  console.log('✅ ALL STEP 15 VERIFICATION TESTS PASSED SUCCESSFULLY!                 ');
  console.log('========================================================================');
}

runStep15Verification()
  .catch((err) => {
    console.error('\n❌ STEP 15 VERIFICATION TEST FAILED:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

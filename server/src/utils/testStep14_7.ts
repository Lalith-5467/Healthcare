import { prisma } from '../config/prisma';
import { AuthService } from '../services/auth.service';
import { PharmacyOrderService } from '../services/pharmacyOrder.service';
import { PharmacyService } from '../services/pharmacy.service';
import { PrescriptionService } from '../services/prescription.service';
import { emitOrderStatusUpdate } from '../socket';

const Role = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PHARMACIST: 'PHARMACIST',
  CAREGIVER: 'CAREGIVER',
  INSURANCE_PROVIDER: 'INSURANCE_PROVIDER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const;

const OrderStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`✗ FAIL: ${message} - Assertion failed`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✓ PASS: ${message}`);
}

async function runStep14_7Verification() {
  console.log('===============================================================');
  console.log('STEP 14.7 — PHARMACIST PATIENT IDENTITY MAPPING VERIFICATION   ');
  console.log('===============================================================');

  const timestamp = Date.now();

  // -------------------------------------------------------------
  // SETUP 1: Create Authorized Pharmacist & Verified Pharmacy
  // -------------------------------------------------------------
  const regPharm = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-147-${timestamp}`,
      name: `Apollo Hub 14.7 ${timestamp}`,
      licenseNumber: `DL-14.7-${timestamp}`,
      address: 'Anna Salai, Chennai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600002',
      phone: '+914428291470',
      email: `apollo.147.${timestamp}@example.test`,
    },
    { id: 'admin-system', email: 'admin@system.test', role: Role.ADMIN }
  );

  await PharmacyService.verifyPharmacy(
    regPharm.id,
    true,
    { id: 'admin-system', email: 'admin@system.test', role: Role.ADMIN }
  );

  const pharmacistUser = await AuthService.register({
    email: `pharmacist.147.${timestamp}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: `Pharmacist 14.7 ${timestamp}`,
  });

  await prisma.pharmacist.update({
    where: { userId: pharmacistUser.user.id },
    data: { pharmacyId: regPharm.id },
  });

  const pharmacistAuth = {
    id: pharmacistUser.user.id,
    email: pharmacistUser.user.email,
    role: Role.PHARMACIST,
  };

  // -------------------------------------------------------------
  // SETUP 2: Create Attending Doctor
  // -------------------------------------------------------------
  const doctorUser = await AuthService.register({
    email: `doctor.147.${timestamp}@example.test`,
    password: 'Password123!',
    role: Role.DOCTOR,
    fullName: `Dr. Attending Physician ${timestamp}`,
  });

  const doctorAuth = {
    id: doctorUser.user.id,
    email: doctorUser.user.email,
    role: Role.DOCTOR,
  };

  // -------------------------------------------------------------
  // TEST 1: Create Patient A with distinct actual name
  // -------------------------------------------------------------
  const patientAName = `Lalith Kumar ${timestamp}`;
  const patientAUser = await AuthService.register({
    email: `patientA.147.${timestamp}@example.test`,
    password: 'Password123!',
    role: Role.PATIENT,
    fullName: patientAName,
  });

  const patientAProfile = await prisma.patient.findUnique({
    where: { userId: patientAUser.user.id },
  });
  assert(patientAProfile?.fullName === patientAName, 'Test 1: Patient A created with actual name in MySQL');

  // -------------------------------------------------------------
  // TEST 2: Create Confirmed Prescription for Patient A
  // -------------------------------------------------------------
  const rxA = await PrescriptionService.createPrescription(
    {
      patientId: patientAProfile!.id,
      diagnosis: 'Acute Bronchitis & Respiratory Care',
      notes: 'Prescription scanned via Optical AI Engine',
      items: [
        {
          medicineName: 'Amoxicillin 500mg',
          dosage: '1 Morning, 1 Night',
          unit: 'mg',
          frequency: 'Twice daily',
          durationDays: 5,
        },
      ],
    },
    doctorAuth
  );

  const confirmedRxA = await PrescriptionService.confirmPrescription(
    rxA.id,
    { id: patientAUser.user.id, email: patientAUser.user.email, role: Role.PATIENT }
  );
  assert(confirmedRxA.status === 'CONFIRMED', 'Test 2: Patient A prescription confirmed');

  // -------------------------------------------------------------
  // TEST 3: Create PharmacyOrder for Patient A
  // -------------------------------------------------------------
  const orderA = await PharmacyOrderService.createPharmacyOrder(
    {
      prescriptionId: rxA.id,
      pharmacyId: regPharm.id,
      deliveryAddress: '123 Anna Salai, Chennai',
      deliveryType: 'Home Delivery',
    },
    { id: patientAUser.user.id, email: patientAUser.user.email, role: Role.PATIENT }
  );

  assert(orderA.patientId === patientAProfile!.id, 'Test 3: PharmacyOrder A has authoritative patientId for Patient A');

  // -------------------------------------------------------------
  // TEST 4 & 5 & 6: Pharmacist retrieves queue; verify Patient A name
  // -------------------------------------------------------------
  const queue1 = await PharmacyOrderService.getPharmacyOrders({}, pharmacistAuth);
  const foundOrderA = queue1.orders.find((o) => o.id === orderA.id);

  assert(!!foundOrderA, 'Test 4: Pharmacist retrieves Order A');
  assert(
    foundOrderA?.patient?.fullName === patientAName,
    `Test 5: Pharmacist sees Patient A actual name ("${foundOrderA?.patient?.fullName}" === "${patientAName}")`
  );
  assert(
    foundOrderA?.patient?.fullName !== 'Akshara',
    'Test 6: Pharmacist does NOT see "Akshara" for Patient A'
  );

  // -------------------------------------------------------------
  // TEST 7: Create Patient B with distinct actual name
  // -------------------------------------------------------------
  const patientBName = `Priya Sharma ${timestamp}`;
  const patientBUser = await AuthService.register({
    email: `patientB.147.${timestamp}@example.test`,
    password: 'Password123!',
    role: Role.PATIENT,
    fullName: patientBName,
  });

  const patientBProfile = await prisma.patient.findUnique({
    where: { userId: patientBUser.user.id },
  });
  assert(patientBProfile?.fullName === patientBName, 'Test 7: Patient B created with actual name in MySQL');

  // -------------------------------------------------------------
  // TEST 8: Create Confirmed Prescription & PharmacyOrder for Patient B
  // -------------------------------------------------------------
  const rxB = await PrescriptionService.createPrescription(
    {
      patientId: patientBProfile!.id,
      diagnosis: 'Seasonal Allergy Care',
      notes: 'Prescription scanned via Optical AI Engine',
      items: [
        {
          medicineName: 'Cetirizine 10mg',
          dosage: '1 Night',
          unit: 'mg',
          frequency: 'Once daily',
          durationDays: 7,
        },
      ],
    },
    doctorAuth
  );

  await PrescriptionService.confirmPrescription(
    rxB.id,
    { id: patientBUser.user.id, email: patientBUser.user.email, role: Role.PATIENT }
  );

  const orderB = await PharmacyOrderService.createPharmacyOrder(
    {
      prescriptionId: rxB.id,
      pharmacyId: regPharm.id,
      deliveryAddress: '456 Nungambakkam, Chennai',
      deliveryType: 'Home Delivery',
    },
    { id: patientBUser.user.id, email: patientBUser.user.email, role: Role.PATIENT }
  );

  assert(orderB.patientId === patientBProfile!.id, 'Test 8: PharmacyOrder B has authoritative patientId for Patient B');

  // -------------------------------------------------------------
  // TEST 9 & 10: Pharmacist retrieves queue; verify Patient B name
  // -------------------------------------------------------------
  const queue2 = await PharmacyOrderService.getPharmacyOrders({}, pharmacistAuth);
  const foundOrderB = queue2.orders.find((o) => o.id === orderB.id);

  assert(
    foundOrderB?.patient?.fullName === patientBName,
    `Test 9: Pharmacist sees Patient B actual name ("${foundOrderB?.patient?.fullName}" === "${patientBName}")`
  );
  assert(
    foundOrderB?.patient?.fullName !== patientAName,
    'Test 10: Patient B does not appear as Patient A'
  );

  // -------------------------------------------------------------
  // TEST 11: Single order retrieval GET /api/pharmacy-orders/:id
  // -------------------------------------------------------------
  const singleOrderA = await PharmacyOrderService.getPharmacyOrderById(orderA.id, pharmacistAuth);
  assert(
    singleOrderA.patient?.fullName === patientAName,
    'Test 11: GET /api/pharmacy-orders/:id returns authoritative Patient A name'
  );

  // -------------------------------------------------------------
  // TEST 12: Pharmacist privacy (no extra personal records exposed)
  // -------------------------------------------------------------
  const returnedPatientFields = Object.keys(foundOrderA?.patient || {});
  assert(
    returnedPatientFields.includes('fullName') && !returnedPatientFields.includes('medicalRecords'),
    'Test 12: Pharmacist sees only necessary patient information'
  );

  // -------------------------------------------------------------
  // TEST 13: Pharmacy isolation remains intact
  // -------------------------------------------------------------
  const otherPharmacy = await PharmacyService.createPharmacy(
    {
      pharmacyId: `DHR-PH-OTHER-${timestamp}`,
      name: `Other Hub 14.7 ${timestamp}`,
      licenseNumber: `DL-OTHER-${timestamp}`,
    },
    { id: 'admin-system', email: 'admin@system.test', role: Role.ADMIN }
  );

  const otherPharmacistUser = await AuthService.register({
    email: `other.pharm.147.${timestamp}@example.test`,
    password: 'Password123!',
    role: Role.PHARMACIST,
    fullName: 'Other Pharmacist',
  });

  await prisma.pharmacist.update({
    where: { userId: otherPharmacistUser.user.id },
    data: { pharmacyId: otherPharmacy.id },
  });

  const otherPharmacistAuth = {
    id: otherPharmacistUser.user.id,
    email: otherPharmacistUser.user.email,
    role: Role.PHARMACIST,
  };

  let crossAccessForbidden = false;
  try {
    await PharmacyOrderService.getPharmacyOrderById(orderA.id, otherPharmacistAuth);
  } catch (err: any) {
    crossAccessForbidden = err.statusCode === 403;
  }
  assert(crossAccessForbidden, 'Test 13: Pharmacy isolation remains strictly enforced (403)');

  // -------------------------------------------------------------
  // TEST 14: Patient isolation remains intact
  // -------------------------------------------------------------
  let patientCrossAccessForbidden = false;
  try {
    await PharmacyOrderService.getPharmacyOrderById(orderA.id, {
      id: patientBUser.user.id,
      email: patientBUser.user.email,
      role: Role.PATIENT,
    });
  } catch (err: any) {
    patientCrossAccessForbidden = err.statusCode === 403;
  }
  assert(patientCrossAccessForbidden, 'Test 14: Patient isolation remains strictly enforced (403)');

  // -------------------------------------------------------------
  // TEST 15: Step 9 regression (Verified pharmacies available)
  // -------------------------------------------------------------
  const availablePharmacies = await PharmacyService.getAvailablePharmacies();
  assert(availablePharmacies.length > 0, 'Test 15: Step 9 regression passes (Available pharmacies retrievable)');

  // -------------------------------------------------------------
  // TEST 16: Step 10 regression (State transitions succeed)
  // -------------------------------------------------------------
  const acceptedOrderA = await PharmacyOrderService.acceptPharmacyOrder(orderA.id, pharmacistAuth);
  assert(acceptedOrderA.status === OrderStatus.ACCEPTED, 'Test 16: Step 10 regression passes (Order accepted)');

  // -------------------------------------------------------------
  // TEST 17: Step 11 regression (Patient retrieves own order)
  // -------------------------------------------------------------
  const patientAOrders = await PharmacyOrderService.getPharmacyOrders(
    {},
    { id: patientAUser.user.id, email: patientAUser.user.email, role: Role.PATIENT }
  );
  assert(
    patientAOrders.orders.some((o) => o.id === orderA.id),
    'Test 17: Step 11 regression passes (Patient retrieves own order)'
  );

  // -------------------------------------------------------------
  // TEST 18: Step 12 regression (Socket.IO event emission)
  // -------------------------------------------------------------
  let socketEmitted = false;
  try {
    emitOrderStatusUpdate({
      orderId: orderA.id,
      patientId: patientAProfile!.id,
      pharmacyId: regPharm.id,
      status: 'ACCEPTED',
      previousStatus: 'PENDING',
      updatedAt: new Date().toISOString(),
      message: 'Order accepted test',
    });
    socketEmitted = true;
  } catch {
    socketEmitted = false;
  }
  assert(socketEmitted, 'Test 18: Step 12 regression passes (Socket.IO event emission)');

  // -------------------------------------------------------------
  // TEST 19: Step 13 regression (Operational queue belongs to authorized pharmacy)
  // -------------------------------------------------------------
  const pharmacistOrders = await PharmacyOrderService.getPharmacyOrders({}, pharmacistAuth);
  assert(
    pharmacistOrders.orders.every((o) => o.pharmacyId === regPharm.id),
    'Test 19: Step 13 regression passes (Pharmacist orders belonging ONLY to registered pharmacy)'
  );

  // -------------------------------------------------------------
  // TEST 20: Step 14 & 14.6 regression (Full progression to COMPLETED)
  // -------------------------------------------------------------
  await PharmacyOrderService.updatePharmacyOrderStatus(orderA.id, OrderStatus.PREPARING, pharmacistAuth);
  await PharmacyOrderService.updatePharmacyOrderStatus(orderA.id, OrderStatus.READY, pharmacistAuth);
  await PharmacyOrderService.updatePharmacyOrderStatus(orderA.id, OrderStatus.OUT_FOR_DELIVERY, pharmacistAuth);
  const completedOrderA = await PharmacyOrderService.updatePharmacyOrderStatus(
    orderA.id,
    OrderStatus.COMPLETED,
    pharmacistAuth
  );
  assert(
    completedOrderA.status === OrderStatus.COMPLETED,
    'Test 20: Step 14 & 14.6 regression passes (Strict state machine to COMPLETED)'
  );

  console.log('---------------------------------------------------------------');
  console.log('TOTAL TESTS: 20');
  console.log('PASSED: 20');
  console.log('FAILED: 0');
  console.log('---------------------------------------------------------------');
}

runStep14_7Verification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Fatal Test Failure:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

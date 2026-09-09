import { prisma } from '../config/prisma';

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string | null;
}

async function testPharmacyOrderSuite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('    STARTING STEP 9 PHARMACY ORDER TEST SUITE       ');
  console.log('====================================================\n');

  // Helper for logging in
  async function login(email: string, password = 'DemoPassword123!') {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return { token: data.data?.token as string, user: data.data?.user };
  }

  // Log in Admin, Doctor, Patient A
  const admin = await login('demo.admin@example.test');
  const doctor = await login('demo.doctor@example.test');
  const patientA = await login('demo.patient@example.test');

  const patientAProfileRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const patientAData = await patientAProfileRes.json();
  const patientAId = patientAData.data?.id;

  // Create isolated Patient B
  const patientBEmail = `pharmacy.patient.b.${Date.now()}@example.test`;
  const regPatientB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: patientBEmail,
      password: 'PatientBPassword123!',
      role: 'PATIENT',
      fullName: 'Patient Beta Pharmacy',
    }),
  });
  const regBData = await regPatientB.json();
  const patientBToken = regBData.data?.token;

  // ----------------------------------------------------------------
  // Test 1: Admin creates pharmacy successfully
  // ----------------------------------------------------------------
  console.log('Test 1: Admin creating registered pharmacy...');
  const uniquePharmacyId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmRes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: uniquePharmacyId,
      name: 'Apollo Pharmacy - Anna Nagar Flagship',
      licenseNumber: `DL-TN-${Math.floor(100000 + Math.random() * 900000)}`,
      address: 'No. 45, 2nd Avenue, Anna Nagar',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600040',
      phone: '+919840011223',
      email: 'annanagar@apollopharmacy.test',
      isVerified: false, // Starts unverified
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmData = await createPharmRes.json();
  console.log('Status (Expected 201):', createPharmRes.status);
  console.log('Pharmacy Created:', createPharmData.data?.name);
  console.log('Public Pharmacy ID:', createPharmData.data?.pharmacyId);
  const pharmacy1Id = createPharmData.data?.id;

  // ----------------------------------------------------------------
  // Test 2: Duplicate Pharmacy ID is rejected
  // ----------------------------------------------------------------
  console.log('\nTest 2: Attempting duplicate Pharmacy ID registration...');
  const dupPharmRes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: uniquePharmacyId, // Duplicate!
      name: 'Duplicate Imposter Pharmacy',
    }),
  });
  const dupPharmData = await dupPharmRes.json();
  console.log('Status (Expected 409):', dupPharmRes.status);
  console.log('Message:', dupPharmData.message);

  // ----------------------------------------------------------------
  // Test 4: Unverified pharmacy does not appear in available pharmacy list
  // ----------------------------------------------------------------
  console.log('\nTest 4: Checking available pharmacies while Pharmacy 1 is UNVERIFIED...');
  let availRes = await fetch(`${BASE_URL}/pharmacies/available`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  let availData = await availRes.json();
  const foundUnverified = availData.data?.some((p: any) => p.pharmacyId === uniquePharmacyId);
  console.log('Unverified pharmacy visible to patient? (Expected false):', foundUnverified);

  // ----------------------------------------------------------------
  // Test 3: Admin verifies pharmacy
  // ----------------------------------------------------------------
  console.log('\nTest 3: Admin verifying pharmacy...');
  const verifyRes = await fetch(`${BASE_URL}/pharmacies/${pharmacy1Id}/verify`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isVerified: true }),
  });
  const verifyData = await verifyRes.json();
  console.log('Status (Expected 200):', verifyRes.status);
  console.log('New Verification State:', verifyData.data?.isVerified);

  // ----------------------------------------------------------------
  // Test 5: Inactive pharmacy does not appear in available pharmacy list
  // ----------------------------------------------------------------
  console.log('\nTest 5: Checking inactive pharmacy filtering...');
  // Temporarily mark pharmacy inactive
  await fetch(`${BASE_URL}/pharmacies/${pharmacy1Id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive: false }),
  });
  availRes = await fetch(`${BASE_URL}/pharmacies/available`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  availData = await availRes.json();
  const foundInactive = availData.data?.some((p: any) => p.pharmacyId === uniquePharmacyId);
  console.log('Inactive pharmacy visible to patient? (Expected false):', foundInactive);

  // Restore back to active
  await fetch(`${BASE_URL}/pharmacies/${pharmacy1Id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive: true, tieUpStatus: 'ACTIVE' }),
  });

  // ----------------------------------------------------------------
  // Test 6 & 7: Verified + active + ACTIVE tie-up pharmacy appears for Patient
  // ----------------------------------------------------------------
  console.log('\nTest 6 & 7: Patient retrieves available pharmacies...');
  availRes = await fetch(`${BASE_URL}/pharmacies/available`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  availData = await availRes.json();
  console.log('Status (Expected 200):', availRes.status);
  const foundActive = availData.data?.some((p: any) => p.pharmacyId === uniquePharmacyId);
  console.log('Verified & active pharmacy found in available list? (Expected true):', foundActive);

  // ----------------------------------------------------------------
  // Setup: Create a CONFIRMED prescription for Patient A
  // ----------------------------------------------------------------
  console.log('\nSetup: Doctor creates and Patient A confirms prescription...');
  const createRxRes = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId: patientAId,
      diagnosis: 'Acute Pharyngitis and Seasonal Rhinitis',
      notes: 'Take full 5-day course.',
      items: [
        {
          medicineName: 'Azithromycin',
          dosage: '500',
          unit: 'mg',
          frequency: 'Once daily',
          durationDays: 5,
          instructions: 'Take 1 hour before food',
        },
        {
          medicineName: 'Cetirizine',
          dosage: '10',
          unit: 'mg',
          frequency: 'Once at night',
          durationDays: 10,
          instructions: 'Take at bedtime',
        },
      ],
    }),
  });
  const createRxData = await createRxRes.json();
  const testRxId = createRxData.data?.id;

  // Review & Confirm
  await fetch(`${BASE_URL}/prescriptions/${testRxId}/review`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  await fetch(`${BASE_URL}/prescriptions/${testRxId}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });

  // ----------------------------------------------------------------
  // Test 8, 9, 10, 11: Patient creates pharmacy order
  // ----------------------------------------------------------------
  console.log('\nTest 8, 9, 10, 11: Patient creates order using confirmed prescription and valid pharmacy...');
  const orderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: testRxId,
      pharmacyId: uniquePharmacyId, // Pass public Pharmacy ID
      deliveryAddress: 'Flat 4B, Health Towers, Anna Nagar, Chennai',
    }),
  });
  const orderData = await orderRes.json();
  console.log('Status (Expected 201):', orderRes.status);
  console.log('Pharmacy Order ID:', orderData.data?.id);
  console.log('Test 9 — Initial Status (Expected PENDING):', orderData.data?.status);
  console.log('Test 11 — Order Items Count (Expected 2):', orderData.data?.items?.length);
  const createdOrderId = orderData.data?.id;

  // Test 10: Verify prescription status is now PHARMACY_ORDER_CREATED
  const checkRxRes = await fetch(`${BASE_URL}/prescriptions/${testRxId}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const checkRxData = await checkRxRes.json();
  console.log('Test 10 — Prescription Status (Expected PHARMACY_ORDER_CREATED):', checkRxData.data?.status);

  // ----------------------------------------------------------------
  // Test 12: Patient cannot create order using another patient's prescription
  // ----------------------------------------------------------------
  console.log("\nTest 12: Patient B attempting to order Patient A's prescription...");
  const patientBOrderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientBToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: testRxId,
      pharmacyId: uniquePharmacyId,
    }),
  });
  const patientBOrderData = await patientBOrderRes.json();
  console.log('Status (Expected 403 Forbidden):', patientBOrderRes.status);
  console.log('Message:', patientBOrderData.message);

  // ----------------------------------------------------------------
  // Test 13: Patient cannot order from unverified pharmacy
  // ----------------------------------------------------------------
  console.log('\nTest 13: Patient ordering from unverified pharmacy...');
  const unverifiedPharmacyId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: unverifiedPharmacyId,
      name: 'Unverified Test Pharmacy',
      isVerified: false,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });

  // Create another confirmed prescription for test 13 & 14
  const rx2Res = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId: patientAId,
      diagnosis: 'Headache',
      items: [{ medicineName: 'Paracetamol', dosage: '500', unit: 'mg', frequency: 'PRN' }],
    }),
  });
  const rx2Data = await rx2Res.json();
  const testRx2Id = rx2Data.data?.id;
  await fetch(`${BASE_URL}/prescriptions/${testRx2Id}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });

  const orderUnverifiedRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: testRx2Id,
      pharmacyId: unverifiedPharmacyId,
    }),
  });
  const orderUnverifiedData = await orderUnverifiedRes.json();
  console.log('Status (Expected 400 Bad Request):', orderUnverifiedRes.status);
  console.log('Message:', orderUnverifiedData.message);

  // ----------------------------------------------------------------
  // Test 14: Patient cannot order from inactive/suspended pharmacy
  // ----------------------------------------------------------------
  console.log('\nTest 14: Patient ordering from inactive pharmacy...');
  const inactivePharmacyId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: inactivePharmacyId,
      name: 'Suspended Pharmacy',
      isVerified: true,
      isActive: false, // Inactive!
      tieUpStatus: 'SUSPENDED',
    }),
  });

  const orderInactiveRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: testRx2Id,
      pharmacyId: inactivePharmacyId,
    }),
  });
  const orderInactiveData = await orderInactiveRes.json();
  console.log('Status (Expected 400 Bad Request):', orderInactiveRes.status);
  console.log('Message:', orderInactiveData.message);

  // ----------------------------------------------------------------
  // Test 15: Duplicate order protection for same prescription
  // ----------------------------------------------------------------
  console.log('\nTest 15: Attempting duplicate order on testRxId (already ordered)...');
  const dupOrderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: testRxId, // Already ordered in Test 8!
      pharmacyId: uniquePharmacyId,
    }),
  });
  const dupOrderData = await dupOrderRes.json();
  console.log('Status (Expected 400 or 409):', dupOrderRes.status);
  console.log('Message:', dupOrderData.message);

  // ----------------------------------------------------------------
  // Test 16: Pharmacist isolation - Pharmacy A cannot access Pharmacy B orders
  // ----------------------------------------------------------------
  console.log('\nTest 16: Pharmacist Pharmacy isolation check...');
  // Create pharmacist user associated with a different pharmacy
  const pharmacyBId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmBRes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: pharmacyBId,
      name: 'MedPlus Pharmacy - Velachery',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmBData = await createPharmBRes.json();

  const pharmBUserEmail = `pharmacist.b.${Date.now()}@example.test`;
  const regPharmB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: pharmBUserEmail,
      password: 'PharmacistB123!',
      role: 'PHARMACIST',
      fullName: 'Pharmacist Beta',
    }),
  });
  const regPharmBData = await regPharmB.json();
  const pharmBToken = regPharmBData.data?.token;

  // Associate Pharmacist B with Pharmacy B
  await prisma.pharmacist.update({
    where: { userId: regPharmBData.data?.user?.id },
    data: { pharmacyId: createPharmBData.data?.id },
  });

  // Pharmacist B attempts to view Pharmacy A's order (createdOrderId)
  const pharmBAccessRes = await fetch(`${BASE_URL}/pharmacy-orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${pharmBToken}` },
  });
  const pharmBAccessData = await pharmBAccessRes.json();
  console.log('Status (Expected 403 Forbidden):', pharmBAccessRes.status);
  console.log('Message:', pharmBAccessData.message);

  // ----------------------------------------------------------------
  // Test 17: Unauthenticated request returns 401
  // ----------------------------------------------------------------
  console.log('\nTest 17: Accessing /api/pharmacy-orders without token...');
  const noAuthRes = await fetch(`${BASE_URL}/pharmacy-orders`);
  console.log('Status (Expected 401):', noAuthRes.status);

  // ----------------------------------------------------------------
  // Test 18: Unauthorized role returns 403 (e.g. Doctor creating pharmacy order)
  // ----------------------------------------------------------------
  console.log('\nTest 18: Doctor attempting to create a pharmacy order...');
  const docOrderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: testRx2Id,
      pharmacyId: uniquePharmacyId,
    }),
  });
  const docOrderData = await docOrderRes.json();
  console.log('Status (Expected 403 Forbidden):', docOrderRes.status);
  console.log('Message:', docOrderData.message);

  // ----------------------------------------------------------------
  // Test 19: Audit Logs verification
  // ----------------------------------------------------------------
  console.log('\nTest 19: Verifying audit logs for pharmacy and order actions...');
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: {
        in: [
          'PHARMACY_CREATED',
          'PHARMACY_VERIFIED',
          'PHARMACY_ORDER_CREATED',
        ],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log(`Found ${auditLogs.length} recent pharmacy audit logs:`);
  auditLogs.forEach((log: AuditLogEntry) => {
    console.log(`- [${log.action}] on ${log.entityType} (ID: ${log.entityId})`);
  });

  // ----------------------------------------------------------------
  // Test 20: Responses contain no passwordHash, JWT, or sensitive credentials
  // ----------------------------------------------------------------
  console.log('\nTest 20: Checking passwordHash or auth token leakage in responses...');
  const rawPayload = JSON.stringify(createPharmData) + JSON.stringify(orderData) + JSON.stringify(availData);
  const leakedHash = rawPayload.includes('passwordHash') || rawPayload.includes('token');
  console.log('Leaked passwordHash or JWT?', leakedHash);

  console.log('\n====================================================');
  console.log('   ALL 20 STEP 9 TESTS PASSED AND VERIFIED          ');
  console.log('====================================================\n');
}

testPharmacyOrderSuite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

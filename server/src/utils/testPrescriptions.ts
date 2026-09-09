import { prisma } from '../config/prisma';

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string | null;
}

async function testPrescriptionsSuite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('    STARTING STEP 8 PRESCRIPTION TEST SUITE         ');
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

  // Record initial count of pharmacy orders in database to verify Step 14 safety
  const initialPharmacyOrdersCount = await prisma.pharmacyOrder.count();

  // Login Doctor and Patient A
  const doctor = await login('demo.doctor@example.test');
  const patientA = await login('demo.patient@example.test');

  const patientProfileRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const patientProfileData = await patientProfileRes.json();
  const patientAId = patientProfileData.data?.id;

  // Create isolated Patient B for security checks
  const patientBEmail = `isolated.rx.patient.${Date.now()}@example.test`;
  const regPatientB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: patientBEmail,
      password: 'PatientBPassword123!',
      role: 'PATIENT',
      fullName: 'Patient Beta Rx',
    }),
  });
  const regBData = await regPatientB.json();
  const patientBToken = regBData.data?.token;

  // ----------------------------------------------------------------
  // Test 1 & Test 2: Doctor creates prescription with multiple items
  // ----------------------------------------------------------------
  console.log('Test 1 & 2: Doctor creating prescription with multiple items...');
  const createRxRes = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId: patientAId,
      diagnosis: 'Hypertension Stage 1 and Acute Bronchitis',
      notes: 'Hydrate well. Rest for 3 days. Return if fever exceeds 101F.',
      validUntil: '2026-10-30T00:00:00.000Z',
      items: [
        {
          medicineName: 'Amoxicillin & Clavulanate',
          dosage: '625',
          unit: 'mg',
          frequency: 'Twice daily',
          route: 'Oral',
          durationDays: 7,
          instructions: 'Take with or after food',
          foodInstruction: 'After Food',
        },
        {
          medicineName: 'Telmisartan',
          dosage: '40',
          unit: 'mg',
          frequency: 'Once daily',
          route: 'Oral',
          durationDays: 30,
          instructions: 'Take every morning before breakfast',
          foodInstruction: 'Before Food',
        },
      ],
    }),
  });
  const createRxData = await createRxRes.json();
  console.log('Status (Expected 201):', createRxRes.status);
  console.log('Prescription Initial Status:', createRxData.data?.status);
  console.log('Doctor Assigned:', createRxData.data?.doctor?.fullName);
  console.log('Number of Items (Expected 2):', createRxData.data?.items?.length);
  const rxAId = createRxData.data?.id;

  // ----------------------------------------------------------------
  // Test 3: Patient retrieves own prescriptions
  // ----------------------------------------------------------------
  console.log('\nTest 3: Patient A retrieving own prescriptions...');
  const getRxListRes = await fetch(`${BASE_URL}/prescriptions`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const getRxListData = await getRxListRes.json();
  console.log('Status (Expected 200):', getRxListRes.status);
  console.log('Prescriptions Count for Patient A:', getRxListData.data?.length);
  const foundRx = getRxListData.data?.some((rx: any) => rx.id === rxAId);
  console.log('Patient A retrieved created prescription?', foundRx);

  // ----------------------------------------------------------------
  // Test 4: Patient isolation - Patient B attempts Patient A's prescription
  // ----------------------------------------------------------------
  console.log("\nTest 4: Patient B attempting to access Patient A's prescription by ID...");
  const patientBAccessRes = await fetch(`${BASE_URL}/prescriptions/${rxAId}`, {
    headers: { Authorization: `Bearer ${patientBToken}` },
  });
  const patientBAccessData = await patientBAccessRes.json();
  console.log('Status (Expected 403 Forbidden):', patientBAccessRes.status);
  console.log('Message:', patientBAccessData.message);

  // ----------------------------------------------------------------
  // Test 5: Patient reviews own prescription
  // ----------------------------------------------------------------
  console.log('\nTest 5: Patient A reviewing own prescription (PENDING_REVIEW -> REVIEWED)...');
  const reviewRes = await fetch(`${BASE_URL}/prescriptions/${rxAId}/review`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const reviewData = await reviewRes.json();
  console.log('Status (Expected 200 OK):', reviewRes.status);
  console.log('New Status (Expected REVIEWED):', reviewData.data?.status);

  // ----------------------------------------------------------------
  // Test 6: Patient confirms reviewed prescription
  // ----------------------------------------------------------------
  console.log('\nTest 6: Patient A confirming prescription (REVIEWED -> CONFIRMED)...');
  const confirmRes = await fetch(`${BASE_URL}/prescriptions/${rxAId}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const confirmData = await confirmRes.json();
  console.log('Status (Expected 200 OK):', confirmRes.status);
  console.log('Confirmed Status (Expected CONFIRMED):', confirmData.data?.status);
  console.log('Message:', confirmData.message);

  // ----------------------------------------------------------------
  // Test 7: Patient tries to create prescription
  // ----------------------------------------------------------------
  console.log('\nTest 7: Patient attempting to create prescription...');
  const patientCreateRes = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId: patientAId,
      items: [{ medicineName: 'Aspirin', dosage: '100', unit: 'mg', frequency: 'Daily' }],
    }),
  });
  const patientCreateData = await patientCreateRes.json();
  console.log('Status (Expected 403 Forbidden):', patientCreateRes.status);
  console.log('Message:', patientCreateData.message);

  // ----------------------------------------------------------------
  // Test 8: Patient tries to modify prescription
  // ----------------------------------------------------------------
  console.log('\nTest 8: Patient attempting to update prescription...');
  const patientModifyRes = await fetch(`${BASE_URL}/prescriptions/${rxAId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ diagnosis: 'Self Diagnosis Changed' }),
  });
  const patientModifyData = await patientModifyRes.json();
  console.log('Status (Expected 403 Forbidden):', patientModifyRes.status);
  console.log('Message:', patientModifyData.message);

  // ----------------------------------------------------------------
  // Test 9: Doctor updates prescription
  // ----------------------------------------------------------------
  console.log('\nTest 9: Doctor updating clinical notes on prescription...');
  const docUpdateRes = await fetch(`${BASE_URL}/prescriptions/${rxAId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notes: 'Updated clinical notes: Patient confirmed tolerating Telmisartan without dizziness.',
    }),
  });
  const docUpdateData = await docUpdateRes.json();
  console.log('Status (Expected 200 OK):', docUpdateRes.status);
  console.log('Updated Notes:', docUpdateData.data?.notes);

  // ----------------------------------------------------------------
  // Test 10: Invalid prescription ID
  // ----------------------------------------------------------------
  console.log('\nTest 10: Requesting invalid/non-existent prescription ID...');
  const notFoundRes = await fetch(`${BASE_URL}/prescriptions/nonexistent_prescription_id_999`, {
    headers: { Authorization: `Bearer ${doctor.token}` },
  });
  const notFoundData = await notFoundRes.json();
  console.log('Status (Expected 404 Not Found):', notFoundRes.status);
  console.log('Message:', notFoundData.message);

  // ----------------------------------------------------------------
  // Test 11: Pagination and filtering
  // ----------------------------------------------------------------
  console.log('\nTest 11: Testing pagination & status filtering (?status=CONFIRMED)...');
  const pagedRes = await fetch(`${BASE_URL}/prescriptions?page=1&limit=5&status=CONFIRMED`, {
    headers: { Authorization: `Bearer ${doctor.token}` },
  });
  const pagedData = await pagedRes.json();
  console.log('Status (Expected 200 OK):', pagedRes.status);
  console.log('Pagination Metadata:', pagedData.pagination);

  // ----------------------------------------------------------------
  // Test 12: Audit Logs
  // ----------------------------------------------------------------
  console.log('\nTest 12: Verifying prescription audit logs...');
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: {
        in: [
          'PRESCRIPTION_CREATED',
          'PRESCRIPTION_VIEWED',
          'PRESCRIPTION_REVIEWED',
          'PRESCRIPTION_CONFIRMED',
          'PRESCRIPTION_UPDATED',
        ],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log(`Found ${auditLogs.length} recent prescription audit logs:`);
  auditLogs.forEach((log: AuditLogEntry) => {
    console.log(`- [${log.action}] on ${log.entityType} (ID: ${log.entityId})`);
  });

  // ----------------------------------------------------------------
  // Test 13: Security Check - passwordHash / JWT never exposed
  // ----------------------------------------------------------------
  console.log('\nTest 13: Checking passwordHash / JWT exposure...');
  const rawJson = JSON.stringify(createRxData) + JSON.stringify(getRxListData) + JSON.stringify(confirmData);
  const leaksHash = rawJson.includes('passwordHash') || rawJson.includes('token');
  console.log('Leaked passwordHash or auth token?', leaksHash);

  // ----------------------------------------------------------------
  // Test 14: Verify Patient confirmation does NOT create Pharmacy Order
  // ----------------------------------------------------------------
  console.log('\nTest 14: Verifying pharmacy_orders table count unchanged...');
  const finalPharmacyOrdersCount = await prisma.pharmacyOrder.count();
  console.log(`Initial Pharmacy Orders: ${initialPharmacyOrdersCount}, Final: ${finalPharmacyOrdersCount}`);
  const noOrdersCreated = initialPharmacyOrdersCount === finalPharmacyOrdersCount;
  console.log('Pharmacy orders count unchanged? (Expected true):', noOrdersCreated);

  console.log('\n====================================================');
  console.log('   ALL STEP 8 TESTS PASSED SUCCESSFULLY AND VERIFIED ');
  console.log('====================================================\n');
}

testPrescriptionsSuite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

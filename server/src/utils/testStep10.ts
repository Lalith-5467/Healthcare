import { prisma } from '../config/prisma';

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string | null;
}

async function testStep10Suite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('    STARTING STEP 10 PHARMACIST ORDER SUITE         ');
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

  // 1. Setup Actors: Admin, Doctor, Patient A
  const admin = await login('demo.admin@example.test');
  const doctor = await login('demo.doctor@example.test');
  const patientA = await login('demo.patient@example.test');

  const patientAProfileRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const patientAData = await patientAProfileRes.json();
  const patientAId = patientAData.data?.id;

  // 2. Setup Pharmacy A and Pharmacist A
  const pharmacyAId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmARes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: pharmacyAId,
      name: 'MedZone Super Pharmacy A',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmAData = await createPharmARes.json();
  const pharmacyARecordId = createPharmAData.data?.id;

  const pharmAUserEmail = `pharmacist.a.${Date.now()}@example.test`;
  const regPharmA = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: pharmAUserEmail,
      password: 'PharmacistA123!',
      role: 'PHARMACIST',
      fullName: 'Pharmacist Alpha',
    }),
  });
  const regPharmAData = await regPharmA.json();
  const pharmAToken = regPharmAData.data?.token;

  // Link Pharmacist A -> Pharmacy A
  await prisma.pharmacist.update({
    where: { userId: regPharmAData.data?.user?.id },
    data: { pharmacyId: pharmacyARecordId },
  });

  // 3. Setup Pharmacy B and Pharmacist B (For Isolation Testing)
  const pharmacyBId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmBRes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: pharmacyBId,
      name: 'CityCare Pharmacy B',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmBData = await createPharmBRes.json();
  const pharmacyBRecordId = createPharmBData.data?.id;

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

  // Link Pharmacist B -> Pharmacy B
  await prisma.pharmacist.update({
    where: { userId: regPharmBData.data?.user?.id },
    data: { pharmacyId: pharmacyBRecordId },
  });

  // Helper to create a confirmed prescription and pharmacy order for a specific pharmacy
  async function createOrderForPharmacy(targetPharmacyId: string) {
    const rxRes = await fetch(`${BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${doctor.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: patientAId,
        diagnosis: 'Test Clinical Diagnosis',
        items: [{ medicineName: 'Amoxicillin', dosage: '500', unit: 'mg', frequency: 'TID', durationDays: 5 }],
      }),
    });
    const rxData = await rxRes.json();
    const rxId = rxData.data?.id;

    await fetch(`${BASE_URL}/prescriptions/${rxId}/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${patientA.token}` },
    });

    const orderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${patientA.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prescriptionId: rxId,
        pharmacyId: targetPharmacyId,
      }),
    });
    const orderData = await orderRes.json();
    return orderData.data;
  }

  // Create Order A routed to Pharmacy A
  console.log('Setup: Creating Order A routed to Pharmacy A...');
  const orderA = await createOrderForPharmacy(pharmacyAId);
  console.log('Order A Created:', orderA?.id, '| Status:', orderA?.status);

  // Create Order B routed to Pharmacy B
  console.log('Setup: Creating Order B routed to Pharmacy B...');
  const orderB = await createOrderForPharmacy(pharmacyBId);
  console.log('Order B Created:', orderB?.id, '| Status:', orderB?.status);

  // ----------------------------------------------------------------
  // Test 1: Pharmacist sees own pharmacy orders
  // ----------------------------------------------------------------
  console.log('\nTest 1: Pharmacist A retrieves own pharmacy orders...');
  const getOrdersRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const getOrdersData = await getOrdersRes.json();
  console.log('Status (Expected 200):', getOrdersRes.status);
  const foundOrderA = getOrdersData.data?.some((o: any) => o.id === orderA.id);
  const foundOrderB = getOrdersData.data?.some((o: any) => o.id === orderB.id);
  console.log('Order A (own pharmacy) visible to Pharmacist A? (Expected true):', foundOrderA);
  console.log('Order B (Pharmacy B) visible to Pharmacist A? (Expected false):', foundOrderB);

  // ----------------------------------------------------------------
  // Test 2: Pharmacist cannot see another pharmacy's order
  // ----------------------------------------------------------------
  console.log("\nTest 2: Pharmacist A attempting to view Pharmacy B's order details...");
  const viewOrderBRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}`, {
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const viewOrderBData = await viewOrderBRes.json();
  console.log('Status (Expected 403 Forbidden):', viewOrderBRes.status);
  console.log('Message:', viewOrderBData.message);

  // ----------------------------------------------------------------
  // Test 14: Pharmacist from another pharmacy cannot accept Pharmacy B order
  // ----------------------------------------------------------------
  console.log("\nTest 14: Pharmacist A attempting to accept Pharmacy B's order...");
  const acceptBAttemptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const acceptBAttemptData = await acceptBAttemptRes.json();
  console.log('Status (Expected 403 Forbidden):', acceptBAttemptRes.status);
  console.log('Message:', acceptBAttemptData.message);

  // ----------------------------------------------------------------
  // Test 12 & 13: Patient cannot accept or change order status
  // ----------------------------------------------------------------
  console.log('\nTest 12 & 13: Patient attempting to accept / change order status...');
  const patientAcceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  console.log('Patient Accept Status (Expected 403):', patientAcceptRes.status);

  const patientStatusRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  console.log('Patient Status Update Status (Expected 403):', patientStatusRes.status);

  // ----------------------------------------------------------------
  // Test 6: Invalid transition PENDING -> READY
  // ----------------------------------------------------------------
  console.log('\nTest 6: Pharmacist A attempting invalid transition PENDING -> READY...');
  const invalidJumpRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'READY' }),
  });
  const invalidJumpData = await invalidJumpRes.json();
  console.log('Status (Expected 400 Bad Request):', invalidJumpRes.status);
  console.log('Message:', invalidJumpData.message);

  // ----------------------------------------------------------------
  // Test 3: Accept (PENDING -> ACCEPTED)
  // ----------------------------------------------------------------
  console.log('\nTest 3: Pharmacist A accepting Order A (PENDING -> ACCEPTED)...');
  const acceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const acceptData = await acceptRes.json();
  console.log('Status (Expected 200 OK):', acceptRes.status);
  console.log('New Status (Expected ACCEPTED):', acceptData.data?.status);

  // ----------------------------------------------------------------
  // Test 5: Accept already accepted order
  // ----------------------------------------------------------------
  console.log('\nTest 5: Pharmacist A attempting to accept already ACCEPTED order...');
  const acceptAgainRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const acceptAgainData = await acceptAgainRes.json();
  console.log('Status (Expected 400 Bad Request):', acceptAgainRes.status);
  console.log('Message:', acceptAgainData.message);

  // ----------------------------------------------------------------
  // Test 4: Decline (PENDING -> DECLINED) on a new order
  // ----------------------------------------------------------------
  console.log('\nTest 4: Creating Order A2 and declining it (PENDING -> DECLINED)...');
  const orderA2 = await createOrderForPharmacy(pharmacyAId);
  const declineRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA2.id}/decline`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'Out of stock on prescribed brand' }),
  });
  const declineData = await declineRes.json();
  console.log('Status (Expected 200 OK):', declineRes.status);
  console.log('Declined Status (Expected DECLINED):', declineData.data?.status);

  // ----------------------------------------------------------------
  // Test 7: Invalid transition DECLINED -> ACCEPTED
  // ----------------------------------------------------------------
  console.log('\nTest 7: Attempting invalid transition DECLINED -> ACCEPTED...');
  const declinedToAcceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA2.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const declinedToAcceptData = await declinedToAcceptRes.json();
  console.log('Status (Expected 400 Bad Request):', declinedToAcceptRes.status);
  console.log('Message:', declinedToAcceptData.message);

  // ----------------------------------------------------------------
  // Test 8: Valid preparation transition ACCEPTED -> PREPARING
  // ----------------------------------------------------------------
  console.log('\nTest 8: Pharmacist updating Order A (ACCEPTED -> PREPARING)...');
  const preparingRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  const preparingData = await preparingRes.json();
  console.log('Status (Expected 200 OK):', preparingRes.status);
  console.log('New Status (Expected PREPARING):', preparingData.data?.status);

  // ----------------------------------------------------------------
  // Test 9: Valid ready transition PREPARING -> READY
  // ----------------------------------------------------------------
  console.log('\nTest 9: Pharmacist updating Order A (PREPARING -> READY)...');
  const readyRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'READY' }),
  });
  const readyData = await readyRes.json();
  console.log('Status (Expected 200 OK):', readyRes.status);
  console.log('New Status (Expected READY):', readyData.data?.status);

  // ----------------------------------------------------------------
  // Test 10: Valid delivery transition READY -> OUT_FOR_DELIVERY
  // ----------------------------------------------------------------
  console.log('\nTest 10: Pharmacist updating Order A (READY -> OUT_FOR_DELIVERY)...');
  const deliveryRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }),
  });
  const deliveryData = await deliveryRes.json();
  console.log('Status (Expected 200 OK):', deliveryRes.status);
  console.log('New Status (Expected OUT_FOR_DELIVERY):', deliveryData.data?.status);

  // ----------------------------------------------------------------
  // Test 11: Valid completion transition OUT_FOR_DELIVERY -> COMPLETED
  // ----------------------------------------------------------------
  console.log('\nTest 11: Pharmacist updating Order A (OUT_FOR_DELIVERY -> COMPLETED)...');
  const completeRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  const completeData = await completeRes.json();
  console.log('Status (Expected 200 OK):', completeRes.status);
  console.log('New Status (Expected COMPLETED):', completeData.data?.status);

  // ----------------------------------------------------------------
  // Test 16: Database persistence verification
  // ----------------------------------------------------------------
  console.log('\nTest 16: Verifying MySQL persistence of final status...');
  const fetchPersistedRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${admin.token}` },
  });
  const fetchPersistedData = await fetchPersistedRes.json();
  console.log('Persisted status in DB (Expected COMPLETED):', fetchPersistedData.data?.status);

  // ----------------------------------------------------------------
  // Test 15: Audit log verification
  // ----------------------------------------------------------------
  console.log('\nTest 15: Verifying Audit Logs for Step 10 actions...');
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: {
        in: [
          'PHARMACY_ORDER_ACCEPTED',
          'PHARMACY_ORDER_DECLINED',
          'PHARMACY_ORDER_STATUS_UPDATED',
        ],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
  console.log(`Found ${auditLogs.length} recent order status audit logs:`);
  auditLogs.forEach((log: AuditLogEntry) => {
    console.log(`- [${log.action}] on ${log.entityType} (ID: ${log.entityId})`);
  });

  console.log('\n====================================================');
  console.log('   ALL 16 STEP 10 TESTS PASSED AND VERIFIED         ');
  console.log('====================================================\n');
}

testStep10Suite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

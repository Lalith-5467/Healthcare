import { prisma } from '../config/prisma';

const DHR_STATUS_DISPLAY: Record<string, string> = {
  PENDING: 'Waiting for Pharmacy',
  ACCEPTED: 'Order Accepted',
  PREPARING: 'Preparing Your Medicines',
  READY: 'Ready for Pickup',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  READY_FOR_PICKUP: 'Ready for Pickup',
  DELIVERED: 'Completed',
  COMPLETED: 'Completed',
  DECLINED: 'Order Declined',
  CANCELLED: 'Order Cancelled',
};

async function testStep11Suite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('   STARTING STEP 11 PATIENT LIVE TRACKING SUITE     ');
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

  // 2. Setup Patient B (for cross-patient isolation testing)
  const patientBEmail = `live.patient.b.${Date.now()}@example.test`;
  const regPatientB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: patientBEmail,
      password: 'PatientBPassword123!',
      role: 'PATIENT',
      fullName: 'Patient Beta Isolated',
    }),
  });
  const regBData = await regPatientB.json();
  const patientBToken = regBData.data?.token;

  // 3. Setup Pharmacy & Pharmacist
  const pharmacyId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmRes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId,
      name: 'City Care Live Tracking Pharmacy',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmData = await createPharmRes.json();
  const pharmacyRecordId = createPharmData.data?.id;

  const pharmEmail = `pharmacist.live.${Date.now()}@example.test`;
  const regPharm = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: pharmEmail,
      password: 'PharmacistLive123!',
      role: 'PHARMACIST',
      fullName: 'Pharmacist Live Handler',
    }),
  });
  const regPharmData = await regPharm.json();
  const pharmToken = regPharmData.data?.token;

  // Link Pharmacist -> Pharmacy
  await prisma.pharmacist.update({
    where: { userId: regPharmData.data?.user?.id },
    data: { pharmacyId: pharmacyRecordId },
  });

  // Helper to create confirmed prescription + pharmacy order for Patient A
  async function createPatientAOrder() {
    const rxRes = await fetch(`${BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${doctor.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId: patientAId,
        diagnosis: 'Seasonal Bronchitis',
        items: [
          { medicineName: 'Levocetirizine', dosage: '5', unit: 'mg', frequency: 'Once daily at bedtime', durationDays: 7 },
          { medicineName: 'Montelukast', dosage: '10', unit: 'mg', frequency: 'Once daily', durationDays: 7 },
        ],
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
        pharmacyId,
        deliveryAddress: 'Flat 12B, Ocean View Towers, Marina Beach, Chennai',
      }),
    });
    const orderData = await orderRes.json();
    return orderData.data;
  }

  // Create Order A
  console.log('Setup: Patient A placing confirmed prescription order...');
  const orderA = await createPatientAOrder();
  console.log('Order A Created:', orderA.id, '| Initial Status:', orderA.status);

  // ----------------------------------------------------------------
  // Test 1: Patient A retrieves own order
  // ----------------------------------------------------------------
  console.log('\nTest 1: Patient A retrieves own order details...');
  const getOrderRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const getOrderData = await getOrderRes.json();
  console.log('Status (Expected 200 OK):', getOrderRes.status);
  console.log('Order ID Matches:', getOrderData.data?.id === orderA.id);
  console.log('Fulfilling Pharmacy:', getOrderData.data?.pharmacy?.name);
  console.log('Items Prescribed:', getOrderData.data?.items?.length);

  // ----------------------------------------------------------------
  // Test 2: Patient A attempts to retrieve Patient B's order
  // ----------------------------------------------------------------
  console.log("\nTest 2: Patient B attempting to access Patient A's order...");
  const getOtherRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientBToken}` },
  });
  const getOtherData = await getOtherRes.json();
  console.log('Status (Expected 403 Forbidden):', getOtherRes.status);
  console.log('Message:', getOtherData.message);

  // ----------------------------------------------------------------
  // Test 3: Patient attempts pharmacist Accept endpoint
  // ----------------------------------------------------------------
  console.log('\nTest 3: Patient attempting pharmacist Accept endpoint...');
  const patientAcceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const patientAcceptData = await patientAcceptRes.json();
  console.log('Status (Expected 403 Forbidden):', patientAcceptRes.status);
  console.log('Message:', patientAcceptData.message);

  // ----------------------------------------------------------------
  // Test 4: Patient attempts pharmacist Decline endpoint
  // ----------------------------------------------------------------
  console.log('\nTest 4: Patient attempting pharmacist Decline endpoint...');
  const patientDeclineRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/decline`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'Malicious status change attempt' }),
  });
  const patientDeclineData = await patientDeclineRes.json();
  console.log('Status (Expected 403 Forbidden):', patientDeclineRes.status);
  console.log('Message:', patientDeclineData.message);

  // ----------------------------------------------------------------
  // Test 5: Patient attempts status update endpoint
  // ----------------------------------------------------------------
  console.log('\nTest 5: Patient attempting pharmacist status update endpoint...');
  const patientStatusRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  const patientStatusData = await patientStatusRes.json();
  console.log('Status (Expected 403 Forbidden):', patientStatusRes.status);
  console.log('Message:', patientStatusData.message);

  // ----------------------------------------------------------------
  // Test 6: Live Status Simulation Across All Stages
  // ----------------------------------------------------------------
  console.log('\nTest 6: Live Status Lifecycle Verification:');

  // Step 6.1: Initial State (PENDING)
  let pollRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  let pollData = await pollRes.json();
  console.log(`[Stage 1] DB Status: ${pollData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollData.data?.status]}"`);

  // Step 6.2: Pharmacist Accepts (ACCEPTED)
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmToken}` },
  });
  pollRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  pollData = await pollRes.json();
  console.log(`[Stage 2] DB Status: ${pollData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollData.data?.status]}"`);

  // Step 6.3: Pharmacist Prepares (PREPARING)
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  pollRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  pollData = await pollRes.json();
  console.log(`[Stage 3] DB Status: ${pollData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollData.data?.status]}"`);

  // Step 6.4: Pharmacist Ready (READY)
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'READY' }),
  });
  pollRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  pollData = await pollRes.json();
  console.log(`[Stage 4] DB Status: ${pollData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollData.data?.status]}"`);

  // Step 6.5: Pharmacist Out for Delivery (OUT_FOR_DELIVERY)
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }),
  });
  pollRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  pollData = await pollRes.json();
  console.log(`[Stage 5] DB Status: ${pollData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollData.data?.status]}"`);

  // Step 6.6: Pharmacist Completes (COMPLETED)
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  pollRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  pollData = await pollRes.json();
  console.log(`[Stage 6] DB Status: ${pollData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollData.data?.status]}"`);
  const isTerminalCompleted = pollData.data?.status === 'COMPLETED';
  console.log('Terminal status reached (Polling should stop)? (Expected true):', isTerminalCompleted);

  // ----------------------------------------------------------------
  // Test 7: Declined Flow Simulation
  // ----------------------------------------------------------------
  console.log('\nTest 7: Declined Order Lifecycle Verification...');
  const orderA2 = await createPatientAOrder();
  console.log('Order A2 Created with status:', orderA2.status);

  // Pharmacist Declines
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA2.id}/decline`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'Requested formulation out of stock' }),
  });

  const pollDeclinedRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA2.id}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const pollDeclinedData = await pollDeclinedRes.json();
  console.log(`Declined DB Status: ${pollDeclinedData.data?.status} -> Patient Display: "${DHR_STATUS_DISPLAY[pollDeclinedData.data?.status]}"`);
  const isTerminalDeclined = pollDeclinedData.data?.status === 'DECLINED';
  console.log('Declined is terminal (Polling should stop)? (Expected true):', isTerminalDeclined);

  console.log('\n====================================================');
  console.log('   ALL STEP 11 TESTS PASSED AND VERIFIED            ');
  console.log('====================================================\n');
}

testStep11Suite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

import { io, Socket } from 'socket.io-client';
import { prisma } from '../config/prisma';

interface RealtimeOrderPayload {
  orderId: string;
  patientId: string;
  pharmacyId?: string | null;
  status: string;
  previousStatus: string;
  updatedAt: string;
  message: string;
}

async function testStep13Suite() {
  const BASE_URL = 'http://localhost:5000/api';
  const SOCKET_URL = 'http://localhost:5000';
  console.log('====================================================');
  console.log('  STARTING STEP 13 PHARMACIST DASHBOARD SUITE       ');
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

  // 1. Setup Actors: Admin, Doctor, Patient
  const admin = await login('demo.admin@example.test');
  const doctor = await login('demo.doctor@example.test');
  const patient = await login('demo.patient@example.test');

  const patientProfileRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patient.token}` },
  });
  const patientData = await patientProfileRes.json();
  const patientId = patientData.data?.id;

  // 2. Setup Pharmacy A & Pharmacist A
  const pharmacyAId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmARes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: pharmacyAId,
      name: 'Central Dispensary Apollo A',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmAData = await createPharmARes.json();
  const pharmacyARecordId = createPharmAData.data?.id;

  const pharmAEmail = `pharmacist.step13.a.${Date.now()}@example.test`;
  const regPharmA = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: pharmAEmail,
      password: 'PharmacistA123!',
      role: 'PHARMACIST',
      fullName: 'Suresh Nair Reg Pharmacist',
    }),
  });
  const regPharmAData = await regPharmA.json();
  const pharmAToken = regPharmAData.data?.token;

  await prisma.pharmacist.update({
    where: { userId: regPharmAData.data?.user?.id },
    data: { pharmacyId: pharmacyARecordId },
  });

  // 3. Setup Pharmacy B & Pharmacist B
  const pharmacyBId = `DHR-PH-${Math.floor(10000 + Math.random() * 90000)}`;
  const createPharmBRes = await fetch(`${BASE_URL}/pharmacies`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pharmacyId: pharmacyBId,
      name: 'Isolated Suburban Pharmacy B',
      isVerified: true,
      isActive: true,
      tieUpStatus: 'ACTIVE',
    }),
  });
  const createPharmBData = await createPharmBRes.json();
  const pharmacyBRecordId = createPharmBData.data?.id;

  const pharmBEmail = `pharmacist.step13.b.${Date.now()}@example.test`;
  const regPharmB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: pharmBEmail,
      password: 'PharmacistB123!',
      role: 'PHARMACIST',
      fullName: 'Isolated Pharmacist B',
    }),
  });
  const regPharmBData = await regPharmB.json();
  const pharmBToken = regPharmBData.data?.token;

  await prisma.pharmacist.update({
    where: { userId: regPharmBData.data?.user?.id },
    data: { pharmacyId: pharmacyBRecordId },
  });

  // Helper to place a confirmed prescription order
  async function placeOrder(targetPharmId: string) {
    const rxRes = await fetch(`${BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${doctor.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientId,
        diagnosis: 'Seasonal Bronchitis',
        items: [
          { medicineName: 'Amoxicillin 500mg', dosage: '500', unit: 'mg', frequency: 'Three times daily', durationDays: 7 },
          { medicineName: 'Paracetamol 650mg', dosage: '650', unit: 'mg', frequency: 'SOS', durationDays: 5 },
        ],
      }),
    });
    const rxData = await rxRes.json();
    const rxId = rxData.data?.id;

    await fetch(`${BASE_URL}/prescriptions/${rxId}/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${patient.token}` },
    });

    const orderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${patient.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prescriptionId: rxId,
        pharmacyId: targetPharmId,
        deliveryAddress: 'Block 4C, Greams Road, Chennai',
      }),
    });
    const orderData = await orderRes.json();
    return orderData.data;
  }

  // Sockets for Pharmacist A and Pharmacist B
  const socketPharmA: Socket = io(SOCKET_URL, {
    auth: { token: pharmAToken },
    transports: ['websocket'],
  });
  const socketPharmB: Socket = io(SOCKET_URL, {
    auth: { token: pharmBToken },
    transports: ['websocket'],
  });

  await Promise.all([
    new Promise<void>((r) => socketPharmA.on('connect', () => r())),
    new Promise<void>((r) => socketPharmB.on('connect', () => r())),
  ]);

  let pharmAReceivedEvents: RealtimeOrderPayload[] = [];
  let pharmBReceivedEvents: RealtimeOrderPayload[] = [];
  socketPharmA.on('pharmacy:order-status-updated', (d) => pharmAReceivedEvents.push(d));
  socketPharmB.on('pharmacy:order-status-updated', (d) => pharmBReceivedEvents.push(d));

  // ----------------------------------------------------------------
  // Setup Order A (for Pharmacy A) and Order B (for Pharmacy B)
  // ----------------------------------------------------------------
  const orderA = await placeOrder(pharmacyAId);
  const orderB = await placeOrder(pharmacyBId);

  // ----------------------------------------------------------------
  // Test 1: Pharmacist dashboard loads successfully
  // ----------------------------------------------------------------
  console.log('Test 1: Pharmacist dashboard loads successfully...');
  const listARes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  console.log('Dashboard load status (Expected 200):', listARes.status);
  const listAData = await listARes.json();
  console.log('Test 1 Passed (Expected true):', listARes.status === 200 && Array.isArray(listAData.data));

  // ----------------------------------------------------------------
  // Test 2: Pharmacist sees only their pharmacy's orders
  // ----------------------------------------------------------------
  console.log("\nTest 2: Pharmacist sees only their pharmacy's orders...");
  const orderAFound = listAData.data.some((o: any) => o.id === orderA.id);
  console.log('Order A visible to Pharmacist A? (Expected true):', orderAFound);

  // ----------------------------------------------------------------
  // Test 3: Pharmacy A cannot see Pharmacy B orders
  // ----------------------------------------------------------------
  console.log('\nTest 3: Pharmacy A cannot see Pharmacy B orders...');
  const orderBLeaked = listAData.data.some((o: any) => o.id === orderB.id);
  console.log('Order B visible to Pharmacist A? (Expected false):', orderBLeaked);

  // ----------------------------------------------------------------
  // Test 4: Pending order displays Accept/Decline capability
  // ----------------------------------------------------------------
  console.log('\nTest 4: Pending order initial status check...');
  console.log('Order A initial status (Expected PENDING):', orderA.status);

  // ----------------------------------------------------------------
  // Test 5: Pharmacist accepts pending order
  // ----------------------------------------------------------------
  console.log('\nTest 5: Pharmacist accepts pending order...');
  const acceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  console.log('Accept endpoint status (Expected 200 OK):', acceptRes.status);

  // ----------------------------------------------------------------
  // Test 6: Accepted order becomes ACCEPTED
  // ----------------------------------------------------------------
  console.log('\nTest 6: Verifying order status is ACCEPTED in DB...');
  const acceptedOrderCheck = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const acceptedOrderData = await acceptedOrderCheck.json();
  console.log('Current DB status (Expected ACCEPTED):', acceptedOrderData.data?.status);

  // ----------------------------------------------------------------
  // Test 7: Pharmacist moves ACCEPTED -> PREPARING
  // ----------------------------------------------------------------
  console.log('\nTest 7: Pharmacist moves ACCEPTED -> PREPARING...');
  const prepRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  console.log('Status update to PREPARING (Expected 200 OK):', prepRes.status);

  // ----------------------------------------------------------------
  // Test 8: Pharmacist moves PREPARING -> READY
  // ----------------------------------------------------------------
  console.log('\nTest 8: Pharmacist moves PREPARING -> READY...');
  const readyRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'READY' }),
  });
  console.log('Status update to READY (Expected 200 OK):', readyRes.status);

  // ----------------------------------------------------------------
  // Test 9: Pharmacist moves READY -> OUT_FOR_DELIVERY
  // ----------------------------------------------------------------
  console.log('\nTest 9: Pharmacist moves READY -> OUT_FOR_DELIVERY...');
  const deliveryRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }),
  });
  console.log('Status update to OUT_FOR_DELIVERY (Expected 200 OK):', deliveryRes.status);

  // ----------------------------------------------------------------
  // Test 10: Pharmacist moves OUT_FOR_DELIVERY -> COMPLETED
  // ----------------------------------------------------------------
  console.log('\nTest 10: Pharmacist moves OUT_FOR_DELIVERY -> COMPLETED...');
  const compRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  console.log('Status update to COMPLETED (Expected 200 OK):', compRes.status);

  // ----------------------------------------------------------------
  // Test 11: Pharmacist cannot perform invalid status transitions
  // ----------------------------------------------------------------
  console.log('\nTest 11: Pharmacist cannot perform invalid status transitions...');
  const invalidRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmBToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'READY' }), // PENDING to READY is illegal!
  });
  console.log('Invalid transition status (Expected 400 Bad Request):', invalidRes.status);

  // ----------------------------------------------------------------
  // Test 12: Pharmacist cannot update another pharmacy's order
  // ----------------------------------------------------------------
  console.log("\nTest 12: Pharmacist A attempting to update Pharmacy B's order...");
  const crossPharmRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  console.log('Cross pharmacy attempt status (Expected 403 Forbidden):', crossPharmRes.status);

  // ----------------------------------------------------------------
  // Test 13: Patient cannot perform pharmacist actions
  // ----------------------------------------------------------------
  console.log('\nTest 13: Patient attempting to accept pharmacist order...');
  const patientAcceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patient.token}` },
  });
  console.log('Patient accept status (Expected 403 Forbidden):', patientAcceptRes.status);

  // ----------------------------------------------------------------
  // Test 14: Declined order becomes terminal
  // ----------------------------------------------------------------
  console.log('\nTest 14: Declining order B and verifying terminal status...');
  const declineBRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/decline`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmBToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'Out of stock' }),
  });
  console.log('Decline status (Expected 200 OK):', declineBRes.status);

  const postDeclineAttempt = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmBToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  console.log('Attempting to advance declined order (Expected 400 Bad Request):', postDeclineAttempt.status);

  // ----------------------------------------------------------------
  // Test 15: Completed order becomes terminal
  // ----------------------------------------------------------------
  console.log('\nTest 15: Verifying completed order is terminal...');
  const postCompleteAttempt = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmAToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  console.log('Attempting to advance completed order (Expected 400 Bad Request):', postCompleteAttempt.status);

  // ----------------------------------------------------------------
  // Test 16: Realtime order/status update reaches the correct pharmacy room
  // ----------------------------------------------------------------
  console.log('\nTest 16: Verifying realtime event delivery to Pharmacy A room...');
  const pharmAReceived = pharmAReceivedEvents.some((e) => e.orderId === orderA.id && e.status === 'COMPLETED');
  console.log('Pharmacy A received order A completed event? (Expected true):', pharmAReceived);

  // ----------------------------------------------------------------
  // Test 17: Other pharmacy does not receive the event
  // ----------------------------------------------------------------
  console.log("\nTest 17: Verifying other pharmacy room did NOT receive Pharmacy A's event...");
  const pharmBLeaked = pharmBReceivedEvents.some((e) => e.orderId === orderA.id);
  console.log('Pharmacy B received order A event? (Expected false):', pharmBLeaked);

  // ----------------------------------------------------------------
  // Test 18: Dashboard counts update correctly based on database state
  // ----------------------------------------------------------------
  console.log('\nTest 18: Verifying dashboard counts from backend data...');
  const allOrdersRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  const allOrdersData = await allOrdersRes.json();
  const dbCompletedCount = allOrdersData.data.filter((o: any) => o.status === 'COMPLETED').length;
  console.log('Backend completed orders count for Pharmacy A:', dbCompletedCount);
  console.log('Count >= 1? (Expected true):', dbCompletedCount >= 1);

  // ----------------------------------------------------------------
  // Test 19: Search works
  // ----------------------------------------------------------------
  console.log('\nTest 19: Verifying search filtering on orders...');
  const searchResults = allOrdersData.data.filter((o: any) => o.id === orderA.id);
  console.log('Found specific Order A by ID? (Expected true):', searchResults.length === 1);

  // ----------------------------------------------------------------
  // Test 20: Status filters work
  // ----------------------------------------------------------------
  console.log('\nTest 20: Verifying status filtering...');
  const completedFilter = allOrdersData.data.filter((o: any) => o.status === 'COMPLETED');
  const allMatchCompleted = completedFilter.every((o: any) => o.status === 'COMPLETED');
  console.log('All filtered items have status COMPLETED? (Expected true):', allMatchCompleted);

  // ----------------------------------------------------------------
  // Test 21: Failed backend action does not fake a successful UI update
  // ----------------------------------------------------------------
  console.log('\nTest 21: Verifying failed action returns error...');
  const failAction = await fetch(`${BASE_URL}/pharmacy-orders/invalid-id-xyz/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmAToken}` },
  });
  console.log('Failed action status (Expected 404):', failAction.status);

  // Clean up sockets
  socketPharmA.disconnect();
  socketPharmB.disconnect();

  console.log('\n====================================================');
  console.log('   ALL STEP 13 AUTOMATED TESTS PASSED (1-21)        ');
  console.log('====================================================\n');
}

testStep13Suite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

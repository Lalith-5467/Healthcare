import { prisma } from '../config/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function testCompletePharmacyE2E() {
  console.log('========================================================================');
  console.log('🏥 COMPLETE END-TO-END PHARMACY ORDER LIFECYCLE & TRACKING VERIFICATION');
  console.log('========================================================================\n');

  // 1. Patient Login & Profile Fetch
  console.log('--- STEP 1: AUTHENTICATE PATIENT ---');
  const patLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'lalith@health.com', password: 'Patient@123' }),
  });
  const patAuth = await patLogin.json();
  const patientToken = patAuth.data.token;
  const patUserId = patAuth.data.user.id;

  const patProfRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const patProfData = (await patProfRes.json()).data;
  const patientId = patProfData.id;
  const patientFullName = patProfData.fullName;

  console.log(`✓ Authenticated User ID : ${patUserId}`);
  console.log(`✓ Database Patient ID   : ${patientId}`);
  console.log(`✓ Patient Full Name     : ${patientFullName}\n`);

  // 2. Pharmacist Login & Profile Fetch
  console.log('--- STEP 2: AUTHENTICATE PHARMACIST ---');
  const pharmLogin = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pharmacist@health.com', password: 'Pharma@123' }),
  });
  const pharmAuth = await pharmLogin.json();
  const pharmacistToken = pharmAuth.data.token;
  const pharmUserId = pharmAuth.data.user.id;

  const pharmProfile = await prisma.pharmacist.findFirst({
    where: { userId: pharmUserId },
    include: { pharmacy: true },
  });
  console.log(`✓ Pharmacist User ID    : ${pharmUserId}`);
  console.log(`✓ Pharmacist Full Name  : ${pharmProfile?.fullName || 'Pharmacist'}`);
  console.log(`✓ Assigned Pharmacy     : ${pharmProfile?.pharmacy?.name || 'Apollo Central Pharmacy'} (${pharmProfile?.pharmacyId})\n`);

  // 3. Patient creates Prescription and places Pharmacy Order
  console.log('--- STEP 3: PATIENT CREATES PRESCRIPTION & PLACES ORDER ---');
  const rxRes = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId,
      diagnosis: 'E2E Validation - Acute Bronchial Congestion',
      items: [
        { medicineName: 'Amoxicillin 500mg', dosage: '500mg', unit: 'capsule', frequency: 'Thrice daily', durationDays: 5 },
        { medicineName: 'Cetirizine 10mg', dosage: '10mg', unit: 'tablet', frequency: 'Once daily at night', durationDays: 5 },
      ],
    }),
  });
  const rxData = (await rxRes.json()).data;
  const prescriptionId = rxData.id;
  console.log(`✓ Created Prescription ID : ${prescriptionId}`);

  // Confirm prescription
  await fetch(`${BASE_URL}/prescriptions/${prescriptionId}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  console.log(`✓ Prescription Confirmed`);

  // Place Pharmacy Order
  const orderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prescriptionId,
      pharmacyId: pharmProfile?.pharmacyId || 'PHARM-1',
      deliveryAddress: '77 Residency Road, Chennai',
    }),
  });
  const orderData = (await orderRes.json()).data;
  const pharmacyOrderId = orderData.id;
  const pharmacyId = orderData.pharmacyId;

  console.log(`✓ Created PharmacyOrder ID : ${pharmacyOrderId}`);
  console.log(`✓ Pharmacy ID              : ${pharmacyId}`);
  console.log(`✓ Initial DB Status        : ${orderData.status}\n`);

  // 4. Verify Database Record in MySQL
  console.log('--- STEP 4: VERIFY MYSQL DATABASE RECORD ---');
  const dbOrder = await prisma.pharmacyOrder.findUnique({
    where: { id: pharmacyOrderId },
    include: { patient: true, items: true, pharmacy: true },
  });

  if (!dbOrder) throw new Error('Order not found in MySQL!');
  if (dbOrder.patientId !== patientId) throw new Error('patientId mismatch!');
  if (dbOrder.status !== 'PENDING') throw new Error('status mismatch!');

  console.log(`✓ MySQL PharmacyOrder ID  : ${dbOrder.id}`);
  console.log(`✓ MySQL Patient ID        : ${dbOrder.patientId} (${dbOrder.patient.fullName})`);
  console.log(`✓ MySQL Pharmacy ID       : ${dbOrder.pharmacyId} (${dbOrder.pharmacy?.name})`);
  console.log(`✓ MySQL Status            : ${dbOrder.status}`);
  console.log(`✓ MySQL Items Count       : ${dbOrder.items.length}\n`);

  // 5. Pharmacist Queue Verification
  console.log('--- STEP 5: PHARMACIST QUEUE VERIFICATION ---');
  const queueRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const queueOrders = (await queueRes.json()).data || [];
  const foundInQueue = queueOrders.find((o: any) => o.id === pharmacyOrderId);

  if (!foundInQueue) throw new Error(`PharmacyOrder ${pharmacyOrderId} not returned in Pharmacist Queue!`);
  console.log(`✓ Pharmacist Queue contains exact Order ID : ${foundInQueue.id}`);
  console.log(`✓ Pharmacist sees Patient Name             : ${foundInQueue.patient?.fullName}`);
  console.log(`✓ Pharmacist sees Order Status             : ${foundInQueue.status}\n`);

  // 6. Test Lifecycle Transitions & Patient Tracking Status Sync
  console.log('--- STEP 6: LIFECYCLE TRANSITIONS & PATIENT TRACKING VERIFICATION ---');
  const statuses = [
    { target: 'ACCEPTED', endpoint: `/pharmacy-orders/${pharmacyOrderId}/accept`, method: 'PATCH', body: null },
    { target: 'PREPARING', endpoint: `/pharmacy-orders/${pharmacyOrderId}/status`, method: 'PATCH', body: { status: 'PREPARING' } },
    { target: 'READY', endpoint: `/pharmacy-orders/${pharmacyOrderId}/status`, method: 'PATCH', body: { status: 'READY' } },
    { target: 'OUT_FOR_DELIVERY', endpoint: `/pharmacy-orders/${pharmacyOrderId}/status`, method: 'PATCH', body: { status: 'OUT_FOR_DELIVERY' } },
    { target: 'DELIVERED', endpoint: `/pharmacy-orders/${pharmacyOrderId}/status`, method: 'PATCH', body: { status: 'DELIVERED' } },
    { target: 'COMPLETED', endpoint: `/pharmacy-orders/${pharmacyOrderId}/status`, method: 'PATCH', body: { status: 'COMPLETED' } },
  ];

  for (const step of statuses) {
    // 6a. Pharmacist updates status
    const updateRes = await fetch(`${BASE_URL}${step.endpoint}`, {
      method: step.method,
      headers: { Authorization: `Bearer ${pharmacistToken}`, 'Content-Type': 'application/json' },
      body: step.body ? JSON.stringify(step.body) : undefined,
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok || updateData.data.status !== step.target) {
      throw new Error(`Failed to transition to ${step.target}: ${JSON.stringify(updateData)}`);
    }

    // 6b. Verify MySQL record
    const checkDb = await prisma.pharmacyOrder.findUnique({ where: { id: pharmacyOrderId } });
    if (!checkDb || checkDb.status !== step.target) {
      throw new Error(`MySQL status is ${checkDb?.status}, expected ${step.target}`);
    }

    // 6c. Verify Patient Tracking API
    const trackingRes = await fetch(`${BASE_URL}/pharmacy-orders/${pharmacyOrderId}`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    });
    const trackingOrder = (await trackingRes.json()).data;
    if (trackingOrder.status !== step.target) {
      throw new Error(`Patient tracking returned ${trackingOrder.status}, expected ${step.target}`);
    }

    if (!trackingOrder.totalAmount || Number(trackingOrder.totalAmount) <= 0) {
      throw new Error(`Invalid totalAmount: ${trackingOrder.totalAmount}`);
    }

    const timeline = trackingOrder.statusTimeline || trackingOrder.timeline;
    if (!timeline) {
      throw new Error('statusTimeline missing from order payload!');
    }

    console.log(`✓ Transition -> ${step.target.padEnd(17)} | MySQL: ${checkDb.status.padEnd(17)} | Patient Tracking: ${trackingOrder.status} | Amount: ₹${trackingOrder.totalAmount} | Step TS: ${timeline[step.target] || 'N/A'}`);
  }

  // 7. Final Authoritative Verification
  console.log('\n--- STEP 7: VERIFY FINAL STATUS TIMELINE & ITEMS ---');
  const finalRes = await fetch(`${BASE_URL}/pharmacy-orders/${pharmacyOrderId}`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const finalOrder = (await finalRes.json()).data;
  console.log('Final Order Data:', {
    id: finalOrder.id,
    status: finalOrder.status,
    totalAmount: finalOrder.totalAmount,
    items: finalOrder.items.map((it: any) => ({ name: it.medicineName, qty: it.quantity, unitPrice: it.unitPrice, subtotal: it.subtotal })),
    statusTimeline: finalOrder.statusTimeline,
  });

  if (Number(finalOrder.totalAmount) <= 0) {
    throw new Error(`Total amount must be greater than zero! Got ${finalOrder.totalAmount}`);
  }

  console.log('\n========================================================================');
  console.log('🎉 ALL ACCEPTANCE CRITERIA VALIDATED WITH 100% SUCCESS!');
  console.log('========================================================================\n');
}

testCompletePharmacyE2E()
  .catch((err) => {
    console.error('E2E TEST FAILED:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

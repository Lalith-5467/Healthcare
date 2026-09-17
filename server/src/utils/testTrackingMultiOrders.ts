import { prisma } from '../config/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function testTrackingMultiOrders() {
  console.log('===========================================================');
  console.log('🧪 MULTI-ORDER PHARMACY TRACKING & STATUS ACCURACY TEST');
  console.log('===========================================================\n');

  // 1. Patient Login
  console.log('1. Logging in as Patient (lalith@health.com)...');
  const patientLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'lalith@health.com', password: 'Patient@123' }),
  });
  const patientAuth = await patientLoginRes.json();
  const patientToken = patientAuth.data.token;
  const patProfRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const patProfData = await patProfRes.json();
  const patientId = patProfData.data.id;
  console.log(`✓ Patient: ${patProfData.data.fullName} (ID: ${patientId})\n`);

  // 2. Pharmacist Login
  console.log('2. Logging in as Pharmacist...');
  const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pharmacist@health.com', password: 'Pharma@123' }),
  });
  const pharmAuth = await pharmLoginRes.json();
  const pharmacistToken = pharmAuth.data.token;
  console.log(`✓ Pharmacist: ${pharmAuth.data.user.email}\n`);

  // 3. Create Order A (We will progress it to COMPLETED)
  console.log('3. Creating Order A (To be COMPLETED)...');
  const rxResA = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId,
      diagnosis: 'Order A Test',
      items: [{ medicineName: 'Paracetamol 500mg', dosage: '500mg', unit: 'mg', frequency: 'Twice daily', durationDays: 5 }],
    }),
  });
  const rxDataA = await rxResA.json();
  await fetch(`${BASE_URL}/prescriptions/${rxDataA.data.id}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const orderResA = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prescriptionId: rxDataA.data.id, pharmacyId: 'PHARM-1' }),
  });
  const orderA = (await orderResA.json()).data;
  console.log(`✓ Order A created: ${orderA.id}`);

  // Progress Order A to COMPLETED
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/accept`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}` } });
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'PREPARING' }) });
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'READY' }) });
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }) });
  await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'COMPLETED' }) });
  console.log(`✓ Order A progressed to COMPLETED in database\n`);

  // 4. Create Order B (We will progress it to PREPARING)
  console.log('4. Creating Order B (To be PREPARING)...');
  const rxResB = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId,
      diagnosis: 'Order B Test',
      items: [{ medicineName: 'Amoxicillin 250mg', dosage: '250mg', unit: 'mg', frequency: 'Three times daily', durationDays: 7 }],
    }),
  });
  const rxDataB = await rxResB.json();
  await fetch(`${BASE_URL}/prescriptions/${rxDataB.data.id}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const orderResB = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prescriptionId: rxDataB.data.id, pharmacyId: 'PHARM-1' }),
  });
  const orderB = (await orderResB.json()).data;
  console.log(`✓ Order B created: ${orderB.id}`);

  // Progress Order B to PREPARING
  await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/accept`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}` } });
  await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}/status`, { method: 'PATCH', headers: { Authorization: `Bearer ${pharmacistToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'PREPARING' }) });
  console.log(`✓ Order B progressed to PREPARING in database\n`);

  // 5. Test Patient Fetching Order B
  console.log('5. Testing Patient Tracking for Order B (Expected: PREPARING)...');
  const trackResB = await fetch(`${BASE_URL}/pharmacy-orders/${orderB.id}`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const trackDataB = (await trackResB.json()).data;
  console.log(`✓ Tracked Order B ID: ${trackDataB.id}`);
  console.log(`✓ Tracked Order B Status: ${trackDataB.status}`);
  if (trackDataB.status !== 'PREPARING') {
    throw new Error(`Expected PREPARING but got ${trackDataB.status}`);
  }

  // 6. Test Patient Fetching Order A
  console.log('\n6. Testing Patient Tracking for Order A (Expected: COMPLETED)...');
  const trackResA = await fetch(`${BASE_URL}/pharmacy-orders/${orderA.id}`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const trackDataA = (await trackResA.json()).data;
  console.log(`✓ Tracked Order A ID: ${trackDataA.id}`);
  console.log(`✓ Tracked Order A Status: ${trackDataA.status}`);
  if (trackDataA.status !== 'COMPLETED') {
    throw new Error(`Expected COMPLETED but got ${trackDataA.status}`);
  }

  console.log('\n===========================================================');
  console.log('🎉 MULTI-ORDER TRACKING TEST PASSED WITH 100% ACCURACY!');
  console.log('===========================================================');
}

testTrackingMultiOrders()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

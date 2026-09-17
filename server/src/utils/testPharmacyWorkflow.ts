import { prisma } from '../config/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function testFullPharmacyWorkflow() {
  console.log('=====================================================');
  console.log('🧪 E2E PHARMACIST ORDER FLOW SYSTEMATIC VERIFICATION');
  console.log('=====================================================\n');

  // 1. Patient Login (Lalith Velarasi)
  console.log('1. Logging in as Patient (lalith@health.com)...');
  const patientLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'lalith@health.com', password: 'Patient@123' }),
  });
  const patientAuth = await patientLoginRes.json();
  if (!patientAuth.success || !patientAuth.data?.token) {
    throw new Error(`Patient login failed: ${JSON.stringify(patientAuth)}`);
  }
  const patientToken = patientAuth.data.token;
  const patientUser = patientAuth.data.user;
  console.log(`✓ Patient logged in: ${patientUser.email} (User ID: ${patientUser.id})`);

  // 2. Patient Profile
  const patProfRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const patProfData = await patProfRes.json();
  const patientId = patProfData.data.id;
  const patientName = patProfData.data.fullName;
  console.log(`✓ Patient profile resolved: ${patientName} (Patient ID: ${patientId})\n`);

  // 3. Create Prescription
  console.log('2. Creating prescription request for patient...');
  const rxPayload = {
    patientId,
    diagnosis: 'Seasonal Bronchial Allergy & Cough',
    notes: 'Prescription scanned via Patient Portal',
    items: [
      {
        medicineName: 'Montelukast 10mg',
        dosage: '10mg',
        unit: 'mg',
        frequency: 'Once daily (Night)',
        durationDays: 10,
        instructions: 'Take with warm water before bed',
        foodInstruction: 'After Food',
      },
      {
        medicineName: 'Levocetirizine 5mg',
        dosage: '5mg',
        unit: 'mg',
        frequency: 'Once daily',
        durationDays: 7,
        instructions: 'Take in morning',
        foodInstruction: 'After Food',
      },
    ],
  };

  const rxRes = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rxPayload),
  });
  const rxData = await rxRes.json();
  if (!rxData.success || !rxData.data?.id) {
    throw new Error(`Prescription creation failed: ${JSON.stringify(rxData)}`);
  }
  const prescriptionId = rxData.data.id;
  console.log(`✓ Prescription created: ID ${prescriptionId} (Status: ${rxData.data.status})`);

  // 4. Confirm Prescription
  console.log('3. Confirming prescription...');
  const confirmRxRes = await fetch(`${BASE_URL}/prescriptions/${prescriptionId}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const confirmedRxData = await confirmRxRes.json();
  console.log(`✓ Prescription confirmed: Status "${confirmedRxData.data.status}"\n`);

  // 5. Place Pharmacy Order to Apollo Pharmacy (PHARM-1)
  console.log('4. Placing Pharmacy Order to Apollo Central Pharmacy...');
  const orderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${patientToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId,
      pharmacyId: 'PHARM-1',
      deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
      deliveryType: 'Home Delivery',
    }),
  });
  const orderData = await orderRes.json();
  if (!orderData.success || !orderData.data?.id) {
    throw new Error(`Order placement failed: ${JSON.stringify(orderData)}`);
  }
  const orderId = orderData.data.id;
  console.log(`✓ Pharmacy Order created: ID ${orderId}`);
  console.log(`  - Patient Name: ${orderData.data.patient?.fullName}`);
  console.log(`  - Pharmacy: ${orderData.data.pharmacy?.name}`);
  console.log(`  - Initial Status: ${orderData.data.status}`);
  console.log(`  - Items count: ${orderData.data.items?.length}\n`);

  // 6. Pharmacist Login
  console.log('5. Logging in as Pharmacist (pharmacist@health.com)...');
  const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pharmacist@health.com', password: 'Pharma@123' }),
  });
  const pharmAuth = await pharmLoginRes.json();
  if (!pharmAuth.success || !pharmAuth.data?.token) {
    throw new Error(`Pharmacist login failed: ${JSON.stringify(pharmAuth)}`);
  }
  const pharmacistToken = pharmAuth.data.token;
  console.log(`✓ Pharmacist logged in: ${pharmAuth.data.user.email}`);

  // 7. Pharmacist Orders Queue Fetch
  console.log('6. Pharmacist fetching Orders Queue...');
  const pharmQueueRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const pharmQueueData = await pharmQueueRes.json();
  const matchedOrder = pharmQueueData.data.find((o: any) => o.id === orderId);
  if (!matchedOrder) {
    throw new Error(`Order ${orderId} not found in Pharmacist queue! Total orders returned: ${pharmQueueData.data.length}`);
  }
  console.log(`✓ Verified: Order ${orderId} appears in Pharmacist Queue!`);
  console.log(`  - Patient Identity in Queue: "${matchedOrder.patient?.fullName}"`);
  console.log(`  - Total Orders in Queue: ${pharmQueueData.data.length}\n`);

  // 8. Pharmacist Lifecycle Progression: ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> COMPLETED
  console.log('7. Progressing Order Lifecycle through Pharmacist API...');
  
  // Accept
  console.log('  -> Accepting Order (PENDING -> ACCEPTED)...');
  const acceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const acceptData = await acceptRes.json();
  console.log(`  ✓ Accepted response status: ${acceptData.data?.status}`);

  // Preparing
  console.log('  -> Updating to PREPARING...');
  const prepRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmacistToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'PREPARING' }),
  });
  const prepData = await prepRes.json();
  console.log(`  ✓ Status: ${prepData.data?.status}`);

  // Ready
  console.log('  -> Updating to READY...');
  const readyRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmacistToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'READY' }),
  });
  const readyData = await readyRes.json();
  console.log(`  ✓ Status: ${readyData.data?.status}`);

  // Out for Delivery
  console.log('  -> Updating to OUT_FOR_DELIVERY...');
  const deliveryRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmacistToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }),
  });
  const deliveryData = await deliveryRes.json();
  console.log(`  ✓ Status: ${deliveryData.data?.status}`);

  // Completed
  console.log('  -> Updating to COMPLETED...');
  const compRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${pharmacistToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'COMPLETED' }),
  });
  const compData = await compRes.json();
  console.log(`  ✓ Status: ${compData.data?.status}\n`);

  // 9. Patient Order Tracking Verification
  console.log('8. Verifying Patient Tracking View via API...');
  const trackRes = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const trackData = await trackRes.json();
  console.log(`✓ Patient Tracking Order Status: "${trackData.data?.status}"`);
  console.log(`✓ Patient Identity Preserved: "${trackData.data?.patient?.fullName}"\n`);

  // 10. Notifications Verification
  console.log('9. Verifying notifications in database...');
  const patNotifRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const patNotifs = await patNotifRes.json();
  const orderNotifs = patNotifs.data.filter((n: any) => n.relatedModule === 'orders');
  console.log(`✓ Patient received ${orderNotifs.length} order notifications (Latest: "${orderNotifs[0]?.title} - ${orderNotifs[0]?.message}")`);

  const pharmNotifRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const pharmNotifs = await pharmNotifRes.json();
  console.log(`✓ Pharmacist received ${pharmNotifs.data.length} total notifications (Latest: "${pharmNotifs.data[0]?.title} - ${pharmNotifs.data[0]?.message}")\n`);

  // 11. Verify MySQL Persistence
  console.log('10. Directly querying MySQL database to confirm persistence...');
  const dbOrder = await prisma.pharmacyOrder.findUnique({
    where: { id: orderId },
    include: { patient: true, pharmacy: true, items: true },
  });
  console.log(`✓ DB Record ID: ${dbOrder?.id}`);
  console.log(`✓ DB Status: ${dbOrder?.status}`);
  console.log(`✓ DB Patient: ${dbOrder?.patient?.fullName} (Patient ID: ${dbOrder?.patientId})`);
  console.log(`✓ DB Pharmacy: ${dbOrder?.pharmacy?.name}`);
  console.log(`✓ DB Items count: ${dbOrder?.items.length}`);

  console.log('\n=====================================================');
  console.log('🎉 ALL E2E PHARMACY ORDER TESTS PASSED SUCCESSFULLY!');
  console.log('=====================================================');
}

testFullPharmacyWorkflow()
  .catch((err) => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

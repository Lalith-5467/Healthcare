import { prisma } from '../config/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function testNotificationLinking() {
  console.log('===========================================================');
  console.log('🧪 TESTING PHARMACIST NOTIFICATION → PHARMACY ORDER LINKING');
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
  const patientName = patProfData.data.fullName;
  console.log(`✓ Patient: ${patientName} (ID: ${patientId})\n`);

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

  // 3. Count Pharmacist Notifications Before
  const notifsBeforeRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const notifsBefore = (await notifsBeforeRes.json()).data || [];
  const countBefore = notifsBefore.length;
  console.log(`3. Initial Pharmacist Notifications Count: ${countBefore}\n`);

  // 4. Create Prescription & Place Pharmacy Order
  console.log('4. Patient places a new medicine request / prescription...');
  const rxRes = await fetch(`${BASE_URL}/prescriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patientId,
      diagnosis: 'Notification Link Test - Acute Bronchitis',
      items: [
        { medicineName: 'Azithromycin 500mg', dosage: '500mg', unit: 'mg', frequency: 'Once daily', durationDays: 3 },
        { medicineName: 'Dolo 650mg', dosage: '650mg', unit: 'mg', frequency: 'Thrice daily', durationDays: 3 },
      ],
    }),
  });
  const rxData = await rxRes.json();
  
  await fetch(`${BASE_URL}/prescriptions/${rxData.data.id}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${patientToken}` },
  });

  const orderRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${patientToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prescriptionId: rxData.data.id,
      pharmacyId: 'PHARM-1',
    }),
  });
  const orderData = await orderRes.json();
  const createdOrder = orderData.data;
  console.log(`✓ PharmacyOrder Created in Database!`);
  console.log(`   Order ID: ${createdOrder.id}`);
  console.log(`   Order Suffix: #${createdOrder.id.slice(-6)}`);
  console.log(`   Initial Status: ${createdOrder.status}\n`);

  // 5. Fetch Pharmacist Notifications After Order Creation
  console.log('5. Verifying Pharmacist Notification Received...');
  const notifsAfterRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const notifsAfter = (await notifsAfterRes.json()).data || [];
  console.log(`   Notification count after: ${notifsAfter.length} (Delta: +${notifsAfter.length - countBefore})`);

  if (notifsAfter.length - countBefore !== 1) {
    throw new Error(`Expected exactly 1 new notification, received delta ${notifsAfter.length - countBefore}`);
  }

  const latestNotification = notifsAfter[0];
  console.log(`✓ Latest Notification Details:`);
  console.log(`   ID: ${latestNotification.id}`);
  console.log(`   Title: "${latestNotification.title}"`);
  console.log(`   Message: "${latestNotification.message}"`);
  console.log(`   RelatedModule: "${latestNotification.relatedModule}"`);
  console.log(`   IsRead: ${latestNotification.isRead}\n`);

  // Check exact order linking
  if (latestNotification.relatedModule !== `orders:${createdOrder.id}`) {
    throw new Error(`Notification relatedModule is "${latestNotification.relatedModule}", expected "orders:${createdOrder.id}"`);
  }
  if (!latestNotification.message.includes(createdOrder.id.slice(-6))) {
    throw new Error(`Notification message did not contain order suffix #${createdOrder.id.slice(-6)}`);
  }
  if (!latestNotification.message.includes('Lalith Velarasi')) {
    throw new Error(`Notification message did not contain patient name Lalith Velarasi`);
  }
  console.log('✓ Notification references EXACT PharmacyOrder and authenticated Patient!\n');

  // 6. Simulate Pharmacist Clicking "View Details"
  console.log('6. Simulating Pharmacist clicking "View Details"...');
  // Mark notification as read
  const markReadRes = await fetch(`${BASE_URL}/notifications/${latestNotification.id}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const markReadData = await markReadRes.json();
  console.log(`✓ Notification marked as read: isRead = ${markReadData.data?.isRead}`);

  // Resolve order from notification reference
  const targetOrderId = latestNotification.relatedModule.replace('orders:', '');
  console.log(`✓ Extracted Target Order ID: ${targetOrderId}`);

  // 7. Verify Order in Pharmacist Queue
  console.log('7. Verifying target order in Pharmacist Prescription Queue...');
  const queueRes = await fetch(`${BASE_URL}/pharmacy-orders`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const queueData = await queueRes.json();
  const queueOrders = queueData.data || [];
  const matchedOrder = queueOrders.find((o: any) => o.id === targetOrderId);

  if (!matchedOrder) {
    throw new Error(`Target order ${targetOrderId} was not found in Pharmacist orders queue!`);
  }

  console.log(`✓ Found exact order in queue!`);
  console.log(`   ID: ${matchedOrder.id}`);
  console.log(`   Patient Name: ${matchedOrder.patient?.fullName}`);
  console.log(`   Items Count: ${matchedOrder.items?.length}`);
  console.log(`   Current Status: ${matchedOrder.status}\n`);

  // 8. Accept Order
  console.log('8. Pharmacist accepts the order...');
  const acceptRes = await fetch(`${BASE_URL}/pharmacy-orders/${matchedOrder.id}/accept`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const acceptData = await acceptRes.json();
  console.log(`✓ Order Status Updated: ${acceptData.data.status}\n`);

  // 9. Check for duplicate notifications
  console.log('9. Checking for duplicate notifications...');
  const finalNotifsRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${pharmacistToken}` },
  });
  const finalNotifs = (await finalNotifsRes.json()).data || [];
  const matchingNotifs = finalNotifs.filter(
    (n: any) => n.relatedModule === `orders:${createdOrder.id}` || n.message.includes(createdOrder.id.slice(-6))
  );
  console.log(`   Notifications for Order #${createdOrder.id.slice(-6)}: ${matchingNotifs.length}`);
  if (matchingNotifs.length !== 1) {
    throw new Error(`Expected exactly 1 notification for this order, found ${matchingNotifs.length}`);
  }
  console.log(`✓ Zero duplicate notifications created!\n`);

  console.log('===========================================================');
  console.log('🎉 PHARMACIST NOTIFICATION → ORDER LINKING: 100% VERIFIED!');
  console.log('===========================================================');
}

testNotificationLinking()
  .catch((err) => {
    console.error('TEST FAILED:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

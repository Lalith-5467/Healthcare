import { prisma } from '../config/prisma';

const BASE_URL = 'http://localhost:5000/api';

async function testAcceptOrder() {
  const orderId = 'cmtsajdqp001wi0b4iylzdwor';
  console.log(`Testing accept order for: ${orderId}`);

  // 1. Login as pharmacist
  const pharmLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pharmacist@health.com', password: 'Pharma@123' }),
  });
  const pharmAuth = await pharmLoginRes.json();
  const token = pharmAuth.data?.token;
  console.log(`Pharmacist logged in. Token present: ${!!token}`);

  // 2. Call accept endpoint
  const res = await fetch(`${BASE_URL}/pharmacy-orders/${orderId}/accept`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const status = res.status;
  const text = await res.text();
  console.log(`HTTP Status: ${status}`);
  console.log(`Response Body: ${text}`);
}

testAcceptOrder()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

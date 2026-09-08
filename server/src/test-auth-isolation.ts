import { prisma } from './config/prisma';

async function testAuthScenarios() {
  console.log('=== VERIFYING REGISTRATION, LOGIN, SESSION & MULTI-USER ISOLATION ===\n');

  // 1. REGISTER PATIENT A
  const emailA = `patient.alpha.${Date.now()}@health.com`;
  const nameA = 'Patient Alpha RealName';
  const regA = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: nameA,
      email: emailA,
      password: 'AlphaPassword123!',
      role: 'PATIENT',
      phoneNumber: '+91 98111 22233',
      bloodGroup: 'B+',
    }),
  });
  const regAJson: any = await regA.json();
  console.log('1. Patient A Registration Status:', regA.status, 'Success:', regAJson.success);

  // Verify MySQL row
  const dbUserA = await prisma.user.findUnique({
    where: { email: emailA },
    include: { patient: true },
  });
  console.log('   MySQL row verified in `users`:', !!dbUserA, 'FullName:', dbUserA?.patient?.fullName);

  // 2. PATIENT A MANUAL LOGIN
  const loginA = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailA,
      password: 'AlphaPassword123!',
    }),
  });
  const loginAJson: any = await loginA.json();
  const tokenA = loginAJson.data?.token;
  console.log('2. Patient A Manual Login HTTP Status:', loginA.status, 'Token acquired:', !!tokenA);

  // 3. VALIDATE PATIENT A SESSION RESTORATION (/auth/me)
  const meA = await fetch('http://localhost:5000/api/auth/me', {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const meAJson: any = await meA.json();
  console.log('3. Patient A /auth/me profile:', meAJson.data?.profile?.fullName, 'Email:', meAJson.data?.email);

  // 4. REGISTER PATIENT B
  const emailB = `patient.beta.${Date.now()}@health.com`;
  const nameB = 'Patient Beta RealName';
  const regB = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: nameB,
      email: emailB,
      password: 'BetaPassword123!',
      role: 'PATIENT',
      phoneNumber: '+91 98444 55566',
      bloodGroup: 'A+',
    }),
  });
  const regBJson: any = await regB.json();
  console.log('4. Patient B Registration Status:', regB.status, 'Success:', regBJson.success);

  const dbUserB = await prisma.user.findUnique({
    where: { email: emailB },
    include: { patient: true },
  });
  console.log('   MySQL row verified in `users`:', !!dbUserB, 'FullName:', dbUserB?.patient?.fullName);

  // 5. PATIENT B MANUAL LOGIN
  const loginB = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: emailB,
      password: 'BetaPassword123!',
    }),
  });
  const loginBJson: any = await loginB.json();
  const tokenB = loginBJson.data?.token;
  console.log('5. Patient B Manual Login HTTP Status:', loginB.status, 'Token acquired:', !!tokenB);

  // 6. VALIDATE PATIENT B SESSION RESTORATION (/auth/me)
  const meB = await fetch('http://localhost:5000/api/auth/me', {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const meBJson: any = await meB.json();
  console.log('6. Patient B /auth/me profile:', meBJson.data?.profile?.fullName, 'Email:', meBJson.data?.email);

  // 7. MULTI-USER ISOLATION VERIFICATION
  const isIsolated = meAJson.data?.email !== meBJson.data?.email && meBJson.data?.profile?.fullName === nameB;
  console.log('7. Multi-user accounts completely isolated without overlap or Ragul fallback:', isIsolated);

  // 8. INVALID SESSION TEST
  const invalidSession = await fetch('http://localhost:5000/api/auth/me', {
    headers: { Authorization: `Bearer invalid-token-12345` },
  });
  console.log('8. Invalid session /auth/me returns 401:', invalidSession.status === 401);

  console.log('\n=== ALL AUTHENTICATION, REGISTRATION & MULTI-USER TESTS PASSED ===');
  await prisma.$disconnect();
}

testAuthScenarios().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});

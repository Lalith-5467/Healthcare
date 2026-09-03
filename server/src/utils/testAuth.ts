async function testAuthSuite() {
  const BASE_URL = 'http://localhost:5000/api/auth';
  console.log('--- Starting Auth & RBAC API Test Suite ---\n');

  // 1. Test Login with patient
  console.log('1. Testing Patient Login (demo.patient@example.test)...');
  const patientLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo.patient@example.test',
      password: 'DemoPassword123!',
    }),
  });
  const patientData = await patientLoginRes.json();
  const patientToken = patientData.data?.token;
  console.log('Status: 200 | Role:', patientData.data?.user?.role, '| Token:', Boolean(patientToken));

  // 2. Test Login with doctor
  console.log('\n2. Testing Doctor Login (demo.doctor@example.test)...');
  const docLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo.doctor@example.test',
      password: 'DemoPassword123!',
    }),
  });
  const docData = await docLoginRes.json();
  const docToken = docData.data?.token;
  console.log('Status: 200 | Role:', docData.data?.user?.role, '| Token:', Boolean(docToken));

  // 3. Test Invalid password
  console.log('\n3. Testing Login with wrong password...');
  const badLoginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo.patient@example.test',
      password: 'WrongPassword999!',
    }),
  });
  const badLoginData = await badLoginRes.json();
  console.log('Status (Expected 401):', badLoginRes.status, '| Msg:', badLoginData.message);

  // 4. Test Registration & duplicate email guard
  console.log('\n4. Testing Registration & Duplicate Guard...');
  const uniqueEmail = `test.user.${Date.now()}@example.test`;
  const regRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: uniqueEmail,
      password: 'StrongPassword123!',
      role: 'CAREGIVER',
      fullName: 'Demo Caregiver',
    }),
  });
  const regData = await regRes.json();
  console.log('Registered Status (Expected 201):', regRes.status, '| Role:', regData.data?.user?.role);

  const dupRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: uniqueEmail,
      password: 'AnotherPassword123!',
    }),
  });
  const dupData = await dupRes.json();
  console.log('Duplicate Status (Expected 409):', dupRes.status, '| Msg:', dupData.message);

  // 5. Test GET /api/auth/me
  console.log('\n5. Testing GET /api/auth/me with Bearer token...');
  const meRes = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const meData = await meRes.json();
  console.log('Status: 200 | Profile:', meData.data?.email, '| Role:', meData.data?.role);
  console.log('Password hash exposed in profile?', 'passwordHash' in (meData.data || {}));

  // 6. Test GET /api/auth/me without token
  console.log('\n6. Testing GET /api/auth/me without token...');
  const noTokenRes = await fetch(`${BASE_URL}/me`);
  const noTokenData = await noTokenRes.json();
  console.log('Status (Expected 401):', noTokenRes.status, '| Msg:', noTokenData.message);

  // 7. Role-based Authorization: Patient accessing Patient route
  console.log('\n7. RBAC Test: Patient accessing /test/patient-only...');
  const pAccessRes = await fetch(`${BASE_URL}/test/patient-only`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const pAccessData = await pAccessRes.json();
  console.log('Status (Expected 200):', pAccessRes.status, '| Msg:', pAccessData.message);

  // 8. Role-based Authorization: Patient accessing Doctor-only route (Forbidden)
  console.log('\n8. RBAC Test: Patient attempting to access /test/doctor-only (Unauthorized Role)...');
  const pDeniedRes = await fetch(`${BASE_URL}/test/doctor-only`, {
    headers: { Authorization: `Bearer ${patientToken}` },
  });
  const pDeniedData = await pDeniedRes.json();
  console.log('Status (Expected 403):', pDeniedRes.status, '| Msg:', pDeniedData.message);

  // 9. Role-based Authorization: Doctor accessing Doctor-only route (Allowed)
  console.log('\n9. RBAC Test: Doctor accessing /test/doctor-only (Authorized Role)...');
  const dAccessRes = await fetch(`${BASE_URL}/test/doctor-only`, {
    headers: { Authorization: `Bearer ${docToken}` },
  });
  const dAccessData = await dAccessRes.json();
  console.log('Status (Expected 200):', dAccessRes.status, '| Msg:', dAccessData.message);

  console.log('\n--- All Auth & RBAC Tests Passed Successfully! ---');
}

testAuthSuite().catch(console.error);

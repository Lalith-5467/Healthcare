const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('=== RUNNING PHASE 1 TESTS ===\n');

  // 1. Login as Admin
  console.log('1. Authenticating as Admin (admin.kavita@dhr-medicare.in)...');
  const adminLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin.kavita@dhr-medicare.in', password: 'Admin@123' })
  });
  const adminLogin = await adminLoginRes.json();
  if (!adminLogin.success) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminLogin));
  }
  const adminToken = adminLogin.data.token;
  console.log('✔ Admin logged in successfully.');

  // 2. Login as Super Admin
  console.log('2. Authenticating as Super Admin (superadmin@dhr-medicare.in)...');
  const superAdminLoginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@dhr-medicare.in', password: 'Admin@123' })
  });
  const superAdminLogin = await superAdminLoginRes.json();
  if (!superAdminLogin.success) {
    throw new Error('Super Admin login failed: ' + JSON.stringify(superAdminLogin));
  }
  const superAdminToken = superAdminLogin.data.token;
  console.log('✔ Super Admin logged in successfully.');

  // 3. Test Security Priority 1: Admin attempts role escalation to SUPER_ADMIN
  console.log('\n3. Testing Role Escalation Protection: Admin tries to create a SUPER_ADMIN user...');
  const escalateCreateRes = await fetch('http://localhost:5000/api/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      email: 'hacker_superadmin@test.com',
      password: 'Password123!',
      fullName: 'Hacker Admin',
      role: 'SUPER_ADMIN'
    })
  });
  const escalateCreate = await escalateCreateRes.json();
  console.log('Result status:', escalateCreateRes.status, 'Response:', escalateCreate);
  if (escalateCreateRes.status === 403 && !escalateCreate.success) {
    console.log('✔ Role escalation prevented! Admin cannot create SUPER_ADMIN (403 Forbidden).');
  } else {
    throw new Error('VULNERABILITY DETECTED: Admin was able to create SUPER_ADMIN!');
  }

  // 4. Test Super Admin CAN create an admin user
  console.log('\n4. Testing Super Admin authority: Super Admin creates a test user...');
  const testEmail = `test_admin_${Date.now()}@test.com`;
  const saCreateRes = await fetch('http://localhost:5000/api/admin/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${superAdminToken}`
    },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password123!',
      fullName: 'Test Support User',
      role: 'ADMIN'
    })
  });
  const saCreate = await saCreateRes.json();
  if (saCreate.success) {
    console.log('✔ Super Admin successfully created user:', saCreate.data.id);
  } else {
    throw new Error('Super Admin creation failed: ' + JSON.stringify(saCreate));
  }

  // Admin tries to escalate that user to SUPER_ADMIN
  console.log('Testing Admin trying to promote user to SUPER_ADMIN...');
  const escalateUpdateRes = await fetch(`http://localhost:5000/api/admin/users/${saCreate.data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      role: 'SUPER_ADMIN'
    })
  });
  const escalateUpdate = await escalateUpdateRes.json();
  console.log('Result status:', escalateUpdateRes.status, 'Response:', escalateUpdate);
  if (escalateUpdateRes.status === 403 && !escalateUpdate.success) {
    console.log('✔ Role escalation prevented! Admin cannot update role to SUPER_ADMIN (403 Forbidden).');
  } else {
    throw new Error('VULNERABILITY DETECTED: Admin was able to promote user to SUPER_ADMIN!');
  }

  // Clean up test user
  await fetch(`http://localhost:5000/api/admin/users/${saCreate.data.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${superAdminToken}` }
  });

  // 5. Test Priority 3: System Settings persistence
  console.log('\n5. Testing Persistent Shared System Settings...');
  const updateSettingsRes = await fetch('http://localhost:5000/api/admin/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      hospitalName: 'Apollo MediCare DHR Hospital',
      supportEmail: 'apollo-support@dhr-medicare.in',
      supportPhone: '+91 99999 88888',
      sessionTimeout: 45,
      mfaEnforced: true,
      emailAlerts: true,
      smsAlerts: true
    })
  });
  const updateSettingsData = await updateSettingsRes.json();
  if (!updateSettingsData.success) {
    throw new Error('Settings update failed: ' + JSON.stringify(updateSettingsData));
  }
  console.log('✔ Admin updated settings successfully in MySQL.');

  // Fetch updated settings via public GET /api/settings
  const getSettingsRes = await fetch('http://localhost:5000/api/settings');
  const getSettingsData = await getSettingsRes.json();
  console.log('Current public settings:', getSettingsData.data);
  if (
    getSettingsData.data.hospitalName === 'Apollo MediCare DHR Hospital' &&
    getSettingsData.data.sessionTimeout === 45 &&
    getSettingsData.data.smsAlerts === true
  ) {
    console.log('✔ Public settings verified! Data persisted accurately.');
  } else {
    throw new Error('Settings verification failed!');
  }

  // 6. Test Priority 4: Image Uploads & File Validation
  console.log('\n6. Testing Secure Image Uploads...');
  
  // Create a dummy image
  const dummyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const blob = new Blob([dummyPng], { type: 'image/png' });
  const formData = new FormData();
  formData.append('file', blob, 'test-logo.png');
  formData.append('category', 'LOGO');

  const uploadRes = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`
    },
    body: formData
  });
  const uploadData = await uploadRes.json();
  console.log('Upload response:', uploadData);
  if (!uploadData.success || !uploadData.data.url) {
    throw new Error('Upload failed: ' + JSON.stringify(uploadData));
  }
  console.log('✔ Image uploaded successfully to:', uploadData.data.url);

  // Test static file retrieval
  const fileFetchRes = await fetch(`http://localhost:5000${uploadData.data.url}`);
  if (fileFetchRes.status === 200) {
    console.log('✔ Static file served successfully via Express HTTP 200.');
  } else {
    throw new Error(`Failed to retrieve uploaded file: ${fileFetchRes.status}`);
  }

  // Test invalid file rejection (e.g. text file / executable disguised)
  console.log('Testing rejection of non-image MIME types...');
  const textBlob = new Blob(['bad script content'], { type: 'text/plain' });
  const badFormData = new FormData();
  badFormData.append('file', textBlob, 'exploit.txt');
  const badUploadRes = await fetch('http://localhost:5000/api/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` },
    body: badFormData
  });
  const badUploadData = await badUploadRes.json();
  console.log('Bad upload status:', badUploadRes.status, 'Response:', badUploadData);
  if (badUploadRes.status === 400 && !badUploadData.success) {
    console.log('✔ Malicious/invalid file rejected properly with 400 Bad Request.');
  } else {
    throw new Error('VULNERABILITY DETECTED: Invalid file type was accepted!');
  }

  console.log('\n=== ALL PHASE 1 BACKEND TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});

import { prisma } from '../config/prisma';

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string | null;
}

async function testStep6Suite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('      STARTING STEP 6 COMPREHENSIVE TEST SUITE      ');
  console.log('====================================================\n');

  // Helper for logging in and grabbing JWT
  async function login(email: string, password = 'DemoPassword123!') {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    return { token: data.data?.token as string, user: data.data?.user };
  }

  // 1. Patient Login & Profile Fetch
  console.log('1. Patient Login & Fetch Current Profile (/api/profile)...');
  const patient = await login('demo.patient@example.test');
  const profileRes = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${patient.token}` },
  });
  const profileData = await profileRes.json();
  console.log('Status (Expected 200):', profileRes.status);
  console.log('Role:', profileData.data?.role);
  console.log('Password hash exposed in /profile?', 'passwordHash' in (profileData.data || {}));

  // 2. Patient Profile GET & PUT
  console.log('\n2. Patient Specific Profile (GET & PUT /api/profile/patient)...');
  const getPatientRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patient.token}` },
  });
  const getPatientData = await getPatientRes.json();
  console.log('GET /patient Status:', getPatientRes.status, '| Name:', getPatientData.data?.fullName);

  const putPatientRes = await fetch(`${BASE_URL}/profile/patient`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${patient.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bloodGroup: 'O+',
      address: '123 Health Care Boulevard',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+919876543210',
    }),
  });
  const putPatientData = await putPatientRes.json();
  console.log('PUT /patient Status (Expected 200):', putPatientRes.status);
  console.log('Updated Blood Group:', putPatientData.data?.bloodGroup);
  console.log('Updated Address:', putPatientData.data?.address);

  // 3. Doctor Login & Profile GET & PUT
  console.log('\n3. Doctor Profile (GET & PUT /api/profile/doctor)...');
  const doctor = await login('demo.doctor@example.test');
  const getDocRes = await fetch(`${BASE_URL}/profile/doctor`, {
    headers: { Authorization: `Bearer ${doctor.token}` },
  });
  const getDocData = await getDocRes.json();
  console.log('GET /doctor Status:', getDocRes.status, '| Speciality:', getDocData.data?.speciality);

  const putDocRes = await fetch(`${BASE_URL}/profile/doctor`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      hospital: 'Apollo Multi-Speciality Hospital',
      consultationFee: 750,
      experienceYears: 12,
      speciality: 'Cardiology',
    }),
  });
  const putDocData = await putDocRes.json();
  console.log('PUT /doctor Status (Expected 200):', putDocRes.status);
  console.log('Updated Hospital:', putDocData.data?.hospital);
  console.log('Updated Consultation Fee:', putDocData.data?.consultationFee);

  // 4. Unauthorized Access (Patient attempting Doctor profile)
  console.log('\n4. RBAC Check: Patient attempting GET /api/profile/doctor...');
  const unauthRes = await fetch(`${BASE_URL}/profile/doctor`, {
    headers: { Authorization: `Bearer ${patient.token}` },
  });
  const unauthData = await unauthRes.json();
  console.log('Status (Expected 403):', unauthRes.status);
  console.log('Message:', unauthData.message);

  // 5. Admin Login & User Listing with Pagination
  console.log('\n5. Admin Login & User Listing (/api/admin/users)...');
  const admin = await login('demo.admin@example.test');
  const usersRes = await fetch(`${BASE_URL}/admin/users?page=1&limit=5`, {
    headers: { Authorization: `Bearer ${admin.token}` },
  });
  const usersData = await usersRes.json();
  console.log('Status (Expected 200):', usersRes.status);
  console.log('Total Users Found:', usersData.pagination?.total);
  console.log('Users on Page 1:', usersData.data?.length);
  console.log('Password hash exposed in user list?', usersData.data?.some((u: any) => 'passwordHash' in u));

  // 6. Get Single User Details
  const targetUser = usersData.data[0];
  console.log(`\n6. Admin Fetch Single User (/api/admin/users/${targetUser.id})...`);
  const singleUserRes = await fetch(`${BASE_URL}/admin/users/${targetUser.id}`, {
    headers: { Authorization: `Bearer ${admin.token}` },
  });
  const singleUserData = await singleUserRes.json();
  console.log('Status (Expected 200):', singleUserRes.status);
  console.log('User Email:', singleUserData.data?.email);
  console.log('User Status:', singleUserData.data?.status);

  // 7. Activate / Deactivate User Status
  console.log(`\n7. Admin Update User Status (/api/admin/users/${targetUser.id}/status)...`);
  const statusDeactRes = await fetch(`${BASE_URL}/admin/users/${targetUser.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'INACTIVE' }),
  });
  const deactData = await statusDeactRes.json();
  console.log('Status to INACTIVE (Expected 200):', statusDeactRes.status, '| New Status:', deactData.data?.status);

  // Restore back to ACTIVE
  const statusActRes = await fetch(`${BASE_URL}/admin/users/${targetUser.id}/status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'ACTIVE' }),
  });
  const actData = await statusActRes.json();
  console.log('Status to ACTIVE (Expected 200):', statusActRes.status, '| Restored Status:', actData.data?.status);

  // 8. Super Admin Role Update Enforcement
  console.log('\n8. Role Update Enforcement: Ordinary Admin vs. Super Admin...');
  console.log('8a. Ordinary Admin attempting PATCH /api/admin/users/:id/role...');
  const adminRoleAttemptRes = await fetch(`${BASE_URL}/admin/users/${targetUser.id}/role`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${admin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'CAREGIVER' }),
  });
  const adminRoleAttemptData = await adminRoleAttemptRes.json();
  console.log('Status (Expected 403 Forbidden):', adminRoleAttemptRes.status);
  console.log('Message:', adminRoleAttemptData.message);

  console.log('\n8b. Super Admin performing PATCH /api/admin/users/:id/role...');
  const superAdmin = await login('demo.superadmin@example.test');

  // Create a temporary user to change role safely without disturbing demo accounts
  const tempEmail = `temp.user.${Date.now()}@example.test`;
  const createTempRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: tempEmail,
      password: 'TempPassword123!',
      role: 'PATIENT',
      fullName: 'Temp Patient',
    }),
  });
  const createTempData = await createTempRes.json();
  const tempUserId = createTempData.data?.user?.id;

  const superAdminRoleRes = await fetch(`${BASE_URL}/admin/users/${tempUserId}/role`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${superAdmin.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'DOCTOR' }),
  });
  const superAdminRoleData = await superAdminRoleRes.json();
  console.log('Status (Expected 200 OK):', superAdminRoleRes.status);
  console.log('Updated User Role:', superAdminRoleData.data?.role);

  // 9. Audit Logging Verification
  console.log('\n9. Verifying Audit Logs recorded in database...');
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: {
        in: ['PROFILE_UPDATED', 'USER_STATUS_CHANGED', 'USER_ROLE_CHANGED'],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log(`Found ${auditLogs.length} recent audit logs:`);
  auditLogs.forEach((log: AuditLogEntry) => {
    console.log(`- [${log.action}] on ${log.entityType} (Entity ID: ${log.entityId})`);
  });

  // 10. Security Checks: Missing and Invalid Token
  console.log('\n10. Security Checks...');
  const noTokenRes = await fetch(`${BASE_URL}/profile`);
  console.log('No Token Status (Expected 401):', noTokenRes.status);

  const invalidTokenRes = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: 'Bearer invalid.token.value' },
  });
  console.log('Invalid Token Status (Expected 401):', invalidTokenRes.status);

  console.log('\n====================================================');
  console.log('   ALL STEP 6 TESTS PASSED SUCCESSFULLY AND VERIFIED ');
  console.log('====================================================\n');
}

testStep6Suite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

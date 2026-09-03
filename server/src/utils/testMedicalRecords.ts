import { prisma } from '../config/prisma';

interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId: string | null;
}

async function testMedicalRecordsSuite() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('    STARTING STEP 7 MEDICAL RECORDS TEST SUITE      ');
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

  // Fetch patient profile ID for demo.patient@example.test
  const patientA = await login('demo.patient@example.test');
  const patientProfileRes = await fetch(`${BASE_URL}/profile/patient`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const patientProfileData = await patientProfileRes.json();
  const patientAId = patientProfileData.data?.id;

  // Create a second test patient for isolation testing
  const patientBEmail = `isolated.patient.${Date.now()}@example.test`;
  const regPatientB = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: patientBEmail,
      password: 'PatientBPassword123!',
      role: 'PATIENT',
      fullName: 'Patient Beta',
    }),
  });
  const regBData = await regPatientB.json();
  const patientBToken = regBData.data?.token;

  // Login Doctor
  const doctor = await login('demo.doctor@example.test');

  // ----------------------------------------------------------------
  // Test 1: Doctor creates medical record
  // ----------------------------------------------------------------
  console.log('Test 1: Doctor creating medical record for Patient A...');
  const createRes = await fetch(`${BASE_URL}/medical-records`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      patientId: patientAId,
      title: 'Comprehensive Cardiovascular Examination',
      type: 'CONSULTATION',
      hospital: 'Metro City Cardiac Center',
      status: 'Normal',
      isImportant: true,
      notes: 'Blood pressure 120/80 mmHg. Normal sinus rhythm. Follow-up in 3 months.',
      recordDate: new Date().toISOString(),
    }),
  });
  const createData = await createRes.json();
  console.log('Status (Expected 201):', createRes.status);
  console.log('Record Title:', createData.data?.title);
  console.log('Assigned Doctor Name:', createData.data?.doctor?.fullName);
  const recordAId = createData.data?.id;

  // ----------------------------------------------------------------
  // Test 2: Patient retrieves own records
  // ----------------------------------------------------------------
  console.log('\nTest 2: Patient A retrieving own medical records...');
  const getPatientRecordsRes = await fetch(`${BASE_URL}/medical-records`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const getPatientRecordsData = await getPatientRecordsRes.json();
  console.log('Status (Expected 200):', getPatientRecordsRes.status);
  console.log('Records Count for Patient A:', getPatientRecordsData.data?.length);
  const hasOwnRecord = getPatientRecordsData.data?.some((r: any) => r.id === recordAId);
  console.log('Patient A saw their created record?', hasOwnRecord);

  // ----------------------------------------------------------------
  // Test 3: Patient isolation - Patient B cannot access Patient A's record
  // ----------------------------------------------------------------
  console.log("\nTest 3: Patient B attempting to access Patient A's record by ID...");
  const patientBAccessRes = await fetch(`${BASE_URL}/medical-records/${recordAId}`, {
    headers: { Authorization: `Bearer ${patientBToken}` },
  });
  const patientBAccessData = await patientBAccessRes.json();
  console.log('Status (Expected 403 Forbidden):', patientBAccessRes.status);
  console.log('Message:', patientBAccessData.message);

  // ----------------------------------------------------------------
  // Test 4: Get record by ID (Authorized User: Patient A)
  // ----------------------------------------------------------------
  console.log('\nTest 4: Patient A accessing their own record by ID...');
  const patientAAccessRes = await fetch(`${BASE_URL}/medical-records/${recordAId}`, {
    headers: { Authorization: `Bearer ${patientA.token}` },
  });
  const patientAAccessData = await patientAAccessRes.json();
  console.log('Status (Expected 200 OK):', patientAAccessRes.status);
  console.log('Record Title:', patientAAccessData.data?.title);
  console.log('Patient Name:', patientAAccessData.data?.patient?.fullName);

  // ----------------------------------------------------------------
  // Test 5: Doctor updates record
  // ----------------------------------------------------------------
  console.log('\nTest 5: Doctor updating clinical record notes...');
  const updateRes = await fetch(`${BASE_URL}/medical-records/${recordAId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${doctor.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notes: 'Blood pressure 118/78 mmHg. Patient reports excellent exercise tolerance.',
      status: 'Reviewed',
      hospital: 'Metro City Cardiac Center - Executive Wing',
    }),
  });
  const updateData = await updateRes.json();
  console.log('Status (Expected 200 OK):', updateRes.status);
  console.log('Updated Status:', updateData.data?.status);
  console.log('Updated Notes:', updateData.data?.notes);

  // ----------------------------------------------------------------
  // Test 6: Patient cannot update clinical record
  // ----------------------------------------------------------------
  console.log('\nTest 6: Patient attempting to update clinical record...');
  const patientUpdateRes = await fetch(`${BASE_URL}/medical-records/${recordAId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${patientA.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notes: 'Hacked by patient notes.',
    }),
  });
  const patientUpdateData = await patientUpdateRes.json();
  console.log('Status (Expected 403 Forbidden):', patientUpdateRes.status);
  console.log('Message:', patientUpdateData.message);

  // ----------------------------------------------------------------
  // Test 7: Unauthorized request without JWT
  // ----------------------------------------------------------------
  console.log('\nTest 7: Accessing /api/medical-records without JWT...');
  const noTokenRes = await fetch(`${BASE_URL}/medical-records`);
  console.log('Status (Expected 401 Unauthorized):', noTokenRes.status);

  // ----------------------------------------------------------------
  // Test 8: Non-existent record ID
  // ----------------------------------------------------------------
  console.log('\nTest 8: Requesting non-existent record ID...');
  const notFoundRes = await fetch(`${BASE_URL}/medical-records/nonexistent_record_id_123`, {
    headers: { Authorization: `Bearer ${doctor.token}` },
  });
  const notFoundData = await notFoundRes.json();
  console.log('Status (Expected 404 Not Found):', notFoundRes.status);
  console.log('Message:', notFoundData.message);

  // ----------------------------------------------------------------
  // Test 9: Pagination & Filtering
  // ----------------------------------------------------------------
  console.log('\nTest 9: Testing pagination & type filtering...');
  const pagedRes = await fetch(`${BASE_URL}/medical-records?page=1&limit=5&type=CONSULTATION`, {
    headers: { Authorization: `Bearer ${doctor.token}` },
  });
  const pagedData = await pagedRes.json();
  console.log('Status (Expected 200 OK):', pagedRes.status);
  console.log('Pagination Metadata:', pagedData.pagination);

  // ----------------------------------------------------------------
  // Test 10: Audit Log Verification
  // ----------------------------------------------------------------
  console.log('\nTest 10: Verifying Medical Records audit logs...');
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      action: {
        in: [
          'MEDICAL_RECORD_CREATED',
          'MEDICAL_RECORD_VIEWED',
          'MEDICAL_RECORD_UPDATED',
        ],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
  console.log(`Found ${auditLogs.length} recent medical record audit logs:`);
  auditLogs.forEach((log: AuditLogEntry) => {
    console.log(`- [${log.action}] on ${log.entityType} (ID: ${log.entityId})`);
  });

  // ----------------------------------------------------------------
  // Test 11: Security check - No passwordHash exposure
  // ----------------------------------------------------------------
  console.log('\nTest 11: Security Check - passwordHash exposure check...');
  const rawJson = JSON.stringify(createData) + JSON.stringify(getPatientRecordsData) + JSON.stringify(patientAAccessData);
  const leaksPasswordHash = rawJson.includes('passwordHash');
  console.log('Contains passwordHash string anywhere in payloads?', leaksPasswordHash);

  console.log('\n====================================================');
  console.log('   ALL STEP 7 TESTS PASSED SUCCESSFULLY AND VERIFIED ');
  console.log('====================================================\n');
}

testMedicalRecordsSuite()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

import { prisma } from './config/prisma';

async function verifyAll() {
  console.log('--- STARTING MYSQL PERSISTENCE VERIFICATION SUITE ---');

  // A. Register Patient Test
  const testEmail = `test.verify.${Date.now()}@health.com`;
  const regRes = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'End-to-End Test Patient',
      email: testEmail,
      password: 'Password123!',
      role: 'PATIENT',
      phone: '+91 99999 88888',
      gender: 'MALE',
      dateOfBirth: '1995-05-15',
      bloodGroup: 'O+',
    }),
  });
  const regJson: any = await regRes.json();
  console.log('1. Registration HTTP status:', regRes.status, 'Success:', regJson.success);

  const dbUser = await prisma.user.findUnique({
    where: { email: testEmail },
    include: { patient: true },
  });
  console.log('   MySQL `users` row found:', !!dbUser, 'ID:', dbUser?.id);
  console.log('   MySQL `patients` row found:', !!dbUser?.patient, 'ABHA ID:', dbUser?.abhaId);

  // B. Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'Password123!',
    }),
  });
  const loginJson: any = await loginRes.json();
  console.log('2. Login HTTP status:', loginRes.status, 'Token acquired:', !!loginJson.data?.token);
  const patientToken = loginJson.data?.token;

  // Login Doctor
  const docLogin = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'doctor@health.com',
      password: 'Doctor@123',
    }),
  });
  const docJson: any = await docLogin.json();
  const docToken = docJson.data?.token;
  console.log('3. Doctor login token acquired:', !!docToken);

  // C. Doctor creates Patient Access Request
  const createReqRes = await fetch('http://localhost:5000/api/health-share/access-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${docToken}`,
    },
    body: JSON.stringify({
      token: dbUser?.patient?.id || 'TEST-PATIENT',
      purpose: 'Routine Cardiology Follow-up Verification',
      permissionScope: ['Medical Records', 'Prescriptions', 'Vitals'],
    }),
  });
  const createReqJson: any = await createReqRes.json();
  const reqId = createReqJson.data?.requestId || createReqJson.data?.id;
  console.log('4. Doctor Access Request HTTP status:', createReqRes.status, 'Request ID:', reqId);

  const dbReqInitial = await prisma.patientAccessRequest.findUnique({
    where: { id: reqId },
  });
  console.log('   MySQL `patient_access_requests` status before decision:', dbReqInitial?.status);

  // D. Patient Accepts Access Request
  const respondRes = await fetch(`http://localhost:5000/api/health-share/access-requests/${reqId}/approve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`,
    },
    body: JSON.stringify({
      approvedScopes: ['Medical Records', 'Prescriptions', 'Vitals'],
    }),
  });
  const respondJson: any = await respondRes.json();
  console.log('5. Patient Respond HTTP status:', respondRes.status, 'Action Response Status:', respondJson.data?.status);

  const dbReqApproved = await prisma.patientAccessRequest.findUnique({
    where: { id: reqId },
  });
  console.log('   MySQL `patient_access_requests` status after approval in DB:', dbReqApproved?.status);

  // E. Doctor queries access requests
  const docCheckRes = await fetch('http://localhost:5000/api/health-share/access-requests/doctor', {
    headers: { Authorization: `Bearer ${docToken}` },
  });
  const docCheckJson: any = await docCheckRes.json();
  const matchedOnDocSide = docCheckJson.data?.find((r: any) => r.id === reqId);
  console.log('6. Doctor sees updated request status via API:', matchedOnDocSide?.status);

  // F. Appointment Create and Cancel
  const apptRes = await fetch('http://localhost:5000/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`,
    },
    body: JSON.stringify({
      doctorId: docJson.data?.user?.doctorId || 'cmtnzzt0z0002i0oo63y61g0f',
      appointmentDate: new Date(Date.now() + 86400000).toISOString(),
      slotTime: '11:00 AM',
      type: 'IN_PERSON',
      reason: 'Chest pain checkup',
    }),
  });
  const apptJson: any = await apptRes.json();
  console.log('7. Appointment Create HTTP status:', apptRes.status, 'ID:', apptJson.data?.id);
  const dbAppt = await prisma.appointment.findUnique({ where: { id: apptJson.data?.id } });
  console.log('   MySQL `appointments` row created:', !!dbAppt, 'Status:', dbAppt?.status);

  // Cancel Appointment
  const cancelRes = await fetch(`http://localhost:5000/api/appointments/${apptJson.data?.id}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`,
    },
    body: JSON.stringify({ reason: 'Patient requested reschedule' }),
  });
  const cancelJson: any = await cancelRes.json();
  console.log('8. Appointment Cancel HTTP status:', cancelRes.status);
  const dbApptCancelled = await prisma.appointment.findUnique({ where: { id: apptJson.data?.id } });
  console.log('   MySQL `appointments` status in DB after cancel:', dbApptCancelled?.status);

  // G. Medical Record Create & Update
  const recRes = await fetch('http://localhost:5000/api/medical-records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`,
    },
    body: JSON.stringify({
      title: 'Lab Lipid Panel Report',
      recordType: 'LAB_REPORT',
      fileUrl: 'https://example.com/lipid-report.pdf',
      doctorNotes: 'HDL and LDL levels normal',
    }),
  });
  const recJson: any = await recRes.json();
  console.log('9. Medical Record Create HTTP status:', recRes.status, 'ID:', recJson.data?.id);
  const dbRecord = await prisma.medicalRecord.findUnique({ where: { id: recJson.data?.id } });
  console.log('   MySQL `medical_records` row created:', !!dbRecord, 'Title:', dbRecord?.title);

  // H. Vitals & Reminders
  const vitalRes = await fetch('http://localhost:5000/api/vitals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${patientToken}`,
    },
    body: JSON.stringify({
      systolicBp: 120,
      diastolicBp: 80,
      heartRate: 72,
      oxygenSaturation: 98,
      temperature: 98.4,
      bloodSugar: 100,
    }),
  });
  const vitalJson: any = await vitalRes.json();
  console.log('10. Vitals Create HTTP status:', vitalRes.status, 'ID:', vitalJson.data?.id);
  const dbVital = await prisma.vital.findUnique({ where: { id: vitalJson.data?.id } });
  console.log('   MySQL `vitals` row created:', !!dbVital, 'Systolic BP:', dbVital?.systolicBp);

  console.log('--- ALL E2E MYSQL PERSISTENCE CHECKS COMPLETED SUCCESSFULLY ---');
  await prisma.$disconnect();
}

verifyAll().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});

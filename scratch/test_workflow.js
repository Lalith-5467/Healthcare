const fetch = globalThis.fetch;

async function run() {
  const base = 'http://localhost:5000/api';
  console.log('--- 1. Login Doctor ---');
  const docRes = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'doctor@health.com', password: 'Doctor@123' })
  });
  const docJson = await docRes.json();
  const docToken = docJson.data.token;
  console.log('Doctor token acquired:', !!docToken);

  console.log('--- 2. Login Patient ---');
  const patRes = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'patient@health.com', password: 'Patient@123' })
  });
  const patJson = await patRes.json();
  const patToken = patJson.data.token;
  const patEmail = patJson.data.user.email;
  console.log('Patient token acquired:', !!patToken, 'Email:', patEmail);

  console.log('--- 3. Doctor creates access request ---');
  const reqRes = await fetch(base + '/health-share/access-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + docToken },
    body: JSON.stringify({
      token: patEmail,
      purpose: 'Cardiology Follow-up',
      permissionScope: ['Vitals', 'Medical Records', 'Prescriptions'],
      durationMinutes: 60
    })
  });
  const reqJson = await reqRes.json();
  console.log('Doctor created request status:', reqRes.status, reqJson.success, 'RequestId:', reqJson.data?.requestId || reqJson.data?.id);
  const reqId = reqJson.data?.requestId || reqJson.data?.id;

  console.log('--- 4. Patient fetches pending requests ---');
  const listRes = await fetch(base + '/health-share/access-requests/patient', {
    headers: { 'Authorization': 'Bearer ' + patToken }
  });
  const listJson = await listRes.json();
  const found = listJson.data?.find(r => r.id === reqId);
  console.log('Found created request in patient list:', !!found, 'Status:', found?.status, 'Doctor:', found?.doctorName, 'Hospital:', found?.doctorHospital);

  console.log('--- 5. Patient checks notifications ---');
  const notifRes = await fetch(base + '/notifications', {
    headers: { 'Authorization': 'Bearer ' + patToken }
  });
  const notifJson = await notifRes.json();
  const notif = notifJson.data?.find(n => n.type === 'ACCESS_REQUEST');
  console.log('Found ACCESS_REQUEST in notifications:', !!notif, 'Title:', notif?.title);

  console.log('--- 6. Patient approves request with selected permissions [Vitals, Prescriptions] ---');
  const appRes = await fetch(base + '/health-share/access-requests/' + reqId + '/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + patToken },
    body: JSON.stringify({
      permissionScope: ['Vitals', 'Prescriptions'],
      durationMinutes: 60
    })
  });
  const appJson = await appRes.json();
  console.log('Approval status:', appRes.status, appJson.success, 'New Status:', appJson.data?.status, 'Granted scopes:', appJson.data?.permissionScope);

  console.log('--- 7. Doctor creates a second request for rejection test ---');
  const req2Res = await fetch(base + '/health-share/access-requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + docToken },
    body: JSON.stringify({
      token: patEmail,
      purpose: 'Surgical Consultation',
      permissionScope: ['Medical Records']
    })
  });
  const req2Json = await req2Res.json();
  const req2Id = req2Json.data?.requestId || req2Json.data?.id;
  console.log('Doctor created second request:', req2Id);

  console.log('--- 8. Patient rejects the second request ---');
  const rejRes = await fetch(base + '/health-share/access-requests/' + req2Id + '/reject', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + patToken }
  });
  const rejJson = await rejRes.json();
  console.log('Rejection status:', rejRes.status, rejJson.success, 'New Status:', rejJson.data?.status);

  console.log('--- 9. Verify server-backed persistence after operations ---');
  const finalListRes = await fetch(base + '/health-share/access-requests/patient', {
    headers: { 'Authorization': 'Bearer ' + patToken }
  });
  const finalListJson = await finalListRes.json();
  const finalReq1 = finalListJson.data?.find(r => r.id === reqId);
  const finalReq2 = finalListJson.data?.find(r => r.id === req2Id);
  console.log('Persisted Req 1 status:', finalReq1?.status, 'Scopes:', finalReq1?.permissionScope);
  console.log('Persisted Req 2 status:', finalReq2?.status);

  console.log('--- 10. Repeated click / idempotency test ---');
  const repeatApp = await fetch(base + '/health-share/access-requests/' + reqId + '/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + patToken },
    body: JSON.stringify({ permissionScope: ['Vitals'] })
  });
  const repeatJson = await repeatApp.json();
  console.log('Repeat approve status code:', repeatApp.status, 'Status in response:', repeatJson.data?.status);

  console.log('--- 11. Unauthorized user test ---');
  const unauthApp = await fetch(base + '/health-share/access-requests/' + reqId + '/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + docToken }, // doctor trying to approve
    body: JSON.stringify({ permissionScope: ['Vitals'] })
  });
  console.log('Unauthorized doctor approval attempt status:', unauthApp.status);

  console.log('All tests finished successfully!');
}

run().catch(console.error);

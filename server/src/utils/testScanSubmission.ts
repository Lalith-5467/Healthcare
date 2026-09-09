async function testScanSubmission() {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtdGpxMHlpYTAwMDBpMHJndWRrMjZhODgiLCJlbWFpbCI6ImRlbW8ucGF0aWVudEBleGFtcGxlLnRlc3QiLCJyb2xlIjoiUEFUSUVOVCIsImlhdCI6MTc4ODM0Mjg4NywiZXhwIjoxNzg4OTQ3Njg3fQ.mZJUu1ju29j1JpG7UqP4oA84PwGE8_XCJaZVXzhlaCk';

  // 1. Profile
  const profRes = await fetch('http://localhost:5000/api/profile/patient', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const profData = await profRes.json();
  console.log('1. Profile:', profData.success, profData.data?.id);
  const patientId = profData.data?.id;

  // 2. Prescription
  const rxPayload = {
    patientId,
    diagnosis: 'Malaria Clinical Scan Test',
    notes: 'Prescription test scan',
    items: [
      {
        medicineName: 'Tab. Abciximab (1 Morning)',
        dosage: '1 Morning',
        unit: 'mg',
        frequency: 'Once daily',
        durationDays: 8,
        instructions: 'Take 1 tablet in morning',
        foodInstruction: 'Before Food',
      },
    ],
  };

  const rxRes = await fetch('http://localhost:5000/api/prescriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rxPayload),
  });
  const rxData = await rxRes.json();
  console.log('2. Prescription create:', rxRes.status, rxData);
  const rxId = rxData.data?.id;

  // 3. Confirm
  const confRes = await fetch(`http://localhost:5000/api/prescriptions/${rxId}/confirm`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
  });
  const confData = await confRes.json();
  console.log('3. Prescription confirm:', confRes.status, confData);

  // 4. Eligible pharmacy
  const pharmRes = await fetch('http://localhost:5000/api/pharmacies/available', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const pharmData = await pharmRes.json();
  console.log('4. pharmRes status:', pharmRes.status, pharmData);
  const eligiblePharmacy = (pharmData.data || [])[0];
  console.log('Eligible pharmacy:', eligiblePharmacy?.name, eligiblePharmacy?.id);

  // 5. Create pharmacy order
  const orderRes = await fetch('http://localhost:5000/api/pharmacy-orders', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prescriptionId: rxId,
      pharmacyId: eligiblePharmacy.id,
      deliveryAddress: 'Flat 4B, Emerald Heights, Anna Salai, Guindy, Chennai',
      deliveryType: 'Home Delivery',
    }),
  });
  const orderData = await orderRes.json();
  console.log('5. Order create:', orderRes.status, orderData);
}

testScanSubmission();

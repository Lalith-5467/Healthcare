const http = require('http');

function postJson(url, body, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch(e) {
          resolve({ status: res.statusCode, text: buf });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(buf) });
        } catch(e) {
          resolve({ status: res.statusCode, text: buf });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function test() {
  console.log('1. Logging in as patient...');
  const patLogin = await postJson('http://localhost:5000/api/auth/login', {
    email: 'ananya@health.com',
    password: 'Patient@123'
  });
  console.log('Patient login status:', patLogin.status);
  const patToken = patLogin.body?.data?.token;

  console.log('\n2. Logging in as pharmacist Suresh (Apollo)...');
  const sureshLogin = await postJson('http://localhost:5000/api/auth/login', {
    email: 'pharmacist@health.com',
    password: 'Pharma@123'
  });
  console.log('Suresh login status:', sureshLogin.status);
  const sureshToken = sureshLogin.body?.data?.token;

  console.log('\n3. Logging in as pharmacist Gowtham (Medplus)...');
  const gowthamLogin = await postJson('http://localhost:5000/api/auth/login', {
    email: 'medplus@gmail.com',
    password: 'Pharma@123'
  });
  console.log('Gowtham login status:', gowthamLogin.status);
  const gowthamToken = gowthamLogin.body?.data?.token;

  console.log('\n4. Fetching orders for Suresh (Apollo):');
  const sureshOrders = await getJson('http://localhost:5000/api/pharmacy-orders', sureshToken);
  console.log('Suresh orders status:', sureshOrders.status, 'count:', sureshOrders.body?.data?.length);
  if (sureshOrders.body?.data) {
    console.log('Suresh orders:', sureshOrders.body.data.map(o => ({
      id: o.id,
      status: o.status,
      pharmacyId: o.pharmacyId,
      pharmacyName: o.pharmacy?.name,
      patientName: o.patient?.fullName
    })));
  }

  console.log('\n5. Fetching orders for Gowtham (Medplus):');
  const gowthamOrders = await getJson('http://localhost:5000/api/pharmacy-orders', gowthamToken);
  console.log('Gowtham orders status:', gowthamOrders.status, 'count:', gowthamOrders.body?.data?.length);
  if (gowthamOrders.body?.data?.length > 0) {
    console.log('First Gowtham order:', {
      id: gowthamOrders.body.data[0].id,
      status: gowthamOrders.body.data[0].status,
      pharmacyName: gowthamOrders.body.data[0].pharmacy?.name,
      patientName: gowthamOrders.body.data[0].patient?.fullName,
    });
  }
}

test().catch(console.error);

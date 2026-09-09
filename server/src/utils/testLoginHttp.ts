async function run() {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'ragul.kumar@abdm.in',
      password: 'Patient@123',
    }),
  });
  const data = await res.json();
  console.log('HTTP Login Status:', res.status);
  console.log('Login Result:', {
    success: data.success,
    message: data.message,
    role: data.data?.user?.role,
    hasToken: Boolean(data.data?.token),
  });
}

run().catch(console.error);

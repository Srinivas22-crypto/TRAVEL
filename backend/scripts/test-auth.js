import axios from 'axios';

console.log('========================================');
console.log('    AUTHENTICATION TEST SCRIPT');
console.log('========================================');
console.log('');

const API_BASE_URL = 'http://localhost:5000/api';

async function testHealthEndpoint() {
  console.log('Testing health endpoint...');
  try {
    const response = await axios.get('http://localhost:5000/health');
    console.log('✅ Health endpoint working');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Health endpoint failed');
    console.log('Error:', error.message);
    return false;
  }
  return true;
}

async function testRegistration() {
  console.log('');
  console.log('Testing user registration...');
  
  const testUser = {
    firstName: 'Auth',
    lastName: 'Test',
    email: `authtest${Date.now()}@example.com`,
    password: 'testpassword123'
  };
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful');
    console.log('User created:', response.data.user?.email);
    return { success: true, user: testUser, token: response.data.token };
  } catch (error) {
    console.log('❌ Registration failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return { success: false };
  }
}

async function testLogin(user) {
  console.log('');
  console.log('Testing user login...');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: user.email,
      password: user.password
    });
    console.log('✅ Login successful');
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    return { success: true, token: response.data.token };
  } catch (error) {
    console.log('❌ Login failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return { success: false };
  }
}

async function testProtectedRoute(token) {
  console.log('');
  console.log('Testing protected route...');
  
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Protected route access successful');
    console.log('User data:', response.data.user?.email);
    return true;
  } catch (error) {
    console.log('❌ Protected route access failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

async function testCorsHeaders() {
  console.log('');
  console.log('Testing CORS configuration...');
  
  try {
    const response = await axios.options(`${API_BASE_URL}/auth/login`);
    console.log('✅ CORS preflight successful');
    console.log('Access-Control-Allow-Origin:', response.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Methods:', response.headers['access-control-allow-methods']);
  } catch (error) {
    console.log('❌ CORS preflight failed');
    console.log('This might indicate CORS configuration issues');
    console.log('Error:', error.message);
  }
}

async function runAuthTests() {
  console.log('Starting comprehensive authentication tests...');
  console.log('');
  
  // Test 1: Health check
  const healthOk = await testHealthEndpoint();
  if (!healthOk) {
    console.log('');
    console.log('❌ Backend server is not responding. Please start it first:');
    console.log('cd backend && npm start');
    return;
  }
  
  // Test 2: CORS
  await testCorsHeaders();
  
  // Test 3: Registration
  const registrationResult = await testRegistration();
  if (!registrationResult.success) {
    console.log('');
    console.log('❌ Registration failed. Cannot continue with login tests.');
    return;
  }
  
  // Test 4: Login
  const loginResult = await testLogin(registrationResult.user);
  if (!loginResult.success) {
    console.log('');
    console.log('❌ Login failed. Check authentication logic.');
    return;
  }
  
  // Test 5: Protected route
  await testProtectedRoute(loginResult.token);
  
  console.log('');
  console.log('========================================');
  console.log('    TEST SUMMARY');
  console.log('========================================');
  console.log('');
  console.log('✅ All authentication tests completed');
  console.log('');
  console.log('If any tests failed, check:');
  console.log('1. Backend server is running (npm start)');
  console.log('2. Database connection is working');
  console.log('3. Environment variables are set correctly');
  console.log('4. CORS is configured for frontend origin');
  console.log('');
  console.log('Test credentials created:');
  console.log('Email:', registrationResult.user.email);
  console.log('Password:', registrationResult.user.password);
}

runAuthTests().catch(console.error);
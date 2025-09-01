import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================');
console.log('    LOGIN DEBUGGING SCRIPT');
console.log('========================================');
console.log('');

async function checkBackendHealth() {
  console.log('Step 1: Checking if backend server is running...');
  try {
    const response = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    console.log('✅ Backend server is running on port 5001');
    return true;
  } catch (error) {
    console.log('❌ Backend server is NOT running on port 5001');
    console.log('Please start the backend server first: cd backend && npm start');
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('');
  console.log('Step 2: Testing database connection...');
  try {
    const response = await axios.get('http://localhost:5001/api/auth/me', {
      headers: { 'Authorization': 'Bearer invalid_token' },
      timeout: 5000
    });
    console.log('✅ API endpoint is accessible');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ API endpoint is accessible (401 expected with invalid token)');
    } else {
      console.log('❌ API endpoint is not accessible');
      console.log('Error:', error.message);
    }
  }
}

async function testAuthEndpoint() {
  console.log('');
  console.log('Step 3: Testing auth endpoint directly...');
  try {
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'demo@travelhub.com',
      password: 'password123'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ Login endpoint responded');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Login endpoint error');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

function checkFrontendEnv() {
  console.log('');
  console.log('Step 4: Checking frontend environment...');
  const frontendEnvPath = path.join(__dirname, '../../frontend/.env');
  
  if (fs.existsSync(frontendEnvPath)) {
    console.log('✅ Frontend .env file exists');
    const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
    const apiUrlMatch = envContent.match(/VITE_API_URL=(.+)/);
    if (apiUrlMatch) {
      console.log('VITE_API_URL setting:', apiUrlMatch[1]);
    } else {
      console.log('❌ VITE_API_URL not found in .env');
    }
  } else {
    console.log('❌ Frontend .env file missing');
  }
}

function checkBackendEnv() {
  console.log('');
  console.log('Step 5: Checking backend environment...');
  const backendEnvPath = path.join(__dirname, '../.env');
  
  if (fs.existsSync(backendEnvPath)) {
    console.log('✅ Backend .env file exists');
    const envContent = fs.readFileSync(backendEnvPath, 'utf8');
    
    const portMatch = envContent.match(/PORT=(.+)/);
    const jwtMatch = envContent.match(/JWT_SECRET=(.+)/);
    const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
    
    console.log('PORT setting:', portMatch ? portMatch[1] : 'Not found');
    console.log('JWT_SECRET setting:', jwtMatch ? 'Set' : 'Not found');
    console.log('MONGODB_URI setting:', mongoMatch ? 'Set' : 'Not found');
  } else {
    console.log('❌ Backend .env file missing');
  }
}

async function runDiagnostics() {
  const backendRunning = await checkBackendHealth();
  
  if (!backendRunning) {
    console.log('');
    console.log('Cannot continue diagnostics without backend server running.');
    process.exit(1);
  }
  
  await testDatabaseConnection();
  await testAuthEndpoint();
  checkFrontendEnv();
  checkBackendEnv();
  
  console.log('');
  console.log('========================================');
  console.log('    DEBUGGING COMPLETE');
  console.log('========================================');
  console.log('');
  console.log('If you see any ❌ errors above, those need to be fixed first.');
  console.log('');
  console.log('Common issues and solutions:');
  console.log('1. Backend not running: cd backend && npm start');
  console.log('2. Wrong API URL: Check VITE_API_URL in frontend/.env');
  console.log('3. Database not connected: Check MONGODB_URI in backend/.env');
  console.log('4. Missing JWT_SECRET: Check JWT_SECRET in backend/.env');
}

runDiagnostics().catch(console.error);
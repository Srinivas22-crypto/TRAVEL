const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './backend/.env' });

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`)
};

async function diagnoseLogin() {
  console.log('🔍 DIAGNOSING LOGIN ISSUES...\n');

  // 1. Check environment variables
  log.info('Step 1: Checking environment variables...');
  
  if (!process.env.PORT) {
    log.error('PORT not set in backend/.env');
  } else {
    log.success(`PORT: ${process.env.PORT}`);
  }

  if (!process.env.MONGODB_URI) {
    log.error('MONGODB_URI not set in backend/.env');
  } else {
    log.success(`MONGODB_URI: ${process.env.MONGODB_URI}`);
  }

  if (!process.env.JWT_SECRET) {
    log.error('JWT_SECRET not set in backend/.env');
  } else {
    log.success('JWT_SECRET is set');
  }

  console.log();

  // 2. Check if backend server is running
  log.info('Step 2: Checking if backend server is running...');
  
  try {
    const response = await axios.get('http://localhost:5001/health', { timeout: 5000 });
    log.success('Backend server is running');
    log.info(`Health check response: ${JSON.stringify(response.data)}`);
  } catch (error) {
    log.error('Backend server is NOT running or not accessible');
    log.error('Please start the backend server: cd backend && npm start');
    return;
  }

  console.log();

  // 3. Check database connection
  log.info('Step 3: Checking database connection...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    log.success('Database connection successful');
    
    // Check if users collection exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasUsersCollection = collections.some(col => col.name === 'users');
    
    if (hasUsersCollection) {
      log.success('Users collection exists');
      
      // Count users
      const User = mongoose.model('User', new mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        password: String
      }));
      
      const userCount = await User.countDocuments();
      log.info(`Found ${userCount} users in database`);
      
      if (userCount === 0) {
        log.warning('No users found in database');
        log.info('Creating test user...');
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await User.create({
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          password: hashedPassword
        });
        
        log.success('Test user created: test@example.com / password123');
      }
    } else {
      log.warning('Users collection does not exist');
    }
    
  } catch (error) {
    log.error(`Database connection failed: ${error.message}`);
    return;
  }

  console.log();

  // 4. Test login endpoint
  log.info('Step 4: Testing login endpoint...');
  
  try {
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    log.success('Login endpoint working correctly');
    log.info(`Response status: ${loginResponse.status}`);
    log.info(`Response data: ${JSON.stringify(loginResponse.data, null, 2)}`);
    
  } catch (error) {
    if (error.response) {
      log.error(`Login failed with status ${error.response.status}`);
      log.error(`Error response: ${JSON.stringify(error.response.data, null, 2)}`);
    } else if (error.request) {
      log.error('No response received from login endpoint');
      log.error('This usually means the server is not running or not accessible');
    } else {
      log.error(`Login request error: ${error.message}`);
    }
  }

  console.log();

  // 5. Check frontend configuration
  log.info('Step 5: Checking frontend configuration...');
  
  const fs = require('fs');
  const path = require('path');
  
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
  
  if (fs.existsSync(frontendEnvPath)) {
    const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');
    const apiUrlMatch = frontendEnv.match(/VITE_API_URL=(.+)/);
    
    if (apiUrlMatch) {
      const apiUrl = apiUrlMatch[1].trim();
      log.success(`Frontend API URL: ${apiUrl}`);
      
      if (apiUrl !== 'http://localhost:5001/api') {
        log.warning('Frontend API URL might be incorrect');
        log.info('Expected: http://localhost:5001/api');
      }
    } else {
      log.error('VITE_API_URL not found in frontend/.env');
    }
  } else {
    log.error('frontend/.env file not found');
  }

  console.log();

  // 6. Summary and recommendations
  log.info('🎯 DIAGNOSIS COMPLETE');
  console.log('\n📋 RECOMMENDATIONS:');
  console.log('1. Make sure backend server is running: cd backend && npm start');
  console.log('2. Make sure MongoDB is running and accessible');
  console.log('3. Use test credentials: test@example.com / password123');
  console.log('4. Check browser DevTools Network tab for detailed error info');
  console.log('5. Verify VITE_API_URL=http://localhost:5001/api in frontend/.env');

  await mongoose.connection.close();
}

// Run diagnosis
diagnoseLogin().catch(error => {
  console.error('Diagnosis failed:', error);
  process.exit(1);
});
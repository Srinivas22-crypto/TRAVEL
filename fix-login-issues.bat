@echo off
echo ========================================
echo    LOGIN ISSUE FIX SCRIPT
echo ========================================
echo.

echo This script will attempt to fix common login issues...
echo.

echo Step 1: Creating a test user in the database...
cd backend
node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }
    
    // Create test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: hashedPassword
    });
    
    console.log('✅ Test user created successfully');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    process.exit(1);
  }
}

createTestUser();
"

echo.
echo Step 2: Testing login with test user...
curl -s -X POST "http://localhost:5001/api/auth/login" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" ^
     -w "HTTP Status: %%{http_code}\n" ^
     -o login_response.json

if exist login_response.json (
    echo Login response:
    type login_response.json
    echo.
    del login_response.json
)

echo.
echo Step 3: Checking CORS configuration...
echo If you're getting CORS errors, the backend server.js should include:
echo app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

echo.
echo ========================================
echo    MANUAL TESTING INSTRUCTIONS
echo ========================================
echo.
echo 1. Open browser developer tools (F12)
echo 2. Go to Network tab
echo 3. Try to login with:
echo    Email: test@example.com
echo    Password: password123
echo.
echo 4. Check the network request to /api/auth/login
echo 5. Look for these common issues:
echo    - Request URL should be: http://localhost:5001/api/auth/login
echo    - Request method should be: POST
echo    - Content-Type should be: application/json
echo    - Response status should be: 200 (success) or 401 (invalid credentials)
echo.
echo 6. Check browser console for JavaScript errors
echo.
pause
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// User model (simplified version)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

console.log('========================================');
console.log('    CREATE TEST USER SCRIPT');
console.log('========================================');
console.log('');

async function createTestUser() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('✅ Test user already exists');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      await mongoose.connection.close();
      return;
    }
    
    // Create test user
    console.log('Creating test user...');
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
    console.log('User ID:', testUser._id);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

async function testLogin() {
  console.log('');
  console.log('Testing login with test user...');
  
  try {
    const axios = (await import('axios')).default;
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('✅ Login test successful');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Login test failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Response:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
      console.log('Make sure the backend server is running: npm start');
    }
  }
}

async function main() {
  await createTestUser();
  await testLogin();
  
  console.log('');
  console.log('========================================');
  console.log('    MANUAL TESTING INSTRUCTIONS');
  console.log('========================================');
  console.log('');
  console.log('1. Open browser developer tools (F12)');
  console.log('2. Go to Network tab');
  console.log('3. Try to login with:');
  console.log('   Email: test@example.com');
  console.log('   Password: password123');
  console.log('');
  console.log('4. Check the network request to /api/auth/login');
  console.log('5. Look for these common issues:');
  console.log('   - Request URL should be: http://localhost:5000/api/auth/login');
  console.log('   - Request method should be: POST');
  console.log('   - Content-Type should be: application/json');
  console.log('   - Response status should be: 200 (success) or 401 (invalid credentials)');
  console.log('');
  console.log('6. Check browser console for JavaScript errors');
}

main().catch(console.error);
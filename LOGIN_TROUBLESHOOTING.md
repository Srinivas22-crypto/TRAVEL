# Login Troubleshooting Guide

## 🔍 Step-by-Step Debugging Process

### 1. **Check Server Status**
```bash
# Run the debug script
debug-login.bat

# Or manually check:
curl http://localhost:5001/health
```

### 2. **Verify Environment Configuration**

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5001/api
```

**Backend (.env):**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/travel_db
JWT_SECRET=travel_super_secret_jwt_key_2024_development_only
JWT_EXPIRE=7d
```

### 3. **Common Issues & Solutions**

#### ❌ **Issue 1: "Network Error" or "Failed to fetch"**
**Cause:** Backend server not running or wrong API URL

**Solutions:**
```bash
# Start backend server
cd backend
npm start

# Check if server is running
curl http://localhost:5001/health
```

**Fix API URL in frontend/.env:**
```env
VITE_API_URL=http://localhost:5001/api
```

#### ❌ **Issue 2: "Invalid credentials" with correct password**
**Cause:** User doesn't exist in database or password hashing mismatch

**Solutions:**
```bash
# Create test user
fix-login-issues.bat

# Or manually create user via MongoDB
```

#### ❌ **Issue 3: CORS Errors**
**Cause:** Frontend and backend on different origins

**Fix in backend/server.js:**
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

#### ❌ **Issue 4: Database Connection Failed**
**Cause:** MongoDB not running or wrong connection string

**Solutions:**
```bash
# Start MongoDB (if using local installation)
mongod

# Or use MongoDB Compass to verify connection
# Connection string: mongodb://localhost:27017/travel_db
```

#### ❌ **Issue 5: JWT Token Issues**
**Cause:** Missing or invalid JWT_SECRET

**Fix in backend/.env:**
```env
JWT_SECRET=your_very_long_and_secure_secret_key_here
JWT_EXPIRE=7d
```

### 4. **Browser Developer Tools Debugging**

#### **Network Tab Inspection:**
1. Open DevTools (F12) → Network tab
2. Try to login
3. Look for the login request to `/api/auth/login`
4. Check:
   - **Request URL:** Should be `http://localhost:5001/api/auth/login`
   - **Method:** Should be `POST`
   - **Status:** Should be `200` (success) or `401` (invalid credentials)
   - **Request Headers:** Should include `Content-Type: application/json`
   - **Request Body:** Should contain `{"email":"...","password":"..."}`

#### **Console Tab Inspection:**
Look for JavaScript errors like:
- `TypeError: Failed to fetch`
- `CORS policy` errors
- `Unexpected token` errors

### 5. **Backend Logs Analysis**

**Start backend with verbose logging:**
```bash
cd backend
DEBUG=* npm start
```

**Look for these log messages:**
- ✅ `🍃 MongoDB Connected: localhost:27017`
- ✅ `🚀 Server running on port 5001`
- ❌ `Database connection failed`
- ❌ `Login error:` (followed by error details)

### 6. **Test API Endpoints Manually**

#### **Test Health Endpoint:**
```bash
curl http://localhost:5001/health
# Expected: {"status":"OK","message":"Travel API is running"}
```

#### **Test Login Endpoint:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "...",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com"
  }
}
```

**Expected Error Response:**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 7. **Most Likely Root Causes (in order of probability)**

1. **Backend server not running** (90% of cases)
2. **Wrong API URL in frontend .env** (5% of cases)
3. **No test user in database** (3% of cases)
4. **CORS configuration issues** (1% of cases)
5. **Database connection issues** (1% of cases)
@echo off
echo ========================================
echo    LOGIN DEBUGGING SCRIPT
echo ========================================
echo.

echo Step 1: Checking if backend server is running...
curl -s http://localhost:5001/health > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend server is running on port 5001
) else (
    echo ❌ Backend server is NOT running on port 5001
    echo Please start the backend server first: cd backend && npm start
    pause
    exit /b 1
)

echo.
echo Step 2: Testing database connection...
curl -s -X GET "http://localhost:5001/api/auth/me" -H "Authorization: Bearer invalid_token" > temp_response.json 2>&1
if exist temp_response.json (
    echo ✅ API endpoint is accessible
    del temp_response.json
) else (
    echo ❌ API endpoint is not accessible
)

echo.
echo Step 3: Testing auth endpoint directly...
curl -s -X POST "http://localhost:5001/api/auth/login" ^
     -H "Content-Type: application/json" ^
     -d "{\"email\":\"demo@travelhub.com\",\"password\":\"password123\"}" ^
     -o login_test.json

if exist login_test.json (
    echo ✅ Login endpoint responded
    echo Response:
    type login_test.json
    del login_test.json
) else (
    echo ❌ Login endpoint did not respond
)

echo.
echo Step 4: Checking frontend environment...
cd frontend
if exist .env (
    echo ✅ Frontend .env file exists
    echo VITE_API_URL setting:
    findstr "VITE_API_URL" .env
) else (
    echo ❌ Frontend .env file missing
)

echo.
echo Step 5: Checking backend environment...
cd ..\backend
if exist .env (
    echo ✅ Backend .env file exists
    echo PORT setting:
    findstr "PORT" .env
    echo JWT_SECRET setting:
    findstr "JWT_SECRET" .env
    echo MONGODB_URI setting:
    findstr "MONGODB_URI" .env
) else (
    echo ❌ Backend .env file missing
)

echo.
echo ========================================
echo    DEBUGGING COMPLETE
echo ========================================
echo.
echo If you see any ❌ errors above, those need to be fixed first.
echo.
echo Common issues and solutions:
echo 1. Backend not running: cd backend && npm start
echo 2. Wrong API URL: Check VITE_API_URL in frontend/.env
echo 3. Database not connected: Check MONGODB_URI in backend/.env
echo 4. Missing JWT_SECRET: Check JWT_SECRET in backend/.env
echo.
pause
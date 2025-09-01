@echo off
echo ========================================
echo    LOGIN ISSUE DIAGNOSIS
echo ========================================
echo.

echo Installing required dependencies...
cd backend
npm install axios > nul 2>&1

echo.
echo Running comprehensive diagnosis...
node ../diagnose-login.js

echo.
echo ========================================
echo    DIAGNOSIS COMPLETE
echo ========================================
echo.
echo If the diagnosis shows any errors, please fix them and try again.
echo.
echo Quick fixes:
echo 1. Start backend: cd backend && npm start
echo 2. Start frontend: cd frontend && npm run dev  
echo 3. Use test login: test@example.com / password123
echo.
pause
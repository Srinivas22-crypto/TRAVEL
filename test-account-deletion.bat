@echo off
echo Testing Account Deletion Functionality...
echo.
echo This script will:
echo 1. Start the backend server
echo 2. Start the frontend development server
echo 3. Open the application in your browser
echo.
echo To test account deletion:
echo 1. Register a new account or sign in
echo 2. Create some trips in the Route Planner
echo 3. Go to Profile Settings > Account tab
echo 4. Try the Delete Account feature
echo 5. Verify that the account and all data are deleted
echo.
pause

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3

echo Starting frontend server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

timeout /t 5

echo Opening application in browser...
start http://localhost:5173

echo.
echo Both servers are now running!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
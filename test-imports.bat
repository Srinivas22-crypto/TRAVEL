@echo off
echo Testing import resolution...
echo.
echo Checking if the tripService import issue is resolved...
echo.

cd frontend

echo Running TypeScript check...
npx tsc --noEmit --skipLibCheck

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ SUCCESS: All imports resolved correctly!
    echo The tripService.ts import issue has been fixed.
) else (
    echo.
    echo ❌ ERROR: There are still import issues.
    echo Please check the console output above for details.
)

echo.
echo Press any key to continue...
pause > nul
@echo off
echo Seeding trip data...
cd backend
node scripts/seedTrips.js
echo Trip seeding completed!
pause
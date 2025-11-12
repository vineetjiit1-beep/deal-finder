@echo off
cd mobile\capacitor
npm install
call npm run build:web
npx @capacitor/cli create poa.app com.dealfinder.app "Deal Finder" --webDir=build || exit /b 1
npx cap add android || true
npx cap sync android
npx cap open android

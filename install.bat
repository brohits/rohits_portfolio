@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo Install failed. Check that Node.js is installed: node -v
  exit /b 1
)
echo.
echo Success. Start the dev server with:
echo   npm run dev
pause

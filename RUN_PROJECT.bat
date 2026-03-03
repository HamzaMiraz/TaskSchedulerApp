@echo off
echo ==========================================
echo 🚀 STARTING TASK TRACKER SYSTEM...
echo ==========================================

:: 1. CLEAN UP: Kill any old versions of the app running on ports 4200 or 5000-5001
echo [1/3] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4200') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5001') do taskkill /f /pid %%a >nul 2>&1
echo ✅ Clean up complete.

:: 2. Start Backend in a new minimized window
echo [2/3] Starting Backend API...
start "TaskBackend" /min cmd /c "cd /d %~dp0TaskBackend && dotnet run"
timeout /t 5 >nul

:: 3. Start Frontend in a new minimized window
echo [3/3] Starting Frontend Dashboard...
start "TaskFrontend" /min cmd /c "cd /d %~dp0TaskFrontend && npm start"

:: 4. Open Browser
echo 🌍 Opening Dashboard...
start http://localhost:4200

echo ==========================================
echo 🎉 SYSTEM RUNNING!
echo ==========================================
timeout /t 5
exit

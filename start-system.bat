@echo off
echo ========================================================
echo   AI-POWERED REAL-TIME STRAY DOGS MONITORING SYSTEM
echo   GITAM Bengaluru - Capstone Review DS-15
echo ========================================================
echo.
echo [1/2] Starting Backend API Server (Port 5000)...
start "CanineAI-Backend" cmd /k "cd /d D:\AntigravityProjects\stray-dog-monitoring-system\backend && node server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Vite Dev Server (Port 5173)...
start "CanineAI-Frontend" cmd /k "cd /d D:\AntigravityProjects\stray-dog-monitoring-system\frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/

echo.
echo Both services are running!
echo Backend:  http://localhost:5000/
echo Frontend: http://localhost:5173/
echo ========================================================
pause

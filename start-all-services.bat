@echo off
REM ============================================
REM START ALL SERVICES FOR AGENTIC RESTAURANT CHATBOT
REM ============================================
REM This script starts:
REM 1. Express API (Port 5000)
REM 2. Python AI Service (Port 8000)
REM 3. Frontend (Port 5173)

setlocal enabledelayedexpansion

echo.
echo ============================================
echo AGENTIC RESTAURANT CHATBOT - STARTUP SCRIPT
echo ============================================
echo.
echo Starting all services...
echo.

REM Get the root directory
set ROOT_DIR=%~dp0

echo [1/3] Starting Express API Service (Port 5000)...
start "Express API - Port 5000" cmd /k "cd /d %ROOT_DIR%services\api && npm run dev"

timeout /t 3 /nobreak

echo [2/3] Starting Python AI Service (Port 8000)...
start "Python AI Service - Port 8000" cmd /k "cd /d %ROOT_DIR%services\ai && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak

echo [3/3] Starting Frontend Web App (Port 5173)...
start "Frontend Web App - Port 5173" cmd /k "cd /d %ROOT_DIR%packages\@restaurant\web && npm run dev"

echo.
echo ============================================
echo All services started!
echo ============================================
echo.
echo Services:
echo  • Backend API: http://localhost:5000
echo  • AI Service: http://localhost:8000/docs
echo  • Frontend: http://localhost:5173
echo.
echo Press CTRL+C in each window to stop services
echo ============================================
echo.

pause

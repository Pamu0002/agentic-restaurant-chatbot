@echo off
REM ============================================
REM START PYTHON AI SERVICE
REM ============================================
REM This script starts the FastAPI AI service with proper configuration

echo.
echo ============================================
echo Starting Python AI Service (Port 8000)
echo ============================================
echo.

REM Navigate to the AI service directory
cd /d "%~dp0services\ai"

REM Load environment variables and start the service
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

REM If the service crashes, keep the window open
pause

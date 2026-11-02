@echo off
setlocal
chcp 65001 >nul
title Ravi - server on port 7002
cd /d "%~dp0"

set "PORT=7002"
set "PY="
where py >nul 2>nul && set "PY=py -3"
if not defined PY where python >nul 2>nul && set "PY=python"
if not defined PY (
  echo.
  echo  Python 3 was not found.
  echo  Install it from https://www.python.org/downloads/
  echo  and tick "Add python.exe to PATH" during setup, then run this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo  ============================================
echo   Ravi is online on 0.0.0.0:%PORT%
echo  ============================================
echo.
echo  On this computer:
echo    Home           http://localhost:%PORT%/
echo    Dashboard      http://localhost:%PORT%/ravi/
echo    Onboarding     http://localhost:%PORT%/onboarding/
echo    Decision Room  http://localhost:%PORT%/decision-room/
echo.
echo  From other devices on the same network:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do for /f "tokens=*" %%b in ("%%a") do echo    http://%%b:%PORT%/
echo.
echo  If Windows Firewall asks, allow Python on Private networks.
echo  Close this window or press Ctrl+C to stop the server.
echo.

start "" /min cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:%PORT%/"
%PY% -m http.server %PORT% --bind 0.0.0.0

echo.
echo  The server stopped.
pause

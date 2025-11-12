@echo off
set API=%1
if "%API%"=="" (
  echo Usage: set_api_base_windows.bat https://your-api.onrender.com
  exit /b 1
)
echo REACT_APP_API_BASE=%API%/api> client\.env.local
echo Done.

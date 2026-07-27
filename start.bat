@echo off
cd /d "%~dp0"
echo Запускаю Рацион на http://localhost:5173 ...
start "" "http://localhost:5173/"
node server.js

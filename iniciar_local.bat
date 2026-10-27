@echo off
chcp 65001 > nul
echo ================================================================
echo   GEOPORTAL MUNICIPAL DE TEÓFILO OTONI - MG (WebGIS)
echo   Concepção: Prof. Dr. Sérgio Lana Morais (IFNMG)
echo ================================================================
echo.
echo Iniciando servidor local na porta 8080...
echo.

set PYTHON_CMD="C:\Program Files\QGIS 3.40.6\apps\Python312\python.exe"

if exist %PYTHON_CMD% (
    start http://localhost:8080/index.html
    %PYTHON_CMD% -m http.server 8080
) else (
    echo Python do QGIS não localizado. Tentando python padrão...
    start http://localhost:8080/index.html
    python -m http.server 8080
)

pause

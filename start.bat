@echo off
title Teknik Depo Sunucusu
echo ===================================================
echo     TEKNIK DEPO SUNUCUSU BASLATILIYOR...
echo ===================================================
echo.
cd /d "%~dp0"
if not exist "node_modules" (
    echo Ilk kurulum paketleri yukleniyor...
    call npm install
)
if not exist "client\dist" (
    echo Frontend derleniyor...
    call npm run build
)
echo.
echo Sunucu aciliyor: http://localhost:3000
echo Tarayicinizdan http://localhost:3000 adresine gidebilirsiniz.
echo Ayni Wi-Fi'daki telefonlar icin: http://BILGISAYAR_IP_ADRESINIZ:3000
echo.
node server/index.js
pause

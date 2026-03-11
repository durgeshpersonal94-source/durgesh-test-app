@echo off
REM MongoDB Local Setup Script for Windows
REM This script sets up local MongoDB for development

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Shopify App - Local MongoDB Setup
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [FAILED] Docker is not installed.
    echo Please install Docker Desktop:
    echo   https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo.

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo Creating .env.local from template...
    copy .env.local.example .env.local >nul
    echo [OK] .env.local created
    echo.
    echo WARNING: Update .env.local with your Shopify credentials:
    echo   - SHOPIFY_API_KEY
    echo   - SHOPIFY_API_SECRET
    echo   - SHOPIFY_APP_URL (if different from http://localhost:3000)
    echo.
) else (
    echo [OK] .env.local already exists
    echo.
)

REM Stopping existing containers if running
docker-compose down >nul 2>&1

REM Start MongoDB containers
echo Starting MongoDB container...
docker-compose up -d mongodb mongoexpress

REM Wait for MongoDB to initialize
echo Waiting for MongoDB to initialize...
timeout /t 5 /nobreak

REM Display connection info
echo.
echo ==========================================
echo [SUCCESS] Setup Complete!
echo ==========================================
echo.
echo MongoDB Access:
echo   Connection String: mongodb://shopify_user:shopify_password@localhost:27017/shopify-app?authSource=admin
echo   Host: localhost
echo   Port: 27017
echo   Username: shopify_user
echo   Password: shopify_password
echo   Database: shopify-app
echo.
echo MongoDB Express ^(Web UI^):
echo   URL: http://localhost:8081
echo   Username: admin
echo   Password: admin
echo.
echo Next Steps:
echo   1. Update .env.local with your Shopify credentials
echo   2. Install dependencies: npm install
echo   3. Start dev server: npm run dev
echo   4. Test API: curl http://localhost:3000/api/addresses.mongo?customerId=test
echo.
echo To stop MongoDB:
echo   docker-compose down
echo.
echo To remove all data:
echo   docker-compose down -v
echo.
pause

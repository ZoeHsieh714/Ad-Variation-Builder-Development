# Stop all running services first
Write-Host "Stopping existing services..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*uvicorn*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

$frontendPath = Join-Path $PSScriptRoot "frontend"
$backendPath = Join-Path $PSScriptRoot "backend"
$aiServicePath = Join-Path $PSScriptRoot "ai-service"

Write-Host "Starting Ad Variation Builder Services..." -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm start"

# Start AI Service
Write-Host "Starting AI Service..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$aiServicePath'; python main.py"

# Start Frontend
Write-Host "Starting Frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "All services started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:3000"
Write-Host "AI Service: http://localhost:8000"
Write-Host ""
Write-Host "NOTE: Please refresh your browser (Ctrl+F5) to see the new design!" -ForegroundColor Cyan

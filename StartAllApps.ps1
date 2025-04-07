Write-Host "Starting all applications..." -ForegroundColor Green

# Function to check if a port is in use
function Test-PortInUse {
    param(
        [int]$Port
    )
    
    $connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | 
                   Where-Object { $_.LocalPort -eq $Port }
    
    return ($connections -ne $null)
}

# Function to start an application if not already running
function Start-Application {
    param(
        [string]$Name,
        [string]$Directory,
        [int]$Port,
        [string]$Command = "npm start"
    )

    Write-Host "Checking $Name on port $Port..." -NoNewline

    if (Test-PortInUse -Port $Port) {
        Write-Host " Already running" -ForegroundColor Yellow
        return
    }

    Write-Host " Starting..." -ForegroundColor Cyan
    
    # Create a new PowerShell window and run the command
    Start-Process powershell -ArgumentList "-Command", "Set-Location '$Directory'; Write-Host 'Starting $Name on port $Port...'; $Command; Read-Host 'Press Enter to exit'"
    
    # Wait a moment to allow the application to start
    Start-Sleep -Seconds 2
}

# Set paths relative to the script location
$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendShellDir = Join-Path $baseDir "Frontend-Shell"
$statusUpdateAppDir = Join-Path $baseDir "status-update-app" 
$releaseNotesAppDir = Join-Path $baseDir "release-notes-app"
$memeGeneratorAppDir = Join-Path $baseDir "meme-generator-app"
$apiServerDir = Join-Path $baseDir "api-server"

# Start each application
Start-Application -Name "Frontend Shell" -Directory $frontendShellDir -Port 4200
Start-Application -Name "Status Update App" -Directory $statusUpdateAppDir -Port 4201
Start-Application -Name "Release Notes App" -Directory $releaseNotesAppDir -Port 4202
Start-Application -Name "Meme Generator App" -Directory $memeGeneratorAppDir -Port 4203
Start-Application -Name "API Server" -Directory $apiServerDir -Port 3000

Write-Host "All applications started!" -ForegroundColor Green
Write-Host "Frontend Shell:     http://localhost:4200" -ForegroundColor Cyan
Write-Host "Status Update App:  http://localhost:4201" -ForegroundColor Cyan
Write-Host "Release Notes App:  http://localhost:4202" -ForegroundColor Cyan
Write-Host "Meme Generator App: http://localhost:4203" -ForegroundColor Cyan
Write-Host "API Server:         http://localhost:3000" -ForegroundColor Cyan
# RadarOfertas — Script de Arranque
# Executa este ficheiro no PowerShell para iniciar todos os servidores

Write-Host "📡 A iniciar RadarOfertas..." -ForegroundColor Cyan

$root = $PSScriptRoot
$tsxPath = Join-Path $root "node_modules\.pnpm\tsx@4.23.13\node_modules\tsx\dist\cli.mjs"
$nextPath = Join-Path $root "node_modules\.pnpm\next@15.5.25_@types+node@22_fa531afda611c6bbe1c3802fdc2c68ee\node_modules\next\dist\bin\next"

# Variáveis de ambiente da Neon
$env:DATABASE_URL = "postgresql://neondb_owner:npg_1klPRVn0hEqf@ep-gentle-snow-zawbvp2f-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
$env:REDIS_URL = "redis://localhost:6379"
$env:PORT = "3001"
$env:ADMIN_API_KEY = "radar_admin_secret_change_in_production"
$env:NODE_ENV = "development"
$env:NEXT_PUBLIC_API_URL = "http://localhost:3001"
$env:NEXT_PUBLIC_SITE_URL = "http://localhost:3000"

# Iniciar API em background
Write-Host "⚡ A iniciar API em :3001..." -ForegroundColor Yellow
$apiDir = Join-Path $root "apps\api"
$apiJob = Start-Job -ScriptBlock {
    param($dir, $tsx)
    Set-Location $dir
    $env:DATABASE_URL = $using:env:DATABASE_URL
    $env:PORT = "3001"
    $env:ADMIN_API_KEY = $using:env:ADMIN_API_KEY
    $env:NODE_ENV = "development"
    node $tsx watch src/index.ts
} -ArgumentList $apiDir, $tsxPath

# Iniciar Next.js em background
Write-Host "🌐 A iniciar Frontend em :3000..." -ForegroundColor Yellow
$webDir = Join-Path $root "apps\web"
$webJob = Start-Job -ScriptBlock {
    param($dir, $next)
    Set-Location $dir
    $env:NEXT_PUBLIC_API_URL = "http://localhost:3001"
    $env:NEXT_PUBLIC_SITE_URL = "http://localhost:3000"
    node $next dev --port 3000
} -ArgumentList $webDir, $nextPath

Write-Host ""
Write-Host "✅ Servidores a iniciar..." -ForegroundColor Green
Write-Host "   🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   ⚡ API:      http://localhost:3001" -ForegroundColor Cyan
Write-Host "   🔧 Admin:    http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prima Ctrl+C para parar." -ForegroundColor Gray
Write-Host ""

# Aguardar e mostrar logs
try {
    while ($true) {
        Start-Sleep -Seconds 3
        $apiOut = Receive-Job $apiJob
        $webOut = Receive-Job $webJob
        if ($apiOut) { Write-Host "[API] $apiOut" -ForegroundColor DarkYellow }
        if ($webOut) { Write-Host "[WEB] $webOut" -ForegroundColor DarkCyan }
    }
} finally {
    Stop-Job $apiJob, $webJob
    Remove-Job $apiJob, $webJob
    Write-Host "🛑 Servidores parados." -ForegroundColor Red
}

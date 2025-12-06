Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTICO: Frontend (Vercel) + Backend (Railway)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar archivos clave
Write-Host "1. Archivos locales..." -ForegroundColor Yellow

$corsPath = "c:\Users\Marlon Alexis CC\Downloads\Desarrollo_web\src\main\java\ProyectoFinal\ProyectoFinal_Ander\config\CorsConfig.java"
if (Test-Path $corsPath) {
    Write-Host "  ✓ CorsConfig.java existe" -ForegroundColor Green
} else {
    Write-Host "  ✗ CorsConfig.java NO existe" -ForegroundColor Red
}

$vercelJsonPath = "c:\Users\Marlon Alexis CC\Downloads\Desarrollo_web\seguridad-frontend\vercel.json"
if (Test-Path $vercelJsonPath) {
    Write-Host "  ✓ vercel.json existe" -ForegroundColor Green
} else {
    Write-Host "  ✗ vercel.json NO existe" -ForegroundColor Red
}

# 2. Verificar dist
Write-Host ""
Write-Host "2. Frontend build..." -ForegroundColor Yellow
$distPath = "c:\Users\Marlon Alexis CC\Downloads\Desarrollo_web\seguridad-frontend\dist"
if (Test-Path $distPath) {
    Write-Host "  ✓ dist/ existe" -ForegroundColor Green
} else {
    Write-Host "  ✗ dist/ NO existe (ejecutar: npm run build)" -ForegroundColor Red
}

# 3. Git status
Write-Host ""
Write-Host "3. Git status..." -ForegroundColor Yellow
cd 'c:\Users\Marlon Alexis CC\Downloads\Desarrollo_web'
$lastCommit = (git log --oneline -1) 2>$null
if ($lastCommit) {
    Write-Host "  ✓ Último commit: $lastCommit" -ForegroundColor Green
} else {
    Write-Host "  ✗ No hay commits o Git no funciona" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PASOS A HACER MANUALMENTE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ve a https://railway.app/dashboard" -ForegroundColor Yellow
Write-Host "   → Tu proyecto → Deployments" -ForegroundColor Gray
Write-Host "   → ¿Dice ✓ Success?" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Obtén la URL de Railway:" -ForegroundColor Yellow
Write-Host "   → Settings → Domain → copia la URL" -ForegroundColor Gray
Write-Host "   → Ejemplo: https://proyectofinal-production.up.railway.app" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Ve a https://vercel.com/dashboard" -ForegroundColor Yellow
Write-Host "   → Tu proyecto → Settings → Environment Variables" -ForegroundColor Gray
Write-Host "   → Edita VITE_API_URL con la URL de Railway del paso 2" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Redeploy en Vercel:" -ForegroundColor Yellow
Write-Host "   → Deployments → último deployment → Redeploy" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Prueba:" -ForegroundColor Yellow
Write-Host "   → Abre tu app en Vercel" -ForegroundColor Gray
Write-Host "   → F12 (DevTools) → Network → intenta login" -ForegroundColor Gray
Write-Host "   → ¿Las llamadas a API dan 200 OK?" -ForegroundColor Gray
Write-Host ""

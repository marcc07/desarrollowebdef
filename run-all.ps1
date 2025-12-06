# Ejecuta los scripts existentes `iniciar-backend.bat` y `iniciar-frontend.bat` en ventanas separadas
$base = Split-Path -Parent $MyInvocation.MyCommand.Definition
$backend = Join-Path $base 'iniciar-backend.bat'
$frontend = Join-Path $base 'iniciar-frontend.bat'

if (-not (Test-Path $backend)) {
    Write-Error "No se encontró $backend"
    exit 1
}
if (-not (Test-Path $frontend)) {
    Write-Error "No se encontró $frontend"
    exit 1
}

Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "`"$backend`""
Start-Process -FilePath "cmd.exe" -ArgumentList "/k", "`"$frontend`""

Write-Host "Se han abierto las ventanas para Backend y Frontend." -ForegroundColor Green

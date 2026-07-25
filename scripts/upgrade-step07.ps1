$path = "scripts\step07-ui.ps1"

if (!(Test-Path $path)) {
    Write-Host "? $path not found." -ForegroundColor Red
    exit 1
}

$content = Get-Content $path -Raw

$content = $content -replace 'Test-Path \$file', 'Test-Path -LiteralPath $file'
$content = $content -replace 'Get-Item \$file', 'Get-Item -LiteralPath $file'

Set-Content -Path $path -Value $content

Write-Host ""
Write-Host "? step07-ui.ps1 upgraded successfully." -ForegroundColor Green

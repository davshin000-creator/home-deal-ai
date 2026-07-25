$path = "app\api\trading\ask\route.ts"

if (-not (Test-Path $path)) {
    Write-Host ""
    Write-Host "✅ route.ts does not exist." -ForegroundColor Green
    exit
}

$item = Get-Item $path
$content = Get-Content $path -Raw

Write-Host ""
Write-Host "Path: $path"
Write-Host "Size: $($item.Length) bytes"

if ($item.Length -eq 0 -or [string]::IsNullOrWhiteSpace($content)) {

    $backupDir = ".backups"
    New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

    Copy-Item $path "$backupDir\ask-route-empty.ts" -Force
    Remove-Item $path -Force

    Write-Host ""
    Write-Host "✅ Empty route deleted." -ForegroundColor Green
}
else {

    Write-Host ""
    Write-Host "===== FILE CONTENT ====="
    Get-Content $path
    Write-Host "========================"

}

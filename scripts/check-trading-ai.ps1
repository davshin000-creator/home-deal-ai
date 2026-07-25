$path = "components\trading\TradingAI.tsx"

if (!(Test-Path $path)) {
    Write-Host ""
    Write-Host "❌ TradingAI.tsx not found" -ForegroundColor Red
    exit
}

$item = Get-Item $path
$content = Get-Content $path -Raw

Write-Host ""
Write-Host "File : $path"
Write-Host "Size : $($item.Length) bytes"

if ($item.Length -eq 0 -or [string]::IsNullOrWhiteSpace($content)) {

    Write-Host ""
    Write-Host "❌ File is EMPTY" -ForegroundColor Red

}
elseif ($content -match "export\s+default") {

    Write-Host ""
    Write-Host "✅ export default detected." -ForegroundColor Green

}
else {

    Write-Host ""
    Write-Host "⚠ File exists but has NO default export." -ForegroundColor Yellow

}

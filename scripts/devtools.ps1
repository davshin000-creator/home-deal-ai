function Backup-File {
    param([string]$Path)

    if (Test-Path -LiteralPath $Path) {

        $backup = ".backups"

        New-Item -ItemType Directory -Force -Path $backup | Out-Null

        $name = Split-Path $Path -Leaf

        Copy-Item -LiteralPath $Path -Destination "$backup\$name.bak" -Force
    }
}

function Write-CodeFile {

    param(
        [string]$Path,
        [string]$Content
    )

    Backup-File $Path

    $dir = Split-Path -LiteralPath $Path

    New-Item -ItemType Directory -Force -Path $dir | Out-Null

    [System.IO.File]::WriteAllText(
        (Resolve-Path $dir).Path + "\" + (Split-Path $Path -Leaf),
        $Content,
        [System.Text.UTF8Encoding]::new($false)
    )

    Write-Host "Created $Path" -ForegroundColor Green
}

Write-Host ""
Write-Host "Dev tools upgraded." -ForegroundColor Cyan

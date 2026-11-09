# Build script para empacotar a extensão para publicação na Chrome Web Store
$ErrorActionPreference = "Stop"

$sourceDir = $PSScriptRoot
$manifestPath = Join-Path $sourceDir "manifest.json"

if (-not (Test-Path $manifestPath)) {
    Write-Error "manifest.json não encontrado em $sourceDir"
}

# Ler versão dinamicamente do manifest.json
$manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
$version = $manifest.version

$distDir = Join-Path $sourceDir "dist"
$zipPath = Join-Path $distDir "watchlist-organizer-crunchyroll-v$version.zip"
$tempDir = Join-Path $distDir "temp_package"

# Criar pasta dist limpa
if (Test-Path $distDir) {
    Remove-Item -Path $distDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Write-Host "📦 Preparando arquivos para publicação da versão v$version..." -ForegroundColor Cyan

# Copiar apenas os arquivos oficiais da extensão
Copy-Item (Join-Path $sourceDir "manifest.json") $tempDir
Copy-Item (Join-Path $sourceDir "content.js") $tempDir
Copy-Item (Join-Path $sourceDir "content.css") $tempDir
Copy-Item (Join-Path $sourceDir "icons") $tempDir -Recurse
Copy-Item (Join-Path $sourceDir "popup") $tempDir -Recurse
Copy-Item (Join-Path $sourceDir "_locales") $tempDir -Recurse

# Compactar em ZIP
Write-Host "🗜️ Gerando arquivo ZIP em: $zipPath" -ForegroundColor Cyan
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force

# Remover pasta temporária
Remove-Item -Path $tempDir -Recurse -Force

$zipSize = (Get-Item $zipPath).Length / 1KB
Write-Host ("✅ Pacote v{0} pronto com sucesso! ({1:N1} KB)" -f $version, $zipSize) -ForegroundColor Green
Write-Host "Envie o arquivo '$zipPath' no painel de desenvolvedores do Chrome / Edge." -ForegroundColor Yellow

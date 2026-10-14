param([ValidateSet('dev', 'build', 'test', 'typecheck', 'preview')][string]$Task = 'dev')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$cacheRoot = Join-Path $env:LOCALAPPDATA 'mello-mosna-site'
New-Item -ItemType Directory -Path $cacheRoot -Force | Out-Null
# Google Drive virtual disks can reject npm's many concurrent package writes.
# Keep dependencies on the local disk; the editable source stays in this project.
foreach ($directory in @('src', 'public', 'tests', 'scripts', 'google-sites')) {
  $sourceDirectory = Join-Path $projectRoot $directory
  if (Test-Path -LiteralPath $sourceDirectory) { Copy-Item -LiteralPath $sourceDirectory -Destination $cacheRoot -Recurse -Force }
}
foreach ($file in @('package.json', 'package-lock.json', 'tsconfig.json', 'index.html', 'playwright.config.ts', 'site.config.json', 'vite.config.ts')) {
  $sourceFile = Join-Path $projectRoot $file
  if (Test-Path -LiteralPath $sourceFile) { Copy-Item -LiteralPath $sourceFile -Destination $cacheRoot -Force }
}
Push-Location $cacheRoot
try {
  $packageHash = (Get-FileHash -LiteralPath 'package.json').Hash
  $hashFile = Join-Path $cacheRoot '.installed-package-hash'
  $installedHash = if (Test-Path -LiteralPath $hashFile) { Get-Content -LiteralPath $hashFile -Raw } else { '' }
  if ($installedHash.Trim() -ne $packageHash -or !(Test-Path -LiteralPath 'node_modules/vite/package.json')) {
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar dependências.' }
    Set-Content -LiteralPath $hashFile -Value $packageHash
  }
  if ($Task -eq 'test') {
    & npx.cmd playwright install chromium firefox webkit
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao instalar o navegador de testes.' }
  }
  & npm.cmd run $Task
  if ($LASTEXITCODE -ne 0) { throw "Falha na tarefa $Task." }
  if ($Task -eq 'build') { Copy-Item -LiteralPath (Join-Path $cacheRoot 'dist') -Destination $projectRoot -Recurse -Force }
  if ($Task -eq 'test') { Copy-Item -LiteralPath (Join-Path $cacheRoot 'test-results') -Destination $projectRoot -Recurse -Force }
  if ($Task -in @('test', 'build')) {
    Copy-Item -LiteralPath (Join-Path $cacheRoot 'google-sites/Avaliacoes.html') -Destination (Join-Path $projectRoot 'google-sites/Avaliacoes.html') -Force
    Copy-Item -LiteralPath (Join-Path $cacheRoot 'public/reviews-preview.html') -Destination (Join-Path $projectRoot 'public/reviews-preview.html') -Force
  }
  Copy-Item -LiteralPath (Join-Path $cacheRoot 'package-lock.json') -Destination $projectRoot -Force
} finally { Pop-Location }

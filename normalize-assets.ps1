# Normalize project folders for static hosting (safe ASCII paths)
# Run from the repository root:
#   powershell -ExecutionPolicy Bypass -File .\normalize-assets.ps1

$ErrorActionPreference = 'Stop'

function Ensure-Dir([string]$p) {
  if (-not (Test-Path $p)) {
    New-Item -ItemType Directory -Path $p | Out-Null
  }
}

$projects = Join-Path $PSScriptRoot 'assets\img\projects'
if (-not (Test-Path $projects)) { throw "Cannot find: $projects" }

# eSim: move from "Puntodigital" -> "esim"
$srcEsim = Join-Path $projects 'Puntodigital'
$dstEsim = Join-Path $projects 'esim'
Ensure-Dir $dstEsim
if (Test-Path $srcEsim) {
  Get-ChildItem -Path $srcEsim -File -Filter 'esim_*' | ForEach-Object {
    Move-Item -Force -Path $_.FullName -Destination $dstEsim
  }
}

# The Ferm: move from the previous unicode folder -> "the-ferm"
$dstFerm = Join-Path $projects 'the-ferm'
Ensure-Dir $dstFerm

# Find any folder that contains "the-ferm_" assets (handles the old encoded folder name)
Get-ChildItem -Path $projects -Directory | ForEach-Object {
  $maybe = $_.FullName
  $hit = Get-ChildItem -Path $maybe -File -Filter 'the-ferm_*' -ErrorAction SilentlyContinue
  if ($hit) {
    $hit | ForEach-Object {
      Move-Item -Force -Path $_.FullName -Destination $dstFerm
    }
  }
}

# Optional cleanup: remove empty folders we no longer need
@($srcEsim) | ForEach-Object {
  if (Test-Path $_) {
    if (-not (Get-ChildItem -Path $_ -Recurse -Force | Select-Object -First 1)) {
      Remove-Item -Force -Recurse -Path $_
    }
  }
}

Write-Host "Done. Projects folder is normalized:" -ForegroundColor Green
Write-Host " - assets/img/projects/esim"
Write-Host " - assets/img/projects/the-ferm"

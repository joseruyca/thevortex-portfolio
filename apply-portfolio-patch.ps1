# Run this from the ROOT of your portfolio (where index.html lives)
$ErrorActionPreference = "Stop"

function Ensure-Dir($p){ if(-not (Test-Path $p)){ New-Item -ItemType Directory -Force -Path $p | Out-Null } }

# 1) Copy patched files (this script assumes you extracted the patch zip over your site root)
Write-Host "✅ Patch files copied (if you extracted the zip over the site root)." -ForegroundColor Green

# 2) Normalize project asset folders to safe ASCII names
$projectsRoot = Join-Path $PSScriptRoot "assets\img\projects"
Ensure-Dir $projectsRoot

# Source candidates (depending on what your unzip created)
$srcEsimCandidates = @("Puntodigital", "PuntoDigital", "punto-digital")
$srcFermCandidates = @("Lūmiara", "Lumiara", "L#U016bmiara", "lumiara")

$dstEsim = Join-Path $projectsRoot "esim"
$dstFerm = Join-Path $projectsRoot "the-ferm"
Ensure-Dir $dstEsim
Ensure-Dir $dstFerm

foreach($c in $srcEsimCandidates){
  $src = Join-Path $projectsRoot $c
  if(Test-Path $src){
    Get-ChildItem -Path $src -File -Filter "esim_*" -ErrorAction SilentlyContinue | ForEach-Object {
      Move-Item -Force $_.FullName (Join-Path $dstEsim $_.Name)
    }
  }
}

foreach($c in $srcFermCandidates){
  $src = Join-Path $projectsRoot $c
  if(Test-Path $src){
    Get-ChildItem -Path $src -File -Filter "the-ferm_*" -ErrorAction SilentlyContinue | ForEach-Object {
      Move-Item -Force $_.FullName (Join-Path $dstFerm $_.Name)
    }
  }
}

# Remove empty legacy folders if they exist
foreach($c in ($srcEsimCandidates + $srcFermCandidates)){
  $p = Join-Path $projectsRoot $c
  if(Test-Path $p){
    try {
      if((Get-ChildItem $p -Recurse | Measure-Object).Count -eq 0){ Remove-Item -Force -Recurse $p }
    } catch {}
  }
}

Write-Host "✅ Folder normalization done: projects/esim and projects/the-ferm" -ForegroundColor Green

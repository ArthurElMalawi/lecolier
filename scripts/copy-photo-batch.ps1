# Copie un lot de photos livré « à plat » (dossiers nommés en libellés) vers le dossier
# source de l'ingestion, dont l'arborescence suit les slugs du menu.
#
#   powershell -File scripts/copy-photo-batch.ps1 -Source "<dossier livré>" [-Execute]
#
# Sans -Execute, le script n'affiche que ce qu'il ferait. Rien n'est écrasé : un fichier
# déjà présent à destination est signalé et laissé tel quel.
param(
  [Parameter(Mandatory = $true)][string]$Source,
  [string]$Dest = "C:\Users\arthu\Pictures\lecolier\catalogue-v1",
  [switch]$Execute
)

$ErrorActionPreference = "Stop"

# Les fichiers nommés par référence sont replacés par le script d'ingestion : le dossier
# de destination n'a donc besoin de désigner que la gamme.
function Get-Target {
  param([string]$Folder, [string]$FileName)

  if ($Folder -like "Bouteilles*") {
    if ($FileName -like "IMG_20241014*") { return "accessoires\gourdes\gourdes-bpa" }
    if ($FileName -like "IMG_20241015*") { return "accessoires\sacs-kraft-plv\sacs-kraft" }
    return $null
  }
  if ($Folder -like "Gamme Polypro Premium*")   { return "nos-cahiers\gamme-polypro-premium" }
  if ($Folder -like "Gamme Polypro Classique*") { return "nos-cahiers\gamme-polypro-classique" }
  if ($Folder -like "Gamme Cartonn*Plume*")     { return "nos-cahiers\gamme-cartonnee-plume\gamme-plume" }
  if ($Folder -like "Cahiers Sp*cialis*")       { return "nos-cahiers\cahiers-specialises" }
  if ($Folder -like "Prises de Notes*")         { return "nos-cahiers\prises-de-notes-spirales\cahiers-spirales-8-sujets" }
  if ($Folder -eq "Nos Cahiers")                { return "nos-cahiers" }
  return $null
}

$files = Get-ChildItem $Source -Recurse -File | Where-Object { $_.Extension -match '^\.(png|jpe?g|webp)$' }
$plan = @{}
$skipped = @()

foreach ($f in $files) {
  $target = Get-Target -Folder $f.Directory.Name -FileName $f.Name
  if ($null -eq $target) { $skipped += "$($f.Directory.Name)\$($f.Name)"; continue }
  if (-not $plan.ContainsKey($target)) { $plan[$target] = @() }
  $plan[$target] += $f
}

foreach ($target in ($plan.Keys | Sort-Object)) {
  $group = $plan[$target]
  $full = Join-Path $Dest $target
  $existing = @($group | Where-Object { Test-Path (Join-Path $full $_.Name) })
  "{0,4} -> {1}{2}" -f $group.Count, $target, $(if ($existing.Count) { "   ($($existing.Count) déjà présents, conservés)" } else { "" })

  if ($Execute) {
    if (-not (Test-Path $full)) { New-Item -ItemType Directory -Force $full | Out-Null }
    foreach ($f in $group) {
      $to = Join-Path $full $f.Name
      if (-not (Test-Path $to)) { Copy-Item $f.FullName $to }
    }
  }
}

if ($skipped.Count) {
  ""
  "$($skipped.Count) fichier(s) sans destination :"
  $skipped | ForEach-Object { "  ! $_" }
}
""
if ($Execute) { "Copie effectuée." } else { "Simulation — relancer avec -Execute pour copier." }

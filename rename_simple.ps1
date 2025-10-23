# Simple file renaming script

# AI folder
$aiFiles = Get-ChildItem "e:\Code\gallery_web\images\ai" -File | Sort-Object Name
for ($i = 0; $i -lt $aiFiles.Count; $i++) {
    $newName = "ai" + ($i + 1) + ".jpg"
    Rename-Item -Path $aiFiles[$i].FullName -NewName $newName
}
Write-Host "AI folder done: " $aiFiles.Count " files"

# Friends folder
$friendsFiles = Get-ChildItem "e:\Code\gallery_web\images\friends" -File | Sort-Object Name
for ($i = 0; $i -lt $friendsFiles.Count; $i++) {
    $newName = "friends" + ($i + 1) + ".jpg"
    Rename-Item -Path $friendsFiles[$i].FullName -NewName $newName
}
Write-Host "Friends folder done: " $friendsFiles.Count " files"

# Scr folder
$scrFiles = Get-ChildItem "e:\Code\gallery_web\images\scr" -File | Sort-Object Name
for ($i = 0; $i -lt $scrFiles.Count; $i++) {
    $newName = "scr" + ($i + 1) + ".jpg"
    Rename-Item -Path $scrFiles[$i].FullName -NewName $newName
}
Write-Host "Scr folder done: " $scrFiles.Count " files"

# Self folder
$selfFiles = Get-ChildItem "e:\Code\gallery_web\images\self" -File | Sort-Object Name
for ($i = 0; $i -lt $selfFiles.Count; $i++) {
    $newName = "self" + ($i + 1) + ".jpg"
    Rename-Item -Path $selfFiles[$i].FullName -NewName $newName
}
Write-Host "Self folder done: " $selfFiles.Count " files"

# Work folder
$workFiles = Get-ChildItem "e:\Code\gallery_web\images\work" -File | Sort-Object Name
for ($i = 0; $i -lt $workFiles.Count; $i++) {
    $newName = "work" + ($i + 1) + ".jpg"
    Rename-Item -Path $workFiles[$i].FullName -NewName $newName
}
Write-Host "Work folder done: " $workFiles.Count " files"
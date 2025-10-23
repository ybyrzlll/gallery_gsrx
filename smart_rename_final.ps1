# Smart file renaming script - only rename files that don't match the pattern

function Rename-FilesInFolder {
    param($folderPath, $prefix)
    
    $files = Get-ChildItem $folderPath -File | Sort-Object Name
    $count = 1
    $renamedCount = 0
    
    foreach ($file in $files) {
        # Check if file already matches the pattern (prefix + number + .jpg)
        $pattern = "^" + $prefix + "\\d+\\.jpg$"
        if ($file.Name -match $pattern) {
            # File already matches the pattern, skip it
            Write-Host "Skipping (already correct): $($file.Name)"
            $count++
            continue
        }
        
        # Generate new name
        $newName = $prefix + $count + ".jpg"
        
        # Check if target file already exists
        while (Test-Path (Join-Path $folderPath $newName)) {
            $count++
            $newName = $prefix + $count + ".jpg"
        }
        
        # Rename the file
        Write-Host "Renaming: $($file.Name) -> $newName"
        Rename-Item -Path $file.FullName -NewName $newName
        $renamedCount++
        $count++
    }
    
    Write-Host "$prefix folder: Renamed $renamedCount files out of $($files.Count) total files"
    return $renamedCount
}

# Rename files in each folder
$totalRenamed = 0
$totalRenamed += Rename-FilesInFolder -folderPath "e:\Code\gallery_web\images\ai" -prefix "ai"
$totalRenamed += Rename-FilesInFolder -folderPath "e:\Code\gallery_web\images\friends" -prefix "friends"
$totalRenamed += Rename-FilesInFolder -folderPath "e:\Code\gallery_web\images\scr" -prefix "scr"
$totalRenamed += Rename-FilesInFolder -folderPath "e:\Code\gallery_web\images\self" -prefix "self"
$totalRenamed += Rename-FilesInFolder -folderPath "e:\Code\gallery_web\images\work" -prefix "work"

Write-Host "Total files renamed: $totalRenamed"
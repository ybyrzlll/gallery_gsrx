# 重命名ai文件夹中的文件
$aiPath = "e:\Code\gallery_web\images\ai"
$files = Get-ChildItem -Path $aiPath -File | Sort-Object Name
$count = 1

foreach ($file in $files) {
    $newName = "ai" + $count + ".jpg"
    if ($file.Name -ne $newName) {
        Rename-Item -Path $file.FullName -NewName $newName
    }
    $count++
}

Write-Host "AI文件夹重命名完成，共重命名 $($files.Count) 个文件"

# 重命名friends文件夹中的文件
$friendsPath = "e:\Code\gallery_web\images\friends"
$files = Get-ChildItem -Path $friendsPath -File | Sort-Object Name
$count = 1

foreach ($file in $files) {
    $newName = "friends" + $count + ".jpg"
    if ($file.Name -ne $newName) {
        Rename-Item -Path $file.FullName -NewName $newName
    }
    $count++
}

Write-Host "Friends文件夹重命名完成，共重命名 $($files.Count) 个文件"

# 重命名scr文件夹中的文件
$scrPath = "e:\Code\gallery_web\images\scr"
$files = Get-ChildItem -Path $scrPath -File | Sort-Object Name
$count = 1

foreach ($file in $files) {
    $newName = "scr" + $count + ".jpg"
    if ($file.Name -ne $newName) {
        Rename-Item -Path $file.FullName -NewName $newName
    }
    $count++
}

Write-Host "Scr文件夹重命名完成，共重命名 $($files.Count) 个文件"

# 重命名self文件夹中的文件
$selfPath = "e:\Code\gallery_web\images\self"
$files = Get-ChildItem -Path $selfPath -File | Sort-Object Name
$count = 1

foreach ($file in $files) {
    $newName = "self" + $count + ".jpg"
    if ($file.Name -ne $newName) {
        Rename-Item -Path $file.FullName -NewName $newName
    }
    $count++
}

Write-Host "Self文件夹重命名完成，共重命名 $($files.Count) 个文件"

# 重命名work文件夹中的文件
$workPath = "e:\Code\gallery_web\images\work"
$files = Get-ChildItem -Path $workPath -File | Sort-Object Name
$count = 1

foreach ($file in $files) {
    $newName = "work" + $count + ".jpg"
    if ($file.Name -ne $newName) {
        Rename-Item -Path $file.FullName -NewName $newName
    }
    $count++
}

Write-Host "Work文件夹重命名完成，共重命名 $($files.Count) 个文件"
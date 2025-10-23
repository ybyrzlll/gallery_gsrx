$i = 1
Get-ChildItem -File | Sort-Object Name | ForEach-Object {
    $newName = "ai" + $i + ".jpg"
    Rename-Item -Path $_.FullName -NewName $newName
    $i++
}
@echo off
cd /d "e:\Code\gallery_web\images\ai"
setlocal enabledelayedexpansion
set count=1
for %%f in (*) do (
    ren "%%f" "ai!count!.jpg"
    set /a count+=1
)

cd /d "e:\Code\gallery_web\images\friends"
set count=1
for %%f in (*) do (
    ren "%%f" "friends!count!.jpg"
    set /a count+=1
)

cd /d "e:\Code\gallery_web\images\scr"
set count=1
for %%f in (*) do (
    ren "%%f" "scr!count!.jpg"
    set /a count+=1
)

cd /d "e:\Code\gallery_web\images\self"
set count=1
for %%f in (*) do (
    ren "%%f" "self!count!.jpg"
    set /a count+=1
)

cd /d "e:\Code\gallery_web\images\work"
set count=1
for %%f in (*) do (
    ren "%%f" "work!count!.jpg"
    set /a count+=1
)
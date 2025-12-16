@echo off
REM Git setup script for Grand Interview project
REM This uses Git from GitHub Desktop installation

set GIT_EXE=C:\Users\ADMIN\AppData\Local\GitHubDesktop\app-3.5.4\resources\app\git\mingw64\bin\git.exe

cd /d "d:\Grand Web - Copy"

echo.
echo ========================================
echo  GITHUB SETUP - Grand Interview
echo ========================================
echo.

REM Configure Git
echo Step 1: Configuring Git...
"%GIT_EXE%" config --global user.name "Grand Interview Developer"
"%GIT_EXE%" config --global user.email "developer@grandinterview.local"

REM Initialize repository
echo Step 2: Initializing repository...
"%GIT_EXE%" init

REM Add all files
echo Step 3: Adding all files...
"%GIT_EXE%" add .

REM Create initial commit
echo Step 4: Creating initial commit...
"%GIT_EXE%" commit -m "Initial commit: Grand Interview curator management system - production ready"

REM Display status
echo.
echo ========================================
echo  SETUP COMPLETE
echo ========================================
echo.
echo Git repository initialized successfully!
echo.
echo NEXT STEPS:
echo 1. Go to: https://github.com/new
echo 2. Create a repository named: grand-interview
echo 3. Copy the repository URL
echo 4. Run this command:
echo    "%GIT_EXE%" remote add origin [YOUR-REPO-URL]
echo    "%GIT_EXE%" branch -M main
echo    "%GIT_EXE%" push -u origin main
echo.
echo 5. Enable GitHub Pages in repository settings
echo    Settings ^> Pages ^> main branch ^> /root folder
echo.
echo Your site will be live at:
echo https://YOUR-USERNAME.github.io/grand-interview/
echo.
pause

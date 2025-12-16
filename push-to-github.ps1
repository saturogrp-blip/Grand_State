#!/usr/bin/env pwsh
# GitHub Push Script for Grand Interview Project

$gitExe = "C:\Users\ADMIN\AppData\Local\GitHubDesktop\app-3.5.4\resources\app\git\mingw64\bin\git.exe"
$projectPath = "d:\Grand Web - Copy"

Write-Host "`n" -ForegroundColor Green
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║      GITHUB PUSH - Grand Interview            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📌 IMPORTANT: Before proceeding, you need to:" -ForegroundColor Yellow
Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "   2. Create a repository named: grand-interview" -ForegroundColor White
Write-Host "   3. Make it PUBLIC (required for GitHub Pages)" -ForegroundColor White
Write-Host "   4. Don't initialize with README or .gitignore" -ForegroundColor White
Write-Host "   5. Copy the repository URL shown (looks like:)" -ForegroundColor White
Write-Host "      https://github.com/YOUR-USERNAME/grand-interview.git`n" -ForegroundColor Cyan

$repoUrl = Read-Host "Paste your GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "`n❌ No URL provided. Exiting." -ForegroundColor Red
    exit
}

Write-Host "`n✓ Adding remote repository..." -ForegroundColor Cyan
cd $projectPath
& $gitExe remote add origin $repoUrl

Write-Host "✓ Renaming branch to main..." -ForegroundColor Cyan
& $gitExe branch -M main

Write-Host "✓ Pushing to GitHub..." -ForegroundColor Cyan
& $gitExe push -u origin main

Write-Host "`n" -ForegroundColor Green
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         ✅ PUSHED TO GITHUB! ✅              ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Host "📝 Next Step: Enable GitHub Pages`n" -ForegroundColor Cyan
Write-Host "1. Go to: $repoUrl" -ForegroundColor White
Write-Host "2. Click Settings (top right)" -ForegroundColor White
Write-Host "3. Click Pages (left sidebar)" -ForegroundColor White
Write-Host "4. Select 'main' branch" -ForegroundColor White
Write-Host "5. Select '/ (root)' folder" -ForegroundColor White
Write-Host "6. Click Save`n" -ForegroundColor White

Write-Host "Wait 1-2 minutes, then your site will be live at:" -ForegroundColor Yellow
Write-Host "https://YOUR-USERNAME.github.io/grand-interview/`n" -ForegroundColor Cyan

Write-Host "Your project repository: $repoUrl" -ForegroundColor Green

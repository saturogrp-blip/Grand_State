# GitHub Hosting Guide

## Step-by-Step Instructions to Host on GitHub

### Prerequisites
1. GitHub account (create at github.com if needed)
2. Git installed on your computer
3. Project files ready (✅ Already done!)

---

## 🚀 Setup Instructions

### Step 1: Install Git (if not already installed)

**Windows:**
- Download from: https://git-scm.com/download/win
- Run the installer with default settings
- Restart your terminal/command prompt

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

### Step 2: Configure Git Credentials

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `grand-interview` (or your preferred name)
3. Description: "Real-time curator management system for interviews"
4. Choose: Public (for hosting on GitHub Pages)
5. Click "Create repository"
6. **Copy the repository URL** (looks like: `https://github.com/your-username/grand-interview.git`)

### Step 4: Initialize and Push to GitHub

Open PowerShell/Terminal in your project directory and run:

```bash
cd "d:\Grand Web - Copy"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Grand Interview curator management system"

# Add GitHub as remote (replace with your URL from Step 3)
git remote add origin https://github.com/YOUR-USERNAME/grand-interview.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 5: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" (top right)
3. Scroll down to "Pages" section
4. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: Select `main` and `/root`
   - Click "Save"
5. Wait 1-2 minutes for deployment
6. Your site is now live at: `https://YOUR-USERNAME.github.io/grand-interview/`

---

## 📋 Quick Command Summary

Once Git is installed, these commands handle everything:

```bash
cd "d:\Grand Web - Copy"
git init
git add .
git commit -m "Initial commit: Grand Interview system"
git remote add origin https://github.com/YOUR-USERNAME/grand-interview.git
git branch -M main
git push -u origin main
```

---

## 🌐 Access Your Project

After GitHub Pages is enabled:

- **Questions Generator:** `https://YOUR-USERNAME.github.io/grand-interview/index.html`
- **Admin Panel:** `https://YOUR-USERNAME.github.io/grand-interview/admin.html`
- **Repository:** `https://github.com/YOUR-USERNAME/grand-interview`

---

## 📝 What's Already Prepared

✅ `.gitignore` - Excludes unnecessary files  
✅ `.github/workflows/deploy.yml` - Auto-deploy on push  
✅ `GITHUB_README.md` - Complete project documentation  
✅ All source files organized and cleaned  

---

## 🔄 Making Updates

After initial setup, to push new changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

---

## 🚀 Alternative: GitHub Desktop (GUI)

If you prefer a graphical interface:

1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Click "Create a New Repository"
4. Set name to "grand-interview"
5. Select your project folder
6. Click "Create Repository"
7. Click "Publish repository"
8. Enable GitHub Pages in repository settings

---

## ✨ Your Project Will Include

```
README with comprehensive documentation
.gitignore for clean repository
GitHub Actions workflow for auto-deployment
GitHub Pages enabled for instant hosting
All source files ready to use
```

---

## 🎯 Next Steps

1. **Install Git** (if needed)
2. **Create GitHub repository** (free account required)
3. **Run the git commands** above
4. **Enable GitHub Pages** in settings
5. **Share your live link!** 🎉

Your application will be automatically hosted and accessible worldwide!

---

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Git Basics: https://git-scm.com/docs
- GitHub Pages: https://pages.github.com

---

**Status:** Ready to deploy! ✅

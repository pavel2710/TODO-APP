# Deployment Guide

## Option 1: GitHub Pages (Recommended - Free)

### Steps:

1. **Create a GitHub account** (if you don't have one)
   - Go to https://github.com
   - Sign up for free

2. **Create a new repository**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Name it: `todo-app`
   - Make it Public
   - Don't initialize with README

3. **Push your code to GitHub**
   ```bash
   cd "/home/pavel/To Do/todo-app"
   git add .
   git commit -m "Initial commit - TODO app with drag and drop"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll to "Pages" section (left sidebar)
   - Under "Source", select "main" branch
   - Click "Save"

5. **Access your app**
   - Your app will be live at: `https://YOUR_USERNAME.github.io/todo-app/`
   - It may take 1-2 minutes to deploy

---

## Option 2: Netlify (Easy Drag & Drop)

### Steps:

1. Go to https://netlify.com
2. Sign up for free
3. Drag the entire `todo-app` folder onto the Netlify dashboard
4. Your app will be live instantly with a URL like: `https://random-name-12345.netlify.app`
5. Optional: Set up a custom domain

---

## Option 3: Vercel (Similar to Netlify)

### Steps:

1. Go to https://vercel.com
2. Sign up for free
3. Import your GitHub repository or upload directly
4. Your app will be live at: `https://your-app.vercel.app`

---

## Option 4: Deploy with Backend (Heroku/Railway)

If you want to use the FastAPI backend instead of localStorage:

### Using Railway (Free Tier Available):

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project from GitHub repo
4. Railway will auto-detect Python and deploy
5. Set up environment variables if needed

### Using Render (Free Tier):

1. Go to https://render.com
2. Sign up for free
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## Comparison

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **GitHub Pages** | Free, simple, fast | Static only (no backend) | Standalone version |
| **Netlify** | Easy drag-drop, free SSL | Static only | Quick deployment |
| **Vercel** | Fast, free, great DX | Static only | Modern web apps |
| **Railway** | Supports backend, databases | Limited free tier | Full-stack apps |
| **Render** | Free tier, supports Python | Slower cold starts | Backend apps |

---

## Recommended: GitHub Pages

For your standalone version (using localStorage), **GitHub Pages is perfect** because:
- ✅ Free forever
- ✅ Fast and reliable
- ✅ Easy to update (just push to GitHub)
- ✅ Custom domain support
- ✅ HTTPS by default

---

## Current File Structure for Deployment

```
todo-app/
├── index.html          # Main entry point (standalone version)
├── standalone.html     # Backup of standalone version
├── backend/            # Python backend (optional, not used in standalone)
├── frontend/           # Original frontend files
├── README.md
└── .gitignore
```

The `index.html` file is a copy of `standalone.html` and will be served by GitHub Pages.

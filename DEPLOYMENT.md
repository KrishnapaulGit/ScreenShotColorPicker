# Deployment Guide: Render (Server) + Vercel (Frontend)

## Current Setup
- **Server**: Render (https://render.com)
- **Frontend**: Vercel (https://vercel.com)
- **Database**: None (stateless API)

---

## 🚀 Deploy Server to Render

### Step 1: Connect GitHub to Render
1. Go to [render.com](https://render.com)
2. Sign in or create account
3. Click **New +** → **Web Service**
4. Select **Connect GitHub account** (if not already connected)
5. Find and select `ScreenShotColorPicker` repository

### Step 2: Configure Render Deployment
1. **Name**: `screenshot-color-picker-api` (or your choice)
2. **Environment**: `Node`
3. **Region**: `Oregon` (or closest to you)
4. **Plan**: Free (or Paid for better performance)
5. **Branch**: `master`
6. **Build Command**: `npm --prefix server install`
7. **Start Command**: `npm --prefix server start`

### Step 3: Set Environment Variables (if needed)
In Render dashboard, click **Environment** and add:
- `NODE_ENV` = `production`
- `PORT` = `5000` (Render assigns automatically, but we can specify)

### Step 4: Deploy
- Click **Create Web Service**
- Render will automatically deploy on each git push to `master`
- Your server URL will be something like: `https://screenshot-color-picker-api.onrender.com`

### Step 5: Update Frontend API URL
Once Render deployment completes, copy your server URL and update:

**File**: `client/.env.production`
```
REACT_APP_API_URL=https://screenshot-color-picker-api.onrender.com
```

---

## 🌐 Deploy Frontend to Vercel

### Step 1: Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in or create account
3. Click **Add New...** → **Project**
4. Select GitHub and choose `ScreenShotColorPicker`

### Step 2: Configure Project Settings
1. **Project Name**: `screenshot-color-picker` (or your choice)
2. **Framework**: React
3. **Root Directory**: `./client`
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. **Install Command**: `npm install`

### Step 3: Set Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:
- `REACT_APP_API_URL` = `https://screenshot-color-picker-api.onrender.com` (your Render URL)

### Step 4: Deploy
- Click **Deploy**
- Vercel will automatically deploy on each git push to `master`
- Your frontend URL will be something like: `https://screenshot-color-picker.vercel.app`

---

## 📋 Deployment Checklist

### Before First Deploy
- [ ] Push all code to GitHub `master` branch
- [ ] Ensure `render.yaml` exists in root directory
- [ ] Ensure `vercel.json` is updated (frontend only)
- [ ] Check `server/package.json` points to `api/index.js`
- [ ] Check `client/.env.production` has correct API URL

### First-Time Setup (Do Once)
- [ ] Deploy server to Render
- [ ] Copy Render deployment URL
- [ ] Update `client/.env.production` with Render URL
- [ ] Push to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Set Vercel environment variable with Render URL

### Ongoing Deployments
- [ ] Make code changes locally
- [ ] Commit and push to `master` branch
- [ ] Both Render and Vercel auto-deploy
- [ ] Verify deployments in respective dashboards

---

## 🔗 File Locations

| File | Purpose |
|------|---------|
| `render.yaml` | Render deployment config |
| `.renderignore` | Files to exclude from Render |
| `vercel.json` | Vercel deployment config |
| `server/package.json` | Server dependencies & start script |
| `client/.env.production` | Frontend production API URL |
| `client/.env.local` | Frontend dev API URL (localhost) |

---

## ⚙️ How It Works

### Development (Local)
```
Client (localhost:3000) → Server (localhost:5000)
```
- Uses `client/.env.local`: `REACT_APP_API_URL=http://localhost:5000`

### Production
```
Client (Vercel) → Server (Render)
```
- Uses `client/.env.production`: `REACT_APP_API_URL=https://your-render-url`

---

## 🔄 Auto-Deployment

Both Render and Vercel are configured for **automatic deployment on git push**:

1. Make changes locally
2. `git add .` 
3. `git commit -m "message"`
4. `git push origin master`
5. Render automatically deploys server (~2-5 min)
6. Vercel automatically deploys frontend (~2-5 min)

---

## 🆘 Troubleshooting

### Frontend shows "Cannot reach API"
- ✅ Check `client/.env.production` has correct Render URL
- ✅ Verify Render deployment is running (check Render dashboard)
- ✅ Check CORS is enabled in `server/api/index.js`

### Render build fails
- ✅ Check `server/package.json` dependencies are correct
- ✅ Verify `npm --prefix server start` works locally
- ✅ Check Render logs for specific error messages

### Image processing timeout on Vercel
- ℹ️ This should be fixed now (not deploying on Vercel anymore)
- ℹ️ Render has longer timeout limits for free tier

---

## 📞 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs

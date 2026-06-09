# 🚀 Deployment Guide: Render + Vercel

Deploy your Screenshot Color Picker application with **Render** (server) and **Vercel** (frontend) for optimal performance.

---

## 📋 Prerequisites

- GitHub account with code pushed to `master` branch
- Render account (free at https://render.com)
- Vercel account (free at https://vercel.com)
- Render and Vercel connected to GitHub

---

## 🔧 Step 1: Deploy Server to Render

### 1.1 Create Web Service on Render

1. Go to **[Render Dashboard](https://dashboard.render.com)**
2. Click **New +** → **Web Service**
3. Select **ScreenShotColorPicker** repository
4. Fill in the settings:
   - **Name**: `screenshot-color-picker-api`
   - **Environment**: `Node`
   - **Region**: `Oregon` (closest to your users)
   - **Plan**: `Free` (or `Paid` for better performance)
   - **Branch**: `master`

### 1.2 Configure Build & Start Commands

Render will auto-detect from `render.yaml`, but verify:
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`

### 1.3 Set Environment Variables

Click **Environment** and add/verify:
```
NODE_ENV = production
PORT = 10000
CORS_ORIGIN = https://your-vercel-url.vercel.app
```

⚠️ **Important**: Replace `your-vercel-url` with your actual Vercel domain (you'll get this after deploying frontend)

### 1.4 Deploy

Click **Create Web Service**. Render will:
- Start building your server
- Show deployment logs in real-time
- Provide a URL like: `https://screenshot-color-picker-api.onrender.com`

**Wait for deployment to complete** (green "Live" status).

### 1.5 Copy Your Render Server URL

Your server URL will be displayed after deployment. **Save it** - you'll need it for Vercel.

Example: `https://screenshot-color-picker-api.onrender.com`

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Project on Vercel

1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Click **Add New...** → **Project**
3. Select **ScreenShotColorPicker** repository
4. Vercel will auto-detect React project

### 2.2 Configure Project Settings

In the configuration screen:
- **Project Name**: `screenshot-color-picker` (or your choice)
- **Root Directory**: `.` (root, not `client/`)
- **Framework**: React (auto-detected)
- **Build Command**: `npm --prefix client run build`
- **Output Directory**: `client/build`
- **Install Command**: `npm --prefix client install`

### 2.3 Set Environment Variables

In **Environment Variables** section, add:
```
REACT_APP_API_URL = https://screenshot-color-picker-api.onrender.com
```

Replace with your **actual Render server URL** from Step 1.5

### 2.4 Deploy

Click **Deploy**. Vercel will:
- Install dependencies
- Build React app
- Deploy to global CDN
- Show URL like: `https://screenshot-color-picker.vercel.app`

**Wait for deployment to complete** (check Status).

---

## 🔄 Step 3: Update Render with Vercel URL (Optional)

If you want Render's CORS to only allow your Vercel domain:

1. Go back to **Render Dashboard** → Your Service
2. Click **Settings** → **Environment**
3. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN = https://screenshot-color-picker.vercel.app
   ```
4. Click **Save Changes** (Render will auto-redeploy)

---

## ✅ Testing Your Deployment

### Test Server (Render)

Open in browser:
```
https://screenshot-color-picker-api.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-..."
}
```

### Test Frontend (Vercel)

Open in browser:
```
https://screenshot-color-picker.vercel.app
```

1. Upload a screenshot with text
2. Click "Process Image"
3. Verify OCR extracts text correctly
4. Try exporting results (JSON/CSV/Excel)

---

## 🔄 Ongoing Updates & Redeployment

After your initial deployment:

### For Server Changes:
```bash
git add server/
git commit -m "Update server: [your changes]"
git push origin master
```
→ Render automatically redeploys in 1-2 minutes

### For Frontend Changes:
```bash
git add client/
git commit -m "Update frontend: [your changes]"
git push origin master
```
→ Vercel automatically redeploys in 30-60 seconds

### For Both:
```bash
git add .
git commit -m "Update: [your changes]"
git push origin master
```
→ Both services automatically redeploy

---

## 🐛 Troubleshooting

### Frontend loads but API calls fail

**Solution**: Check Render server URL in Vercel environment variables:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Verify `REACT_APP_API_URL` matches your Render service URL
3. Redeploy Vercel after updating

### "CORS error" when uploading images

**Solution**: Update `CORS_ORIGIN` in Render:
1. Render Dashboard → Service → Settings → Environment
2. Set `CORS_ORIGIN` to your Vercel URL: `https://screenshot-color-picker.vercel.app`
3. Save (auto-redeploys)

### Render service keeps going to sleep

**Solution**: Upgrade Render plan to Paid ($7/month) for always-on service. Free tier spins down after 15 minutes of inactivity.

### OCR takes too long / times out

**Solution**: 
- Ensure image is under 5MB
- Check Render logs for errors
- May need to upgrade Render plan for faster CPU

### Build fails on Render

**Solution**: Check Render build logs:
1. Render Dashboard → Service
2. Click **Logs** tab
3. Look for error messages
4. Common issue: Missing dependencies in `server/package.json`

---

## 📊 Production Checklist

- [ ] Server deployed and running on Render
- [ ] Server health check returns 200 status
- [ ] Frontend deployed on Vercel
- [ ] Vercel environment variable set with correct Render URL
- [ ] Frontend can reach server API
- [ ] Test image upload works end-to-end
- [ ] Export functionality works
- [ ] No CORS errors in browser console
- [ ] (Optional) Custom domain configured
- [ ] (Optional) Monitor logs for errors

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────────┐
│                  Your Vercel Frontend            │
│        https://screenshot-color-picker.vercel.app│
├─────────────────────────────────────────────────┤
│              API Calls (axios)                   │
├─────────────────────────────────────────────────┤
│              Render API Server                   │
│      https://screenshot-color-picker-api        │
│              .onrender.com                       │
├─────────────────────────────────────────────────┤
│   OCR (Tesseract) | Image Processing (Sharp)    │
│        Color Extraction | Text Detection        │
└─────────────────────────────────────────────────┘
```

---

## 📞 Support

For issues:
1. Check **Render Logs** (Real-time) and **Vercel Logs** (Deployments tab)
2. Verify environment variables match
3. Test API endpoint directly in browser/curl
4. Check GitHub Actions for any CI/CD issues

---

## 🔐 Security Notes

- Never commit `.env` files with secrets
- Use `render.yaml` and environment variables for configuration
- Keep `NODE_ENV=production` on production
- Render auto-HTTPS with valid SSL certificates
- Vercel auto-HTTPS with free SSL certificates

---

Happy deploying! 🎉

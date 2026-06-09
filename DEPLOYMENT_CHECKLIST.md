# Vercel Deployment Checklist

## ✅ Pre-Deployment Verification

### Configuration Files
- [x] `vercel.json` - Configured with correct builds and routes
- [x] `.vercelignore` - Excludes unnecessary files
- [x] `client/.env.local` - Set for local development
- [x] `client/.env.production` - Set for production (empty API_URL)
- [x] `.gitignore` - Properly excludes node_modules, .env files, etc.

### Package.json Files
- [x] Root `package.json` - Has install-all and build scripts
- [x] `server/package.json` - Lists all required dependencies
- [x] `client/package.json` - Proxy removed, uses env variable instead

### Environment Variables
- [x] API URL uses environment variable in App.js
- [x] Components don't have hardcoded localhost URLs
- [x] .env files properly configured for development and production

### API Configuration
- [x] Express API at `server/api/index.js`
- [x] CORS enabled for cross-origin requests
- [x] Handles both Vercel and local environments
- [x] Proper error handling and logging

### React Frontend
- [x] Uses REACT_APP_API_URL environment variable
- [x] Relative paths fallback when env var is empty (for production)
- [x] All API calls use axios with proper error handling

### Build & Dependencies
- [x] All dependencies listed in respective package.json files
- [x] No private/local dependencies
- [x] Sharp, Tesseract.js, and other native modules properly configured

## 🚀 Deployment Steps

1. **Ensure all files are committed:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel:** https://vercel.com/dashboard

3. **Import Project:**
   - Click "New Project"
   - Select your GitHub/GitLab repository
   - Select ScreenshotColorPicker folder as root

4. **Configure Environment Variables** (Optional):
   - Development: Set `REACT_APP_API_URL=http://localhost:5000`
   - Production: Leave empty (uses relative paths)

5. **Deploy:** Vercel will automatically build and deploy

## 📋 What Happens During Deployment

1. **Install Phase:**
   - Root dependencies installed
   - `server/package.json` dependencies installed
   - `client/package.json` dependencies installed

2. **Build Phase:**
   - React app built to `client/build`
   - Tesseract data and other assets bundled

3. **Package Phase:**
   - Backend API wrapped as serverless function
   - Static files uploaded to CDN

4. **Routing Phase:**
   - `/api/*` requests routed to serverless function
   - All other requests served from React build

## 🔍 Verification After Deployment

1. **Check API is working:**
   - Visit `https://your-deployment.vercel.app/api/health`
   - Should return `{"status":"ok","timestamp":"..."}`

2. **Check Frontend is loading:**
   - Visit `https://your-deployment.vercel.app/`
   - Should show the screenshot color picker UI

3. **Test File Upload:**
   - Upload a test image
   - Verify OCR processing works
   - Check exported results

4. **Monitor Logs:**
   - Go to Vercel dashboard
   - Check Deployments section for any errors
   - Review Function Logs for runtime issues

## ⚠️ Common Issues & Solutions

### Issue: "Cannot find module" errors
**Solution:** Check package.json files have all dependencies, run `npm install-all` locally first

### Issue: API returns 404
**Solution:** Verify vercel.json routes, ensure API endpoints use `/api/` prefix

### Issue: CORS errors in console
**Solution:** Normally shouldn't occur on same domain, but can add origin config if needed

### Issue: OCR/Image processing failures
**Solution:** Check memory limit in vercel.json, ensure Tesseract data is accessible

### Issue: Build size too large
**Solution:** Review .vercelignore, remove test files, check for large dependencies

## 📊 Monitoring & Maintenance

- **Vercel Analytics:** Monitor real user performance
- **Function Logs:** Debug API issues
- **Deployment History:** Rollback if needed
- **Environment Variables:** Update without redeployment if needed

## 🔐 Security Notes

- Sensitive API keys/tokens go in Vercel Environment Variables (not in code)
- Never commit `.env` files to Git
- Verify CORS settings for production
- Monitor upload file sizes (currently 10MB limit)

## 📞 Getting Help

- **Vercel Docs:** https://vercel.com/docs
- **Common Issues:** https://vercel.com/support
- **Build Logs:** Available in Vercel dashboard

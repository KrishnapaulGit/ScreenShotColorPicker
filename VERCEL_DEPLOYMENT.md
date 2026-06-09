# Vercel Deployment Guide

## Overview
This application is configured for deployment on Vercel with:
- Express.js backend API at `/server/api/index.js`
- React frontend in `/client` folder
- Automatic builds and deployments

## Prerequisites
- Vercel account (https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Node.js 18+ installed locally

## Deployment Steps

### 1. Push to Git Repository
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your Git repository
4. Choose the project root directory (ScreenshotColorPicker)
5. Click "Import"

### 3. Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

#### For Development (`Development`)
- `REACT_APP_API_URL`: `http://localhost:5000`
- `NODE_ENV`: `development`

#### For Preview Deployments (`Preview`)
- `REACT_APP_API_URL`: (leave empty - will use relative paths)
- `NODE_ENV`: `production`

#### For Production (`Production`)
- `REACT_APP_API_URL`: (leave empty - will use relative paths)
- `NODE_ENV`: `production`

### 4. Deploy
- Vercel will automatically detect the configuration from `vercel.json`
- It will install dependencies, build the React app, and deploy both frontend and API
- Your deployment will be live at `https://your-project-name.vercel.app`

## How It Works

### Build Process
1. `npm install` - Install root dependencies
2. `npm --prefix client install` - Install client dependencies
3. `npm --prefix client run build` - Build React app to `client/build`
4. Backend files are deployed as serverless functions

### Routing
- `/api/*` - Routed to backend (server/api/index.js)
- `/static/*` - Cached static assets
- All other routes - Routed to React app (for SPA routing)

### API Calls
- In production, the client makes relative API calls (`/api/process`, `/api/export`)
- Vercel's routing automatically routes these to the serverless backend

## Local Development

### Install Dependencies
```bash
npm install-all
```

### Run Development Server
```bash
npm run dev
```
This starts both the React dev server (localhost:3000) and Express server (localhost:5000)

### Build for Production
```bash
npm run build
npm start
```

## File Structure
```
├── server/
│   ├── api/index.js          # Express app (Vercel serverless)
│   ├── exportService.js      # Export functionality
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.js           # Uses REACT_APP_API_URL env var
│   │   └── components/
│   ├── build/               # Built React app (created during build)
│   └── package.json
├── vercel.json             # Vercel configuration
└── .vercelignore           # Files to exclude from deployment
```

## Troubleshooting

### "API calls return 404"
- Check that `vercel.json` routes are correct
- Ensure API endpoints use `/api/` prefix
- Verify environment variables are set

### "React app not loading"
- Check that `client/build` folder exists after deployment
- Verify `outputDirectory` in `vercel.json` is set to `client/build`
- Check that routes correctly serve `index.html` for SPA

### "Large build size"
- Check `.vercelignore` to exclude unnecessary files
- Remove debug files, test images, and logs before pushing

### "Database or external service connection issues"
- Add required API keys/URLs to Vercel Environment Variables
- Make sure services allow connections from Vercel IPs

## Performance Optimization

### API Optimization
- Set `maxDuration` in vercel.json (currently 60 seconds)
- Optimize image processing and OCR for faster responses

### Frontend Optimization
- React app is automatically optimized by create-react-app
- Static assets are cached by Vercel

## Monitoring

Monitor your deployment at:
- Vercel Dashboard: https://vercel.com/dashboard
- Real-time logs in Project Settings → Monitoring
- Analytics in Project Settings → Analytics

## Support
For issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review build logs in Vercel dashboard
3. Check environment variables are correctly set
4. Verify all dependencies are in package.json files

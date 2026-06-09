#!/bin/bash

# Vercel Deployment Quick Script
# This script helps prepare and deploy to Vercel

echo "🚀 Screenshot Color Picker - Vercel Deployment Guide"
echo "======================================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Please run: git init"
    exit 1
fi

echo "✅ Step 1: Verify all dependencies are installed"
echo "   Running: npm install-all"
npm install-all

echo ""
echo "✅ Step 2: Build React frontend locally"
echo "   Running: npm run build"
npm run build

echo ""
echo "✅ Step 3: Commit changes"
echo "   Adding all files..."
git add .

echo "   Enter commit message (or press Enter for default):"
read -r commit_msg
commit_msg=${commit_msg:-"Ready for Vercel deployment"}

git commit -m "$commit_msg"

echo ""
echo "✅ Step 4: Push to Git repository"
echo "   Running: git push"
git push origin main

echo ""
echo "🎉 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Select your repository"
echo "4. Vercel will automatically deploy"
echo ""
echo "Environment Variables (optional):"
echo "- For development: Set REACT_APP_API_URL=http://localhost:5000"
echo "- For production: Leave REACT_APP_API_URL empty"
echo ""
echo "Documentation:"
echo "- See VERCEL_DEPLOYMENT.md for detailed guide"
echo "- See DEPLOYMENT_CHECKLIST.md for verification steps"

#!/bin/bash

# G8S LPG - Quick Deployment Script
echo "🚀 Deploying G8S LPG to Vercel..."

# Check if we're in the right directory
if [ ! -d "g8s-frontend" ]; then
    echo "❌ Error: g8s-frontend directory not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Navigate to frontend directory
cd g8s-frontend

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying frontend to Vercel..."
vercel --prod

echo "✅ Frontend deployed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy backend to Railway: https://railway.app"
echo "2. Update NEXT_PUBLIC_BACKEND_URL in Vercel environment variables"
echo "3. Test your deployment"
echo ""
echo "🎯 Your admin dashboard will be available at: https://your-project.vercel.app/admin"

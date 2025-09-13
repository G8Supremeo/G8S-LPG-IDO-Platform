# G8S LPG - Vercel Deployment Guide

## 🚀 **Streamlined Vercel Deployment (Frontend Only)**

### **Why Vercel Only?**
- ✅ **Frontend**: Perfect for Next.js applications
- ✅ **Automatic Deployments**: GitHub integration
- ✅ **Global CDN**: Fast worldwide performance
- ✅ **HTTPS**: Automatic SSL certificates
- ✅ **Custom Domains**: Professional URLs
- ✅ **No Server Management**: Fully managed platform

### **Backend Options (Choose One):**

#### **Option 1: Railway (Recommended)**
- ✅ **Free Tier**: 500 hours/month
- ✅ **Easy Setup**: GitHub integration
- ✅ **MongoDB**: Built-in database
- ✅ **Environment Variables**: Simple configuration

#### **Option 2: Render**
- ✅ **Free Tier**: 750 hours/month
- ✅ **Auto-Deploy**: GitHub integration
- ✅ **MongoDB**: External database support

#### **Option 3: Heroku**
- ✅ **Free Tier**: Limited hours
- ✅ **Add-ons**: MongoDB Atlas integration
- ✅ **Easy Scaling**: Professional features

## 📋 **Step-by-Step Deployment**

### **Step 1: Prepare Your Code**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Production ready for Vercel"
   git push origin main
   ```

2. **Verify Frontend Structure**
   ```
   g8s-frontend/
   ├── src/
   ├── public/
   ├── package.json
   ├── next.config.js
   ├── vercel.json ✅
   └── .env.local (for local development)
   ```

### **Step 2: Deploy Frontend to Vercel**

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Choose `g8s-frontend` as root directory

3. **Configure Environment Variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.railway.app
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
   NEXT_PUBLIC_G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
   NEXT_PUBLIC_G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
   NEXT_PUBLIC_PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Get your Vercel URL: `https://your-project.vercel.app`

### **Step 3: Deploy Backend to Railway**

1. **Go to Railway**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `g8s-backend` folder

3. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/g8s-lpg
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-project.vercel.app
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
   G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
   G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
   PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@g8s-lpg.com
   ```

4. **Deploy**
   - Railway automatically detects Node.js
   - Builds and deploys your backend
   - Get your Railway URL: `https://your-project.railway.app`

### **Step 4: Update Frontend Backend URL**

1. **Update Vercel Environment Variables**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Update `NEXT_PUBLIC_BACKEND_URL` with your Railway URL

2. **Redeploy Frontend**
   - Vercel automatically redeploys when you update environment variables
   - Or trigger manual redeploy

## 🔧 **Environment Configuration**

### **Frontend (.env.local for local development):**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
NEXT_PUBLIC_G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
NEXT_PUBLIC_PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
```

### **Backend (.env for local development):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/g8s-lpg
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com
```

## 🎯 **Admin Dashboard Access**

### **Admin Panel Features:**
- ✅ **Real-time IDO Statistics**
- ✅ **User Management**
- ✅ **Transaction Monitoring**
- ✅ **System Controls** (pause/resume IDO)
- ✅ **Analytics Dashboard**
- ✅ **Email Notifications**

### **Access Admin Dashboard:**
1. **Local Development**: http://localhost:3000/admin
2. **Production**: https://your-project.vercel.app/admin

### **Admin Authentication:**
- Currently open access (for testing)
- Can be secured with authentication in production

## 🚀 **Deployment Benefits**

### **Vercel Advantages:**
- ✅ **Zero Configuration**: Automatic Next.js optimization
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Automatic HTTPS**: SSL certificates included
- ✅ **Preview Deployments**: Test before going live
- ✅ **Analytics**: Built-in performance monitoring
- ✅ **Custom Domains**: Professional URLs

### **Railway Advantages:**
- ✅ **Simple Deployment**: GitHub integration
- ✅ **Automatic Scaling**: Handles traffic spikes
- ✅ **Database Integration**: MongoDB support
- ✅ **Environment Management**: Easy configuration
- ✅ **Monitoring**: Built-in logs and metrics

## 📊 **Production URLs**

After deployment, your platform will be available at:

- **Frontend**: https://your-project.vercel.app
- **Admin Dashboard**: https://your-project.vercel.app/admin
- **Backend API**: https://your-project.railway.app
- **API Health**: https://your-project.railway.app/health

## 🔄 **Automatic Deployments**

### **Frontend (Vercel):**
- ✅ **Auto-deploy** on every push to main branch
- ✅ **Preview deployments** for pull requests
- ✅ **Instant rollbacks** if needed

### **Backend (Railway):**
- ✅ **Auto-deploy** on every push to main branch
- ✅ **Zero-downtime deployments**
- ✅ **Automatic health checks**

## 🛡️ **Security Features**

- ✅ **HTTPS Only**: Automatic SSL certificates
- ✅ **CORS Configuration**: Secure API access
- ✅ **Environment Variables**: Secure configuration
- ✅ **No Private Keys**: Read-only blockchain operations
- ✅ **Rate Limiting**: API protection
- ✅ **Input Validation**: Secure data handling

## 🎉 **Your G8S LPG Platform is Live!**

### **What You Get:**
- ✅ **Professional IDO Platform**
- ✅ **Real-time Blockchain Integration**
- ✅ **Admin Dashboard**
- ✅ **User Management**
- ✅ **Email Notifications**
- ✅ **Global CDN Performance**
- ✅ **Automatic Deployments**
- ✅ **Zero Server Management**

**Ready to launch your IDO!** 🚀

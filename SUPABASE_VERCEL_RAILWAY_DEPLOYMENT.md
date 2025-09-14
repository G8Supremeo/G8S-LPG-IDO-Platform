# 🚀 Complete Deployment Guide: Supabase + Vercel + Railway

This guide will help you deploy your G8S LPG IDO Platform using:
- **Supabase** for database and authentication
- **Vercel** for frontend hosting
- **Railway** for backend hosting

## 📋 Prerequisites

1. **Supabase Account** - [Sign up here](https://supabase.com)
2. **Vercel Account** - [Sign up here](https://vercel.com)
3. **Railway Account** - [Sign up here](https://railway.app)
4. **GitHub Repository** with your code

## 🗄️ Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `g8s-lpg-ido`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 1.2 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (SUPABASE_URL)
   - **anon public** key (SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_KEY)

### 1.3 Set Up Database Schema
1. Go to **SQL Editor** in Supabase
2. Run the SQL from `g8s-backend/supabase-schema.sql`
3. This will create all necessary tables

## 🚂 Step 2: Railway Backend Deployment

### 2.1 Deploy to Railway
1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Choose the `g8s-backend` folder as root directory
5. Railway will automatically detect it's a Node.js project

### 2.2 Set Environment Variables in Railway
Go to your Railway project → **Variables** tab and add:

#### 🔴 **REQUIRED Variables**
```bash
# Core Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d

# Supabase Database
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_KEY=your-supabase-service-role-key-here

# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
```

#### 🟡 **OPTIONAL Variables**
```bash
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.3 Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Verify Backend Deployment
1. Wait for Railway to finish deploying
2. Check the logs for any errors
3. Visit your Railway URL + `/health` to verify it's working
4. Example: `https://your-backend.railway.app/health`

## 🌐 Step 3: Vercel Frontend Deployment

### 3.1 Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `g8s-frontend`
5. Vercel will auto-detect Next.js settings

### 3.2 Set Environment Variables in Vercel
Go to your Vercel project → **Settings** → **Environment Variables** and add:

#### 🔴 **REQUIRED Variables**
```bash
# Wallet Connection
NEXT_PUBLIC_WC_PROJECT_ID=your-walletconnect-project-id

# Blockchain Configuration
NEXT_PUBLIC_RPC_URL_SEPOLIA=https://sepolia.infura.io/v3/your-infura-key
NEXT_PUBLIC_G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
NEXT_PUBLIC_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
NEXT_PUBLIC_PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920

# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

#### 🟡 **OPTIONAL Variables**
```bash
# Direct Supabase Integration (if needed)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### 3.3 Get WalletConnect Project ID
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Add it to your Vercel environment variables

### 3.4 Verify Frontend Deployment
1. Wait for Vercel to finish deploying
2. Visit your Vercel URL
3. Test wallet connection
4. Test token purchase functionality

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Frontend API Configuration
Make sure your frontend is pointing to the correct Railway backend URL:

```typescript
// In your frontend code
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.railway.app';
```

### 4.2 Test the Integration
1. Open your Vercel frontend
2. Try connecting a wallet
3. Test the token purchase flow
4. Check Railway logs for API calls

## 🧪 Step 5: Testing & Verification

### 5.1 Backend Health Check
```bash
curl https://your-backend.railway.app/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "environment": "production",
  "database": "Supabase",
  "services": {
    "supabase": "connected",
    "blockchain": "read-only",
    "websocket": "active"
  }
}
```

### 5.2 Frontend Functionality Test
1. **Wallet Connection**: Connect MetaMask or other wallet
2. **Token Purchase**: Try purchasing G8S tokens
3. **Real-time Updates**: Check if WebSocket connections work
4. **Error Handling**: Test with insufficient funds, etc.

## 🚨 Troubleshooting

### Backend Issues
- **Crashes on startup**: Check Railway logs for missing environment variables
- **Database errors**: Verify Supabase credentials and schema
- **Blockchain errors**: Check RPC URL and contract addresses

### Frontend Issues
- **Wallet not connecting**: Verify WalletConnect Project ID
- **Purchase not working**: Check contract addresses and RPC URL
- **API errors**: Verify backend URL and CORS settings

### Common Solutions
1. **Environment Variables**: Double-check all required variables are set
2. **CORS Issues**: Ensure FRONTEND_URL in Railway matches your Vercel domain
3. **Contract Issues**: Verify all contract addresses are correct
4. **Network Issues**: Use reliable RPC providers (Alchemy, Infura)

## 📊 Monitoring & Maintenance

### Railway Monitoring
- Check Railway dashboard for deployment status
- Monitor logs for errors
- Set up alerts for downtime

### Vercel Monitoring
- Use Vercel Analytics for performance
- Monitor build logs for deployment issues
- Check function logs for API errors

### Supabase Monitoring
- Monitor database performance in Supabase dashboard
- Check API usage and limits
- Review authentication logs

## 🔄 Updates & Redeployment

### Backend Updates
1. Push changes to GitHub
2. Railway will auto-deploy
3. Check logs for any issues

### Frontend Updates
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Test functionality after deployment

## 🎉 Success Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Railway backend deployed and healthy
- [ ] Vercel frontend deployed and working
- [ ] Wallet connection functional
- [ ] Token purchase working
- [ ] Real-time updates working
- [ ] Error handling working
- [ ] All environment variables set correctly

## 📞 Support

If you encounter issues:
1. Check the logs in Railway and Vercel
2. Verify all environment variables are set
3. Test locally first with the same configuration
4. Check the troubleshooting section above

Your G8S LPG IDO Platform should now be fully deployed and functional! 🚀

# G8S LPG Production Deployment Guide

## 🚀 **Deployment Options**

### **Option 1: Vercel (Frontend) + Railway/Heroku (Backend) - Recommended**

#### **Frontend Deployment (Vercel):**

1. **Connect GitHub Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to: https://vercel.com
   - Import your GitHub repository
   - Configure environment variables:
     ```
     NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
     NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
     NEXT_PUBLIC_G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
     NEXT_PUBLIC_G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
     NEXT_PUBLIC_PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
     ```

3. **Automatic Deployments**
   - Every push to main branch triggers deployment
   - Preview deployments for pull requests
   - Custom domain support

#### **Backend Deployment (Railway):**

1. **Connect GitHub Repository**
   - Go to: https://railway.app
   - Connect your GitHub account
   - Select your repository

2. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/g8s-lpg
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
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

3. **Deploy**
   - Railway automatically detects Node.js
   - Builds and deploys your backend
   - Provides HTTPS endpoint

### **Option 2: Docker Compose (VPS/Cloud Server)**

#### **Prerequisites:**
- VPS with Docker and Docker Compose
- Domain name with DNS pointing to your server
- SSL certificate (Let's Encrypt)

#### **Deployment Steps:**

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/g8s-lpg.git
   cd g8s-lpg
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Setup SSL (Let's Encrypt)**
   ```bash
   # Install certbot
   sudo apt install certbot python3-certbot-nginx

   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

### **Option 3: AWS/GCP/Azure (Enterprise)**

#### **AWS Deployment:**

1. **Frontend (S3 + CloudFront)**
   ```bash
   # Build and upload to S3
   npm run build
   aws s3 sync out/ s3://your-bucket-name
   
   # Configure CloudFront distribution
   # Point to S3 bucket
   ```

2. **Backend (ECS/EKS)**
   ```bash
   # Build Docker image
   docker build -t g8s-backend .
   
   # Push to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker tag g8s-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/g8s-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/g8s-backend:latest
   
   # Deploy to ECS
   # Create ECS service with your image
   ```

3. **Database (MongoDB Atlas)**
   - Use MongoDB Atlas for managed database
   - Configure VPC peering for security
   - Enable backup and monitoring

## 🔧 **Environment Configuration**

### **Production Environment Variables:**

#### **Frontend (.env.local):**
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
NEXT_PUBLIC_G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
NEXT_PUBLIC_G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
NEXT_PUBLIC_PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
```

#### **Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/g8s-lpg?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-domain.com
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com
```

## 🛡️ **Security Checklist**

### **Before Deployment:**

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Configure CORS properly
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Enable database authentication
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Test all endpoints

### **Security Headers:**
```javascript
// Add to your server configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://sepolia.infura.io"],
    },
  },
}));
```

## 📊 **Monitoring & Analytics**

### **Recommended Tools:**

1. **Application Monitoring**
   - Sentry (error tracking)
   - LogRocket (user sessions)
   - New Relic (performance)

2. **Infrastructure Monitoring**
   - Uptime Robot (uptime monitoring)
   - DataDog (server metrics)
   - CloudWatch (AWS)

3. **Analytics**
   - Google Analytics
   - Mixpanel (user behavior)
   - Hotjar (user experience)

## 🚀 **Deployment Commands**

### **Quick Deploy Script:**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Deploying G8S LPG to production..."

# Build frontend
cd g8s-frontend
npm run build
cd ..

# Build backend
cd g8s-backend
npm run build
cd ..

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!"
echo "Frontend: https://your-domain.com"
echo "Backend: https://api.your-domain.com"
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions (.github/workflows/deploy.yml):**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./g8s-frontend
          
      - name: Deploy to Railway
        uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          working-directory: ./g8s-backend
```

## 📋 **Post-Deployment Checklist**

- [ ] Test all frontend pages
- [ ] Verify API endpoints
- [ ] Check database connections
- [ ] Test wallet connections
- [ ] Verify email notifications
- [ ] Check SSL certificates
- [ ] Monitor error logs
- [ ] Test backup procedures
- [ ] Verify monitoring tools
- [ ] Update DNS records
- [ ] Configure CDN (if needed)

## 🎯 **Performance Optimization**

### **Frontend:**
- ✅ Next.js automatic optimizations
- ✅ Image optimization
- ✅ Code splitting
- ✅ Static generation
- ✅ CDN delivery

### **Backend:**
- ✅ Connection pooling
- ✅ Caching strategies
- ✅ Rate limiting
- ✅ Compression
- ✅ Database indexing

## 🚀 **Your G8S LPG Platform is Ready!**

After deployment, your platform will be available at:
- **Frontend**: https://your-domain.com
- **Backend API**: https://api.your-domain.com
- **Admin Panel**: https://your-domain.com/admin

**No private keys required - completely secure!** 🔒

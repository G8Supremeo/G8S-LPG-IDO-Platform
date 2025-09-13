# G8S LPG - Supabase Setup Guide

## 🚀 **Complete Supabase Configuration**

### **Step 1: Create Supabase Project**

1. **Go to Supabase**
   - Visit: https://supabase.com
   - Sign up/Login with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose organization
   - Project name: `g8s-lpg`
   - Database password: Generate strong password
   - Region: Choose closest to your users
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll get project URL and API keys

### **Step 2: Configure Database Schema**

1. **Go to SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in sidebar

2. **Run Schema Script**
   - Copy the contents of `g8s-backend/supabase-schema.sql`
   - Paste in SQL Editor
   - Click "Run" to execute

3. **Verify Tables Created**
   - Go to "Table Editor"
   - You should see: users, transactions, tokens, analytics, notifications, ido_settings

### **Step 3: Configure Environment Variables**

1. **Get Project Credentials**
   - Go to Settings → API
   - Copy the following:
     - Project URL
     - Anon public key
     - Service role key

2. **Update Backend .env File**
   ```env
   # Supabase Configuration
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=noreply@g8s-lpg.com
   
   # Other settings
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
   G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
   G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
   PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
   ```

### **Step 4: Configure Email Service**

1. **Gmail App Password Setup**
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

2. **Update SMTP Settings**
   - Use the app password in `SMTP_PASS`
   - Use your Gmail address in `SMTP_USER`

### **Step 5: Start Backend with Supabase**

1. **Install Dependencies**
   ```bash
   cd g8s-backend
   npm install @supabase/supabase-js
   ```

2. **Start Supabase Server**
   ```bash
   # Use the new Supabase server
   node server-supabase.js
   ```

3. **Verify Connection**
   - Check logs for "✅ Supabase connection successful"
   - Test API endpoints

### **Step 6: Test Admin Dashboard**

1. **Access Admin Dashboard**
   - Go to: http://localhost:3000/admin
   - Should show real data from Supabase

2. **Test Admin Features**
   - View user statistics
   - Check transaction history
   - Update IDO settings
   - Send notifications

## 🎯 **Admin Dashboard Features**

### **Real-time Statistics:**
- ✅ Total users count
- ✅ Total transactions
- ✅ Total volume raised
- ✅ Active users (24h)
- ✅ New users (24h)

### **User Management:**
- ✅ View all users
- ✅ Update user status
- ✅ KYC management
- ✅ User activity tracking

### **Transaction Monitoring:**
- ✅ All transactions list
- ✅ Transaction details
- ✅ Status updates
- ✅ Real-time updates

### **IDO Controls:**
- ✅ Pause/Resume IDO
- ✅ Update token price
- ✅ Set IDO parameters
- ✅ Monitor progress

### **Analytics:**
- ✅ Daily/Weekly/Monthly reports
- ✅ User growth charts
- ✅ Transaction volume
- ✅ Conversion rates

### **Notifications:**
- ✅ Send broadcast messages
- ✅ Email notifications
- ✅ Real-time updates
- ✅ User-specific alerts

## 📧 **Email Notifications**

### **Available Templates:**
- ✅ **Welcome Email** - New user registration
- ✅ **Investment Confirmation** - IDO purchase confirmation
- ✅ **KYC Status Update** - Verification status changes
- ✅ **Password Reset** - Account recovery
- ✅ **IDO Announcements** - Important updates

### **Email Features:**
- ✅ Professional HTML templates
- ✅ Responsive design
- ✅ Branded styling
- ✅ Automatic sending
- ✅ Delivery tracking

## 🔧 **Testing Commands**

### **Test Supabase Connection:**
```bash
# Test database connection
curl http://localhost:5000/health

# Test admin API
curl http://localhost:5000/api/admin/stats
```

### **Test Email Service:**
```bash
# Check backend logs for:
# "✅ Email service initialized successfully"
```

### **Test Admin Dashboard:**
```bash
# Open browser to:
http://localhost:3000/admin
```

## 🚀 **Production Deployment**

### **For Vercel + Railway:**
1. **Deploy Frontend to Vercel**
2. **Deploy Backend to Railway**
3. **Add Supabase environment variables to Railway**
4. **Update frontend backend URL**

### **Environment Variables for Production:**
```env
# Railway Backend Environment Variables
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com
NODE_ENV=production
FRONTEND_URL=https://your-project.vercel.app
```

## ✅ **Verification Checklist**

- [ ] Supabase project created
- [ ] Database schema executed
- [ ] Environment variables configured
- [ ] Email service working
- [ ] Backend connecting to Supabase
- [ ] Admin dashboard functional
- [ ] Real-time updates working
- [ ] Email notifications sending

## 🎉 **Your G8S LPG Platform is Ready!**

### **What You Get:**
- ✅ **Real Database** - Supabase PostgreSQL
- ✅ **Admin Dashboard** - Full management interface
- ✅ **Email Notifications** - Professional templates
- ✅ **Real-time Updates** - WebSocket integration
- ✅ **User Management** - Complete user system
- ✅ **Analytics** - Detailed reporting
- ✅ **Production Ready** - Scalable architecture

**Ready to launch your IDO!** 🚀

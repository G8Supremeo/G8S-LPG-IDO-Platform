# Railway Environment Variables Setup - Supabase Configuration

To fix your backend crashes on Railway, you need to set up the following environment variables in your Railway dashboard:

## 🔴 **REQUIRED Environment Variables**

### **Core Application**
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### **Authentication (CRITICAL)**
```
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=30d
```

### **Supabase Database (CRITICAL)**
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_KEY=your-supabase-service-role-key-here
```

### **Blockchain Configuration (REQUIRED)**
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-key
IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
```

## 🟡 **OPTIONAL Environment Variables**

### **Email Service**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com
```

### **Security & Rate Limiting**
```
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **External APIs**
```
ETHERSCAN_API_KEY=your-etherscan-api-key
COINMARKETCAP_API_KEY=your-coinmarketcap-api-key
```

## How to Set Environment Variables in Railway

1. Go to your Railway dashboard
2. Select your backend project
3. Go to **Variables** tab
4. Add each variable:
   - **Name**: The variable name (e.g., `JWT_SECRET`)
   - **Value**: The actual value
5. Click **Add**
6. Redeploy your application

## Important Notes

- **JWT_SECRET**: Generate a strong random string (at least 32 characters)
- **Supabase Keys**: Get these from your Supabase project dashboard
- **RPC URL**: Use a reliable provider like Infura, Alchemy, or QuickNode
- **Contract Addresses**: Make sure these are correct and deployed on Sepolia

## Quick Fix Commands

If you need to generate a JWT secret quickly:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Testing

After setting up environment variables:
1. Redeploy your application
2. Check the logs for any remaining errors
3. Test the `/health` endpoint
4. Verify database connections work

## Common Issues

- **Missing JWT_SECRET**: Causes authentication failures
- **Invalid Supabase keys**: Causes database connection failures
- **Wrong RPC URL**: Causes blockchain service failures
- **Missing contract addresses**: Causes contract interaction failures

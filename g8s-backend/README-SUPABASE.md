# 🚀 G8S LPG Backend - Supabase + Railway

Backend API for the G8S LPG IDO Platform using Supabase database and deployed on Railway.

## 🏗️ Architecture

- **Database**: Supabase (PostgreSQL)
- **Hosting**: Railway
- **Authentication**: JWT + Supabase Auth
- **Blockchain**: Ethers.js + Sepolia Testnet
- **Real-time**: WebSocket connections

## ⚡ Quick Start

### 1. Setup Environment Variables
```bash
npm run setup
```
This will generate a JWT secret and show you all required environment variables.

### 2. Check Environment Variables
```bash
npm run check-env
```
Verify all required environment variables are set.

### 3. Test Startup
```bash
npm run test-startup
```
Test if the server starts correctly.

### 4. Start Development Server
```bash
npm run dev
```

## 🚀 Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set the root directory to `g8s-backend`
3. Add all required environment variables
4. Deploy!

### Required Environment Variables
```bash
# Core
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app

# Authentication
JWT_SECRET=your-generated-jwt-secret
JWT_EXPIRE=30d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Blockchain
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-key
IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
```

## 📚 API Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/tokens/info` - Token information
- `POST /api/transactions/purchase` - Purchase tokens
- `GET /api/analytics/dashboard` - Analytics data
- `GET /api/notifications` - User notifications

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run setup` - Generate environment variables
- `npm run check-env` - Check environment variables
- `npm run test-startup` - Test server startup
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Project Structure
```
g8s-backend/
├── routes/           # API routes
├── services/         # Business logic
├── middleware/       # Express middleware
├── models/          # Data models (Mongoose - legacy)
├── contracts/       # Smart contract ABIs
├── supabase-config.js # Supabase configuration
├── server-supabase.js # Main server file
└── startup-check.js  # Environment validation
```

## 🗄️ Database Schema

The backend uses Supabase (PostgreSQL) with the following main tables:
- `users` - User accounts and profiles
- `transactions` - Token purchase transactions
- `tokens` - Token information and prices
- `analytics` - Platform analytics data
- `notifications` - User notifications
- `ido_settings` - IDO configuration

## 🔐 Security Features

- JWT authentication
- Rate limiting
- CORS protection
- Input validation
- Error handling
- Helmet security headers

## 📖 Documentation

- [Complete Deployment Guide](../SUPABASE_VERCEL_RAILWAY_DEPLOYMENT.md)
- [Railway Environment Setup](./RAILWAY_ENV_SETUP.md)
- [Supabase Schema](./supabase-schema.sql)

## 🐛 Troubleshooting

### Common Issues
1. **Server crashes on startup**: Check environment variables
2. **Database connection fails**: Verify Supabase credentials
3. **Blockchain errors**: Check RPC URL and contract addresses
4. **CORS errors**: Ensure FRONTEND_URL is set correctly

### Debug Commands
```bash
# Check environment variables
npm run check-env

# Test server startup
npm run test-startup

# View logs
railway logs
```

## 📄 License

MIT License - see LICENSE file for details.

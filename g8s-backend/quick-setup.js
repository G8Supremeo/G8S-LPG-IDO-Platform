#!/usr/bin/env node

// quick-setup.js
// Quick setup script for G8S LPG IDO Platform

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🚀 G8S LPG IDO Platform - Quick Setup\n');

// Generate JWT Secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ Generated JWT Secret:');
console.log(`JWT_SECRET=${jwtSecret}\n`);

// Display required environment variables
console.log('📋 Required Environment Variables for Railway:\n');

const requiredVars = [
  { name: 'NODE_ENV', value: 'production', description: 'Environment mode' },
  { name: 'PORT', value: '5000', description: 'Server port' },
  { name: 'JWT_SECRET', value: jwtSecret, description: 'JWT signing secret' },
  { name: 'JWT_EXPIRE', value: '30d', description: 'JWT expiration time' },
  { name: 'SUPABASE_URL', value: 'https://your-project-id.supabase.co', description: 'Supabase project URL' },
  { name: 'SUPABASE_ANON_KEY', value: 'your-supabase-anon-key', description: 'Supabase anonymous key' },
  { name: 'SUPABASE_SERVICE_KEY', value: 'your-supabase-service-key', description: 'Supabase service role key' },
  { name: 'SEPOLIA_RPC_URL', value: 'https://sepolia.infura.io/v3/your-key', description: 'Sepolia RPC endpoint' },
  { name: 'IDO_ADDRESS', value: '0x182a1b31e2C57B44D6700eEBBD6733511b559782', description: 'IDO contract address' },
  { name: 'G8S_TOKEN_ADDRESS', value: '0xCe28Eb32bbd8c66749b227A860beFcC12e612295', description: 'G8S token contract address' },
  { name: 'PUSD_ADDRESS', value: '0xDd7639e3920426de6c59A1009C7ce2A9802d0920', description: 'PUSD token contract address' },
  { name: 'FRONTEND_URL', value: 'https://your-frontend.vercel.app', description: 'Frontend URL for CORS' }
];

requiredVars.forEach(({ name, value, description }) => {
  console.log(`${name}=${value}  # ${description}`);
});

console.log('\n📋 Required Environment Variables for Vercel:\n');

const frontendVars = [
  { name: 'NEXT_PUBLIC_WC_PROJECT_ID', value: 'your-walletconnect-project-id', description: 'WalletConnect project ID' },
  { name: 'NEXT_PUBLIC_RPC_URL_SEPOLIA', value: 'https://sepolia.infura.io/v3/your-key', description: 'Sepolia RPC endpoint' },
  { name: 'NEXT_PUBLIC_G8S_TOKEN_ADDRESS', value: '0xCe28Eb32bbd8c66749b227A860beFcC12e612295', description: 'G8S token contract address' },
  { name: 'NEXT_PUBLIC_IDO_ADDRESS', value: '0x182a1b31e2C57B44D6700eEBBD6733511b559782', description: 'IDO contract address' },
  { name: 'NEXT_PUBLIC_PUSD_ADDRESS', value: '0xDd7639e3920426de6c59A1009C7ce2A9802d0920', description: 'PUSD token contract address' },
  { name: 'NEXT_PUBLIC_API_URL', value: 'https://g8s-lpg-api.up.railway.app', description: 'Backend API URL' }
];

frontendVars.forEach(({ name, value, description }) => {
  console.log(`${name}=${value}  # ${description}`);
});

console.log('\n🎯 Next Steps:');
console.log('1. Set up Supabase project and get credentials');
console.log('2. Deploy backend to Railway with the environment variables above');
console.log('3. Deploy frontend to Vercel with the environment variables above');
console.log('4. Test the integration');
console.log('\n📖 See SUPABASE_VERCEL_RAILWAY_DEPLOYMENT.md for detailed instructions');

// Create a .env template file
const envTemplate = `# G8S LPG IDO Platform - Environment Variables Template
# Copy this file to .env and fill in your actual values

# Core Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app

# Authentication
JWT_SECRET=${jwtSecret}
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

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com
`;

try {
  fs.writeFileSync(path.join(__dirname, '.env.template'), envTemplate);
  console.log('\n✅ Created .env.template file for reference');
} catch (error) {
  console.log('\n⚠️  Could not create .env.template file:', error.message);
}

console.log('\n🎉 Setup complete! Happy coding! 🚀');

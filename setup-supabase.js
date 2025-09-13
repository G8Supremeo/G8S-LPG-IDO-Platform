#!/usr/bin/env node

// G8S LPG Supabase Setup Script
const fs = require('fs');
const path = require('path');

console.log('🚀 G8S LPG Supabase Setup');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, 'g8s-backend', '.env');
const envExamplePath = path.join(__dirname, 'g8s-backend', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created from example');
  } else {
    // Create basic .env file
    const envContent = `# G8S LPG Backend Environment Variables

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

# Server Configuration
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000

# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created with default values');
  }
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next Steps:');
console.log('1. Create Supabase project at: https://supabase.com');
console.log('2. Run the SQL schema from: g8s-backend/supabase-schema.sql');
console.log('3. Update g8s-backend/.env with your Supabase credentials');
console.log('4. Configure email settings in .env file');
console.log('5. Start the backend: cd g8s-backend && npm run dev:supabase');
console.log('6. Test admin dashboard: http://localhost:3000/admin');

console.log('\n📚 Documentation:');
console.log('- Supabase Setup: SUPABASE-SETUP.md');
console.log('- Vercel Deployment: VERCEL-DEPLOYMENT.md');

console.log('\n🎯 Quick Commands:');
console.log('cd g8s-backend');
console.log('npm install @supabase/supabase-js');
console.log('npm run dev:supabase');

console.log('\n✅ Setup complete! Follow the next steps above.');

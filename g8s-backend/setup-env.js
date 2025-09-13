const fs = require('fs');
const path = require('path');

// Create a basic .env file for development
const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/g8s-lpg

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=30d

# Blockchain Configuration (Optional - will work without these)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-infura-project-id
PRIVATE_KEY=your-private-key-here
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
G8S_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920

# Email Configuration (Optional - will work without these)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@g8s-lpg.com
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
  console.log('📝 Please update the .env file with your actual configuration values');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n🚀 You can now start the backend server with: npm run dev');
console.log('📋 Make sure MongoDB is running on your system');
console.log('🔧 Update the .env file with your actual configuration values');

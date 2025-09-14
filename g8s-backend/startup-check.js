// startup-check.js
// This script checks for required environment variables and provides helpful error messages

const requiredEnvVars = [
  'JWT_SECRET',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY',
  'SEPOLIA_RPC_URL',
  'IDO_ADDRESS',
  'G8S_TOKEN_ADDRESS',
  'PUSD_ADDRESS'
];

const optionalEnvVars = [
  'FRONTEND_URL',
  'NODE_ENV',
  'PORT',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'ETHERSCAN_API_KEY',
  'COINMARKETCAP_API_KEY'
];

function checkEnvironmentVariables() {
  console.log('🔍 Checking environment variables...\n');
  
  const missing = [];
  const present = [];
  const optional = [];
  
  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  // Check optional variables
  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      optional.push(varName);
    }
  });
  
  // Display results
  if (present.length > 0) {
    console.log('✅ Required environment variables found:');
    present.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('');
  }
  
  if (optional.length > 0) {
    console.log('📋 Optional environment variables found:');
    optional.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('');
  }
  
  if (missing.length > 0) {
    console.log('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('');
    
    console.log('🚨 CRITICAL: The following environment variables are required:');
    console.log('');
    console.log('1. JWT_SECRET - Generate with: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    console.log('2. SUPABASE_URL - Get from your Supabase project dashboard');
    console.log('3. SUPABASE_ANON_KEY - Get from your Supabase project dashboard');
    console.log('4. SUPABASE_SERVICE_KEY - Get from your Supabase project dashboard');
    console.log('5. SEPOLIA_RPC_URL - Get from Infura, Alchemy, or QuickNode');
    console.log('6. IDO_ADDRESS - Your deployed IDO contract address');
    console.log('7. G8S_TOKEN_ADDRESS - Your deployed G8S token contract address');
    console.log('8. PUSD_ADDRESS - PUSD token contract address');
    console.log('');
    console.log('📝 Set these in your Railway dashboard under Variables tab');
    console.log('📖 See SUPABASE_VERCEL_RAILWAY_DEPLOYMENT.md for complete setup guide');
    console.log('');
    
    return false;
  }
  
  console.log('🎉 All required environment variables are set!');
  console.log('');
  
  return true;
}

function generateJWTSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('hex');
}

function displayHelp() {
  console.log('🚀 G8S LPG Backend Startup Check');
  console.log('=====================================\n');
  
  console.log('This script checks if all required environment variables are set.');
  console.log('If you\'re missing variables, follow the setup guide in RAILWAY_ENV_SETUP.md\n');
  
  const isValid = checkEnvironmentVariables();
  
  if (!isValid) {
    console.log('💡 Quick JWT Secret Generator:');
    console.log(`   JWT_SECRET=${generateJWTSecret()}\n`);
    
    process.exit(1);
  }
  
  console.log('✅ Environment check passed! Starting server...\n');
}

// Run the check
if (require.main === module) {
  displayHelp();
}

module.exports = {
  checkEnvironmentVariables,
  generateJWTSecret
};

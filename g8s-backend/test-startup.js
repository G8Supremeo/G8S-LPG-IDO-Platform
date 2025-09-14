// test-startup.js
// Simple test script to verify backend startup

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing G8S Backend Startup...\n');

// Test environment variable check
console.log('1. Testing environment variable check...');
const { checkEnvironmentVariables } = require('./startup-check');

try {
  const result = checkEnvironmentVariables();
  if (result) {
    console.log('✅ Environment check passed\n');
  } else {
    console.log('❌ Environment check failed\n');
  }
} catch (error) {
  console.log('❌ Environment check error:', error.message, '\n');
}

// Test server startup (with timeout)
console.log('2. Testing server startup...');
const serverProcess = spawn('node', ['server-supabase.js'], {
  cwd: __dirname,
  stdio: 'pipe',
  env: {
    ...process.env,
    NODE_ENV: 'test',
    PORT: '0' // Use random port for testing
  }
});

let serverStarted = false;
let serverError = false;

serverProcess.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server output:', output);
  
  if (output.includes('Server started successfully') || output.includes('running on port')) {
    serverStarted = true;
    console.log('✅ Server started successfully');
    serverProcess.kill();
  }
});

serverProcess.stderr.on('data', (data) => {
  const error = data.toString();
  console.log('Server error:', error);
  
  if (error.includes('Error') || error.includes('Failed')) {
    serverError = true;
    console.log('❌ Server startup error detected');
    serverProcess.kill();
  }
});

// Timeout after 10 seconds
setTimeout(() => {
  if (!serverStarted && !serverError) {
    console.log('⏰ Server startup test timed out');
    serverProcess.kill();
  }
}, 10000);

serverProcess.on('close', (code) => {
  console.log(`\n🏁 Test completed with exit code: ${code}`);
  
  if (serverStarted) {
    console.log('🎉 Backend startup test PASSED');
    process.exit(0);
  } else {
    console.log('💥 Backend startup test FAILED');
    process.exit(1);
  }
});

serverProcess.on('error', (error) => {
  console.log('❌ Failed to start server process:', error.message);
  process.exit(1);
});

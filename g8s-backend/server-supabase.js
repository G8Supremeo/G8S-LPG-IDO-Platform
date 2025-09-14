// server-supabase.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cron = require('node-cron');
const WebSocket = require('ws');
const http = require('http');
const { SupabaseService } = require('./supabase-config');
const { checkEnvironmentVariables } = require('./startup-check');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tokenRoutes = require('./routes/tokens');
const transactionRoutes = require('./routes/transactions');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Import services
const blockchainService = require('./services/blockchainService');
const notificationService = require('./services/notificationService');
const analyticsService = require('./services/analyticsService');
const emailService = require('./services/emailService');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');
const validationMiddleware = require('./middleware/validation');

const app = express();
const server = http.createServer(app);

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ server });

// Behind proxy (Railway/Render) - trust X-Forwarded-* headers
app.set('trust proxy', 1);

// Initialize Supabase service safely
let supabaseService = null;

if (!global.supabaseService) {
  supabaseService = new SupabaseService();
  global.supabaseService = supabaseService;

  if (!supabaseService.client) {
    console.error("❌ Supabase client not initialized due to missing env vars!");
  }
} else {
  supabaseService = global.supabaseService;
}

// Middleware
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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    database: 'Supabase',
    services: {
      supabase: supabaseService && supabaseService.client ? 'connected' : 'not_configured',
      blockchain: 'read-only',
      websocket: 'active'
    }
  };
  
  res.json(health);
});

// Simple status endpoint for Railway health checks
app.get('/', (req, res) => {
  res.json({
    message: 'G8S LPG Backend API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/transactions', protect, transactionRoutes);
app.use('/api/analytics', protect, analyticsRoutes);
app.use('/api/admin', protect, adminRoutes);
app.use('/api/notifications', protect, notificationRoutes);

// WebSocket connection handling
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
      
      switch (data.type) {
        case 'subscribe':
          ws.subscription = data.channel;
          break;
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast function for real-time updates
const broadcast = (data) => {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Make broadcast function available globally
global.broadcast = broadcast;

// Initialize services
const initializeServices = async () => {
  try {
    await blockchainService.initialize();
    console.log('✅ Blockchain service initialized successfully');
  } catch (error) {
    console.error('❌ Blockchain service initialization failed:', error.message);
    console.log('⚠️  Continuing without blockchain service...');
  }
  
  try {
    await notificationService.initialize();
    console.log('✅ Notification service initialized successfully');
  } catch (error) {
    console.error('❌ Notification service initialization failed:', error.message);
    console.log('⚠️  Continuing without notification service...');
  }

  try {
    await emailService.initialize();
    console.log('✅ Email service initialized successfully');
  } catch (error) {
    console.error('❌ Email service initialization failed:', error.message);
    console.log('⚠️  Continuing without email service...');
  }

  startScheduledTasks();
};

// Start the application
const startApp = async () => {
  console.log('🚀 Starting G8S LPG Backend with Supabase...\n');
  
  // Check environment variables first
  const envCheck = checkEnvironmentVariables();
  if (!envCheck) {
    console.log('❌ Environment check failed. Please set required environment variables.');
    console.log('📝 See RAILWAY_ENV_SETUP.md for setup instructions.');
    process.exit(1);
  }
  
  // Test Supabase connection
  if (supabaseService && supabaseService.client) {
    try {
      const { data, error } = await supabaseService.client
        .from('users')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Supabase connection failed:', error.message);
      } else {
        console.log('✅ Supabase connection successful');
      }
    } catch (error) {
      console.error('❌ Supabase connection error:', error.message);
    }
  } else {
    console.warn('⚠️ Supabase client not initialized. Skipping connection test.');
  }

  await initializeServices();
  
  console.log('🎉 Server started successfully with Supabase!');
  console.log('📝 To enable full functionality, configure your Supabase environment variables');
};

startApp();

// Scheduled tasks
function startScheduledTasks() {
  const USE_MONGO = (process.env.USE_MONGO || '').toLowerCase() === 'true';

  // Update token prices every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      if (blockchainService.isInitialized) {
        await blockchainService.updateTokenPrices();
        console.log('Token prices updated');
      }
    } catch (error) {
      console.error('Error updating token prices:', error);
    }
  });

  // Process pending transactions every minute
  cron.schedule('* * * * *', async () => {
    try {
      if (blockchainService.isInitialized && USE_MONGO) {
        await blockchainService.processPendingTransactions();
        console.log('Pending transactions processed');
      }
    } catch (error) {
      console.error('Error processing pending transactions:', error);
    }
  });

  // Generate analytics reports every hour
  cron.schedule('0 * * * *', async () => {
    try {
      await analyticsService.generateHourlyReport();
      console.log('Hourly analytics report generated');
    } catch (error) {
      console.error('Error generating analytics report:', error);
    }
  });

  // Clean up old notifications daily
  cron.schedule('0 0 * * *', async () => {
    try {
      if (notificationService.isInitialized && USE_MONGO) {
        await notificationService.cleanupOldNotifications();
        console.log('Old notifications cleaned up');
      }
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 G8S LPG Backend Server running on port ${PORT}`);
  console.log(`📊 WebSocket server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🗄️  Database: Supabase`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

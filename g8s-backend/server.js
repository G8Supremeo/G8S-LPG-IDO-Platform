const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cron = require('node-cron');
const WebSocket = require('ws');
const http = require('http');

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

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
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
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to G8S LPG real-time updates',
    timestamp: new Date().toISOString()
  }));

  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received WebSocket message:', data);
      
      // Handle different message types
      switch (data.type) {
        case 'subscribe':
          // Subscribe to specific updates
          ws.subscriptions = data.subscriptions || [];
          ws.send(JSON.stringify({
            type: 'subscribed',
            subscriptions: ws.subscriptions,
            timestamp: new Date().toISOString()
          }));
          break;
        case 'ping':
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type',
            timestamp: new Date().toISOString()
          }));
      }
    } catch (error) {
      console.error('WebSocket message parsing error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
        timestamp: new Date().toISOString()
      }));
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast function for real-time updates
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Make broadcast function available globally
global.broadcast = broadcast;

// Database connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/g8s-lpg', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without database - some features will be limited');
    return false;
  }
};

// Initialize services
const initializeServices = async () => {
  // Initialize blockchain service (with error handling)
  try {
    await blockchainService.initialize();
    console.log('✅ Blockchain service initialized successfully');
  } catch (error) {
    console.error('❌ Blockchain service initialization failed:', error.message);
    console.log('⚠️  Continuing without blockchain service...');
  }
  
  // Initialize other services
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
  
  // Start scheduled tasks
  startScheduledTasks();
};

// Start the application
const startApp = async () => {
  const dbConnected = await connectToDatabase();
  await initializeServices();
  
  if (dbConnected) {
    console.log('🎉 All services initialized successfully!');
  } else {
    console.log('🎉 Server started in limited mode (no database)');
    console.log('📝 To enable full functionality, install and start MongoDB');
  }
};

startApp();

// Scheduled tasks
function startScheduledTasks() {
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
      if (blockchainService.isInitialized) {
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
      if (notificationService.isInitialized) {
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
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 G8S LPG Backend Server running on port ${PORT}`);
  console.log(`📊 WebSocket server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = { app, server, wss };

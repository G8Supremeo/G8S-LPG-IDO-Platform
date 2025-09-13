// Load environment variables FIRST
const dotenv = require('dotenv');
dotenv.config();

// Imports
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cron = require('node-cron');
const WebSocket = require('ws');
const http = require('http');
const { SupabaseService } = require('./supabase-config');

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

// WebSocket server
const wss = new WebSocket.Server({ server });
app.set('trust proxy', 1);

// --- Initialize Supabase service ---
const supabaseService = global.supabaseService || new SupabaseService();
global.supabaseService = supabaseService;

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

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP,

const jwt = require('jsonwebtoken');
const USE_MONGO = (process.env.USE_MONGO || '').toLowerCase() === 'true';
let User;
if (USE_MONGO) {
  User = require('../models/User');
}
const { SupabaseService } = require('../supabase-config');
const supabaseService = global.supabaseService || new SupabaseService();

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      if (USE_MONGO) {
        req.user = await User.findById(decoded.id).select('-password');
      } else if (supabaseService && supabaseService.client) {
        const { data: userRow, error } = await supabaseService.client
          .from(supabaseService.tables.USERS)
          .select('*')
          .eq('id', decoded.id)
          .single();
        if (error) {
          throw error;
        }
        req.user = userRow;
      } else {
        req.user = null;
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized, user not found'
        });
      }

      // Check if account is active
      if (req.user.accountStatus !== 'active') {
        return res.status(401).json({
          success: false,
          error: 'Account is not active'
        });
      }

      // Check if account is locked
      if (USE_MONGO && req.user && typeof req.user.isLocked === 'function' && req.user.isLocked()) {
        return res.status(401).json({
          success: false,
          error: 'Account is temporarily locked due to multiple failed login attempts'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized, no token'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  next();
};

// Check if user is owner or admin
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  // Check if user is admin
  if (req.user.role === 'admin') {
    return next();
  }

  // Check if user is the owner of the resource
  const currentUserId = req.user._id ? req.user._id.toString() : String(req.user.id);
  if (req.params.userId && currentUserId === req.params.userId) {
    return next();
  }

  // Check if user is the owner of the resource in body
  if (req.body.userId && currentUserId === req.body.userId) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Access denied'
  });
};

// Check if user has completed KYC
const requireKYC = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  if (req.user.kycStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      error: 'KYC verification required'
    });
  }

  next();
};

// Check if user has connected wallet
const requireWallet = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  if (!req.user.walletConnected || !req.user.walletAddress) {
    return res.status(403).json({
      success: false,
      error: 'Wallet connection required'
    });
  }

  next();
};

// Check if user has verified email
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required'
    });
  }

  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (USE_MONGO) {
        req.user = await User.findById(decoded.id).select('-password');
      } else if (supabaseService && supabaseService.client) {
        const { data: userRow } = await supabaseService.client
          .from(supabaseService.tables.USERS)
          .select('*')
          .eq('id', decoded.id)
          .single();
        req.user = userRow || null;
      } else {
        req.user = null;
      }
    } catch (error) {
      // Don't fail, just continue without user
      req.user = null;
    }
  }

  next();
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (req, res, next) => {
  // This would integrate with express-rate-limit
  // For now, just pass through
  next();
};

// Check if user can perform investment
const canInvest = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  // Check all requirements for investment
  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required for investment'
    });
  }

  if (!req.user.walletConnected) {
    return res.status(403).json({
      success: false,
      error: 'Wallet connection required for investment'
    });
  }

  if (req.user.kycStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      error: 'KYC verification required for investment'
    });
  }

  if (req.user.accountStatus !== 'active') {
    return res.status(403).json({
      success: false,
      error: 'Account must be active to invest'
    });
  }

  next();
};

// Check if user can access admin features
const canAccessAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
    return res.status(403).json({
      success: false,
      error: 'Admin or moderator access required'
    });
  }

  next();
};

// Check if user can access analytics
const canAccessAnalytics = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized'
    });
  }

  // Allow access for admin, moderator, or users with analytics permission
  if (req.user.role === 'admin' || req.user.role === 'moderator' || req.user.permissions?.analytics) {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Analytics access required'
  });
};

module.exports = {
  protect,
  authorize,
  isAdmin,
  isOwnerOrAdmin,
  requireKYC,
  requireWallet,
  requireEmailVerification,
  optionalAuth,
  sensitiveOperationLimit,
  canInvest,
  canAccessAdmin,
  canAccessAnalytics
};

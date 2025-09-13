const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  handleValidationErrors
];

const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  handleValidationErrors
];

// Wallet validation rules
const validateWalletAddress = [
  body('walletAddress')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid wallet address format'),
  handleValidationErrors
];

const validateWalletConnection = [
  body('walletAddress')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid wallet address format'),
  body('walletProvider')
    .isIn(['MetaMask', 'WalletConnect', 'Coinbase', 'Trust', 'Other'])
    .withMessage('Invalid wallet provider'),
  body('signature')
    .notEmpty()
    .withMessage('Signature is required for wallet connection'),
  handleValidationErrors
];

// Transaction validation rules
const validateTransaction = [
  body('tokenIn')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid input token address'),
  body('tokenOut')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid output token address'),
  body('amountIn')
    .isNumeric()
    .isFloat({ min: 0.000001 })
    .withMessage('Amount must be a positive number'),
  body('amountOut')
    .isNumeric()
    .isFloat({ min: 0.000001 })
    .withMessage('Output amount must be a positive number'),
  body('slippageTolerance')
    .optional()
    .isFloat({ min: 0.1, max: 50 })
    .withMessage('Slippage tolerance must be between 0.1% and 50%'),
  handleValidationErrors
];

const validateInvestment = [
  body('amount')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Investment amount must be at least $1'),
  body('tokenAddress')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid token address'),
  body('paymentToken')
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid payment token address'),
  handleValidationErrors
];

// KYC validation rules
const validateKYCDocument = [
  body('documentType')
    .isIn(['passport', 'drivers_license', 'national_id'])
    .withMessage('Invalid document type'),
  body('documentNumber')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Document number must be between 5 and 50 characters'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date of birth format'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Address must be between 10 and 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  body('postalCode')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Postal code must be between 3 and 20 characters'),
  handleValidationErrors
];

// Admin validation rules
const validateAdminAction = [
  body('action')
    .isIn(['pause', 'resume', 'setPrice', 'withdraw', 'sweep'])
    .withMessage('Invalid admin action'),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Value must be a number'),
  handleValidationErrors
];

const validateTokenCreation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Token name must be between 2 and 100 characters'),
  body('symbol')
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage('Token symbol must be between 2 and 10 characters'),
  body('decimals')
    .isInt({ min: 0, max: 18 })
    .withMessage('Decimals must be between 0 and 18'),
  body('totalSupply')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('Total supply must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  handleValidationErrors
];

// Query validation rules
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'amount', 'status'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  handleValidationErrors
];

const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  query('startDate')
    .custom((value, { req }) => {
      if (value && req.query.endDate && new Date(value) > new Date(req.query.endDate)) {
        throw new Error('Start date must be before end date');
      }
      return true;
    }),
  handleValidationErrors
];

// Parameter validation rules
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

const validateTransactionHash = [
  param('hash')
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage('Invalid transaction hash format'),
  handleValidationErrors
];

// Notification validation rules
const validateNotification = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('type')
    .isIn(['transaction', 'investment', 'kyc', 'security', 'marketing', 'system', 'referral', 'reward', 'alert', 'reminder'])
    .withMessage('Invalid notification type'),
  body('category')
    .optional()
    .isIn(['success', 'error', 'warning', 'info', 'promotion'])
    .withMessage('Invalid notification category'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 5MB'
      });
    }

    next();
  };
};

// Custom validation for investment limits
const validateInvestmentLimits = (req, res, next) => {
  const { amount } = req.body;
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'User not authenticated'
    });
  }

  // Check minimum investment based on user tier
  const minInvestments = {
    bronze: 10,
    silver: 50,
    gold: 100,
    platinum: 500,
    diamond: 1000
  };

  const minInvestment = minInvestments[user.investmentProfile.investmentTier] || 10;

  if (amount < minInvestment) {
    return res.status(400).json({
      success: false,
      error: `Minimum investment for your tier is $${minInvestment}`
    });
  }

  // Check maximum investment based on user tier
  const maxInvestments = {
    bronze: 1000,
    silver: 5000,
    gold: 10000,
    platinum: 50000,
    diamond: 100000
  };

  const maxInvestment = maxInvestments[user.investmentProfile.investmentTier] || 1000;

  if (amount > maxInvestment) {
    return res.status(400).json({
      success: false,
      error: `Maximum investment for your tier is $${maxInvestment}`
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validatePasswordUpdate,
  validateWalletAddress,
  validateWalletConnection,
  validateTransaction,
  validateInvestment,
  validateKYCDocument,
  validateAdminAction,
  validateTokenCreation,
  validatePagination,
  validateDateRange,
  validateObjectId,
  validateTransactionHash,
  validateNotification,
  validateFileUpload,
  validateInvestmentLimits
};

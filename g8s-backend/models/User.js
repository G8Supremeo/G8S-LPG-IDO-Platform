const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  
  // Wallet Information
  walletAddress: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return !v || /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  walletConnected: {
    type: Boolean,
    default: false
  },
  walletProvider: {
    type: String,
    enum: ['MetaMask', 'WalletConnect', 'Coinbase', 'Trust', 'Other'],
    default: null
  },
  
  // KYC Information
  kycStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'not_started'],
    default: 'not_started'
  },
  kycDocuments: {
    identityDocument: String,
    proofOfAddress: String,
    selfie: String,
    submittedAt: Date,
    reviewedAt: Date,
    reviewedBy: String,
    rejectionReason: String
  },
  
  // Investment Information
  investmentProfile: {
    totalInvested: {
      type: Number,
      default: 0
    },
    totalTokensPurchased: {
      type: Number,
      default: 0
    },
    investmentTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
      default: 'bronze'
    },
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate'
    },
    investmentGoals: [String],
    annualIncome: {
      type: String,
      enum: ['under_25k', '25k_50k', '50k_100k', '100k_250k', '250k_500k', 'over_500k'],
      default: null
    }
  },
  
  // Account Status
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'banned', 'pending_verification'],
    default: 'pending_verification'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Security
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Preferences
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      marketing: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Referral System
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralRewards: {
    type: Number,
    default: 0
  },
  
  // Activity Tracking
  lastLogin: Date,
  lastActivity: Date,
  loginHistory: [{
    timestamp: Date,
    ipAddress: String,
    userAgent: String,
    location: String
  }],
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    country: String,
    city: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ walletAddress: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'investmentProfile.totalInvested': -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account age
userSchema.virtual('accountAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to generate referral code
userSchema.pre('save', function(next) {
  if (this.isNew && !this.referralCode) {
    this.referralCode = this._id.toString().slice(-8).toUpperCase();
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to find by referral code
userSchema.statics.findByReferralCode = function(code) {
  return this.findOne({ referralCode: code.toUpperCase() });
};

// Static method to get top investors
userSchema.statics.getTopInvestors = function(limit = 10) {
  return this.find({ accountStatus: 'active' })
    .sort({ 'investmentProfile.totalInvested': -1 })
    .limit(limit)
    .select('firstName lastName investmentProfile.totalInvested investmentProfile.totalTokensPurchased createdAt');
};

// Static method to get user statistics
userSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$accountStatus', 'active'] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: [{ $eq: ['$emailVerified', true] }, 1, 0] }
        },
        kycApprovedUsers: {
          $sum: { $cond: [{ $eq: ['$kycStatus', 'approved'] }, 1, 0] }
        },
        totalInvestment: { $sum: '$investmentProfile.totalInvested' },
        averageInvestment: { $avg: '$investmentProfile.totalInvested' }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    kycApprovedUsers: 0,
    totalInvestment: 0,
    averageInvestment: 0
  };
};

module.exports = mongoose.model('User', userSchema);

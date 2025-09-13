const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction Identification
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{64}$/.test(v);
      },
      message: 'Invalid transaction hash format'
    }
  },
  blockNumber: {
    type: Number,
    required: true
  },
  blockHash: {
    type: String,
    required: true
  },
  transactionIndex: {
    type: Number,
    required: true
  },
  
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid wallet address format'
    }
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: ['purchase', 'refund', 'withdrawal', 'transfer', 'approval', 'claim'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed', 'cancelled'],
    default: 'pending'
  },
  
  // Token Information
  tokenIn: {
    address: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    amount: {
      type: String, // Using string to handle large numbers
      required: true
    },
    decimals: {
      type: Number,
      default: 18
    }
  },
  tokenOut: {
    address: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    amount: {
      type: String, // Using string to handle large numbers
      required: true
    },
    decimals: {
      type: Number,
      default: 18
    }
  },
  
  // Financial Information
  amountInUSD: {
    type: Number,
    required: true
  },
  amountInNGN: {
    type: Number,
    required: true
  },
  exchangeRate: {
    type: Number,
    required: true
  },
  gasUsed: {
    type: String,
    default: '0'
  },
  gasPrice: {
    type: String,
    default: '0'
  },
  gasCost: {
    type: String,
    default: '0'
  },
  gasCostUSD: {
    type: Number,
    default: 0
  },
  
  // IDO Specific Information
  idoRound: {
    type: String,
    enum: ['presale', 'public', 'private'],
    default: 'public'
  },
  tokensPerUSD: {
    type: Number,
    required: true
  },
  bonusPercentage: {
    type: Number,
    default: 0
  },
  bonusTokens: {
    type: String,
    default: '0'
  },
  
  // Transaction Metadata
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  value: {
    type: String,
    default: '0'
  },
  nonce: {
    type: Number,
    required: true
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    required: true
  },
  confirmedAt: Date,
  failedAt: Date,
  
  // Error Information
  error: {
    code: String,
    message: String,
    details: String
  },
  
  // Receipt Information
  receipt: {
    status: {
      type: Number,
      default: 1
    },
    cumulativeGasUsed: String,
    effectiveGasPrice: String,
    logs: [{
      address: String,
      topics: [String],
      data: String,
      logIndex: Number,
      transactionIndex: Number,
      transactionHash: String,
      blockHash: String,
      blockNumber: Number
    }]
  },
  
  // Additional Data
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    userAgent: String,
    ipAddress: String,
    referrer: String,
    campaign: String
  },
  
  // Processing Information
  processed: {
    type: Boolean,
    default: false
  },
  processedAt: Date,
  processingAttempts: {
    type: Number,
    default: 0
  },
  lastProcessingAttempt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ walletAddress: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ blockNumber: -1 });
transactionSchema.index({ timestamp: -1 });
transactionSchema.index({ amountInUSD: -1 });
transactionSchema.index({ processed: 1, processingAttempts: 1 });

// Virtual for transaction age
transactionSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.timestamp) / (1000 * 60 * 60 * 24));
});

// Virtual for confirmation time
transactionSchema.virtual('confirmationTime').get(function() {
  if (this.confirmedAt && this.timestamp) {
    return Math.floor((this.confirmedAt - this.timestamp) / 1000); // seconds
  }
  return null;
});

// Pre-save middleware to calculate NGN amount
transactionSchema.pre('save', function(next) {
  if (this.amountInUSD && this.exchangeRate && !this.amountInNGN) {
    this.amountInNGN = this.amountInUSD * this.exchangeRate;
  }
  next();
});

// Instance method to mark as confirmed
transactionSchema.methods.markAsConfirmed = function(receipt) {
  this.status = 'confirmed';
  this.confirmedAt = new Date();
  this.receipt = receipt;
  this.processed = true;
  this.processedAt = new Date();
  return this.save();
};

// Instance method to mark as failed
transactionSchema.methods.markAsFailed = function(error) {
  this.status = 'failed';
  this.failedAt = new Date();
  this.error = error;
  return this.save();
};

// Instance method to increment processing attempts
transactionSchema.methods.incrementProcessingAttempts = function() {
  this.processingAttempts += 1;
  this.lastProcessingAttempt = new Date();
  return this.save();
};

// Static method to get transaction statistics
transactionSchema.statics.getTransactionStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalVolume: { $sum: '$amountInUSD' },
        totalVolumeNGN: { $sum: '$amountInNGN' },
        averageTransaction: { $avg: '$amountInUSD' },
        confirmedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
        },
        pendingTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        failedTransactions: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalTransactions: 0,
    totalVolume: 0,
    totalVolumeNGN: 0,
    averageTransaction: 0,
    confirmedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0
  };
};

// Static method to get daily transaction volume
transactionSchema.statics.getDailyVolume = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate },
        status: 'confirmed'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        },
        dailyVolume: { $sum: '$amountInUSD' },
        dailyVolumeNGN: { $sum: '$amountInNGN' },
        transactionCount: { $sum: 1 },
        averageTransaction: { $avg: '$amountInUSD' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
    }
  ]);
};

// Static method to get user transaction history
transactionSchema.statics.getUserTransactions = function(userId, limit = 50, skip = 0) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'firstName lastName email')
    .lean();
};

// Static method to get pending transactions
transactionSchema.statics.getPendingTransactions = function() {
  return this.find({ 
    status: 'pending',
    processingAttempts: { $lt: 5 }
  }).sort({ timestamp: 1 });
};

// Static method to get transaction by hash
transactionSchema.statics.findByHash = function(hash) {
  return this.findOne({ transactionHash: hash })
    .populate('user', 'firstName lastName email walletAddress');
};

module.exports = mongoose.model('Transaction', transactionSchema);

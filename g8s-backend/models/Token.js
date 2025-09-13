const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  // Token Identification
  address: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^0x[a-fA-F0-9]{40}$/.test(v);
      },
      message: 'Invalid token address format'
    }
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    maxlength: 10
  },
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  decimals: {
    type: Number,
    required: true,
    min: 0,
    max: 18
  },
  
  // Token Type
  type: {
    type: String,
    enum: ['native', 'erc20', 'erc721', 'erc1155'],
    default: 'erc20'
  },
  standard: {
    type: String,
    enum: ['ERC20', 'ERC721', 'ERC1155', 'Native'],
    default: 'ERC20'
  },
  
  // Token Economics
  totalSupply: {
    type: String, // Using string to handle large numbers
    required: true
  },
  circulatingSupply: {
    type: String,
    default: '0'
  },
  maxSupply: {
    type: String,
    default: null
  },
  
  // Price Information
  price: {
    usd: {
      type: Number,
      default: 0
    },
    ngn: {
      type: Number,
      default: 0
    },
    btc: {
      type: Number,
      default: 0
    },
    eth: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // Market Data
  marketCap: {
    usd: {
      type: Number,
      default: 0
    },
    ngn: {
      type: Number,
      default: 0
    }
  },
  volume24h: {
    usd: {
      type: Number,
      default: 0
    },
    ngn: {
      type: Number,
      default: 0
    }
  },
  priceChange24h: {
    percentage: {
      type: Number,
      default: 0
    },
    absolute: {
      type: Number,
      default: 0
    }
  },
  
  // Token Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'delisted'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isListed: {
    type: Boolean,
    default: true
  },
  
  // Contract Information
  contractInfo: {
    deployer: String,
    deployedAt: Date,
    verifiedAt: Date,
    sourceCode: String,
    abi: mongoose.Schema.Types.Mixed,
    bytecode: String,
    constructorArgs: [String]
  },
  
  // Liquidity Information
  liquidity: {
    totalLiquidity: {
      type: Number,
      default: 0
    },
    liquidityPools: [{
      exchange: String,
      pair: String,
      liquidity: Number,
      volume24h: Number,
      lastUpdated: Date
    }]
  },
  
  // Trading Information
  trading: {
    isTradable: {
      type: Boolean,
      default: true
    },
    minTradeAmount: {
      type: String,
      default: '0'
    },
    maxTradeAmount: {
      type: String,
      default: null
    },
    tradingFees: {
      buy: {
        type: Number,
        default: 0
      },
      sell: {
        type: Number,
        default: 0
      }
    }
  },
  
  // IDO Specific Information
  idoInfo: {
    isIdoToken: {
      type: Boolean,
      default: false
    },
    idoPrice: {
      type: Number,
      default: 0
    },
    idoStartDate: Date,
    idoEndDate: Date,
    idoStatus: {
      type: String,
      enum: ['upcoming', 'active', 'ended', 'cancelled'],
      default: 'upcoming'
    },
    totalIdoTokens: {
      type: String,
      default: '0'
    },
    soldIdoTokens: {
      type: String,
      default: '0'
    },
    idoRaiseTarget: {
      type: Number,
      default: 0
    },
    idoRaiseCurrent: {
      type: Number,
      default: 0
    },
    idoParticipants: {
      type: Number,
      default: 0
    },
    idoWhitelist: [String],
    idoKycRequired: {
      type: Boolean,
      default: false
    }
  },
  
  // Token Metadata
  metadata: {
    description: String,
    website: String,
    whitepaper: String,
    logo: String,
    banner: String,
    social: {
      twitter: String,
      telegram: String,
      discord: String,
      github: String,
      reddit: String,
      medium: String
    },
    tags: [String],
    category: {
      type: String,
      enum: ['DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Energy', 'Other'],
      default: 'Other'
    }
  },
  
  // Statistics
  statistics: {
    holders: {
      type: Number,
      default: 0
    },
    transactions: {
      type: Number,
      default: 0
    },
    transfers: {
      type: Number,
      default: 0
    },
    lastActivity: Date
  },
  
  // Audit Information
  audit: {
    audited: {
      type: Boolean,
      default: false
    },
    auditReport: String,
    auditDate: Date,
    auditor: String,
    securityScore: {
      type: Number,
      min: 0,
      max: 100
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
tokenSchema.index({ address: 1 });
tokenSchema.index({ symbol: 1 });
tokenSchema.index({ 'price.usd': -1 });
tokenSchema.index({ 'marketCap.usd': -1 });
tokenSchema.index({ 'idoInfo.idoStatus': 1 });
tokenSchema.index({ status: 1, isListed: 1 });
tokenSchema.index({ 'metadata.category': 1 });

// Virtual for price change color
tokenSchema.virtual('priceChangeColor').get(function() {
  if (this.priceChange24h.percentage > 0) return 'green';
  if (this.priceChange24h.percentage < 0) return 'red';
  return 'gray';
});

// Virtual for IDO progress percentage
tokenSchema.virtual('idoProgress').get(function() {
  if (this.idoInfo.idoRaiseTarget === 0) return 0;
  return (this.idoInfo.idoRaiseCurrent / this.idoInfo.idoRaiseTarget) * 100;
});

// Virtual for token age
tokenSchema.virtual('age').get(function() {
  if (this.contractInfo.deployedAt) {
    return Math.floor((Date.now() - this.contractInfo.deployedAt) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Pre-save middleware to update market cap
tokenSchema.pre('save', function(next) {
  if (this.price.usd && this.circulatingSupply) {
    const circulatingSupplyNum = parseFloat(this.circulatingSupply);
    const priceUSD = this.price.usd;
    
    this.marketCap.usd = circulatingSupplyNum * priceUSD;
    this.marketCap.ngn = this.marketCap.usd * (this.price.ngn / this.price.usd);
  }
  next();
});

// Instance method to update price
tokenSchema.methods.updatePrice = function(priceData) {
  this.price = {
    ...this.price,
    ...priceData,
    lastUpdated: new Date()
  };
  return this.save();
};

// Instance method to update market data
tokenSchema.methods.updateMarketData = function(marketData) {
  this.volume24h = marketData.volume24h || this.volume24h;
  this.priceChange24h = marketData.priceChange24h || this.priceChange24h;
  this.statistics.lastActivity = new Date();
  return this.save();
};

// Instance method to update IDO progress
tokenSchema.methods.updateIdoProgress = function(raiseAmount, participants = 1) {
  if (this.idoInfo.isIdoToken) {
    this.idoInfo.idoRaiseCurrent += raiseAmount;
    this.idoInfo.idoParticipants += participants;
    this.idoInfo.soldIdoTokens = this.idoInfo.idoRaiseCurrent / this.idoInfo.idoPrice;
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to get active tokens
tokenSchema.statics.getActiveTokens = function() {
  return this.find({ 
    status: 'active', 
    isListed: true 
  }).sort({ 'marketCap.usd': -1 });
};

// Static method to get IDO tokens
tokenSchema.statics.getIdoTokens = function() {
  return this.find({ 
    'idoInfo.isIdoToken': true,
    'idoInfo.idoStatus': { $in: ['upcoming', 'active'] }
  }).sort({ 'idoInfo.idoStartDate': 1 });
};

// Static method to get token by address
tokenSchema.statics.findByAddress = function(address) {
  return this.findOne({ address: address.toLowerCase() });
};

// Static method to get token statistics
tokenSchema.statics.getTokenStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalTokens: { $sum: 1 },
        activeTokens: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        idoTokens: {
          $sum: { $cond: [{ $eq: ['$idoInfo.isIdoToken', true] }, 1, 0] }
        },
        totalMarketCap: { $sum: '$marketCap.usd' },
        totalVolume24h: { $sum: '$volume24h.usd' },
        averagePrice: { $avg: '$price.usd' }
      }
    }
  ]);
  
  return stats[0] || {
    totalTokens: 0,
    activeTokens: 0,
    idoTokens: 0,
    totalMarketCap: 0,
    totalVolume24h: 0,
    averagePrice: 0
  };
};

// Static method to search tokens
tokenSchema.statics.searchTokens = function(query, limit = 20) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { symbol: searchRegex },
      { 'metadata.description': searchRegex },
      { 'metadata.tags': { $in: [searchRegex] } }
    ],
    status: 'active',
    isListed: true
  }).limit(limit);
};

module.exports = mongoose.model('Token', tokenSchema);

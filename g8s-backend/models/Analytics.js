const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // Time Period
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  
  // User Analytics
  users: {
    total: {
      type: Number,
      default: 0
    },
    new: {
      type: Number,
      default: 0
    },
    active: {
      type: Number,
      default: 0
    },
    verified: {
      type: Number,
      default: 0
    },
    kycApproved: {
      type: Number,
      default: 0
    },
    walletConnected: {
      type: Number,
      default: 0
    }
  },
  
  // Transaction Analytics
  transactions: {
    total: {
      type: Number,
      default: 0
    },
    successful: {
      type: Number,
      default: 0
    },
    failed: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    totalVolume: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    averageTransaction: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    }
  },
  
  // IDO Analytics
  ido: {
    totalRaised: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    tokensSold: {
      type: String,
      default: '0'
    },
    participants: {
      type: Number,
      default: 0
    },
    newParticipants: {
      type: Number,
      default: 0
    },
    averageInvestment: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    progressPercentage: {
      type: Number,
      default: 0
    }
  },
  
  // Token Analytics
  tokens: {
    totalTokens: {
      type: Number,
      default: 0
    },
    activeTokens: {
      type: Number,
      default: 0
    },
    totalMarketCap: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    totalVolume: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    priceChanges: {
      positive: {
        type: Number,
        default: 0
      },
      negative: {
        type: Number,
        default: 0
      },
      neutral: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Geographic Analytics
  geography: {
    countries: [{
      country: String,
      users: Number,
      transactions: Number,
      volume: Number
    }],
    topCountries: [{
      country: String,
      percentage: Number
    }]
  },
  
  // Device Analytics
  devices: {
    desktop: {
      type: Number,
      default: 0
    },
    mobile: {
      type: Number,
      default: 0
    },
    tablet: {
      type: Number,
      default: 0
    }
  },
  
  // Browser Analytics
  browsers: [{
    name: String,
    version: String,
    users: Number,
    percentage: Number
  }],
  
  // Referral Analytics
  referrals: {
    totalReferrals: {
      type: Number,
      default: 0
    },
    successfulReferrals: {
      type: Number,
      default: 0
    },
    referralRewards: {
      type: Number,
      default: 0
    },
    topReferrers: [{
      user: mongoose.Schema.Types.ObjectId,
      referrals: Number,
      rewards: Number
    }]
  },
  
  // Performance Metrics
  performance: {
    averagePageLoadTime: {
      type: Number,
      default: 0
    },
    averageApiResponseTime: {
      type: Number,
      default: 0
    },
    errorRate: {
      type: Number,
      default: 0
    },
    uptime: {
      type: Number,
      default: 100
    }
  },
  
  // Financial Metrics
  financial: {
    revenue: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    fees: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    costs: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    },
    profit: {
      usd: {
        type: Number,
        default: 0
      },
      ngn: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Engagement Metrics
  engagement: {
    pageViews: {
      type: Number,
      default: 0
    },
    uniqueVisitors: {
      type: Number,
      default: 0
    },
    sessionDuration: {
      type: Number,
      default: 0
    },
    bounceRate: {
      type: Number,
      default: 0
    },
    returnVisitors: {
      type: Number,
      default: 0
    }
  },
  
  // Conversion Metrics
  conversion: {
    signupRate: {
      type: Number,
      default: 0
    },
    walletConnectionRate: {
      type: Number,
      default: 0
    },
    kycCompletionRate: {
      type: Number,
      default: 0
    },
    investmentConversionRate: {
      type: Number,
      default: 0
    }
  },
  
  // Risk Metrics
  risk: {
    suspiciousTransactions: {
      type: Number,
      default: 0
    },
    blockedUsers: {
      type: Number,
      default: 0
    },
    securityIncidents: {
      type: Number,
      default: 0
    },
    complianceIssues: {
      type: Number,
      default: 0
    }
  },
  
  // Metadata
  metadata: {
    generatedAt: {
      type: Date,
      default: Date.now
    },
    generatedBy: {
      type: String,
      default: 'system'
    },
    dataSource: {
      type: String,
      default: 'database'
    },
    version: {
      type: String,
      default: '1.0'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for efficient queries
analyticsSchema.index({ period: 1, date: -1 });
analyticsSchema.index({ date: -1 });
analyticsSchema.index({ period: 1 });

// Virtual for period label
analyticsSchema.virtual('periodLabel').get(function() {
  const labels = {
    hourly: 'Hour',
    daily: 'Day',
    weekly: 'Week',
    monthly: 'Month',
    yearly: 'Year'
  };
  return labels[this.period] || this.period;
});

// Virtual for growth rate
analyticsSchema.virtual('userGrowthRate').get(function() {
  // This would need to be calculated by comparing with previous period
  return 0;
});

// Static method to get analytics for a specific period
analyticsSchema.statics.getAnalytics = function(period, startDate, endDate) {
  return this.find({
    period: period,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to get latest analytics
analyticsSchema.statics.getLatestAnalytics = function(period = 'daily') {
  return this.findOne({ period: period }).sort({ date: -1 });
};

// Static method to get analytics summary
analyticsSchema.statics.getAnalyticsSummary = async function(period = 'daily', days = 30) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const analytics = await this.find({
    period: period,
    date: { $gte: startDate, $lte: endDate }
  }).sort({ date: 1 });
  
  if (analytics.length === 0) {
    return {
      totalUsers: 0,
      totalTransactions: 0,
      totalVolume: 0,
      totalRaised: 0,
      growthRate: 0,
      trends: []
    };
  }
  
  const summary = {
    totalUsers: analytics[analytics.length - 1].users.total,
    totalTransactions: analytics.reduce((sum, a) => sum + a.transactions.total, 0),
    totalVolume: analytics.reduce((sum, a) => sum + a.transactions.totalVolume.usd, 0),
    totalRaised: analytics.reduce((sum, a) => sum + a.ido.totalRaised.usd, 0),
    growthRate: 0,
    trends: analytics.map(a => ({
      date: a.date,
      users: a.users.total,
      transactions: a.transactions.total,
      volume: a.transactions.totalVolume.usd,
      raised: a.ido.totalRaised.usd
    }))
  };
  
  // Calculate growth rate
  if (analytics.length > 1) {
    const first = analytics[0];
    const last = analytics[analytics.length - 1];
    summary.growthRate = ((last.users.total - first.users.total) / first.users.total) * 100;
  }
  
  return summary;
};

// Static method to generate analytics for a period
analyticsSchema.statics.generateAnalytics = async function(period, date) {
  // This method would aggregate data from various collections
  // and create analytics records
  const analytics = new this({
    period: period,
    date: date,
    // ... populate with aggregated data
  });
  
  return analytics.save();
};

// Static method to get top performing metrics
analyticsSchema.statics.getTopMetrics = async function(period = 'daily', limit = 10) {
  const latest = await this.getLatestAnalytics(period);
  if (!latest) return [];
  
  return [
    { metric: 'Total Users', value: latest.users.total, change: 0 },
    { metric: 'Total Volume', value: latest.transactions.totalVolume.usd, change: 0 },
    { metric: 'IDO Raised', value: latest.ido.totalRaised.usd, change: 0 },
    { metric: 'Active Users', value: latest.users.active, change: 0 },
    { metric: 'Transaction Success Rate', value: (latest.transactions.successful / latest.transactions.total) * 100, change: 0 }
  ];
};

module.exports = mongoose.model('Analytics', analyticsSchema);

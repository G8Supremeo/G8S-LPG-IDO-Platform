const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Token = require('../models/Token');
const Notification = require('../models/Notification');

class AnalyticsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async generateHourlyReport() {
    try {
      const now = new Date();
      const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
      
      // Check if report already exists
      const existingReport = await Analytics.findOne({
        period: 'hourly',
        date: hourStart
      });

      if (existingReport) {
        console.log('Hourly report already exists for this hour');
        return existingReport;
      }

      // Generate analytics data
      const analyticsData = await this.generateAnalyticsData('hourly', hourStart);
      
      // Create analytics record
      const analytics = new Analytics({
        period: 'hourly',
        date: hourStart,
        ...analyticsData
      });

      await analytics.save();
      console.log('Hourly analytics report generated');
      return analytics;
    } catch (error) {
      console.error('Error generating hourly report:', error);
      throw error;
    }
  }

  async generateDailyReport() {
    try {
      const now = new Date();
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Check if report already exists
      const existingReport = await Analytics.findOne({
        period: 'daily',
        date: dayStart
      });

      if (existingReport) {
        console.log('Daily report already exists for this day');
        return existingReport;
      }

      // Generate analytics data
      const analyticsData = await this.generateAnalyticsData('daily', dayStart);
      
      // Create analytics record
      const analytics = new Analytics({
        period: 'daily',
        date: dayStart,
        ...analyticsData
      });

      await analytics.save();
      console.log('Daily analytics report generated');
      return analytics;
    } catch (error) {
      console.error('Error generating daily report:', error);
      throw error;
    }
  }

  async generateWeeklyReport() {
    try {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week
      weekStart.setHours(0, 0, 0, 0);
      
      // Check if report already exists
      const existingReport = await Analytics.findOne({
        period: 'weekly',
        date: weekStart
      });

      if (existingReport) {
        console.log('Weekly report already exists for this week');
        return existingReport;
      }

      // Generate analytics data
      const analyticsData = await this.generateAnalyticsData('weekly', weekStart);
      
      // Create analytics record
      const analytics = new Analytics({
        period: 'weekly',
        date: weekStart,
        ...analyticsData
      });

      await analytics.save();
      console.log('Weekly analytics report generated');
      return analytics;
    } catch (error) {
      console.error('Error generating weekly report:', error);
      throw error;
    }
  }

  async generateMonthlyReport() {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Check if report already exists
      const existingReport = await Analytics.findOne({
        period: 'monthly',
        date: monthStart
      });

      if (existingReport) {
        console.log('Monthly report already exists for this month');
        return existingReport;
      }

      // Generate analytics data
      const analyticsData = await this.generateAnalyticsData('monthly', monthStart);
      
      // Create analytics record
      const analytics = new Analytics({
        period: 'monthly',
        date: monthStart,
        ...analyticsData
      });

      await analytics.save();
      console.log('Monthly analytics report generated');
      return analytics;
    } catch (error) {
      console.error('Error generating monthly report:', error);
      throw error;
    }
  }

  async generateAnalyticsData(period, date) {
    try {
      const endDate = this.getPeriodEndDate(period, date);
      
      // User analytics
      const userStats = await this.getUserAnalytics(date, endDate);
      
      // Transaction analytics
      const transactionStats = await this.getTransactionAnalytics(date, endDate);
      
      // IDO analytics
      const idoStats = await this.getIdoAnalytics(date, endDate);
      
      // Token analytics
      const tokenStats = await this.getTokenAnalytics(date, endDate);
      
      // Geographic analytics
      const geographyStats = await this.getGeographyAnalytics(date, endDate);
      
      // Device analytics
      const deviceStats = await this.getDeviceAnalytics(date, endDate);
      
      // Referral analytics
      const referralStats = await this.getReferralAnalytics(date, endDate);
      
      // Performance metrics
      const performanceStats = await this.getPerformanceMetrics(date, endDate);
      
      // Financial metrics
      const financialStats = await this.getFinancialMetrics(date, endDate);
      
      // Engagement metrics
      const engagementStats = await this.getEngagementMetrics(date, endDate);
      
      // Conversion metrics
      const conversionStats = await this.getConversionMetrics(date, endDate);
      
      // Risk metrics
      const riskStats = await this.getRiskMetrics(date, endDate);

      return {
        users: userStats,
        transactions: transactionStats,
        ido: idoStats,
        tokens: tokenStats,
        geography: geographyStats,
        devices: deviceStats,
        referrals: referralStats,
        performance: performanceStats,
        financial: financialStats,
        engagement: engagementStats,
        conversion: conversionStats,
        risk: riskStats
      };
    } catch (error) {
      console.error('Error generating analytics data:', error);
      throw error;
    }
  }

  async getUserAnalytics(startDate, endDate) {
    try {
      const totalUsers = await User.countDocuments();
      const newUsers = await User.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate }
      });
      const activeUsers = await User.countDocuments({
        lastActivity: { $gte: startDate, $lt: endDate },
        accountStatus: 'active'
      });
      const verifiedUsers = await User.countDocuments({
        emailVerified: true
      });
      const kycApprovedUsers = await User.countDocuments({
        kycStatus: 'approved'
      });
      const walletConnectedUsers = await User.countDocuments({
        walletConnected: true
      });

      return {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        verified: verifiedUsers,
        kycApproved: kycApprovedUsers,
        walletConnected: walletConnectedUsers
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  async getTransactionAnalytics(startDate, endDate) {
    try {
      const totalTransactions = await Transaction.countDocuments();
      const periodTransactions = await Transaction.countDocuments({
        timestamp: { $gte: startDate, $lt: endDate }
      });
      const successfulTransactions = await Transaction.countDocuments({
        status: 'confirmed'
      });
      const failedTransactions = await Transaction.countDocuments({
        status: 'failed'
      });
      const pendingTransactions = await Transaction.countDocuments({
        status: 'pending'
      });

      const totalVolume = await Transaction.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amountInUSD' } } }
      ]);

      const periodVolume = await Transaction.aggregate([
        { 
          $match: { 
            status: 'confirmed',
            timestamp: { $gte: startDate, $lt: endDate }
          }
        },
        { $group: { _id: null, total: { $sum: '$amountInUSD' } } }
      ]);

      const averageTransaction = await Transaction.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, average: { $avg: '$amountInUSD' } } }
      ]);

      return {
        total: totalTransactions,
        successful: successfulTransactions,
        failed: failedTransactions,
        pending: pendingTransactions,
        totalVolume: {
          usd: totalVolume[0]?.total || 0,
          ngn: (totalVolume[0]?.total || 0) * 1500
        },
        averageTransaction: {
          usd: averageTransaction[0]?.average || 0,
          ngn: (averageTransaction[0]?.average || 0) * 1500
        }
      };
    } catch (error) {
      console.error('Error getting transaction analytics:', error);
      throw error;
    }
  }

  async getIdoAnalytics(startDate, endDate) {
    try {
      const totalRaised = await Transaction.aggregate([
        { $match: { type: 'purchase', status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amountInUSD' } } }
      ]);

      const periodRaised = await Transaction.aggregate([
        { 
          $match: { 
            type: 'purchase', 
            status: 'confirmed',
            timestamp: { $gte: startDate, $lt: endDate }
          }
        },
        { $group: { _id: null, total: { $sum: '$amountInUSD' } } }
      ]);

      const tokensSold = await Transaction.aggregate([
        { $match: { type: 'purchase', status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: { $toDouble: '$tokenOut.amount' } } } }
      ]);

      const participants = await Transaction.distinct('user', {
        type: 'purchase',
        status: 'confirmed'
      });

      const newParticipants = await Transaction.distinct('user', {
        type: 'purchase',
        status: 'confirmed',
        timestamp: { $gte: startDate, $lt: endDate }
      });

      const averageInvestment = await Transaction.aggregate([
        { $match: { type: 'purchase', status: 'confirmed' } },
        { $group: { _id: null, average: { $avg: '$amountInUSD' } } }
      ]);

      // Calculate progress percentage (assuming target is $1M)
      const target = 1000000;
      const progressPercentage = ((totalRaised[0]?.total || 0) / target) * 100;

      return {
        totalRaised: {
          usd: totalRaised[0]?.total || 0,
          ngn: (totalRaised[0]?.total || 0) * 1500
        },
        tokensSold: tokensSold[0]?.total?.toString() || '0',
        participants: participants.length,
        newParticipants: newParticipants.length,
        averageInvestment: {
          usd: averageInvestment[0]?.average || 0,
          ngn: (averageInvestment[0]?.average || 0) * 1500
        },
        progressPercentage: Math.min(progressPercentage, 100)
      };
    } catch (error) {
      console.error('Error getting IDO analytics:', error);
      throw error;
    }
  }

  async getTokenAnalytics(startDate, endDate) {
    try {
      const totalTokens = await Token.countDocuments();
      const activeTokens = await Token.countDocuments({
        status: 'active',
        isListed: true
      });

      const totalMarketCap = await Token.aggregate([
        { $match: { status: 'active', isListed: true } },
        { $group: { _id: null, total: { $sum: '$marketCap.usd' } } }
      ]);

      const totalVolume = await Token.aggregate([
        { $match: { status: 'active', isListed: true } },
        { $group: { _id: null, total: { $sum: '$volume24h.usd' } } }
      ]);

      const priceChanges = await Token.aggregate([
        { $match: { status: 'active', isListed: true } },
        {
          $group: {
            _id: null,
            positive: { $sum: { $cond: [{ $gt: ['$priceChange24h.percentage', 0] }, 1, 0] } },
            negative: { $sum: { $cond: [{ $lt: ['$priceChange24h.percentage', 0] }, 1, 0] } },
            neutral: { $sum: { $cond: [{ $eq: ['$priceChange24h.percentage', 0] }, 1, 0] } }
          }
        }
      ]);

      return {
        totalTokens: totalTokens,
        activeTokens: activeTokens,
        totalMarketCap: {
          usd: totalMarketCap[0]?.total || 0,
          ngn: (totalMarketCap[0]?.total || 0) * 1500
        },
        totalVolume: {
          usd: totalVolume[0]?.total || 0,
          ngn: (totalVolume[0]?.total || 0) * 1500
        },
        priceChanges: {
          positive: priceChanges[0]?.positive || 0,
          negative: priceChanges[0]?.negative || 0,
          neutral: priceChanges[0]?.neutral || 0
        }
      };
    } catch (error) {
      console.error('Error getting token analytics:', error);
      throw error;
    }
  }

  async getGeographyAnalytics(startDate, endDate) {
    try {
      const countries = await User.aggregate([
        { $match: { 'metadata.country': { $exists: true } } },
        {
          $group: {
            _id: '$metadata.country',
            users: { $sum: 1 },
            transactions: { $sum: 1 },
            volume: { $sum: '$investmentProfile.totalInvested' }
          }
        },
        { $sort: { users: -1 } },
        { $limit: 10 }
      ]);

      const totalUsers = await User.countDocuments();
      const topCountries = countries.map(country => ({
        country: country._id,
        percentage: (country.users / totalUsers) * 100
      }));

      return {
        countries: countries,
        topCountries: topCountries
      };
    } catch (error) {
      console.error('Error getting geography analytics:', error);
      throw error;
    }
  }

  async getDeviceAnalytics(startDate, endDate) {
    try {
      // This would typically come from user agent parsing
      // For now, we'll use mock data
      return {
        desktop: 60,
        mobile: 35,
        tablet: 5
      };
    } catch (error) {
      console.error('Error getting device analytics:', error);
      throw error;
    }
  }

  async getReferralAnalytics(startDate, endDate) {
    try {
      const totalReferrals = await User.countDocuments({
        referredBy: { $exists: true }
      });

      const successfulReferrals = await User.countDocuments({
        referredBy: { $exists: true },
        'investmentProfile.totalInvested': { $gt: 0 }
      });

      const referralRewards = await User.aggregate([
        { $match: { referralRewards: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$referralRewards' } } }
      ]);

      const topReferrers = await User.aggregate([
        { $match: { referralCode: { $exists: true } } },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'referredBy',
            as: 'referrals'
          }
        },
        {
          $project: {
            user: '$_id',
            referrals: { $size: '$referrals' },
            rewards: '$referralRewards'
          }
        },
        { $sort: { referrals: -1 } },
        { $limit: 10 }
      ]);

      return {
        totalReferrals: totalReferrals,
        successfulReferrals: successfulReferrals,
        referralRewards: referralRewards[0]?.total || 0,
        topReferrers: topReferrers
      };
    } catch (error) {
      console.error('Error getting referral analytics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(startDate, endDate) {
    try {
      // This would typically come from monitoring systems
      // For now, we'll use mock data
      return {
        averagePageLoadTime: 1.2,
        averageApiResponseTime: 0.3,
        errorRate: 0.1,
        uptime: 99.9
      };
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw error;
    }
  }

  async getFinancialMetrics(startDate, endDate) {
    try {
      // Calculate revenue from fees (assuming 2% fee on transactions)
      const totalVolume = await Transaction.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$amountInUSD' } } }
      ]);

      const revenue = (totalVolume[0]?.total || 0) * 0.02; // 2% fee
      const costs = revenue * 0.3; // 30% of revenue as costs
      const profit = revenue - costs;

      return {
        revenue: {
          usd: revenue,
          ngn: revenue * 1500
        },
        fees: {
          usd: revenue,
          ngn: revenue * 1500
        },
        costs: {
          usd: costs,
          ngn: costs * 1500
        },
        profit: {
          usd: profit,
          ngn: profit * 1500
        }
      };
    } catch (error) {
      console.error('Error getting financial metrics:', error);
      throw error;
    }
  }

  async getEngagementMetrics(startDate, endDate) {
    try {
      // This would typically come from analytics tracking
      // For now, we'll use mock data
      return {
        pageViews: 10000,
        uniqueVisitors: 2500,
        sessionDuration: 300, // seconds
        bounceRate: 35,
        returnVisitors: 1500
      };
    } catch (error) {
      console.error('Error getting engagement metrics:', error);
      throw error;
    }
  }

  async getConversionMetrics(startDate, endDate) {
    try {
      const totalVisitors = 10000; // Mock data
      const signups = await User.countDocuments({
        createdAt: { $gte: startDate, $lt: endDate }
      });
      const walletConnections = await User.countDocuments({
        walletConnected: true
      });
      const kycCompletions = await User.countDocuments({
        kycStatus: 'approved'
      });
      const investments = await Transaction.countDocuments({
        type: 'purchase',
        status: 'confirmed'
      });

      return {
        signupRate: (signups / totalVisitors) * 100,
        walletConnectionRate: (walletConnections / signups) * 100,
        kycCompletionRate: (kycCompletions / walletConnections) * 100,
        investmentConversionRate: (investments / kycCompletions) * 100
      };
    } catch (error) {
      console.error('Error getting conversion metrics:', error);
      throw error;
    }
  }

  async getRiskMetrics(startDate, endDate) {
    try {
      // This would typically come from risk monitoring systems
      // For now, we'll use mock data
      return {
        suspiciousTransactions: 5,
        blockedUsers: 2,
        securityIncidents: 0,
        complianceIssues: 0
      };
    } catch (error) {
      console.error('Error getting risk metrics:', error);
      throw error;
    }
  }

  getPeriodEndDate(period, startDate) {
    const endDate = new Date(startDate);
    
    switch (period) {
      case 'hourly':
        endDate.setHours(endDate.getHours() + 1);
        break;
      case 'daily':
        endDate.setDate(endDate.getDate() + 1);
        break;
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    return endDate;
  }

  async getAnalyticsSummary(period = 'daily', days = 30) {
    try {
      const cacheKey = `analytics_summary_${period}_${days}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const summary = await Analytics.getAnalyticsSummary(period, days);
      
      this.cache.set(cacheKey, {
        data: summary,
        timestamp: Date.now()
      });

      return summary;
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      throw error;
    }
  }

  async getTopMetrics(period = 'daily') {
    try {
      const cacheKey = `top_metrics_${period}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const metrics = await Analytics.getTopMetrics(period);
      
      this.cache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error getting top metrics:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
    console.log('Analytics cache cleared');
  }
}

module.exports = new AnalyticsService();

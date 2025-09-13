const express = require('express');
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Token = require('../models/Token');
const analyticsService = require('../services/analyticsService');
const { canAccessAnalytics } = require('../middleware/auth');
const { validatePagination, validateDateRange } = require('../middleware/validation');

const router = express.Router();

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private
router.get('/summary', canAccessAnalytics, async (req, res) => {
  try {
    const period = req.query.period || 'daily';
    const days = parseInt(req.query.days) || 30;

    const summary = await analyticsService.getAnalyticsSummary(period, days);

    res.json({
      success: true,
      data: {
        summary
      }
    });
  } catch (error) {
    console.error('Get analytics summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get top metrics
// @route   GET /api/analytics/top-metrics
// @access  Private
router.get('/top-metrics', canAccessAnalytics, async (req, res) => {
  try {
    const period = req.query.period || 'daily';

    const metrics = await analyticsService.getTopMetrics(period);

    res.json({
      success: true,
      data: {
        metrics
      }
    });
  } catch (error) {
    console.error('Get top metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private
router.get('/users', canAccessAnalytics, async (req, res) => {
  try {
    const stats = await User.getUserStats();

    res.json({
      success: true,
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get transaction analytics
// @route   GET /api/analytics/transactions
// @access  Private
router.get('/transactions', canAccessAnalytics, async (req, res) => {
  try {
    const stats = await Transaction.getTransactionStats();

    res.json({
      success: true,
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get transaction analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get daily transaction volume
// @route   GET /api/analytics/transactions/volume
// @access  Private
router.get('/transactions/volume', canAccessAnalytics, validateDateRange, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const volume = await Transaction.getDailyVolume(days);

    res.json({
      success: true,
      data: {
        volume
      }
    });
  } catch (error) {
    console.error('Get daily transaction volume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get token analytics
// @route   GET /api/analytics/tokens
// @access  Private
router.get('/tokens', canAccessAnalytics, async (req, res) => {
  try {
    const stats = await Token.getTokenStats();

    res.json({
      success: true,
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get token analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get IDO analytics
// @route   GET /api/analytics/ido
// @access  Private
router.get('/ido', canAccessAnalytics, async (req, res) => {
  try {
    const idoTokens = await Token.getIdoTokens();
    
    const idoStats = await Promise.all(idoTokens.map(async (token) => {
      const transactions = await Transaction.countDocuments({
        'tokenOut.address': token.address,
        type: 'purchase',
        status: 'confirmed'
      });

      const totalRaised = await Transaction.aggregate([
        {
          $match: {
            'tokenOut.address': token.address,
            type: 'purchase',
            status: 'confirmed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amountInUSD' }
          }
        }
      ]);

      const participants = await Transaction.distinct('user', {
        'tokenOut.address': token.address,
        type: 'purchase',
        status: 'confirmed'
      });

      return {
        token: {
          address: token.address,
          symbol: token.symbol,
          name: token.name
        },
        idoInfo: token.idoInfo,
        statistics: {
          transactions,
          totalRaised: totalRaised[0]?.total || 0,
          participants: participants.length,
          progressPercentage: token.idoProgress
        }
      };
    }));

    res.json({
      success: true,
      data: {
        idoStats
      }
    });
  } catch (error) {
    console.error('Get IDO analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get top investors
// @route   GET /api/analytics/top-investors
// @access  Private
router.get('/top-investors', canAccessAnalytics, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const topInvestors = await User.getTopInvestors(limit);

    res.json({
      success: true,
      data: {
        topInvestors
      }
    });
  } catch (error) {
    console.error('Get top investors error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get geographic analytics
// @route   GET /api/analytics/geography
// @access  Private
router.get('/geography', canAccessAnalytics, async (req, res) => {
  try {
    const countries = await User.aggregate([
      { $match: { 'metadata.country': { $exists: true } } },
      {
        $group: {
          _id: '$metadata.country',
          users: { $sum: 1 },
          totalInvested: { $sum: '$investmentProfile.totalInvested' }
        }
      },
      { $sort: { users: -1 } },
      { $limit: 20 }
    ]);

    const totalUsers = await User.countDocuments();
    const topCountries = countries.map(country => ({
      country: country._id,
      users: country.users,
      totalInvested: country.totalInvested,
      percentage: (country.users / totalUsers) * 100
    }));

    res.json({
      success: true,
      data: {
        countries: topCountries,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Get geographic analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get conversion analytics
// @route   GET /api/analytics/conversion
// @access  Private
router.get('/conversion', canAccessAnalytics, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ emailVerified: true });
    const walletConnectedUsers = await User.countDocuments({ walletConnected: true });
    const kycApprovedUsers = await User.countDocuments({ kycStatus: 'approved' });
    const investors = await Transaction.distinct('user', { type: 'purchase' });

    const conversion = {
      signupRate: 100, // Base rate
      emailVerificationRate: (verifiedUsers / totalUsers) * 100,
      walletConnectionRate: (walletConnectedUsers / verifiedUsers) * 100,
      kycCompletionRate: (kycApprovedUsers / walletConnectedUsers) * 100,
      investmentConversionRate: (investors.length / kycApprovedUsers) * 100
    };

    res.json({
      success: true,
      data: {
        conversion,
        totals: {
          totalUsers,
          verifiedUsers,
          walletConnectedUsers,
          kycApprovedUsers,
          investors: investors.length
        }
      }
    });
  } catch (error) {
    console.error('Get conversion analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private
router.get('/revenue', canAccessAnalytics, async (req, res) => {
  try {
    const totalVolume = await Transaction.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$amountInUSD' } } }
    ]);

    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          status: 'confirmed',
          timestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          dailyRevenue: { $sum: '$amountInUSD' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const revenue = {
      total: totalVolume[0]?.total || 0,
      daily: dailyRevenue,
      fees: (totalVolume[0]?.total || 0) * 0.02, // 2% fee
      profit: (totalVolume[0]?.total || 0) * 0.014 // 1.4% profit after costs
    };

    res.json({
      success: true,
      data: {
        revenue
      }
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get performance analytics
// @route   GET /api/analytics/performance
// @access  Private
router.get('/performance', canAccessAnalytics, async (req, res) => {
  try {
    // This would typically come from monitoring systems
    const performance = {
      uptime: 99.9,
      averageResponseTime: 250,
      errorRate: 0.1,
      activeUsers: await User.countDocuments({
        lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      peakConcurrentUsers: 150,
      databasePerformance: {
        averageQueryTime: 50,
        connectionPool: 80
      }
    };

    res.json({
      success: true,
      data: {
        performance
      }
    });
  } catch (error) {
    console.error('Get performance analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get analytics for specific period
// @route   GET /api/analytics/period/:period
// @access  Private
router.get('/period/:period', canAccessAnalytics, async (req, res) => {
  try {
    const { period } = req.params;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const analytics = await Analytics.getAnalytics(period, startDate, endDate);

    res.json({
      success: true,
      data: {
        analytics,
        period,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Get analytics for period error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Generate analytics report
// @route   POST /api/analytics/generate-report
// @access  Private
router.post('/generate-report', canAccessAnalytics, async (req, res) => {
  try {
    const { period, date } = req.body;

    let report;
    switch (period) {
      case 'hourly':
        report = await analyticsService.generateHourlyReport();
        break;
      case 'daily':
        report = await analyticsService.generateDailyReport();
        break;
      case 'weekly':
        report = await analyticsService.generateWeeklyReport();
        break;
      case 'monthly':
        report = await analyticsService.generateMonthlyReport();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid period'
        });
    }

    res.json({
      success: true,
      data: {
        report
      },
      message: `${period} report generated successfully`
    });
  } catch (error) {
    console.error('Generate analytics report error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get real-time analytics
// @route   GET /api/analytics/real-time
// @access  Private
router.get('/real-time', canAccessAnalytics, async (req, res) => {
  try {
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    const realTimeStats = {
      activeUsers: await User.countDocuments({
        lastActivity: { $gte: lastHour }
      }),
      transactionsLastHour: await Transaction.countDocuments({
        timestamp: { $gte: lastHour },
        status: 'confirmed'
      }),
      volumeLastHour: await Transaction.aggregate([
        {
          $match: {
            timestamp: { $gte: lastHour },
            status: 'confirmed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amountInUSD' }
          }
        }
      ]),
      pendingTransactions: await Transaction.countDocuments({
        status: 'pending'
      }),
      currentBlockNumber: await blockchainService.getBlockNumber(),
      timestamp: now
    };

    res.json({
      success: true,
      data: {
        realTimeStats
      }
    });
  } catch (error) {
    console.error('Get real-time analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Export analytics data
// @route   GET /api/analytics/export
// @access  Private
router.get('/export', canAccessAnalytics, async (req, res) => {
  try {
    const { format = 'json', period = 'daily', days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const analytics = await Analytics.getAnalytics(period, startDate, new Date());

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(analytics);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      res.send(csv);
    } else {
      res.json({
        success: true,
        data: {
          analytics,
          exportInfo: {
            format,
            period,
            days,
            exportedAt: new Date()
          }
        }
      });
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper function to convert analytics to CSV
function convertToCSV(analytics) {
  const headers = ['Date', 'Users', 'Transactions', 'Volume', 'Revenue'];
  const rows = analytics.map(a => [
    a.date.toISOString().split('T')[0],
    a.users.total,
    a.transactions.total,
    a.transactions.totalVolume.usd,
    a.financial.revenue.usd
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

module.exports = router;

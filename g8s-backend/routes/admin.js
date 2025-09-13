const express = require('express');
const { ethers } = require('ethers');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Token = require('../models/Token');
const Notification = require('../models/Notification');
const blockchainService = require('../services/blockchainService');
const notificationService = require('../services/notificationService');
const analyticsService = require('../services/analyticsService');
const { isAdmin, canAccessAdmin } = require('../middleware/auth');
const { 
  validateAdminAction, 
  validateTokenCreation, 
  validatePagination,
  validateObjectId 
} = require('../middleware/validation');

const router = express.Router();

// @desc    Get admin dashboard data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    // Get comprehensive dashboard data
    const [
      userStats,
      transactionStats,
      tokenStats,
      recentTransactions,
      topInvestors,
      systemHealth
    ] = await Promise.all([
      User.getUserStats(),
      Transaction.getTransactionStats(),
      Token.getTokenStats(),
      Transaction.find({ status: 'confirmed' })
        .sort({ timestamp: -1 })
        .limit(10)
        .populate('user', 'firstName lastName email')
        .lean(),
      User.getTopInvestors(5),
      getSystemHealth()
    ]);

    res.json({
      success: true,
      data: {
        dashboard: {
          userStats,
          transactionStats,
          tokenStats,
          recentTransactions,
          topInvestors,
          systemHealth
        }
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', canAccessAdmin, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search;
    const status = req.query.status;
    const kycStatus = req.query.kycStatus;

    const query = {};
    
    if (search) {
      query.$or = [
        { email: new RegExp(search, 'i') },
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { walletAddress: new RegExp(search, 'i') }
      ];
    }
    
    if (status) query.accountStatus = status;
    if (kycStatus) query.kycStatus = kycStatus;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', isAdmin, validateObjectId, async (req, res) => {
  try {
    const { status, reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const oldStatus = user.accountStatus;
    user.accountStatus = status;
    await user.save();

    // Create notification for user
    try {
      await notificationService.createNotification({
        user: user._id,
        title: 'Account Status Updated',
        message: `Your account status has been changed to ${status}. ${reason || ''}`,
        type: 'system',
        category: status === 'active' ? 'success' : 'warning',
        priority: 'high'
      });
    } catch (notificationError) {
      console.error('Error creating status notification:', notificationError);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          accountStatus: user.accountStatus
        }
      },
      message: `User status updated from ${oldStatus} to ${status}`
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Approve/Reject KYC
// @route   PUT /api/admin/users/:id/kyc
// @access  Private/Admin
router.put('/users/:id/kyc', isAdmin, validateObjectId, async (req, res) => {
  try {
    const { status, reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.kycStatus = status;
    user.kycDocuments.reviewedAt = new Date();
    user.kycDocuments.reviewedBy = req.user._id;
    
    if (status === 'rejected') {
      user.kycDocuments.rejectionReason = reason;
    }

    await user.save();

    // Create KYC notification
    try {
      await notificationService.createKYCNotification(user._id, status);
    } catch (notificationError) {
      console.error('Error creating KYC notification:', notificationError);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          kycStatus: user.kycStatus
        }
      },
      message: `KYC ${status} successfully`
    });
  } catch (error) {
    console.error('Update KYC status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
router.get('/transactions', canAccessAdmin, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { transactionHash: new RegExp(search, 'i') },
        { walletAddress: new RegExp(search, 'i') }
      ];
    }

    const transactions = await Transaction.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Process pending transactions
// @route   POST /api/admin/transactions/process-pending
// @access  Private/Admin
router.post('/transactions/process-pending', isAdmin, async (req, res) => {
  try {
    await blockchainService.processPendingTransactions();

    res.json({
      success: true,
      message: 'Pending transactions processed successfully'
    });
  } catch (error) {
    console.error('Process pending transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    IDO management actions
// @route   POST /api/admin/ido/:action
// @access  Private/Admin
router.post('/ido/:action', isAdmin, validateAdminAction, async (req, res) => {
  try {
    const { action } = req.params;
    const { value } = req.body;

    let result;
    
    switch (action) {
      case 'pause':
        result = await pauseIdo();
        break;
      case 'resume':
        result = await resumeIdo();
        break;
      case 'setPrice':
        if (!value) {
          return res.status(400).json({
            success: false,
            error: 'Price value is required'
          });
        }
        result = await setIdoPrice(value);
        break;
      case 'withdraw':
        result = await withdrawIdoFunds();
        break;
      case 'sweep':
        result = await sweepUnsoldTokens();
        break;
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action'
        });
    }

    res.json({
      success: true,
      data: result,
      message: `IDO ${action} executed successfully`
    });
  } catch (error) {
    console.error('IDO management action error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// @desc    Get IDO status
// @route   GET /api/admin/ido/status
// @access  Private/Admin
router.get('/ido/status', canAccessAdmin, async (req, res) => {
  try {
    const g8sToken = await Token.findOne({ symbol: 'G8S' });
    const idoContract = blockchainService.contracts.g8sIdo;

    if (!idoContract) {
      return res.status(404).json({
        success: false,
        error: 'IDO contract not found'
      });
    }

    const [
      isPaused,
      currentPrice,
      totalRaised,
      tokensSold,
      startTime,
      endTime
    ] = await Promise.all([
      idoContract.paused(),
      idoContract.tokenPrice(),
      idoContract.totalRaised(),
      idoContract.tokensSold(),
      idoContract.startTime(),
      idoContract.endTime()
    ]);

    res.json({
      success: true,
      data: {
        idoStatus: {
          isPaused,
          currentPrice: parseFloat(ethers.formatEther(currentPrice)),
          totalRaised: parseFloat(ethers.formatEther(totalRaised)),
          tokensSold: parseFloat(ethers.formatEther(tokensSold)),
          startTime: new Date(Number(startTime) * 1000),
          endTime: new Date(Number(endTime) * 1000),
          isActive: !isPaused && Date.now() >= Number(startTime) * 1000 && Date.now() <= Number(endTime) * 1000
        }
      }
    });
  } catch (error) {
    console.error('Get IDO status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create new token
// @route   POST /api/admin/tokens
// @access  Private/Admin
router.post('/tokens', isAdmin, validateTokenCreation, async (req, res) => {
  try {
    const {
      name,
      symbol,
      decimals,
      totalSupply,
      description,
      website,
      category
    } = req.body;

    // Check if token already exists
    const existingToken = await Token.findOne({ 
      $or: [
        { symbol: symbol.toUpperCase() },
        { name: name }
      ]
    });

    if (existingToken) {
      return res.status(400).json({
        success: false,
        error: 'Token with this symbol or name already exists'
      });
    }

    const token = new Token({
      address: '0x0000000000000000000000000000000000000000', // Will be updated after deployment
      symbol: symbol.toUpperCase(),
      name,
      decimals,
      totalSupply: totalSupply.toString(),
      circulatingSupply: '0',
      status: 'active',
      isVerified: false,
      isListed: true,
      metadata: {
        description,
        website,
        category
      }
    });

    await token.save();

    res.status(201).json({
      success: true,
      data: {
        token
      },
      message: 'Token created successfully'
    });
  } catch (error) {
    console.error('Create token error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update token
// @route   PUT /api/admin/tokens/:id
// @access  Private/Admin
router.put('/tokens/:id', isAdmin, validateObjectId, async (req, res) => {
  try {
    const { status, isListed, price, metadata } = req.body;

    const token = await Token.findById(req.params.id);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    if (status) token.status = status;
    if (isListed !== undefined) token.isListed = isListed;
    if (price) {
      token.price.usd = price;
      token.price.ngn = price * 1500;
      token.price.lastUpdated = new Date();
    }
    if (metadata) {
      token.metadata = { ...token.metadata, ...metadata };
    }

    await token.save();

    res.json({
      success: true,
      data: {
        token
      },
      message: 'Token updated successfully'
    });
  } catch (error) {
    console.error('Update token error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Send system notification
// @route   POST /api/admin/notifications/send
// @access  Private/Admin
router.post('/notifications/send', isAdmin, async (req, res) => {
  try {
    const { title, message, type, category, targetUsers, channels } = req.body;

    if (targetUsers === 'all') {
      // Send to all active users
      const users = await User.find({ accountStatus: 'active' });
      const userIds = users.map(user => user._id);
      
      await notificationService.createMarketingNotification(
        userIds,
        title,
        message,
        { type, category }
      );
    } else if (Array.isArray(targetUsers)) {
      // Send to specific users
      await notificationService.createMarketingNotification(
        targetUsers,
        title,
        message,
        { type, category }
      );
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid target users'
      });
    }

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Send system notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get system health
// @route   GET /api/admin/system/health
// @access  Private/Admin
router.get('/system/health', canAccessAdmin, async (req, res) => {
  try {
    const health = await getSystemHealth();

    res.json({
      success: true,
      data: {
        health
      }
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Generate analytics report
// @route   POST /api/admin/analytics/generate
// @access  Private/Admin
router.post('/analytics/generate', isAdmin, async (req, res) => {
  try {
    const { period } = req.body;

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
      message: `${period} analytics report generated successfully`
    });
  } catch (error) {
    console.error('Generate analytics report error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper functions for IDO management
async function pauseIdo() {
  const idoContract = blockchainService.contracts.g8sIdo;
  if (!idoContract) throw new Error('IDO contract not found');
  
  const tx = await idoContract.pause();
  await tx.wait();
  
  return { transactionHash: tx.hash };
}

async function resumeIdo() {
  const idoContract = blockchainService.contracts.g8sIdo;
  if (!idoContract) throw new Error('IDO contract not found');
  
  const tx = await idoContract.resume();
  await tx.wait();
  
  return { transactionHash: tx.hash };
}

async function setIdoPrice(price) {
  const idoContract = blockchainService.contracts.g8sIdo;
  if (!idoContract) throw new Error('IDO contract not found');
  
  const priceWei = ethers.parseEther(price.toString());
  const tx = await idoContract.setTokenPrice(priceWei);
  await tx.wait();
  
  return { transactionHash: tx.hash, newPrice: price };
}

async function withdrawIdoFunds() {
  const idoContract = blockchainService.contracts.g8sIdo;
  if (!idoContract) throw new Error('IDO contract not found');
  
  const tx = await idoContract.withdrawFunds();
  await tx.wait();
  
  return { transactionHash: tx.hash };
}

async function sweepUnsoldTokens() {
  const idoContract = blockchainService.contracts.g8sIdo;
  if (!idoContract) throw new Error('IDO contract not found');
  
  const tx = await idoContract.sweepUnsoldTokens();
  await tx.wait();
  
  return { transactionHash: tx.hash };
}

async function getSystemHealth() {
  try {
    const [
      userCount,
      transactionCount,
      pendingTransactions,
      blockchainStatus
    ] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: 'pending' }),
      blockchainService.getBlockNumber().catch(() => null)
    ]);

    return {
      database: {
        connected: true,
        users: userCount,
        transactions: transactionCount,
        pendingTransactions
      },
      blockchain: {
        connected: blockchainStatus !== null,
        blockNumber: blockchainStatus,
        network: 'Sepolia Testnet'
      },
      services: {
        blockchainService: blockchainService.isInitialized,
        notificationService: true,
        analyticsService: true
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting system health:', error);
    return {
      database: { connected: false },
      blockchain: { connected: false },
      services: { error: error.message },
      timestamp: new Date()
    };
  }
}

module.exports = router;

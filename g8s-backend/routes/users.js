const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { 
  isOwnerOrAdmin, 
  requireKYC, 
  requireWallet, 
  requireEmailVerification 
} = require('../middleware/auth');
const { 
  validateWalletAddress, 
  validateWalletConnection, 
  validateKYCDocument,
  validatePagination,
  validateObjectId 
} = require('../middleware/validation');
const notificationService = require('../services/notificationService');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          emailVerified: user.emailVerified,
          accountStatus: user.accountStatus,
          walletConnected: user.walletConnected,
          walletAddress: user.walletAddress,
          walletProvider: user.walletProvider,
          kycStatus: user.kycStatus,
          kycDocuments: user.kycDocuments,
          investmentProfile: user.investmentProfile,
          preferences: user.preferences,
          referralCode: user.referralCode,
          referredBy: user.referredBy,
          referralRewards: user.referralRewards,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          lastActivity: user.lastActivity,
          accountAge: user.accountAge
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { firstName, lastName, preferences } = req.body;

    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          preferences: user.preferences
        }
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Connect wallet
// @route   POST /api/users/connect-wallet
// @access  Private
router.post('/connect-wallet', validateWalletConnection, async (req, res) => {
  try {
    const { walletAddress, walletProvider, signature } = req.body;

    // Check if wallet is already connected to another account
    const existingUser = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      _id: { $ne: req.user._id }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Wallet is already connected to another account'
      });
    }

    const user = await User.findById(req.user._id);

    // Update wallet information
    user.walletAddress = walletAddress.toLowerCase();
    user.walletProvider = walletProvider;
    user.walletConnected = true;
    await user.save();

    // Create security notification
    try {
      await notificationService.createSecurityNotification(
        user._id,
        'wallet_connected',
        { walletAddress, walletProvider }
      );
    } catch (notificationError) {
      console.error('Error creating security notification:', notificationError);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          walletConnected: user.walletConnected,
          walletAddress: user.walletAddress,
          walletProvider: user.walletProvider
        }
      },
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Disconnect wallet
// @route   POST /api/users/disconnect-wallet
// @access  Private
router.post('/disconnect-wallet', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const walletAddress = user.walletAddress;
    const walletProvider = user.walletProvider;

    // Disconnect wallet
    user.walletAddress = undefined;
    user.walletProvider = undefined;
    user.walletConnected = false;
    await user.save();

    // Create security notification
    try {
      await notificationService.createSecurityNotification(
        user._id,
        'wallet_disconnected',
        { walletAddress, walletProvider }
      );
    } catch (notificationError) {
      console.error('Error creating security notification:', notificationError);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          walletConnected: user.walletConnected,
          walletAddress: user.walletAddress,
          walletProvider: user.walletProvider
        }
      },
      message: 'Wallet disconnected successfully'
    });
  } catch (error) {
    console.error('Disconnect wallet error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Submit KYC documents
// @route   POST /api/users/kyc
// @access  Private
router.post('/kyc', validateKYCDocument, async (req, res) => {
  try {
    const {
      documentType,
      documentNumber,
      firstName,
      lastName,
      dateOfBirth,
      address,
      city,
      country,
      postalCode
    } = req.body;

    const user = await User.findById(req.user._id);

    // Update KYC information
    user.kycDocuments = {
      ...user.kycDocuments,
      documentType,
      documentNumber,
      firstName,
      lastName,
      dateOfBirth,
      address,
      city,
      country,
      postalCode,
      submittedAt: new Date()
    };
    user.kycStatus = 'pending';
    await user.save();

    // Create KYC notification
    try {
      await notificationService.createKYCNotification(user._id, 'pending');
    } catch (notificationError) {
      console.error('Error creating KYC notification:', notificationError);
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          kycStatus: user.kycStatus,
          kycDocuments: user.kycDocuments
        }
      },
      message: 'KYC documents submitted successfully'
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user transactions
// @route   GET /api/users/transactions
// @access  Private
router.get('/transactions', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.getUserTransactions(
      req.user._id,
      limit,
      skip
    );

    const total = await Transaction.countDocuments({ user: req.user._id });

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
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
router.get('/notifications', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.getUserNotifications(
      req.user._id,
      limit,
      skip
    );

    const total = await Notification.countDocuments({ user: req.user._id });
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/users/notifications/:id/read
// @access  Private
router.put('/notifications/:id/read', validateObjectId, async (req, res) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user._id
    );

    res.json({
      success: true,
      data: {
        notification
      },
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/users/notifications/read-all
// @access  Private
router.put('/notifications/read-all', async (req, res) => {
  try {
    await notificationService.markAllNotificationsAsRead(req.user._id);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/statistics
// @access  Private
router.get('/statistics', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Get transaction statistics
    const transactionStats = await Transaction.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalInvested: { $sum: '$amountInUSD' },
          totalTokensPurchased: { $sum: { $toDouble: '$tokenOut.amount' } },
          averageTransaction: { $avg: '$amountInUSD' },
          successfulTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get notification statistics
    const notificationStats = await Notification.getNotificationStats(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          accountAge: user.accountAge,
          investmentProfile: user.investmentProfile,
          kycStatus: user.kycStatus,
          walletConnected: user.walletConnected
        },
        transactions: transactionStats[0] || {
          totalTransactions: 0,
          totalInvested: 0,
          totalTokensPurchased: 0,
          averageTransaction: 0,
          successfulTransactions: 0
        },
        notifications: notificationStats
      }
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', validateObjectId, isOwnerOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          emailVerified: user.emailVerified,
          accountStatus: user.accountStatus,
          walletConnected: user.walletConnected,
          walletAddress: user.walletAddress,
          kycStatus: user.kycStatus,
          investmentProfile: user.investmentProfile,
          referralCode: user.referralCode,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          lastActivity: user.lastActivity
        }
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update user by ID (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
router.put('/:id', validateObjectId, isOwnerOrAdmin, async (req, res) => {
  try {
    const { accountStatus, kycStatus, investmentProfile } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user fields
    if (accountStatus) user.accountStatus = accountStatus;
    if (kycStatus) {
      user.kycStatus = kycStatus;
      if (kycStatus === 'approved') {
        user.kycDocuments.reviewedAt = new Date();
        user.kycDocuments.reviewedBy = req.user._id;
      }
    }
    if (investmentProfile) {
      user.investmentProfile = { ...user.investmentProfile, ...investmentProfile };
    }

    await user.save();

    // Create notification if KYC status changed
    if (kycStatus && kycStatus !== 'pending') {
      try {
        await notificationService.createKYCNotification(user._id, kycStatus);
      } catch (notificationError) {
        console.error('Error creating KYC notification:', notificationError);
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          accountStatus: user.accountStatus,
          kycStatus: user.kycStatus,
          investmentProfile: user.investmentProfile
        }
      },
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user has active investments
    const activeInvestments = await Transaction.countDocuments({
      user: user._id,
      type: 'purchase',
      status: 'confirmed'
    });

    if (activeInvestments > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete account with active investments. Please contact support.'
      });
    }

    // Soft delete - mark account as deleted
    user.accountStatus = 'deleted';
    user.email = `deleted_${user._id}@deleted.com`;
    user.firstName = 'Deleted';
    user.lastName = 'User';
    user.walletAddress = undefined;
    user.walletConnected = false;
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;

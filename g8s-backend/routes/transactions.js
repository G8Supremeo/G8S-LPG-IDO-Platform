const express = require('express');
const { ethers } = require('ethers');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Token = require('../models/Token');
const blockchainService = require('../services/blockchainService');
const notificationService = require('../services/notificationService');
const { 
  requireWallet, 
  requireKYC, 
  requireEmailVerification,
  canInvest 
} = require('../middleware/auth');
const { 
  validateTransaction, 
  validateInvestment, 
  validatePagination,
  validateObjectId,
  validateDateRange 
} = require('../middleware/validation');

const router = express.Router();

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const status = req.query.status;

    const query = { user: req.user._id };
    
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
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
    console.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get transaction by hash
// @route   GET /api/transactions/:hash
// @access  Private
router.get('/:hash', async (req, res) => {
  try {
    const transaction = await Transaction.findByHash(req.params.hash);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Check if user owns this transaction
    if (transaction.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        transaction
      }
    });
  } catch (error) {
    console.error('Get transaction by hash error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Create investment transaction
// @route   POST /api/transactions/invest
// @access  Private
router.post('/invest', canInvest, validateInvestment, async (req, res) => {
  try {
    const { amount, tokenAddress, paymentToken } = req.body;

    // Get token information
    const token = await Token.findByAddress(tokenAddress);
    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // Check if IDO is active
    if (token.idoInfo.idoStatus !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'IDO is not currently active'
      });
    }

    // Check if user has sufficient balance
    const balance = await blockchainService.getTokenBalance(
      req.user.walletAddress,
      paymentToken
    );

    const requiredAmount = ethers.parseUnits(amount.toString(), 18);
    if (BigInt(balance.balance) < requiredAmount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance'
      });
    }

    // Calculate tokens to receive
    const tokensToReceive = amount / token.idoInfo.idoPrice;
    const bonusTokens = tokensToReceive * (token.idoInfo.bonusPercentage || 0) / 100;
    const totalTokens = tokensToReceive + bonusTokens;

    // Create transaction record
    const transaction = new Transaction({
      user: req.user._id,
      walletAddress: req.user.walletAddress,
      type: 'purchase',
      status: 'pending',
      tokenIn: {
        address: paymentToken,
        symbol: 'PUSD',
        amount: ethers.parseUnits(amount.toString(), 18).toString(),
        decimals: 18
      },
      tokenOut: {
        address: tokenAddress,
        symbol: token.symbol,
        amount: ethers.parseUnits(totalTokens.toString(), 18).toString(),
        decimals: 18
      },
      amountInUSD: amount,
      amountInNGN: amount * 1500,
      exchangeRate: 1500,
      idoRound: 'public',
      tokensPerUSD: 1 / token.idoInfo.idoPrice,
      bonusPercentage: token.idoInfo.bonusPercentage || 0,
      bonusTokens: ethers.parseUnits(bonusTokens.toString(), 18).toString(),
      from: req.user.walletAddress,
      to: process.env.G8S_IDO_ADDRESS,
      value: '0',
      nonce: 0, // Will be updated when transaction is sent
      timestamp: new Date()
    });

    await transaction.save();

    // Return transaction details for frontend to sign
    res.json({
      success: true,
      data: {
        transaction: {
          id: transaction._id,
          hash: transaction.transactionHash,
          amount: amount,
          tokensToReceive: totalTokens,
          bonusTokens: bonusTokens,
          tokenPrice: token.idoInfo.idoPrice,
          gasEstimate: '0.01', // Estimated gas cost
          contractAddress: process.env.G8S_IDO_ADDRESS,
          method: 'buyTokens',
          params: [
            ethers.parseUnits(amount.toString(), 18).toString()
          ]
        }
      },
      message: 'Transaction created. Please sign the transaction in your wallet.'
    });
  } catch (error) {
    console.error('Create investment transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Confirm transaction
// @route   POST /api/transactions/:id/confirm
// @access  Private
router.post('/:id/confirm', validateObjectId, async (req, res) => {
  try {
    const { transactionHash, receipt } = req.body;

    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Check if user owns this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Update transaction with hash and receipt
    transaction.transactionHash = transactionHash;
    transaction.receipt = receipt;
    transaction.status = receipt.status === 1 ? 'confirmed' : 'failed';
    transaction.confirmedAt = new Date();
    transaction.processed = true;
    transaction.processedAt = new Date();

    await transaction.save();

    // Create notification
    try {
      await notificationService.createTransactionNotification(
        req.user._id,
        transactionHash,
        transaction.type,
        parseFloat(ethers.formatEther(transaction.tokenOut.amount)),
        transaction.tokenOut.symbol
      );
    } catch (notificationError) {
      console.error('Error creating transaction notification:', notificationError);
    }

    res.json({
      success: true,
      data: {
        transaction
      },
      message: 'Transaction confirmed successfully'
    });
  } catch (error) {
    console.error('Confirm transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get transaction statistics
// @route   GET /api/transactions/statistics
// @access  Private
router.get('/statistics', async (req, res) => {
  try {
    const stats = await Transaction.getTransactionStats();

    res.json({
      success: true,
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get transaction statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get daily transaction volume
// @route   GET /api/transactions/volume/daily
// @access  Private
router.get('/volume/daily', validateDateRange, async (req, res) => {
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

// @desc    Get pending transactions
// @route   GET /api/transactions/pending
// @access  Private
router.get('/pending', async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
      status: 'pending'
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: {
        transactions
      }
    });
  } catch (error) {
    console.error('Get pending transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Cancel transaction
// @route   POST /api/transactions/:id/cancel
// @access  Private
router.post('/:id/cancel', validateObjectId, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Check if user owns this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if transaction can be cancelled
    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Transaction cannot be cancelled'
      });
    }

    // Cancel transaction
    transaction.status = 'cancelled';
    transaction.failedAt = new Date();
    await transaction.save();

    res.json({
      success: true,
      data: {
        transaction
      },
      message: 'Transaction cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get transaction receipt
// @route   GET /api/transactions/:hash/receipt
// @access  Private
router.get('/:hash/receipt', async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      transactionHash: req.params.hash,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Get fresh receipt from blockchain
    const receipt = await blockchainService.getTransactionReceipt(req.params.hash);

    res.json({
      success: true,
      data: {
        receipt,
        transaction: {
          status: transaction.status,
          confirmedAt: transaction.confirmedAt,
          processed: transaction.processed
        }
      }
    });
  } catch (error) {
    console.error('Get transaction receipt error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Retry failed transaction
// @route   POST /api/transactions/:id/retry
// @access  Private
router.post('/:id/retry', validateObjectId, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Check if user owns this transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if transaction can be retried
    if (transaction.status !== 'failed') {
      return res.status(400).json({
        success: false,
        error: 'Transaction cannot be retried'
      });
    }

    // Reset transaction status
    transaction.status = 'pending';
    transaction.transactionHash = undefined;
    transaction.receipt = undefined;
    transaction.confirmedAt = undefined;
    transaction.failedAt = undefined;
    transaction.error = undefined;
    transaction.processed = false;
    transaction.processedAt = undefined;
    transaction.processingAttempts = 0;
    transaction.lastProcessingAttempt = undefined;
    await transaction.save();

    res.json({
      success: true,
      data: {
        transaction
      },
      message: 'Transaction ready for retry'
    });
  } catch (error) {
    console.error('Retry transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get transaction history for token
// @route   GET /api/transactions/token/:address
// @access  Private
router.get('/token/:address', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      user: req.user._id,
      $or: [
        { 'tokenIn.address': req.params.address },
        { 'tokenOut.address': req.params.address }
      ]
    };

    const transactions = await Transaction.find(query)
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
    console.error('Get token transaction history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;

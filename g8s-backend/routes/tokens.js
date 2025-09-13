const express = require('express');
const Token = require('../models/Token');
const Transaction = require('../models/Transaction');
const blockchainService = require('../services/blockchainService');
const { validatePagination, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @desc    Get all tokens
// @route   GET /api/tokens
// @access  Public
router.get('/', validatePagination, async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (!Token.db.readyState || Token.db.readyState !== 1) {
      // Return mock data when MongoDB is not available
      const mockTokens = [
        {
          _id: 'mock-g8s-token',
          name: 'G8S Token',
          symbol: 'G8S',
          address: '0xCe28Eb32bbd8c66749b227A860beFcC12e612295',
          decimals: 18,
          totalSupply: '1000000000000000000000000000', // 1 billion tokens
          currentPrice: { usd: 0.05 },
          marketCap: { usd: 50000000 },
          status: 'active',
          isListed: true,
          metadata: {
            description: 'G8S LPG Token - Clean Energy Investment',
            website: 'https://g8s-lpg.com',
            logo: '/images/tokens/g8s-logo.png'
          },
          idoDetails: {
            isActive: true,
            startTime: new Date('2024-09-13T08:00:00Z'),
            endTime: new Date('2024-12-31T23:59:59Z'),
            price: { usd: 0.05 },
            minPurchase: { usd: 10 },
            maxPurchase: { usd: 10000 },
            totalRaised: { usd: 2500000 },
            totalSold: '50000000000000000000000000' // 50 million tokens
          }
        }
      ];
      
      return res.json({
        success: true,
        data: mockTokens,
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1
        }
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || 'marketCap.usd';
    const order = req.query.order === 'asc' ? 1 : -1;

    const query = { status: 'active', isListed: true };
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { symbol: searchRegex },
        { 'metadata.description': searchRegex }
      ];
    }

    // Filter by category
    if (req.query.category) {
      query['metadata.category'] = req.query.category;
    }

    // Filter by IDO status
    if (req.query.idoStatus) {
      query['idoInfo.idoStatus'] = req.query.idoStatus;
    }

    const tokens = await Token.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Token.countDocuments(query);

    res.json({
      success: true,
      data: {
        tokens,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get token by address
// @route   GET /api/tokens/:address
// @access  Public
router.get('/:address', async (req, res) => {
  try {
    const token = await Token.findByAddress(req.params.address);

    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    res.json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    console.error('Get token by address error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get token balance for user
// @route   GET /api/tokens/:address/balance
// @access  Private
router.get('/:address/balance', async (req, res) => {
  try {
    if (!req.user.walletConnected || !req.user.walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet not connected'
      });
    }

    const balance = await blockchainService.getTokenBalance(
      req.user.walletAddress,
      req.params.address
    );

    res.json({
      success: true,
      data: {
        balance: balance.formatted,
        raw: balance.balance,
        decimals: balance.decimals,
        tokenAddress: req.params.address,
        walletAddress: req.user.walletAddress
      }
    });
  } catch (error) {
    console.error('Get token balance error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

// @desc    Get token price history
// @route   GET /api/tokens/:address/price-history
// @access  Public
router.get('/:address/price-history', async (req, res) => {
  try {
    const token = await Token.findByAddress(req.params.address);

    if (!token) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }

    // This would typically fetch from a price oracle or historical data
    // For now, we'll return mock data
    const priceHistory = generateMockPriceHistory(token.price.usd);

    res.json({
      success: true,
      data: {
        token: {
          address: token.address,
          symbol: token.symbol,
          name: token.name
        },
        priceHistory
      }
    });
  } catch (error) {
    console.error('Get token price history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get token transactions
// @route   GET /api/tokens/:address/transactions
// @access  Public
router.get('/:address/transactions', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { 'tokenIn.address': req.params.address },
        { 'tokenOut.address': req.params.address }
      ]
    };

    const transactions = await Transaction.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .populate('user', 'firstName lastName email')
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
    console.error('Get token transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get IDO tokens
// @route   GET /api/tokens/ido/list
// @access  Public
router.get('/ido/list', async (req, res) => {
  try {
    const tokens = await Token.getIdoTokens();

    res.json({
      success: true,
      data: {
        tokens
      }
    });
  } catch (error) {
    console.error('Get IDO tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get token statistics
// @route   GET /api/tokens/statistics
// @access  Public
router.get('/statistics', async (req, res) => {
  try {
    const stats = await Token.getTokenStats();

    res.json({
      success: true,
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get token statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Search tokens
// @route   GET /api/tokens/search/:query
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const limit = parseInt(req.query.limit) || 10;

    const tokens = await Token.searchTokens(query, limit);

    res.json({
      success: true,
      data: {
        tokens,
        query
      }
    });
  } catch (error) {
    console.error('Search tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get top tokens by market cap
// @route   GET /api/tokens/top/market-cap
// @access  Public
router.get('/top/market-cap', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const tokens = await Token.find({ 
      status: 'active', 
      isListed: true 
    })
    .sort({ 'marketCap.usd': -1 })
    .limit(limit)
    .select('address symbol name price marketCap volume24h priceChange24h')
    .lean();

    res.json({
      success: true,
      data: {
        tokens
      }
    });
  } catch (error) {
    console.error('Get top tokens by market cap error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get top tokens by volume
// @route   GET /api/tokens/top/volume
// @access  Public
router.get('/top/volume', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const tokens = await Token.find({ 
      status: 'active', 
      isListed: true 
    })
    .sort({ 'volume24h.usd': -1 })
    .limit(limit)
    .select('address symbol name price marketCap volume24h priceChange24h')
    .lean();

    res.json({
      success: true,
      data: {
        tokens
      }
    });
  } catch (error) {
    console.error('Get top tokens by volume error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get trending tokens
// @route   GET /api/tokens/trending
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Get tokens with highest price change in last 24h
    const tokens = await Token.find({ 
      status: 'active', 
      isListed: true,
      'priceChange24h.percentage': { $gt: 0 }
    })
    .sort({ 'priceChange24h.percentage': -1 })
    .limit(limit)
    .select('address symbol name price marketCap volume24h priceChange24h')
    .lean();

    res.json({
      success: true,
      data: {
        tokens
      }
    });
  } catch (error) {
    console.error('Get trending tokens error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get token holders
// @route   GET /api/tokens/:address/holders
// @access  Public
router.get('/:address/holders', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get unique holders from transactions
    const holders = await Transaction.aggregate([
      {
        $match: {
          'tokenOut.address': req.params.address,
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: '$walletAddress',
          totalTokens: { $sum: { $toDouble: '$tokenOut.amount' } },
          totalInvested: { $sum: '$amountInUSD' },
          transactionCount: { $sum: 1 },
          firstPurchase: { $min: '$timestamp' },
          lastPurchase: { $max: '$timestamp' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'walletAddress',
          as: 'user'
        }
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          walletAddress: '$_id',
          totalTokens: 1,
          totalInvested: 1,
          transactionCount: 1,
          firstPurchase: 1,
          lastPurchase: 1,
          user: {
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email'
          }
        }
      },
      {
        $sort: { totalTokens: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    const total = await Transaction.distinct('walletAddress', {
      'tokenOut.address': req.params.address,
      status: 'confirmed'
    });

    res.json({
      success: true,
      data: {
        holders,
        pagination: {
          page,
          limit,
          total: total.length,
          pages: Math.ceil(total.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get token holders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Helper function to generate mock price history
function generateMockPriceHistory(currentPrice) {
  const history = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate price with some volatility
    const volatility = 0.1; // 10% volatility
    const change = (Math.random() - 0.5) * volatility;
    const price = currentPrice * (1 + change);
    
    history.push({
      date: date.toISOString(),
      price: price,
      volume: Math.random() * 1000000
    });
  }
  
  return history;
}

module.exports = router;

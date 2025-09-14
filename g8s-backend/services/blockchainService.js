const { ethers } = require('ethers');
const Token = require('../models/Token');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.contracts = {};
    this.isInitialized = false;
    this.eventListeners = new Map();
  }

  async initialize() {
    try {
      // Prefer WebSocket provider if provided (required for subscriptions)
      const wsUrl = (process.env.SEPOLIA_WS_URL || '').trim();
      const httpUrl = (process.env.SEPOLIA_RPC_URL || '').trim();

      if (wsUrl) {
        try {
          this.provider = new ethers.WebSocketProvider(wsUrl);
          console.log('✅ Using WebSocket provider for blockchain events');
        } catch (e) {
          console.warn('⚠️  Failed to initialize WebSocket provider, falling back to HTTP:', e.message);
          this.provider = httpUrl
            ? new ethers.JsonRpcProvider(httpUrl)
            : new ethers.JsonRpcProvider('https://sepolia.drpc.org');
        }
      } else if (httpUrl) {
        this.provider = new ethers.JsonRpcProvider(httpUrl);
        console.log('ℹ️ Using HTTP provider (event subscriptions will be disabled)');
      } else {
        console.log('⚠️  Blockchain RPC URL not configured - using public endpoint');
        this.provider = new ethers.JsonRpcProvider('https://sepolia.drpc.org');
      }
      
      // No wallet needed for read-only operations
      this.wallet = null;
      this.isReadOnly = true;
      
      // Load contract ABIs and addresses
      await this.loadContracts();
      
      // Start event listeners (only if provider supports subscriptions)
      await this.startEventListeners();
      
      // Update token prices
      await this.updateTokenPrices();
      
      this.isInitialized = true;
      console.log('✅ Blockchain service initialized successfully (read-only mode)');
    } catch (error) {
      console.error('❌ Failed to initialize blockchain service:', error.message);
      this.isInitialized = false;
      // Don't throw error, just log it and continue
    }
  }

  async loadContracts() {
    try {
      // Load G8S Token contract (case-sensitive on Linux)
      const g8sTokenAddress = process.env.G8S_TOKEN_ADDRESS;
      
      if (g8sTokenAddress) {
        try {
          const g8sTokenABI = require('../contracts/abi/g8sToken.json');
          this.contracts.g8sToken = new ethers.Contract(
            g8sTokenAddress,
            g8sTokenABI,
            this.wallet
          );
          console.log('✅ G8S Token contract loaded');
        } catch (error) {
          console.warn('⚠️ G8S Token ABI not found, using minimal ERC20 ABI');
          const minimalERC20ABI = [
            'function balanceOf(address owner) view returns (uint256)',
            'function transfer(address to, uint256 amount) returns (bool)',
            'function approve(address spender, uint256 amount) returns (bool)',
            'function allowance(address owner, address spender) view returns (uint256)',
            'function decimals() view returns (uint8)',
            'function name() view returns (string)',
            'function symbol() view returns (string)',
            'function totalSupply() view returns (uint256)',
            'event Transfer(address indexed from, address indexed to, uint256 value)',
            'event Approval(address indexed owner, address indexed spender, uint256 value)'
          ];
          this.contracts.g8sToken = new ethers.Contract(
            g8sTokenAddress,
            minimalERC20ABI,
            this.wallet
          );
        }
      }

      // Load G8S IDO contract (case-sensitive on Linux)
      const g8sIdoAddress = process.env.IDO_ADDRESS || process.env.G8S_IDO_ADDRESS;
      
      if (g8sIdoAddress) {
        try {
          const g8sIdoABI = require('../contracts/abi/g8sIdo.json');
          this.contracts.g8sIdo = new ethers.Contract(
            g8sIdoAddress,
            g8sIdoABI,
            this.wallet
          );
          console.log('✅ G8S IDO contract loaded');
        } catch (error) {
          console.warn('⚠️ G8S IDO ABI not found, skipping IDO contract');
        }
      }

      // Load PUSD contract
      const pusdAddress = process.env.PUSD_ADDRESS;
      if (pusdAddress) {
        const erc20ABI = [
          'function balanceOf(address owner) view returns (uint256)',
          'function transfer(address to, uint256 amount) returns (bool)',
          'function approve(address spender, uint256 amount) returns (bool)',
          'function allowance(address owner, address spender) view returns (uint256)',
          'function decimals() view returns (uint8)',
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function totalSupply() view returns (uint256)',
          'event Transfer(address indexed from, address indexed to, uint256 value)',
          'event Approval(address indexed owner, address indexed spender, uint256 value)'
        ];
        
        this.contracts.pusd = new ethers.Contract(
          pusdAddress,
          erc20ABI,
          this.wallet
        );
      }

      console.log('Contracts loaded successfully');
    } catch (error) {
      console.error('Failed to load contracts:', error);
      throw error;
    }
  }

  async startEventListeners() {
    try {
      const supportsSubscriptions = typeof this.provider.on === 'function' && this.provider._isWebSocket;

      if (!supportsSubscriptions) {
        console.log('ℹ️ Provider does not support subscriptions. Skipping event listeners.');
        return;
      }

      // Listen to G8S Token events
      if (this.contracts.g8sToken && typeof this.contracts.g8sToken.on === 'function') {
        this.contracts.g8sToken.on('Transfer', this.handleTokenTransfer.bind(this));
      }

      // Listen to IDO events
      if (this.contracts.g8sIdo && typeof this.contracts.g8sIdo.on === 'function') {
        this.contracts.g8sIdo.on('TokensPurchased', this.handleTokensPurchased.bind(this));
        this.contracts.g8sIdo.on('SalePaused', this.handleSalePaused.bind(this));
        this.contracts.g8sIdo.on('SaleResumed', this.handleSaleResumed.bind(this));
        this.contracts.g8sIdo.on('PriceUpdated', this.handlePriceUpdated.bind(this));
        this.contracts.g8sIdo.on('FundsWithdrawn', this.handleFundsWithdrawn.bind(this));
      }

      // Listen to PUSD events
      if (this.contracts.pusd && typeof this.contracts.pusd.on === 'function') {
        this.contracts.pusd.on('Transfer', this.handlePusdTransfer.bind(this));
      }

      console.log('Event listeners started');
    } catch (error) {
      console.error('Failed to start event listeners:', error);
      throw error;
    }
  }

  async handleTokenTransfer(from, to, amount, event) {
    try {
      console.log('G8S Token Transfer:', { from, to, amount: amount.toString() });
      
      // Update token statistics
      await this.updateTokenStatistics('g8s', event);
      
      // Create notification if it's a user transaction
      if (from !== ethers.ZeroAddress && to !== ethers.ZeroAddress) {
        await this.createTransferNotification(from, to, amount, 'G8S');
      }
    } catch (error) {
      console.error('Error handling token transfer:', error);
    }
  }

  async handleTokensPurchased(buyer, amount, cost, event) {
    try {
      console.log('Tokens Purchased:', { buyer, amount: amount.toString(), cost: cost.toString() });
      
      // Find user by wallet address
      const user = await User.findOne({ walletAddress: buyer.toLowerCase() });
      
      if (user) {
        // Update user investment profile
        user.investmentProfile.totalInvested += parseFloat(ethers.formatEther(cost));
        user.investmentProfile.totalTokensPurchased += parseFloat(ethers.formatEther(amount));
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber,
          blockHash: event.blockHash,
          transactionIndex: event.transactionIndex,
          user: user._id,
          walletAddress: buyer,
          type: 'purchase',
          status: 'confirmed',
          tokenIn: {
            address: process.env.PUSD_ADDRESS,
            symbol: 'PUSD',
            amount: cost.toString(),
            decimals: 18
          },
          tokenOut: {
            address: process.env.G8S_TOKEN_ADDRESS,
            symbol: 'G8S',
            amount: amount.toString(),
            decimals: 18
          },
          amountInUSD: parseFloat(ethers.formatEther(cost)),
          amountInNGN: parseFloat(ethers.formatEther(cost)) * 1500, // Approximate NGN rate
          exchangeRate: 1500,
          from: event.from,
          to: event.to,
          value: '0',
          nonce: event.transaction.nonce,
          timestamp: new Date(event.blockTimestamp * 1000),
          confirmedAt: new Date(),
          processed: true,
          processedAt: new Date()
        });

        await transaction.save();

        // Create notification
        await Notification.createNotification({
          user: user._id,
          title: 'Investment Successful',
          message: `You have successfully purchased ${ethers.formatEther(amount)} G8S tokens for ${ethers.formatEther(cost)} PUSD`,
          type: 'investment',
          category: 'success',
          relatedData: {
            transactionId: transaction._id,
            amount: parseFloat(ethers.formatEther(amount)),
            currency: 'G8S'
          }
        });

        // Broadcast real-time update
        if (global.broadcast) {
          global.broadcast({
            type: 'investment_update',
            data: {
              user: buyer,
              amount: parseFloat(ethers.formatEther(amount)),
              cost: parseFloat(ethers.formatEther(cost)),
              timestamp: new Date()
            }
          });
        }
      }
    } catch (error) {
      console.error('Error handling tokens purchased:', error);
    }
  }

  async handleSalePaused(event) {
    try {
      console.log('Sale Paused:', event);
      
      // Create system notification
      await this.createSystemNotification(
        'IDO Sale Paused',
        'The G8S IDO sale has been temporarily paused. Please check back later.',
        'system',
        'warning'
      );

      // Broadcast real-time update
      if (global.broadcast) {
        global.broadcast({
          type: 'sale_status',
          data: {
            status: 'paused',
            timestamp: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Error handling sale paused:', error);
    }
  }

  async handleSaleResumed(event) {
    try {
      console.log('Sale Resumed:', event);
      
      // Create system notification
      await this.createSystemNotification(
        'IDO Sale Resumed',
        'The G8S IDO sale has been resumed. You can now invest in G8S tokens.',
        'system',
        'success'
      );

      // Broadcast real-time update
      if (global.broadcast) {
        global.broadcast({
          type: 'sale_status',
          data: {
            status: 'active',
            timestamp: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Error handling sale resumed:', error);
    }
  }

  async handlePriceUpdated(newPrice, event) {
    try {
      console.log('Price Updated:', { newPrice: newPrice.toString() });
      
      // Update token price
      await this.updateTokenPrice('g8s', parseFloat(ethers.formatEther(newPrice)));
      
      // Create system notification
      await this.createSystemNotification(
        'Token Price Updated',
        `The G8S token price has been updated to ${ethers.formatEther(newPrice)} PUSD per token`,
        'system',
        'info'
      );

      // Broadcast real-time update
      if (global.broadcast) {
        global.broadcast({
          type: 'price_update',
          data: {
            token: 'G8S',
            price: parseFloat(ethers.formatEther(newPrice)),
            timestamp: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Error handling price updated:', error);
    }
  }

  async handleFundsWithdrawn(amount, event) {
    try {
      console.log('Funds Withdrawn:', { amount: amount.toString() });
      
      // Create system notification
      await this.createSystemNotification(
        'Funds Withdrawn',
        `${ethers.formatEther(amount)} PUSD has been withdrawn from the IDO contract`,
        'system',
        'info'
      );
    } catch (error) {
      console.error('Error handling funds withdrawn:', error);
    }
  }

  async handlePusdTransfer(from, to, amount, event) {
    try {
      console.log('PUSD Transfer:', { from, to, amount: amount.toString() });
      
      // Update token statistics
      await this.updateTokenStatistics('pusd', event);
    } catch (error) {
      console.error('Error handling PUSD transfer:', error);
    }
  }

  async updateTokenPrices() {
    try {
      // This would typically fetch from a price oracle or DEX
      // For now, we'll use mock data
      const mockPrices = {
        g8s: 0.01, // $0.01 per G8S token
        pusd: 1.0,  // $1.00 per PUSD (stablecoin)
        eth: 2000,  // $2000 per ETH
        btc: 45000  // $45000 per BTC
      };

      for (const [symbol, price] of Object.entries(mockPrices)) {
        await this.updateTokenPrice(symbol, price);
      }

      console.log('Token prices updated');
    } catch (error) {
      console.error('Error updating token prices:', error);
    }
  }

  async updateTokenPrice(symbol, priceUSD) {
    try {
      const token = await Token.findOne({ symbol: symbol.toUpperCase() });
      if (token) {
        token.price.usd = priceUSD;
        token.price.ngn = priceUSD * 1500; // Approximate NGN rate
        token.price.lastUpdated = new Date();
        await token.save();
      }
    } catch (error) {
      console.error(`Error updating ${symbol} price:`, error);
    }
  }

  async updateTokenStatistics(symbol, event) {
    try {
      const token = await Token.findOne({ symbol: symbol.toUpperCase() });
      if (token) {
        token.statistics.transactions += 1;
        token.statistics.lastActivity = new Date();
        await token.save();
      }
    } catch (error) {
      console.error(`Error updating ${symbol} statistics:`, error);
    }
  }

  async processPendingTransactions() {
    try {
      const pendingTransactions = await Transaction.getPendingTransactions();
      
      for (const transaction of pendingTransactions) {
        try {
          const receipt = await this.provider.getTransactionReceipt(transaction.transactionHash);
          
          if (receipt) {
            if (receipt.status === 1) {
              await transaction.markAsConfirmed(receipt);
            } else {
              await transaction.markAsFailed({
                code: 'TRANSACTION_FAILED',
                message: 'Transaction failed on blockchain'
              });
            }
          } else {
            // Transaction not found, increment attempts
            await transaction.incrementProcessingAttempts();
          }
        } catch (error) {
          console.error('Error processing transaction:', error);
          await transaction.incrementProcessingAttempts();
        }
      }
    } catch (error) {
      console.error('Error processing pending transactions:', error);
    }
  }

  async getTokenBalance(address, tokenAddress) {
    try {
      if (!this.isInitialized) {
        throw new Error('Blockchain service not initialized');
      }

      const contract = new ethers.Contract(
        tokenAddress,
        [
          'function balanceOf(address owner) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ],
        this.provider
      );

      const [balance, decimals] = await Promise.all([
        contract.balanceOf(address),
        contract.decimals()
      ]);

      return {
        balance: balance.toString(),
        formatted: ethers.formatUnits(balance, decimals),
        decimals: decimals
      };
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  async getTransactionReceipt(txHash) {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      throw error;
    }
  }

  async getBlockNumber() {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error('Error getting block number:', error);
      throw error;
    }
  }

  async createTransferNotification(from, to, amount, tokenSymbol) {
    try {
      const user = await User.findOne({ walletAddress: to.toLowerCase() });
      if (user) {
        await Notification.createNotification({
          user: user._id,
          title: `${tokenSymbol} Received`,
          message: `You received ${ethers.formatEther(amount)} ${tokenSymbol} tokens`,
          type: 'transaction',
          category: 'success',
          relatedData: {
            amount: parseFloat(ethers.formatEther(amount)),
            currency: tokenSymbol
          }
        });
      }
    } catch (error) {
      console.error('Error creating transfer notification:', error);
    }
  }

  async createSystemNotification(title, message, type, category) {
    try {
      // Get all active users
      const users = await User.find({ accountStatus: 'active' });
      
      const notifications = users.map(user => ({
        user: user._id,
        title,
        message,
        type,
        category,
        priority: 'normal'
      }));

      await Notification.sendBulkNotifications(notifications);
    } catch (error) {
      console.error('Error creating system notification:', error);
    }
  }

  async getContractInfo() {
    try {
      if (!this.isInitialized) {
        throw new Error('Blockchain service not initialized');
      }

      const info = {
        network: 'Sepolia Testnet',
        provider: this.provider.connection.url,
        wallet: this.wallet.address,
        contracts: {}
      };

      if (this.contracts.g8sToken) {
        info.contracts.g8sToken = {
          address: this.contracts.g8sToken.target,
          name: 'G8S Token'
        };
      }

      if (this.contracts.g8sIdo) {
        info.contracts.g8sIdo = {
          address: this.contracts.g8sIdo.target,
          name: 'G8S IDO'
        };
      }

      if (this.contracts.pusd) {
        info.contracts.pusd = {
          address: this.contracts.pusd.target,
          name: 'PUSD Token'
        };
      }

      return info;
    } catch (error) {
      console.error('Error getting contract info:', error);
      throw error;
    }
  }
}

module.exports = new BlockchainService();

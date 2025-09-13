const express = require('express');
const { ethers } = require('ethers');
const { isAdmin, isOwnerOrAdmin } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

const router = express.Router();

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    
    // Get admin statistics
    const stats = await supabaseService.getAdminStats();
    
    // Get recent activity
    const recentActivity = await supabaseService.getRecentActivity(10);
    
    // Get IDO settings
    const idoSettings = await supabaseService.getIDOSettings();
    
    // Get analytics
    const analytics = await supabaseService.getAnalytics();
    
    res.json({
      success: true,
      data: {
        stats,
        recentActivity,
        idoSettings,
        analytics
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch admin statistics'
    });
  }
});

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', isAdmin, validatePagination, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { data, error } = await supabaseService.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);
    
    if (error) throw error;
    
    // Get total count
    const { count } = await supabaseService.client
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

// @desc    Get all transactions with pagination
// @route   GET /api/admin/transactions
// @access  Admin
router.get('/transactions', isAdmin, validatePagination, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { data, error } = await supabaseService.client
      .from('transactions')
      .select(`
        *,
        users!inner(wallet_address, email, username)
      `)
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);
    
    if (error) throw error;
    
    // Get total count
    const { count } = await supabaseService.client
      .from('transactions')
      .select('*', { count: 'exact', head: true });
    
    res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id
// @access  Admin
router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const { id } = req.params;
    const updates = req.body;
    
    // Remove sensitive fields
    delete updates.id;
    delete updates.wallet_address;
    delete updates.created_at;
    
    const { data, error } = await supabaseService.client
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
});

// @desc    Update IDO settings
// @route   PUT /api/admin/ido-settings
// @access  Admin
router.put('/ido-settings', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const settings = req.body;
    
    const { data, error } = await supabaseService.client
      .from('ido_settings')
      .upsert(settings)
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating IDO settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update IDO settings'
    });
  }
});

// @desc    Get IDO settings
// @route   GET /api/admin/ido-settings
// @access  Admin
router.get('/ido-settings', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const settings = await supabaseService.getIDOSettings();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching IDO settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch IDO settings'
    });
  }
});

// @desc    Pause/Resume IDO
// @route   POST /api/admin/ido/pause
// @access  Admin
router.post('/ido/pause', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const { is_paused, pause_reason } = req.body;
    
    const { data, error } = await supabaseService.client
      .from('ido_settings')
      .update({ 
        is_paused: is_paused || true,
        pause_reason: pause_reason || 'Admin paused'
      })
      .select();
    
    if (error) throw error;
    
    // Broadcast update to connected clients
    if (global.broadcast) {
      global.broadcast({
        type: 'ido_status_changed',
        data: {
          is_paused: is_paused || true,
          pause_reason: pause_reason || 'Admin paused',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    res.json({
      success: true,
      data: data[0],
      message: is_paused ? 'IDO paused successfully' : 'IDO resumed successfully'
    });
  } catch (error) {
    console.error('Error updating IDO status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update IDO status'
    });
  }
});

// @desc    Update token price
// @route   PUT /api/admin/token-price
// @access  Admin
router.put('/token-price', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const { token_address, price } = req.body;
    
    if (!token_address || !price) {
      return res.status(400).json({
        success: false,
        error: 'Token address and price are required'
      });
    }
    
    const { data, error } = await supabaseService.client
      .from('tokens')
      .update({ 
        current_price: price,
        last_updated: new Date().toISOString()
      })
      .eq('address', token_address)
      .select();
    
    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Token not found'
      });
    }
    
    // Broadcast price update
    if (global.broadcast) {
      global.broadcast({
        type: 'price_updated',
        data: {
          token_address,
          price,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    res.json({
      success: true,
      data: data[0]
    });
  } catch (error) {
    console.error('Error updating token price:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update token price'
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Admin
router.get('/analytics', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const { period = '7d' } = req.query;
    
    let dateFilter;
    switch (period) {
      case '1d':
        dateFilter = new Date(Date.now() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    const { data, error } = await supabaseService.client
      .from('analytics')
      .select('*')
      .gte('date', dateFilter.toISOString().split('T')[0])
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// @desc    Send notification to all users
// @route   POST /api/admin/notifications/broadcast
// @access  Admin
router.post('/notifications/broadcast', isAdmin, async (req, res) => {
  try {
    const supabaseService = global.supabaseService;
    const { title, message, type = 'announcement' } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }
    
    // Get all active users
    const { data: users, error: usersError } = await supabaseService.client
      .from('users')
      .select('id')
      .eq('is_active', true);
    
    if (usersError) throw usersError;
    
    // Create notifications for all users
    const notifications = users.map(user => ({
      user_id: user.id,
      type,
      title,
      message,
      is_read: false,
      is_email_sent: false
    }));
    
    const { data, error } = await supabaseService.client
      .from('notifications')
      .insert(notifications)
      .select();
    
    if (error) throw error;
    
    // Broadcast notification to connected clients
    if (global.broadcast) {
      global.broadcast({
        type: 'notification',
        data: {
          title,
          message,
          type,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        notifications_sent: data.length,
        message: 'Notifications sent successfully'
      }
    });
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notifications'
    });
  }
});

module.exports = router;

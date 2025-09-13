const express = require('express');
const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');
const { validatePagination, validateObjectId } = require('../middleware/validation');

const router = express.Router();

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const category = req.query.category;
    const read = req.query.read;

    const query = { user: req.user._id };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (read !== undefined) query.read = read === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Notification.countDocuments(query);
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
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get notification by ID
// @route   GET /api/notifications/:id
// @access  Private
router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: {
        notification
      }
    });
  } catch (error) {
    console.error('Get notification by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', validateObjectId, async (req, res) => {
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

// @desc    Mark notification as clicked
// @route   PUT /api/notifications/:id/click
// @access  Private
router.put('/:id/click', validateObjectId, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.markAsClicked();

    res.json({
      success: true,
      data: {
        notification
      },
      message: 'Notification marked as clicked'
    });
  } catch (error) {
    console.error('Mark notification as clicked error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Dismiss notification
// @route   PUT /api/notifications/:id/dismiss
// @access  Private
router.put('/:id/dismiss', validateObjectId, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    await notification.dismiss();

    res.json({
      success: true,
      data: {
        notification
      },
      message: 'Notification dismissed'
    });
  } catch (error) {
    console.error('Dismiss notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', async (req, res) => {
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

// @desc    Dismiss all notifications
// @route   PUT /api/notifications/dismiss-all
// @access  Private
router.put('/dismiss-all', async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, dismissed: false },
      { dismissed: true, dismissedAt: new Date() }
    );

    res.json({
      success: true,
      message: 'All notifications dismissed'
    });
  } catch (error) {
    console.error('Dismiss all notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get notification statistics
// @route   GET /api/notifications/statistics
// @access  Private
router.get('/statistics', async (req, res) => {
  try {
    const stats = await notificationService.getNotificationStats(req.user._id);

    res.json({
      success: true,
      data: {
        statistics: stats
      }
    });
  } catch (error) {
    console.error('Get notification statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const unreadCount = await Notification.getUnreadCount(req.user._id);

    res.json({
      success: true,
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', async (req, res) => {
  try {
    const { preferences } = req.body;

    // Update user notification preferences
    const user = await User.findById(req.user._id);
    if (user.preferences.notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...preferences
      };
      await user.save();
    }

    res.json({
      success: true,
      data: {
        preferences: user.preferences.notifications
      },
      message: 'Notification preferences updated successfully'
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
router.get('/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');

    res.json({
      success: true,
      data: {
        preferences: user.preferences.notifications || {
          email: true,
          push: true,
          sms: false,
          marketing: true
        }
      }
    });
  } catch (error) {
    console.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Test notification
// @route   POST /api/notifications/test
// @access  Private
router.post('/test', async (req, res) => {
  try {
    const { type, message } = req.body;

    const notification = await Notification.createNotification({
      user: req.user._id,
      title: 'Test Notification',
      message: message || 'This is a test notification',
      type: type || 'system',
      category: 'info',
      priority: 'normal'
    });

    res.json({
      success: true,
      data: {
        notification
      },
      message: 'Test notification created successfully'
    });
  } catch (error) {
    console.error('Create test notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get notification types
// @route   GET /api/notifications/types
// @access  Private
router.get('/types', async (req, res) => {
  try {
    const types = [
      {
        value: 'transaction',
        label: 'Transaction',
        description: 'Notifications about your transactions'
      },
      {
        value: 'investment',
        label: 'Investment',
        description: 'Notifications about your investments'
      },
      {
        value: 'kyc',
        label: 'KYC',
        description: 'Notifications about KYC verification'
      },
      {
        value: 'security',
        label: 'Security',
        description: 'Security alerts and notifications'
      },
      {
        value: 'marketing',
        label: 'Marketing',
        description: 'Promotional and marketing notifications'
      },
      {
        value: 'system',
        label: 'System',
        description: 'System updates and announcements'
      },
      {
        value: 'referral',
        label: 'Referral',
        description: 'Referral program notifications'
      },
      {
        value: 'reward',
        label: 'Reward',
        description: 'Reward and bonus notifications'
      },
      {
        value: 'alert',
        label: 'Alert',
        description: 'Important alerts and warnings'
      },
      {
        value: 'reminder',
        label: 'Reminder',
        description: 'Reminder notifications'
      }
    ];

    res.json({
      success: true,
      data: {
        types
      }
    });
  } catch (error) {
    console.error('Get notification types error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Get notification categories
// @route   GET /api/notifications/categories
// @access  Private
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      {
        value: 'success',
        label: 'Success',
        description: 'Success notifications',
        color: '#28a745'
      },
      {
        value: 'error',
        label: 'Error',
        description: 'Error notifications',
        color: '#dc3545'
      },
      {
        value: 'warning',
        label: 'Warning',
        description: 'Warning notifications',
        color: '#ffc107'
      },
      {
        value: 'info',
        label: 'Info',
        description: 'Information notifications',
        color: '#17a2b8'
      },
      {
        value: 'promotion',
        label: 'Promotion',
        description: 'Promotional notifications',
        color: '#6f42c1'
      }
    ];

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get notification categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;

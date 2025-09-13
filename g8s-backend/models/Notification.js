const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification Content
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: [
      'transaction',
      'investment',
      'kyc',
      'security',
      'marketing',
      'system',
      'referral',
      'reward',
      'alert',
      'reminder'
    ],
    required: true
  },
  category: {
    type: String,
    enum: [
      'success',
      'error',
      'warning',
      'info',
      'promotion'
    ],
    default: 'info'
  },
  
  // Notification Channels
  channels: {
    email: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      opened: {
        type: Boolean,
        default: false
      },
      openedAt: Date,
      error: String
    },
    push: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      clicked: {
        type: Boolean,
        default: false
      },
      clickedAt: Date,
      error: String
    },
    sms: {
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      error: String
    },
    inApp: {
      sent: {
        type: Boolean,
        default: true
      },
      sentAt: {
        type: Date,
        default: Date.now
      }
    }
  },
  
  // Notification Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Action Information
  action: {
    type: {
      type: String,
      enum: ['url', 'deep_link', 'modal', 'page', 'none'],
      default: 'none'
    },
    url: String,
    deepLink: String,
    modalId: String,
    pageRoute: String,
    buttonText: String
  },
  
  // Related Data
  relatedData: {
    transactionId: mongoose.Schema.Types.ObjectId,
    tokenId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    currency: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  
  // User Interaction
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  clicked: {
    type: Boolean,
    default: false
  },
  clickedAt: Date,
  dismissed: {
    type: Boolean,
    default: false
  },
  dismissedAt: Date,
  
  // Template Information
  template: {
    id: String,
    version: String,
    variables: mongoose.Schema.Types.Mixed
  },
  
  // Delivery Information
  delivery: {
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    lastAttempt: Date,
    nextAttempt: Date,
    backoffMultiplier: {
      type: Number,
      default: 2
    }
  },
  
  // Error Information
  error: {
    code: String,
    message: String,
    details: String,
    stack: String
  },
  
  // Metadata
  metadata: {
    source: {
      type: String,
      enum: ['system', 'user', 'admin', 'api'],
      default: 'system'
    },
    campaign: String,
    tags: [String],
    locale: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ status: 1, scheduledFor: 1 });
notificationSchema.index({ type: 1, category: 1 });
notificationSchema.index({ 'channels.email.sent': 1, 'channels.email.sentAt': 1 });
notificationSchema.index({ 'channels.push.sent': 1, 'channels.push.sentAt': 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for delivery status
notificationSchema.virtual('deliveryStatus').get(function() {
  if (this.status === 'delivered') return 'delivered';
  if (this.status === 'sent') return 'sent';
  if (this.status === 'failed') return 'failed';
  return 'pending';
});

// Pre-save middleware to set expiration date
notificationSchema.pre('save', function(next) {
  if (!this.expiresAt && this.type === 'marketing') {
    // Marketing notifications expire after 30 days
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  next();
});

// Instance method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to mark as clicked
notificationSchema.methods.markAsClicked = function() {
  this.clicked = true;
  this.clickedAt = new Date();
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to dismiss
notificationSchema.methods.dismiss = function() {
  this.dismissed = true;
  this.dismissedAt = new Date();
  return this.save();
};

// Instance method to retry delivery
notificationSchema.methods.retryDelivery = function() {
  if (this.delivery.attempts < this.delivery.maxAttempts) {
    this.delivery.attempts += 1;
    this.delivery.lastAttempt = new Date();
    
    // Calculate next attempt with exponential backoff
    const backoffMs = Math.pow(this.delivery.backoffMultiplier, this.delivery.attempts) * 60000; // Start with 1 minute
    this.delivery.nextAttempt = new Date(Date.now() + backoffMs);
    this.status = 'pending';
    
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to mark channel as sent
notificationSchema.methods.markChannelSent = function(channel, success = true, error = null) {
  if (this.channels[channel]) {
    this.channels[channel].sent = true;
    this.channels[channel].sentAt = new Date();
    
    if (success) {
      this.channels[channel].delivered = true;
      this.channels[channel].deliveredAt = new Date();
    } else {
      this.channels[channel].error = error;
    }
  }
  
  // Update overall status
  if (success) {
    this.status = 'sent';
  } else {
    this.status = 'failed';
    this.error = {
      code: 'DELIVERY_FAILED',
      message: error,
      timestamp: new Date()
    };
  }
  
  return this.save();
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, limit = 50, skip = 0) {
  return this.find({ 
    user: userId,
    dismissed: false
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip(skip)
  .populate('user', 'firstName lastName email');
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ 
    user: userId,
    read: false,
    dismissed: false
  });
};

// Static method to get pending notifications
notificationSchema.statics.getPendingNotifications = function() {
  return this.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() },
    'delivery.attempts': { $lt: 3 }
  }).sort({ priority: -1, scheduledFor: 1 });
};

// Static method to get notification statistics
notificationSchema.statics.getNotificationStats = async function(userId = null) {
  const match = userId ? { user: userId } : {};
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        unread: {
          $sum: { $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$dismissed', false] }] }, 1, 0] }
        },
        read: {
          $sum: { $cond: [{ $eq: ['$read', true] }, 1, 0] }
        },
        clicked: {
          $sum: { $cond: [{ $eq: ['$clicked', true] }, 1, 0] }
        },
        dismissed: {
          $sum: { $cond: [{ $eq: ['$dismissed', true] }, 1, 0] }
        },
        byType: {
          $push: {
            type: '$type',
            category: '$category'
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    total: 0,
    unread: 0,
    read: 0,
    clicked: 0,
    dismissed: 0,
    byType: []
  };
};

// Static method to create notification
notificationSchema.statics.createNotification = function(data) {
  const notification = new this({
    user: data.user,
    title: data.title,
    message: data.message,
    type: data.type,
    category: data.category,
    priority: data.priority || 'normal',
    action: data.action || {},
    relatedData: data.relatedData || {},
    scheduledFor: data.scheduledFor || new Date(),
    template: data.template || {},
    metadata: data.metadata || {}
  });
  
  return notification.save();
};

// Static method to send bulk notifications
notificationSchema.statics.sendBulkNotifications = function(notifications) {
  return this.insertMany(notifications);
};

// Static method to cleanup old notifications
notificationSchema.statics.cleanupOldNotifications = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    read: true,
    dismissed: true
  });
};

module.exports = mongoose.model('Notification', notificationSchema);

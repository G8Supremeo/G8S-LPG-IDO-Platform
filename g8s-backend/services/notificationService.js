const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  constructor() {
    this.emailTransporter = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Check if email configuration is available
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || 
          process.env.SMTP_USER === 'your-email@gmail.com') {
        console.log('⚠️  Email configuration not provided - running without email notifications');
        this.isInitialized = false;
        return;
      }

      // Initialize email transporter
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify email configuration
      await this.emailTransporter.verify();
      
      this.isInitialized = true;
      console.log('✅ Notification service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error.message);
      this.isInitialized = false;
      // Don't throw error, continue without email functionality
    }
  }

  async sendNotification(notificationId) {
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        throw new Error('Notification not found');
      }

      const user = await User.findById(notification.user);
      if (!user) {
        throw new Error('User not found');
      }

      // Send via different channels based on user preferences
      const promises = [];

      // Email notification
      if (user.preferences.notifications.email && !notification.channels.email.sent) {
        promises.push(this.sendEmailNotification(notification, user));
      }

      // Push notification (would integrate with FCM or similar)
      if (user.preferences.notifications.push && !notification.channels.push.sent) {
        promises.push(this.sendPushNotification(notification, user));
      }

      // SMS notification (would integrate with Twilio or similar)
      if (user.preferences.notifications.sms && !notification.channels.sms.sent) {
        promises.push(this.sendSMSNotification(notification, user));
      }

      // In-app notification is already created
      if (!notification.channels.inApp.sent) {
        await notification.markChannelSent('inApp', true);
      }

      await Promise.allSettled(promises);
      
      // Update notification status
      const allChannelsSent = notification.channels.email.sent && 
                             notification.channels.push.sent && 
                             notification.channels.sms.sent;
      
      if (allChannelsSent) {
        notification.status = 'sent';
        await notification.save();
      }

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  async sendEmailNotification(notification, user) {
    try {
      if (!this.isInitialized) {
        console.log('Email service not initialized, skipping email notification');
        return;
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@g8s-lpg.com',
        to: user.email,
        subject: notification.title,
        html: this.generateEmailTemplate(notification, user)
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      
      await notification.markChannelSent('email', true);
      
      console.log('Email notification sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending email notification:', error);
      await notification.markChannelSent('email', false, error.message);
      throw error;
    }
  }

  async sendPushNotification(notification, user) {
    try {
      // This would integrate with Firebase Cloud Messaging (FCM)
      // For now, we'll just log and mark as sent
      console.log('Push notification would be sent to:', user.email);
      
      await notification.markChannelSent('push', true);
      
      // In a real implementation, you would:
      // 1. Get user's FCM token
      // 2. Send push notification via FCM
      // 3. Handle delivery receipts
      
      return { success: true };
    } catch (error) {
      console.error('Error sending push notification:', error);
      await notification.markChannelSent('push', false, error.message);
      throw error;
    }
  }

  async sendSMSNotification(notification, user) {
    try {
      // This would integrate with Twilio or similar SMS service
      // For now, we'll just log and mark as sent
      console.log('SMS notification would be sent to:', user.phone);
      
      await notification.markChannelSent('sms', true);
      
      // In a real implementation, you would:
      // 1. Get user's phone number
      // 2. Send SMS via Twilio
      // 3. Handle delivery receipts
      
      return { success: true };
    } catch (error) {
      console.error('Error sending SMS notification:', error);
      await notification.markChannelSent('sms', false, error.message);
      throw error;
    }
  }

  generateEmailTemplate(notification, user) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .button:hover { background: #5a6fd8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>G8S LPG</h1>
            <p>Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>${notification.title}</h2>
            <p>Hello ${user.firstName},</p>
            <p>${notification.message}</p>
            ${notification.action.type !== 'none' ? `
              <a href="${baseUrl}${notification.action.url || ''}" class="button">
                ${notification.action.buttonText || 'View Details'}
              </a>
            ` : ''}
            <p>Best regards,<br>The G8S LPG Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${user.email}. If you no longer wish to receive these emails, you can unsubscribe <a href="${baseUrl}/unsubscribe">here</a>.</p>
            <p>&copy; 2024 G8S LPG. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async processPendingNotifications() {
    try {
      const pendingNotifications = await Notification.getPendingNotifications();
      
      for (const notification of pendingNotifications) {
        try {
          await this.sendNotification(notification._id);
        } catch (error) {
          console.error('Error processing notification:', error);
          await notification.retryDelivery();
        }
      }
    } catch (error) {
      console.error('Error processing pending notifications:', error);
    }
  }

  async createInvestmentNotification(userId, amount, tokenSymbol) {
    try {
      return await Notification.createNotification({
        user: userId,
        title: 'Investment Successful',
        message: `You have successfully invested $${amount} in ${tokenSymbol} tokens`,
        type: 'investment',
        category: 'success',
        priority: 'high',
        relatedData: {
          amount: amount,
          currency: tokenSymbol
        }
      });
    } catch (error) {
      console.error('Error creating investment notification:', error);
      throw error;
    }
  }

  async createTransactionNotification(userId, txHash, type, amount, tokenSymbol) {
    try {
      const titles = {
        'purchase': 'Purchase Confirmed',
        'transfer': 'Transfer Confirmed',
        'withdrawal': 'Withdrawal Confirmed',
        'deposit': 'Deposit Confirmed'
      };

      const messages = {
        'purchase': `Your purchase of ${amount} ${tokenSymbol} tokens has been confirmed`,
        'transfer': `Your transfer of ${amount} ${tokenSymbol} tokens has been confirmed`,
        'withdrawal': `Your withdrawal of ${amount} ${tokenSymbol} tokens has been confirmed`,
        'deposit': `Your deposit of ${amount} ${tokenSymbol} tokens has been confirmed`
      };

      return await Notification.createNotification({
        user: userId,
        title: titles[type] || 'Transaction Confirmed',
        message: messages[type] || `Your ${type} transaction has been confirmed`,
        type: 'transaction',
        category: 'success',
        priority: 'normal',
        action: {
          type: 'url',
          url: `/transactions/${txHash}`,
          buttonText: 'View Transaction'
        },
        relatedData: {
          transactionHash: txHash,
          amount: amount,
          currency: tokenSymbol
        }
      });
    } catch (error) {
      console.error('Error creating transaction notification:', error);
      throw error;
    }
  }

  async createKYCNotification(userId, status) {
    try {
      const titles = {
        'approved': 'KYC Verification Approved',
        'rejected': 'KYC Verification Rejected',
        'pending': 'KYC Verification Submitted'
      };

      const messages = {
        'approved': 'Congratulations! Your KYC verification has been approved. You can now access all platform features.',
        'rejected': 'Your KYC verification has been rejected. Please review your documents and resubmit.',
        'pending': 'Your KYC verification has been submitted and is under review. We will notify you once it\'s processed.'
      };

      const categories = {
        'approved': 'success',
        'rejected': 'error',
        'pending': 'info'
      };

      return await Notification.createNotification({
        user: userId,
        title: titles[status],
        message: messages[status],
        type: 'kyc',
        category: categories[status],
        priority: 'high',
        action: {
          type: 'url',
          url: '/kyc',
          buttonText: 'View KYC Status'
        }
      });
    } catch (error) {
      console.error('Error creating KYC notification:', error);
      throw error;
    }
  }

  async createSecurityNotification(userId, event, details) {
    try {
      const titles = {
        'login': 'New Login Detected',
        'password_change': 'Password Changed',
        'wallet_connected': 'Wallet Connected',
        'wallet_disconnected': 'Wallet Disconnected',
        'suspicious_activity': 'Suspicious Activity Detected'
      };

      const messages = {
        'login': `A new login was detected from ${details.location || 'unknown location'}`,
        'password_change': 'Your password has been successfully changed',
        'wallet_connected': `Wallet ${details.walletAddress} has been connected to your account`,
        'wallet_disconnected': `Wallet ${details.walletAddress} has been disconnected from your account`,
        'suspicious_activity': 'Suspicious activity has been detected on your account. Please review your recent activity.'
      };

      return await Notification.createNotification({
        user: userId,
        title: titles[event] || 'Security Alert',
        message: messages[event] || 'A security event has occurred on your account',
        type: 'security',
        category: 'warning',
        priority: 'high',
        action: {
          type: 'url',
          url: '/security',
          buttonText: 'Review Security'
        },
        relatedData: {
          event: event,
          details: details
        }
      });
    } catch (error) {
      console.error('Error creating security notification:', error);
      throw error;
    }
  }

  async createReferralNotification(userId, referralCode, reward) {
    try {
      return await Notification.createNotification({
        user: userId,
        title: 'Referral Reward Earned',
        message: `You earned ${reward} G8S tokens for referring a new user with code ${referralCode}`,
        type: 'referral',
        category: 'success',
        priority: 'normal',
        action: {
          type: 'url',
          url: '/referrals',
          buttonText: 'View Referrals'
        },
        relatedData: {
          referralCode: referralCode,
          reward: reward
        }
      });
    } catch (error) {
      console.error('Error creating referral notification:', error);
      throw error;
    }
  }

  async createMarketingNotification(userIds, title, message, action = null) {
    try {
      const notifications = userIds.map(userId => ({
        user: userId,
        title: title,
        message: message,
        type: 'marketing',
        category: 'promotion',
        priority: 'low',
        action: action || { type: 'none' },
        scheduledFor: new Date()
      }));

      return await Notification.sendBulkNotifications(notifications);
    } catch (error) {
      console.error('Error creating marketing notification:', error);
      throw error;
    }
  }

  async cleanupOldNotifications() {
    try {
      const result = await Notification.cleanupOldNotifications(30);
      console.log(`Cleaned up ${result.deletedCount} old notifications`);
      return result;
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
      throw error;
    }
  }

  async getNotificationStats(userId = null) {
    try {
      return await Notification.getNotificationStats(userId);
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        _id: notificationId,
        user: userId
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      return await notification.markAsRead();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      return await Notification.updateMany(
        { user: userId, read: false },
        { read: true, readAt: new Date() }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();

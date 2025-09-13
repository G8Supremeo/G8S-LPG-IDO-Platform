const nodemailer = require('nodemailer');
const User = require('../models/User');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Check if email configuration is available
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || 
          process.env.SMTP_USER === 'your-email@gmail.com') {
        console.log('⚠️  Email configuration not provided - running without email service');
        this.isInitialized = false;
        return;
      }

      // Initialize email transporter
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify email configuration
      await this.transporter.verify();
      
      this.isInitialized = true;
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
      this.isInitialized = false;
      // Don't throw error, continue without email functionality
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      if (!this.isInitialized) {
        console.log('Email service not initialized, skipping email');
        return { success: false, error: 'Email service not initialized' };
      }

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@g8s-lpg.com',
        to: to,
        subject: subject,
        html: html,
        text: text
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    try {
      const subject = 'Welcome to G8S LPG - Clean Energy Investment Platform';
      const html = this.generateWelcomeEmailTemplate(user);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendEmailVerificationEmail(user, token) {
    try {
      const subject = 'Verify Your Email Address - G8S LPG';
      const html = this.generateEmailVerificationTemplate(user, token);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(user, token) {
    try {
      const subject = 'Reset Your Password - G8S LPG';
      const html = this.generatePasswordResetTemplate(user, token);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendInvestmentConfirmationEmail(user, transaction) {
    try {
      const subject = 'Investment Confirmed - G8S LPG';
      const html = this.generateInvestmentConfirmationTemplate(user, transaction);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending investment confirmation email:', error);
      throw error;
    }
  }

  async sendKYCStatusEmail(user, status) {
    try {
      const subject = `KYC Verification ${status.charAt(0).toUpperCase() + status.slice(1)} - G8S LPG`;
      const html = this.generateKYCStatusTemplate(user, status);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending KYC status email:', error);
      throw error;
    }
  }

  async sendSecurityAlertEmail(user, event, details) {
    try {
      const subject = 'Security Alert - G8S LPG';
      const html = this.generateSecurityAlertTemplate(user, event, details);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending security alert email:', error);
      throw error;
    }
  }

  async sendReferralRewardEmail(user, referralCode, reward) {
    try {
      const subject = 'Referral Reward Earned - G8S LPG';
      const html = this.generateReferralRewardTemplate(user, referralCode, reward);
      
      return await this.sendEmail(user.email, subject, html);
    } catch (error) {
      console.error('Error sending referral reward email:', error);
      throw error;
    }
  }

  async sendNewsletterEmail(users, subject, content) {
    try {
      const results = [];
      
      for (const user of users) {
        if (user.preferences.notifications.marketing) {
          const html = this.generateNewsletterTemplate(user, content);
          const result = await this.sendEmail(user.email, subject, html);
          results.push({ user: user.email, result });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error sending newsletter email:', error);
      throw error;
    }
  }

  generateWelcomeEmailTemplate(user) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a6fd8; }
          .feature { margin: 20px 0; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to G8S LPG!</h1>
            <p>Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Welcome to G8S LPG, the premier platform for clean energy investments through blockchain technology. We're excited to have you join our community of forward-thinking investors.</p>
            
            <div class="feature">
              <h3>🚀 What's Next?</h3>
              <p>Complete your profile setup to unlock all platform features:</p>
              <ul>
                <li>Connect your wallet to start investing</li>
                <li>Complete KYC verification for enhanced security</li>
                <li>Explore our IDO opportunities</li>
                <li>Join our community discussions</li>
              </ul>
            </div>
            
            <div class="feature">
              <h3>💡 Why G8S LPG?</h3>
              <p>We're revolutionizing clean energy investments by:</p>
              <ul>
                <li>Making LPG investments accessible to everyone</li>
                <li>Providing transparent, blockchain-based transactions</li>
                <li>Offering competitive returns on clean energy projects</li>
                <li>Ensuring regulatory compliance and security</li>
              </ul>
            </div>
            
            <div style="text-align: center;">
              <a href="${baseUrl}/dashboard" class="button">Get Started</a>
            </div>
            
            <p>If you have any questions, our support team is here to help. You can reach us at <a href="mailto:support@g8s-lpg.com">support@g8s-lpg.com</a>.</p>
            
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

  generateEmailVerificationTemplate(user, token) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/verify-email?token=${token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a6fd8; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
            <p>G8S LPG - Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Thank you for signing up with G8S LPG. To complete your registration and secure your account, please verify your email address.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            
            <div class="warning">
              <p><strong>Important:</strong> This verification link will expire in 24 hours. If you don't verify your email within this time, you'll need to request a new verification email.</p>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            
            <p>If you didn't create an account with G8S LPG, please ignore this email.</p>
            
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

  generatePasswordResetTemplate(user, token) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a6fd8; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
            <p>G8S LPG - Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>We received a request to reset your password for your G8S LPG account. If you made this request, click the button below to reset your password.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            
            <div class="warning">
              <p><strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you don't reset your password within this time, you'll need to request a new reset link.</p>
            </div>
            
            <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, if you continue to receive password reset emails you didn't request, please contact our support team immediately.</p>
            
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

  generateInvestmentConfirmationTemplate(user, transaction) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Investment Confirmed - G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a6fd8; }
          .transaction-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Investment Confirmed!</h1>
            <p>G8S LPG - Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Congratulations ${user.firstName}!</h2>
            <p>Your investment in G8S tokens has been successfully confirmed. Thank you for supporting clean energy initiatives!</p>
            
            <div class="transaction-details">
              <h3>Transaction Details</h3>
              <div class="detail-row">
                <span><strong>Transaction Hash:</strong></span>
                <span style="font-family: monospace; font-size: 12px;">${transaction.transactionHash}</span>
              </div>
              <div class="detail-row">
                <span><strong>Amount Invested:</strong></span>
                <span>$${transaction.amountInUSD} USD</span>
              </div>
              <div class="detail-row">
                <span><strong>Tokens Received:</strong></span>
                <span>${transaction.tokenOut.amount} ${transaction.tokenOut.symbol}</span>
              </div>
              <div class="detail-row">
                <span><strong>Date:</strong></span>
                <span>${new Date(transaction.timestamp).toLocaleDateString()}</span>
              </div>
              <div class="detail-row">
                <span><strong>Status:</strong></span>
                <span style="color: green; font-weight: bold;">Confirmed</span>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${baseUrl}/transactions/${transaction.transactionHash}" class="button">View Transaction</a>
            </div>
            
            <p>Your investment is now part of our clean energy portfolio. You can track your investment performance in your dashboard.</p>
            
            <p>If you have any questions about your investment, please don't hesitate to contact our support team.</p>
            
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

  generateKYCStatusTemplate(user, status) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const statusColors = {
      approved: '#28a745',
      rejected: '#dc3545',
      pending: '#ffc107'
    };
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KYC Status Update - G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a6fd8; }
          .status-badge { display: inline-block; padding: 10px 20px; border-radius: 20px; color: white; font-weight: bold; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>KYC Status Update</h1>
            <p>G8S LPG - Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>Your KYC (Know Your Customer) verification status has been updated.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <span class="status-badge" style="background-color: ${statusColors[status]};">${status}</span>
            </div>
            
            ${status === 'approved' ? `
              <p><strong>Congratulations!</strong> Your KYC verification has been approved. You now have full access to all platform features, including:</p>
              <ul>
                <li>Higher investment limits</li>
                <li>Advanced trading features</li>
                <li>Priority customer support</li>
                <li>Exclusive investment opportunities</li>
              </ul>
            ` : status === 'rejected' ? `
              <p><strong>KYC Verification Rejected</strong></p>
              <p>Unfortunately, your KYC verification could not be approved at this time. This may be due to:</p>
              <ul>
                <li>Unclear or incomplete documents</li>
                <li>Document authenticity concerns</li>
                <li>Information mismatch</li>
              </ul>
              <p>Please review your submitted documents and resubmit your KYC application with clear, valid documents.</p>
            ` : `
              <p><strong>KYC Under Review</strong></p>
              <p>Your KYC verification is currently under review. Our team will process your application within 1-3 business days.</p>
              <p>You will receive another email once the review is complete.</p>
            `}
            
            <div style="text-align: center;">
              <a href="${baseUrl}/kyc" class="button">View KYC Status</a>
            </div>
            
            <p>If you have any questions about your KYC status, please contact our support team.</p>
            
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

  generateSecurityAlertTemplate(user, event, details) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Security Alert - G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #c82333; }
          .alert-box { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Security Alert</h1>
            <p>G8S LPG - Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            <p>We detected a security event on your G8S LPG account that requires your attention.</p>
            
            <div class="alert-box">
              <h3>Security Event Details:</h3>
              <p><strong>Event:</strong> ${event}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Details:</strong> ${details}</p>
            </div>
            
            <p>If this activity was authorized by you, no further action is required. However, if you did not initiate this activity, please take immediate action to secure your account:</p>
            
            <ol>
              <li>Change your password immediately</li>
              <li>Review your recent account activity</li>
              <li>Contact our support team if you notice any unauthorized transactions</li>
              <li>Consider enabling two-factor authentication for added security</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="${baseUrl}/security" class="button">Review Security Settings</a>
            </div>
            
            <p><strong>Important:</strong> If you believe your account has been compromised, please contact our support team immediately at <a href="mailto:security@g8s-lpg.com">security@g8s-lpg.com</a>.</p>
            
            <p>Best regards,<br>The G8S LPG Security Team</p>
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

  generateReferralRewardTemplate(user, referralCode, reward) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Referral Reward Earned - G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #20c997; }
          .reward-box { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center; border: 2px solid #28a745; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Referral Reward Earned!</h1>
            <p>G8S LPG - Clean Energy Investment Platform</p>
          </div>
          <div class="content">
            <h2>Congratulations ${user.firstName}!</h2>
            <p>You've earned a referral reward for successfully referring a new user to G8S LPG!</p>
            
            <div class="reward-box">
              <h3>🎉 Reward Earned</h3>
              <p style="font-size: 24px; font-weight: bold; color: #28a745;">${reward} G8S Tokens</p>
              <p>For referring with code: <strong>${referralCode}</strong></p>
            </div>
            
            <p>Your referral reward has been automatically added to your account. You can view your updated balance in your dashboard.</p>
            
            <div style="text-align: center;">
              <a href="${baseUrl}/referrals" class="button">View Referral Program</a>
            </div>
            
            <p>Keep sharing your referral code to earn more rewards! The more people you refer, the more you earn.</p>
            
            <p>Thank you for helping us grow the G8S LPG community!</p>
            
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

  generateNewsletterTemplate(user, content) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>G8S LPG Newsletter</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; background: #fff; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .button:hover { background: #5a6fd8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>G8S LPG Newsletter</h1>
            <p>Clean Energy Investment Updates</p>
          </div>
          <div class="content">
            <h2>Hello ${user.firstName}!</h2>
            ${content}
            <div style="text-align: center;">
              <a href="${baseUrl}/dashboard" class="button">Visit Dashboard</a>
            </div>
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
}

module.exports = new EmailService();

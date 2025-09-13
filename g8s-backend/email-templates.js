// Email Templates for G8S LPG
const emailTemplates = {
  // Welcome email for new users
  welcome: (userData) => ({
    subject: 'Welcome to G8S LPG - Your Clean Energy Investment Journey Begins!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to G8S LPG</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Welcome to G8S LPG!</h1>
            <p>Your Clean Energy Investment Journey Begins</p>
          </div>
          <div class="content">
            <h2>Hello ${userData.firstName || 'Investor'}!</h2>
            <p>Welcome to the future of clean energy investments! We're thrilled to have you join the G8S LPG community.</p>
            
            <h3>🎯 What's Next?</h3>
            <ul>
              <li>✅ Complete your KYC verification</li>
              <li>✅ Connect your wallet</li>
              <li>✅ Start investing in clean energy</li>
              <li>✅ Track your portfolio growth</li>
            </ul>
            
            <p>Your wallet address: <strong>${userData.walletAddress}</strong></p>
            
            <a href="https://g8s-lpg.vercel.app/dashboard" class="button">Go to Dashboard</a>
            
            <h3>📊 IDO Details</h3>
            <ul>
              <li><strong>Token:</strong> G8S</li>
              <li><strong>Price:</strong> $0.05 per token</li>
              <li><strong>Minimum:</strong> $10</li>
              <li><strong>Maximum:</strong> $10,000</li>
            </ul>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 G8S LPG. All rights reserved.</p>
            <p>This email was sent to ${userData.email}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to G8S LPG!
      
      Hello ${userData.firstName || 'Investor'}!
      
      Welcome to the future of clean energy investments! We're thrilled to have you join the G8S LPG community.
      
      What's Next?
      - Complete your KYC verification
      - Connect your wallet
      - Start investing in clean energy
      - Track your portfolio growth
      
      Your wallet address: ${userData.walletAddress}
      
      IDO Details:
      - Token: G8S
      - Price: $0.05 per token
      - Minimum: $10
      - Maximum: $10,000
      
      Dashboard: https://g8s-lpg.vercel.app/dashboard
      
      If you have any questions, feel free to reach out to our support team.
      
      © 2024 G8S LPG. All rights reserved.
    `
  }),

  // Investment confirmation email
  investmentConfirmation: (transactionData) => ({
    subject: 'Investment Confirmed - G8S LPG IDO',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Investment Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; }
          .transaction-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Investment Confirmed!</h1>
            <p>Your G8S LPG Investment is Complete</p>
          </div>
          <div class="content">
            <h2>Congratulations!</h2>
            <p>Your investment in G8S LPG has been successfully processed.</p>
            
            <div class="transaction-details">
              <h3>📊 Transaction Details</h3>
              <p><strong>Transaction Hash:</strong> ${transactionData.transactionHash}</p>
              <p><strong>Amount Invested:</strong> $${transactionData.amountUSD}</p>
              <p><strong>Tokens Purchased:</strong> ${transactionData.tokensReceived} G8S</p>
              <p><strong>Price per Token:</strong> $${transactionData.pricePerToken}</p>
              <p><strong>Date:</strong> ${new Date(transactionData.createdAt).toLocaleString()}</p>
            </div>
            
            <h3>🎯 What Happens Next?</h3>
            <ul>
              <li>✅ Tokens will be distributed after IDO ends</li>
              <li>✅ You'll receive updates on project progress</li>
              <li>✅ Track your investment in the dashboard</li>
            </ul>
            
            <p>Thank you for investing in the future of clean energy!</p>
          </div>
          <div class="footer">
            <p>© 2024 G8S LPG. All rights reserved.</p>
            <p>Transaction ID: ${transactionData.id}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Investment Confirmed - G8S LPG IDO
      
      Congratulations!
      
      Your investment in G8S LPG has been successfully processed.
      
      Transaction Details:
      - Transaction Hash: ${transactionData.transactionHash}
      - Amount Invested: $${transactionData.amountUSD}
      - Tokens Purchased: ${transactionData.tokensReceived} G8S
      - Price per Token: $${transactionData.pricePerToken}
      - Date: ${new Date(transactionData.createdAt).toLocaleString()}
      
      What Happens Next?
      - Tokens will be distributed after IDO ends
      - You'll receive updates on project progress
      - Track your investment in the dashboard
      
      Thank you for investing in the future of clean energy!
      
      © 2024 G8S LPG. All rights reserved.
      Transaction ID: ${transactionData.id}
    `
  }),

  // KYC status update email
  kycStatusUpdate: (userData) => ({
    subject: `KYC Status Update - ${userData.kycStatus.toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>KYC Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #faf5ff; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-approved { background: #dcfce7; border-left: 4px solid #22c55e; }
          .status-pending { background: #fef3c7; border-left: 4px solid #f59e0b; }
          .status-rejected { background: #fee2e2; border-left: 4px solid #ef4444; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 KYC Status Update</h1>
            <p>Your Verification Status Has Changed</p>
          </div>
          <div class="content">
            <h2>Hello ${userData.firstName || 'User'}!</h2>
            
            <div class="status-${userData.kycStatus}">
              <h3>Status: ${userData.kycStatus.toUpperCase()}</h3>
              ${userData.kycStatus === 'approved' ? 
                '<p>🎉 Congratulations! Your KYC verification has been approved. You can now participate in the IDO.</p>' :
                userData.kycStatus === 'pending' ?
                '<p>⏳ Your KYC documents are under review. We\'ll notify you once the verification is complete.</p>' :
                '<p>❌ Your KYC verification was not approved. Please check the requirements and resubmit your documents.</p>'
              }
            </div>
            
            ${userData.kycStatus === 'approved' ? `
              <h3>🎯 Next Steps:</h3>
              <ul>
                <li>✅ Start investing in G8S LPG IDO</li>
                <li>✅ Access all platform features</li>
                <li>✅ Receive investment updates</li>
              </ul>
            ` : ''}
            
            <p>If you have any questions about your KYC status, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>© 2024 G8S LPG. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      KYC Status Update
      
      Hello ${userData.firstName || 'User'}!
      
      Status: ${userData.kycStatus.toUpperCase()}
      
      ${userData.kycStatus === 'approved' ? 
        'Congratulations! Your KYC verification has been approved. You can now participate in the IDO.' :
        userData.kycStatus === 'pending' ?
        'Your KYC documents are under review. We\'ll notify you once the verification is complete.' :
        'Your KYC verification was not approved. Please check the requirements and resubmit your documents.'
      }
      
      ${userData.kycStatus === 'approved' ? `
        Next Steps:
        - Start investing in G8S LPG IDO
        - Access all platform features
        - Receive investment updates
      ` : ''}
      
      If you have any questions about your KYC status, please contact our support team.
      
      © 2024 G8S LPG. All rights reserved.
    `
  }),

  // Password reset email
  passwordReset: (resetData) => ({
    subject: 'Password Reset - G8S LPG',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #fef2f2; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>Secure Your G8S LPG Account</p>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>We received a request to reset your password for your G8S LPG account.</p>
            
            <p>If you requested this password reset, click the button below:</p>
            
            <a href="${resetData.resetLink}" class="button">Reset Password</a>
            
            <p><strong>This link will expire in 1 hour.</strong></p>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>For security reasons, this link can only be used once.</p>
          </div>
          <div class="footer">
            <p>© 2024 G8S LPG. All rights reserved.</p>
            <p>If you have any questions, contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset Request - G8S LPG
      
      Password Reset Request
      
      We received a request to reset your password for your G8S LPG account.
      
      If you requested this password reset, click the link below:
      ${resetData.resetLink}
      
      This link will expire in 1 hour.
      
      If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      
      For security reasons, this link can only be used once.
      
      © 2024 G8S LPG. All rights reserved.
      If you have any questions, contact our support team.
    `
  }),

  // IDO announcement email
  idoAnnouncement: (announcementData) => ({
    subject: 'Important IDO Update - G8S LPG',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>IDO Announcement</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #eff6ff; padding: 30px; border-radius: 0 0 10px 10px; }
          .announcement { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Important IDO Update</h1>
            <p>G8S LPG Announcement</p>
          </div>
          <div class="content">
            <h2>Hello G8S LPG Community!</h2>
            
            <div class="announcement">
              <h3>${announcementData.title}</h3>
              <p>${announcementData.message}</p>
            </div>
            
            <h3>📊 Current IDO Status</h3>
            <ul>
              <li><strong>Total Raised:</strong> $${announcementData.totalRaised || '0'}</li>
              <li><strong>Tokens Sold:</strong> ${announcementData.tokensSold || '0'} G8S</li>
              <li><strong>Remaining:</strong> ${announcementData.remainingTokens || '0'} G8S</li>
            </ul>
            
            <p>Thank you for being part of the G8S LPG community!</p>
          </div>
          <div class="footer">
            <p>© 2024 G8S LPG. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Important IDO Update - G8S LPG
      
      Hello G8S LPG Community!
      
      ${announcementData.title}
      
      ${announcementData.message}
      
      Current IDO Status:
      - Total Raised: $${announcementData.totalRaised || '0'}
      - Tokens Sold: ${announcementData.tokensSold || '0'} G8S
      - Remaining: ${announcementData.remainingTokens || '0'} G8S
      
      Thank you for being part of the G8S LPG community!
      
      © 2024 G8S LPG. All rights reserved.
    `
  })
};

module.exports = emailTemplates;

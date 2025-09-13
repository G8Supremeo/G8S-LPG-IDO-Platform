# Email Service Setup Guide for G8S LPG

## Secure Email Configuration (No Private Keys Required)

### Option 1: Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Enable 2-Factor Authentication

2. **Generate App Password**
   - Go to Security → App passwords
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Update Backend Configuration**
   ```env
   # In g8s-backend/.env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   SMTP_FROM=noreply@g8s-lpg.com
   ```

### Option 2: SendGrid (Professional)

1. **Create SendGrid Account**
   - Go to: https://sendgrid.com
   - Sign up for free account (100 emails/day free)

2. **Create API Key**
   - Go to Settings → API Keys
   - Create new API key
   - Copy the key

3. **Update Backend Configuration**
   ```env
   # In g8s-backend/.env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   SMTP_FROM=noreply@g8s-lpg.com
   ```

### Option 3: Mailgun (Developer Friendly)

1. **Create Mailgun Account**
   - Go to: https://www.mailgun.com
   - Sign up for free account (10,000 emails/month free)

2. **Get SMTP Credentials**
   - Go to Sending → Domains
   - Copy SMTP credentials

3. **Update Backend Configuration**
   ```env
   # In g8s-backend/.env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-mailgun-smtp-username
   SMTP_PASS=your-mailgun-smtp-password
   SMTP_FROM=noreply@your-domain.mailgun.org
   ```

### Option 4: AWS SES (Enterprise)

1. **Create AWS Account**
   - Go to: https://aws.amazon.com/ses
   - Set up AWS SES

2. **Get SMTP Credentials**
   - Go to SES → SMTP Settings
   - Create SMTP credentials

3. **Update Backend Configuration**
   ```env
   # In g8s-backend/.env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-ses-smtp-username
   SMTP_PASS=your-ses-smtp-password
   SMTP_FROM=noreply@g8s-lpg.com
   ```

## Email Templates Available:

- ✅ **Welcome Email** - New user registration
- ✅ **Investment Confirmation** - IDO purchase confirmation
- ✅ **Transaction Updates** - Blockchain transaction status
- ✅ **Password Reset** - Account recovery
- ✅ **KYC Status** - Verification updates
- ✅ **Admin Notifications** - System alerts

## Security Features:

- ✅ **No Private Keys** - Uses app passwords/API keys only
- ✅ **Rate Limiting** - Prevents spam
- ✅ **Template System** - Professional email templates
- ✅ **Error Handling** - Graceful fallbacks
- ✅ **Logging** - Email delivery tracking

## After Configuration:

1. **Restart Backend Server**
   ```bash
   cd g8s-backend
   npm run dev
   ```

2. **Test Email Service**
   - Check logs for "✅ Email service initialized successfully"
   - Test registration flow

## Benefits:
- ✅ User engagement through notifications
- ✅ Transaction confirmations
- ✅ Account security alerts
- ✅ Professional communication
- ✅ Compliance with regulations

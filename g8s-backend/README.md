# G8S LPG Backend

A comprehensive backend API for the G8S LPG IDO platform, built with Node.js, Express, and MongoDB.

## Features

- **User Management**: Registration, authentication, KYC verification, wallet connection
- **Blockchain Integration**: Real-time event listening, transaction processing, token management
- **IDO Management**: Token sales, investment tracking, admin controls
- **Analytics**: Comprehensive analytics and reporting system
- **Notifications**: Multi-channel notification system (email, push, SMS, in-app)
- **Real-time Updates**: WebSocket support for live data updates
- **Security**: JWT authentication, rate limiting, input validation
- **Admin Panel**: Complete admin interface for platform management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain**: Ethers.js for Ethereum interaction
- **Authentication**: JWT with bcrypt
- **Real-time**: WebSocket
- **Email**: Nodemailer
- **Validation**: Joi and express-validator
- **Security**: Helmet, CORS, rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd g8s-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret
   - Blockchain RPC URLs and contract addresses
   - Email service credentials
   - Other service configurations

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create collections and indexes

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/connect-wallet` - Connect wallet
- `POST /api/users/kyc` - Submit KYC documents
- `GET /api/users/transactions` - Get user transactions
- `GET /api/users/notifications` - Get user notifications

### Tokens
- `GET /api/tokens` - Get all tokens
- `GET /api/tokens/:address` - Get token by address
- `GET /api/tokens/:address/balance` - Get token balance
- `GET /api/tokens/ido/list` - Get IDO tokens
- `GET /api/tokens/statistics` - Get token statistics

### Transactions
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions/invest` - Create investment
- `POST /api/transactions/:id/confirm` - Confirm transaction
- `GET /api/transactions/statistics` - Get transaction statistics

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
- `GET /api/analytics/users` - Get user analytics
- `GET /api/analytics/transactions` - Get transaction analytics
- `GET /api/analytics/ido` - Get IDO analytics

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `POST /api/admin/ido/:action` - IDO management actions
- `GET /api/admin/system/health` - Get system health

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `GET /api/notifications/statistics` - Get notification stats

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `SEPOLIA_RPC_URL` | Ethereum Sepolia RPC URL | Yes |
| `PRIVATE_KEY` | Admin wallet private key | Yes |
| `G8S_TOKEN_ADDRESS` | G8S token contract address | Yes |
| `G8S_IDO_ADDRESS` | G8S IDO contract address | Yes |
| `PUSD_ADDRESS` | PUSD token contract address | Yes |
| `SMTP_HOST` | Email SMTP host | No |
| `SMTP_USER` | Email SMTP user | No |
| `SMTP_PASS` | Email SMTP password | No |

## Database Models

### User
- Basic profile information
- Wallet connection details
- KYC verification status
- Investment profile and preferences
- Security settings and login history

### Transaction
- Blockchain transaction details
- Token information and amounts
- User and wallet associations
- Status and processing information

### Token
- Token metadata and economics
- Price and market data
- IDO-specific information
- Trading and liquidity data

### Analytics
- Time-based analytics data
- User, transaction, and financial metrics
- Performance and engagement data
- Geographic and device analytics

### Notification
- Multi-channel notification system
- Delivery status tracking
- User preferences and settings
- Template and scheduling support

## Services

### BlockchainService
- Contract interaction and event listening
- Transaction processing and confirmation
- Token balance and price updates
- Real-time blockchain data synchronization

### NotificationService
- Multi-channel notification delivery
- Email, push, SMS, and in-app notifications
- Template management and personalization
- Delivery tracking and retry logic

### AnalyticsService
- Comprehensive analytics generation
- Time-based reporting (hourly, daily, weekly, monthly)
- Performance metrics and KPIs
- Data aggregation and caching

### EmailService
- Professional email templates
- Transactional and marketing emails
- Delivery tracking and error handling
- SMTP configuration and management

## WebSocket Events

The backend provides real-time updates via WebSocket:

- `investment_update` - New investment notifications
- `sale_status` - IDO sale status changes
- `price_update` - Token price updates
- `transaction_update` - Transaction status changes
- `system_announcement` - System-wide announcements

## Security Features

- JWT-based authentication
- Rate limiting and request throttling
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Password hashing with bcrypt
- Account lockout protection
- KYC verification system

## Monitoring and Logging

- Comprehensive error handling
- Request logging with Morgan
- Performance monitoring
- System health checks
- Database connection monitoring
- Blockchain service status

## Development

### Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

### Testing
- Unit tests with Jest
- Integration tests with Supertest
- API endpoint testing
- Database model testing

## Deployment

1. **Environment Setup**
   - Configure production environment variables
   - Set up MongoDB Atlas or self-hosted MongoDB
   - Configure email service
   - Set up blockchain RPC endpoints

2. **Build and Deploy**
   ```bash
   npm install --production
   npm start
   ```

3. **Process Management**
   - Use PM2 for process management
   - Set up reverse proxy with Nginx
   - Configure SSL certificates
   - Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Email: support@g8s-lpg.com
- Documentation: [API Documentation](link-to-docs)
- Issues: [GitHub Issues](link-to-issues)

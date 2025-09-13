# G8S LPG IDO Platform

A complete fullstack Web3 IDO (Initial DEX Offering) platform for G8S token fundraising, featuring modern UI, smart contracts, and real-time event indexing.

## 🚀 Features

### Smart Contracts
- **G8SToken**: ERC-20 compliant token with 1B total supply
- **G8SIDO**: IDO sale contract with PUSD payment integration
- **Admin Controls**: Price setting, pause/resume, fund withdrawal, token sweep
- **Security**: OpenZeppelin security patterns, reentrancy protection

### Frontend
- **Modern UI**: Professional design inspired by TotalEnergies/Polkastarter
- **Wallet Integration**: RainbowKit with multiple wallet support
- **Real-time Stats**: Live token sale progress and user balances
- **Admin Panel**: Full control interface for IDO management
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Animations**: Smooth Framer Motion animations throughout

### Backend
- **Event Indexing**: Real-time blockchain event monitoring
- **REST API**: Health checks, stats, and purchase history
- **Purchase Tracking**: Individual wallet purchase history
- **Live Updates**: Automatic stats updates from blockchain events

## 🏗️ Architecture

```
G8S_LPG/
├── contracts/           # Smart contracts (Hardhat)
├── g8s-frontend/        # Next.js frontend
├── g8s-backend/         # Node.js/Express backend
├── G8S_LPG_PRD_Final.md # Product requirements
└── G8S_LPG_TestPlan_Final.md # Test cases
```

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** 0.8.20
- **Hardhat** development environment
- **OpenZeppelin** security libraries
- **Ethereum Sepolia** testnet

### Frontend
- **Next.js** 15.5.2 (React framework)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Wagmi** + **RainbowKit** for Web3
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Node.js** + **Express.js**
- **Ethers.js** for blockchain interaction
- **CORS** enabled for frontend integration
- **Morgan** for request logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible wallet
- Sepolia ETH for gas fees
- PUSD test tokens

### 1. Smart Contracts Setup

```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your RPC URL and private key
npx hardhat compile
npx hardhat test
```

### 2. Frontend Setup

```bash
cd g8s-frontend
npm install
cp ENV_EXAMPLE.txt .env.local
# Edit .env.local with your configuration
npm run dev
```

### 3. Backend Setup

```bash
cd g8s-backend
npm install
cp ENV_EXAMPLE.txt .env
# Edit .env with your configuration
npm start
```

## 📋 Environment Variables

### Contracts (.env)
```env
SEPOLIA_RPC_URL=https://sepolia.drpc.org
PRIVATE_KEY=your_private_key_here
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
PRICE_PUSD=666670000000000000000
START_TIME=1726128000
END_TIME=1735689600
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_RPC_URL_SEPOLIA=https://sepolia.drpc.org
NEXT_PUBLIC_IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
NEXT_PUBLIC_G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
NEXT_PUBLIC_PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
```

### Backend (.env)
```env
PORT=4000
NODE_ENV=development
SEPOLIA_RPC_URL=https://sepolia.drpc.org
IDO_ADDRESS=0x182a1b31e2C57B44D6700eEBBD6733511b559782
G8S_TOKEN_ADDRESS=0xCe28Eb32bbd8c66749b227A860beFcC12e612295
PUSD_ADDRESS=0xDd7639e3920426de6c59A1009C7ce2A9802d0920
```

## 🎯 Contract Addresses (Sepolia)

- **G8S Token**: `0xCe28Eb32bbd8c66749b227A860beFcC12e612295`
- **IDO Contract**: `0x182a1b31e2C57B44D6700eEBBD6733511b559782`
- **PUSD Token**: `0xDd7639e3920426de6c59A1009C7ce2A9802d0920`

## 🔧 Available Scripts

### Smart Contracts
```bash
npx hardhat compile          # Compile contracts
npx hardhat test            # Run tests
npx hardhat run scripts/deploy.js --network sepolia  # Deploy
```

### Frontend
```bash
npm run dev                 # Development server
npm run build              # Production build
npm run start              # Production server
npm run lint               # Lint code
```

### Backend
```bash
npm start                  # Start server
npm run dev                # Development with nodemon
```

## 🌐 API Endpoints

### Backend API
- `GET /healthz` - Health check
- `GET /stats` - IDO statistics
- `GET /purchases/:wallet` - User purchase history

## 🎨 UI Features

### Main Dashboard
- **Hero Section**: Professional landing with animated background
- **Stats Cards**: Real-time sale progress and metrics
- **Buy Panel**: Intuitive token purchase interface
- **Portfolio**: User balance display
- **Progress Bar**: Visual sale completion tracking

### Admin Panel
- **Status Overview**: Sale state and metrics
- **Price Control**: Dynamic price adjustment
- **Sale Management**: Pause/resume functionality
- **Fund Management**: Withdraw and sweep operations
- **Transaction History**: Admin action tracking

## 🔒 Security Features

- **OpenZeppelin**: Battle-tested security patterns
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency stop functionality
- **Ownable**: Admin access control
- **Input Validation**: Comprehensive parameter checks

## 🧪 Testing

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

### Frontend Tests
```bash
cd g8s-frontend
npm test
```

## 📊 Tokenomics

- **Total Supply**: 1,000,000,000 G8S tokens
- **IDO Allocation**: 300,000,000 G8S (30%)
- **Price**: 666.67 PUSD per G8S token
- **Sale Duration**: 3 months (Oct 2024 - Dec 2024)

## 🚀 Deployment

### Smart Contracts
Deploy to Sepolia testnet using Hardhat or Remix IDE.

### Frontend
Deploy to Vercel, Netlify, or similar platform.

### Backend
Deploy to Railway, Heroku, or VPS with Node.js support.

## 📝 Development Status

✅ **Completed Features:**
- Smart contract implementation and testing
- Modern frontend with wallet integration
- Backend with event indexing
- Admin panel with full controls
- Professional UI with animations
- Real-time stats and progress tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation in `G8S_LPG_PRD_Final.md`
- Review test cases in `G8S_LPG_TestPlan_Final.md`
- Open an issue for bugs or feature requests

---

**Built with ❤️ for the G8S LPG community**

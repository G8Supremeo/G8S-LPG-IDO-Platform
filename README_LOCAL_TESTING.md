# G8S LPG IDO Platform — Local Testing Guide

This document explains how to run and test the project locally (backend API + frontend UI) and how to execute the backend test suite.

---

## 1) Prerequisites
- Node.js 20+
- npm
- Reliable Sepolia RPC (Alchemy/Infura/QuickNode) for wallet testing
- Supabase project (URL, anon key, service key) if you want to run the API locally against your DB

---

## 2) Backend — Run Tests Locally
Location: `g8s-backend/`

- Install and run tests:
```bash
cd g8s-backend
npm install
npm test
```
- Optional:
```bash
npm run test:watch     # re-run on file changes
npm run test:coverage  # coverage report
```

Notes:
- Tests mock Supabase; no network is required.
- Main test file: `g8s-backend/__tests__/auth.test.js` (register, login, me).

---

## 3) Backend — Run the API Locally
Location: `g8s-backend/`

### 3.1 Create `.env`
Create `g8s-backend/.env` (or export these in your shell):
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY=YOUR_SUPABASE_SERVICE_KEY

JWT_SECRET=your-long-random-secret

SEPOLIA_RPC_URL=YOUR_SEPOLIA_RPC_URL
IDO_ADDRESS=YOUR_IDO_CONTRACT_ADDRESS
G8S_TOKEN_ADDRESS=YOUR_G8S_CONTRACT_ADDRESS
PUSD_ADDRESS=YOUR_PUSD_CONTRACT_ADDRESS

USE_MONGO=false
```

### 3.2 Start the server
```bash
cd g8s-backend
npm run check-env   # optional: prints missing required envs
npm run dev         # starts server on http://localhost:5000
```

### 3.3 Verify health
```bash
curl http://localhost:5000/health
```
Expect 200 and a JSON payload.

### 3.4 Quick API checks (Postman/Insomnia)
- `POST /api/auth/register` → { email, password, firstName, lastName }
- `POST /api/auth/login` → returns JWT
- `GET /api/auth/me` → with `Authorization: Bearer <token>`

---

## 4) Frontend — Run the UI Locally
Location: `g8s-frontend/`

### 4.1 Create `.env.local`
Create `g8s-frontend/.env.local`:
```
NEXT_PUBLIC_WC_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
NEXT_PUBLIC_RPC_URL_SEPOLIA=YOUR_SEPOLIA_RPC_URL
NEXT_PUBLIC_G8S_TOKEN_ADDRESS=YOUR_G8S_CONTRACT_ADDRESS
NEXT_PUBLIC_IDO_ADDRESS=YOUR_IDO_CONTRACT_ADDRESS
NEXT_PUBLIC_PUSD_ADDRESS=YOUR_PUSD_CONTRACT_ADDRESS
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4.2 Start the app
```bash
cd g8s-frontend
npm install
npm run dev   # http://localhost:3000
```

### 4.3 Wallet testing (Sepolia)
- Ensure your wallet is on Sepolia testnet.
- Open the IDO page.
- Enter PUSD amount → click “Approve” → wallet prompt → wait for confirmation.
- Click “Buy G8S Tokens” → wallet prompt → wait for confirmation.

Tips for faster prompts:
- Use a fast RPC (Alchemy/Infura/QuickNode) in both the app env and MetaMask’s Sepolia network config.
- Keep the browser tab in the foreground and allow extension popups.

---

## 5) (Optional) Update IDO Price On-Chain (Sepolia)
To change the on-chain price for local validation (owner wallet required):
- See `CHANGE_IDO_PRICE.md` for step-by-step instructions.
- Summary (owner-only): call `setPricePUSD(1555555555555555600)` for ~₦2,333.33/token at ₦1,500/$.

---

## 6) Troubleshooting
- Healthcheck fails locally
  - Verify `.env` values and rerun `npm run check-env` in `g8s-backend/`.
- CORS errors
  - Ensure `FRONTEND_URL=http://localhost:3000` in backend `.env` and `NEXT_PUBLIC_API_URL=http://localhost:5000` in frontend `.env.local`.
- Wallet prompt delayed
  - Make sure the wallet is already on Sepolia; use a fast RPC; watch the UI text for “Waiting for confirmation…”.
- Contract address mismatch
  - Confirm all three addresses are consistent across backend and frontend envs.

---

## 7) Useful Commands
```bash
# Backend tests
cd g8s-backend && npm test

# Backend dev server
cd g8s-backend && npm run dev

# Frontend dev server
cd g8s-frontend && npm run dev
```

---

## 8) Where Things Live
- Backend tests: `g8s-backend/__tests__/`
- Backend routes/config: `g8s-backend/routes/`, `g8s-backend/supabase-config.js`
- Frontend IDO UI: `g8s-frontend/src/components/IDOPurchase.tsx`
- Price change guide: `CHANGE_IDO_PRICE.md`

This guide keeps your existing READMEs intact and is focused solely on local testing workflows.

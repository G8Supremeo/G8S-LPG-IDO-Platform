# G8S LPG IDO Platform — Supabase-Native README

This README documents the current Supabase-native setup for the G8S LPG IDO Platform.

- Frontend: Next.js (Vercel)
- Backend: Node/Express (Railway)
- Auth & Database: Supabase (Postgres + Auth)
- Blockchain: Ethereum Sepolia (G8S Token, IDO, PUSD)

---

## 1) Architecture Overview
- Wallet flow (frontend only): Approve PUSD → Buy G8S via IDO contract
- API flow (backend): Supabase Auth (email/password), profile in `users` table, JWT issued for API
- Reads from chain (price, paused, tokensSold) are client-side via Wagmi/Viem
- Optional on-chain event subscriptions (enable with WebSocket RPC)

---

## 2) Repos & Folders
- `g8s-frontend/` — Next.js app (RainbowKit, Wagmi, Viem)
- `g8s-backend/` — Express API (Supabase-native; Mongo paths disabled by default)

---

## 3) Environment Variables

### Frontend (Vercel)
- `NEXT_PUBLIC_WC_PROJECT_ID` — WalletConnect Cloud Project ID
- `NEXT_PUBLIC_RPC_URL_SEPOLIA` — Sepolia RPC (Alchemy/Infura/QuickNode)
- `NEXT_PUBLIC_G8S_TOKEN_ADDRESS` — G8S token address (Sepolia)
- `NEXT_PUBLIC_IDO_ADDRESS` — IDO contract address (Sepolia)
- `NEXT_PUBLIC_PUSD_ADDRESS` — PUSD token address (Sepolia)
- `NEXT_PUBLIC_API_URL` — Railway backend URL

### Backend (Railway)
- `SUPABASE_URL` — e.g. `https://your-project.supabase.co`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `JWT_SECRET` — long random secret
- `SEPOLIA_RPC_URL` — HTTP RPC (required)
- `SEPOLIA_WS_URL` — WebSocket RPC (optional; enables event subscriptions)
- `IDO_ADDRESS`, `G8S_TOKEN_ADDRESS`, `PUSD_ADDRESS`
- `USE_MONGO=false` — disable legacy Mongo paths

---

## 4) Supabase Setup
1. Create project → Settings → API → copy URL/keys
2. Run schema:
   - File: `g8s-backend/supabase-schema.sql`
3. Relax wallet column so signup works without a wallet:
```sql
alter table users alter column wallet_address drop not null;
create unique index if not exists users_wallet_address_unique
on users(wallet_address) where wallet_address is not null;
```
4. Grant admin to a user (optional):
```sql
alter table users add column if not exists role text default 'user';
update users set role = 'admin' where email = 'you@example.com';
```

---

## 5) Deployment

### Backend (Railway)
- Root: `g8s-backend`
- Health check: `/health`
- Logs: Railway → Deployments → Logs

### Frontend (Vercel)
- Root: `g8s-frontend`
- Set environment variables → Redeploy

---

## 6) Running Locally
Backend:
```bash
cd g8s-backend
npm install
npm run check-env    # verifies required envs
npm run dev
```
Frontend:
```bash
cd g8s-frontend
npm install
npm run dev
```

---

## 7) Key User Flows
- Signup/Login (Supabase Auth)
  - POST `/api/auth/register` → creates Supabase Auth user + profile row (`users`)
  - POST `/api/auth/login` → Supabase Auth sign-in → returns JWT (payload contains Supabase user id)
  - GET `/api/auth/me` → returns profile from Supabase
- Purchase G8S (Frontend)
  - Approve PUSD → wallet prompt → waits for confirmation
  - Buy G8S → wallet prompt → waits for confirmation
  - Reads: `pricePUSD`, `paused`, `tokensSold` via contract reads
- Admin
  - Set `users.role='admin'` in Supabase → visit `/admin` on the frontend

---

## 8) Common Issues & Fixes
- MetaMask prompt delayed
  - Use a fast RPC (`NEXT_PUBLIC_RPC_URL_SEPOLIA`), be on Sepolia before clicking Approve, keep tab in foreground
- `Invalid supabaseUrl` in logs
  - Re-enter `SUPABASE_URL` exactly, no spaces or `@`; restart
- Healthcheck failing
  - Check logs for missing required env vars (`JWT_SECRET`, Supabase keys, RPC URLs)
- Event subscriptions skipped
  - Add `SEPOLIA_WS_URL` (wss) to enable `.on()` listeners; otherwise reads continue to work
- Mongo timeouts
  - Ensure `USE_MONGO=false`

---

## 9) Testing (Highlights)
- Auth
  - Register/Login returns token; `/api/auth/me` works with Bearer token
- Wallet
  - Approve shows prompt → confirmation text updates
  - Buy shows prompt → confirmation text updates
- Admin
  - Non-admin blocks; admin allowed after `role='admin'`
- Env/Health
  - `/health` returns 200 JSON; logs show "All required environment variables are set!"

Detailed cases: see `TEST_CASES.md`.

---

## 10) Files of Interest
- Frontend purchase logic: `g8s-frontend/src/components/IDOPurchase.tsx`
- Backend Supabase config: `g8s-backend/supabase-config.js`
- Auth routes (Supabase-native): `g8s-backend/routes/auth.js`
- Auth middleware (Supabase-aware): `g8s-backend/middleware/auth.js`
- Blockchain service: `g8s-backend/services/blockchainService.js`

---

## 11) License
MIT

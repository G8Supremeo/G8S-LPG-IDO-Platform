# G8S LPG IDO Platform — Product Requirements (Supabase-Native)

## 1. Overview
G8S LPG is a tokenized IDO platform enabling users to purchase G8S tokens using PUSD on Ethereum Sepolia. The platform comprises a Next.js frontend (Vercel), a Node/Express backend API (Railway), and Supabase for auth, data, and admin visibility.

## 2. Goals
- Seamless wallet-based purchase of G8S with PUSD.
- Secure email/password account system (Supabase Auth), plus on-chain wallet linking.
- Real-time sale status (read-only without WS if needed).
- Admin insights (users, transactions, IDO settings) via frontend and Supabase Studio.

## 3. Personas & Roles
- Investor (user): signs up, connects wallet, buys tokens.
- Admin: manages sale, views analytics, moderates users.

Roles stored in `users.role` (values: `user`, `admin`).

## 4. Key User Flows
- Signup/Login: Supabase Auth (email/password). Profile row in `users` table.
- Wallet connect: frontend via RainbowKit; store wallet address in profile (optional).
- Approve PUSD: ERC-20 approve to IDO contract.
- Buy G8S: call `buyWithPUSD(amount)` on IDO contract.
- Admin access: `/admin` UI if role=`admin`.

## 5. Functional Requirements
- Auth:
  - Register/Login using Supabase Auth.
  - JWT issued by backend for API authorization (payload: Supabase user id).
  - `GET /api/auth/me` returns profile data from Supabase.
- IDO Purchase:
  - Frontend reads `pricePUSD`, `paused`, `tokensSold` from IDO contract (read-only).
  - Approval and purchase transactions via wallet.
- Notifications & Analytics:
  - Core app logs available via Supabase tables; optional email notifications.
- Admin:
  - Admin can access `/admin` when `users.role='admin'`.

## 6. Non-Functional Requirements
- Security: JWT, CORS restricted to Vercel domain, Helmet.
- Availability: Health check `/health` on Railway.
- Performance: Use dedicated RPC (Infura/Alchemy). Skip event subs if no WS.
- Observability: Logs in Railway; DB visible in Supabase Studio.

## 7. Tech Stack
- Frontend: Next.js 15, React 19, RainbowKit, Wagmi, Viem.
- Backend: Node.js 20+, Express, Supabase JS.
- Infra: Vercel (frontend), Railway (backend), Supabase (DB/Auth).
- Chain: Ethereum Sepolia. Contracts: G8S Token, IDO, PUSD.

## 8. Configuration
- Frontend env:
  - `NEXT_PUBLIC_WC_PROJECT_ID`, `NEXT_PUBLIC_RPC_URL_SEPOLIA`, `NEXT_PUBLIC_G8S_TOKEN_ADDRESS`, `NEXT_PUBLIC_IDO_ADDRESS`, `NEXT_PUBLIC_PUSD_ADDRESS`, `NEXT_PUBLIC_API_URL`.
- Backend env:
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `SEPOLIA_RPC_URL`, `IDO_ADDRESS`, `G8S_TOKEN_ADDRESS`, `PUSD_ADDRESS`, `USE_MONGO=false`.

## 9. Data Model (Supabase)
- `users(id uuid pk, email text, first_name text, last_name text, wallet_address text null unique, role text default 'user', is_active bool, created_at, updated_at)`
- `transactions(id uuid pk, user_id uuid fk, transaction_hash text unique, transaction_type text, token_address text, token_symbol text, amount numeric, amount_usd numeric, status text, created_at, ... )`
- `tokens`, `analytics`, `notifications`, `ido_settings` (as in supabase-schema.sql)

## 10. APIs (selected)
- `POST /api/auth/register` → create Supabase Auth user + profile row; return JWT.
- `POST /api/auth/login` → Supabase Auth sign-in; return JWT.
- `GET /api/auth/me` → profile from Supabase.
- Other route groups: `/api/users`, `/api/transactions`, `/api/tokens`, `/api/admin`, `/api/analytics`

## 11. Permissions
- Default `user` access to own data.
- `admin` access to admin routes and `/admin` UI.

## 12. UX Requirements
- Approve/Buy buttons show progress and confirmation states.
- Network switch to Sepolia when needed.
- Clear error messages for RPC/auth failures.

## 13. Deployment
- Frontend: Vercel (root: `g8s-frontend`).
- Backend: Railway (root: `g8s-backend`), health check `/health`.
- Supabase: Run schema SQL; set RLS as provided.

## 14. Risks & Mitigations
- RPC latency: use dedicated provider; pre-switch network.
- Missing env vars: startup-check and docs.
- Supabase client init: delayed/guarded init; trims env values.

## 15. Success Metrics
- Signup success rate, conversion to purchase, error rate of wallet actions, admin dashboard load success.

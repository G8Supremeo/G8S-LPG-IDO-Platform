# 📘 Product Requirement Document (PRD)

Project: G8S_LPG Tokenized IDO Platform (Frontend, Backend, Smart Contracts)
Chain/Network: Ethereum Sepolia Testnet
Purchase Currency: PUSD (ERC-20) `0xDd7639e3920426de6c59A1009C7ce2A9802d0920`
Token: G8S (ERC-20), Total Supply: 1,000,000,000 G8S
Version: v1.0 (Execution-Ready)
Date: 2025-09-10
Owner: G8S Fullstack Builder

## 0) Document Control
- Purpose: Define scope, requirements, architecture, and acceptance criteria to build and ship the G8S_LPG IDO platform end-to-end.
- Audience: Product, Engineering (FE/BE/SC), QA, DevOps, Stakeholders.
- Change Mgmt: Version bump on every material change; keep CHANGELOG in repo root.

## 1) Company & Product Overview
- Company: G8S_LPG
- Vision: “Empowering healthier, happier homes by delivering clean, safe, and affordable LPG energy—anytime, anywhere.”
- Mission: Disrupt LPG market with smart distribution, subscription utilities, IoT safety, and tokenized fundraising.
- UVP: First mover combining LPG utility + blockchain fundraising; scalable infra powered by IoT/AI and community inclusion.

## 2) Business & Tokenomics
- Pre-money valuation: ₦600B (~$400M assumed)
- Fundraising target: ₦200B (~$133M)
- Token supply: 1,000,000,000 G8S (1B)
- Distribution:
  - Public IDO: 30% → 300M G8S
  - Founders & Team: 20% → 200M (4-year vesting)
  - Treasury: 20% → 200M
  - Ecosystem: 15% → 150M
  - Reserves/Liquidity: 10% → 100M
  - Advisors/Marketing: 5% → 50M
- IDO pricing: Target raise ₦200B over 300M G8S ⇒ ₦666.67/G8S. Assumption PUSD = ₦1 ⇒ 666.67 PUSD per G8S. Price is configurable on-chain.

## 3) Scope
- In Scope:
  - Smart contracts: `G8SToken` (ERC-20), `G8SIDO` (IDO sale accepting PUSD), optional `TeamVesting`.
  - Frontend: Next.js app for wallet connection, price/allocations, approve + buy flow, sale analytics, receipts.
  - Backend: Node/Express service with DB for analytics, event indexing, REST APIs.
  - DevOps: CI/CD, test/stage/prod (on Sepolia), observability, secrets mgmt.
- Out of Scope (v1):
  - KYC/AML, fiat onramps, CEX listings, production mainnet deployment, advanced governance (beyond owner operations).

## 4) Personas & Key Journeys
- Retail Buyer: Connect wallet, approve PUSD, buy G8S, view confirmations, see balances and sale progress.
- Project Admin: Configure sale (time/price), pause/unpause, withdraw PUSD, sweep unsold G8S, view analytics.
- Analyst/Stakeholder: Read-only dashboards for raised funds, tokens sold, buyers count, top stats.

## 5) Functional Requirements
### 5.1 Smart Contracts
- `G8SToken` (ERC-20):
  - Standard 18 decimals; mint initial supply to deployer/treasury.
  - Ownership transfer capability.
- `G8SIDO` (Sale):
  - Constructor params: `g8sToken`, `pusdToken`, `pricePUSD`, `tokensForSale`, `startTime`, `endTime`.
  - Accept PUSD ERC-20 payments via `buyWithPUSD(pusdAmount)` and `buyTokens(tokensDesired)`.
  - Accounting: `tokensSold`, `totalRaisedPUSD`, `contributions[buyer]`.
  - Admin ops (onlyOwner): `setPricePUSD`, `pauseSale`, `resumeSale`, `withdrawPUSD(to)`, `sweepUnsold(to)` after `endTime`.
  - Guards: time window active, sale not paused, caps not exceeded, dust prevention (tokensOut > 0), ReentrancyGuard.
  - Events: `Purchased(address buyer, uint256 pusdAmount, uint256 tokensOut, uint256 timestamp)`, `PriceUpdated(uint256 oldPrice, uint256 newPrice)`, `Paused()`, `Unpaused()`.
- Optional `TeamVesting`:
  - Linear vesting with cliff; owner-assignable beneficiaries; non-transferable claim; emits `TokensClaimed`.

### 5.2 Frontend (Next.js)
- Wallet: MetaMask on Sepolia, account/network detection, switch prompt, error states.
- IDO Dashboard:
  - Live price (PUSD/G8S), tokens for sale, tokens sold, remaining; progress bar.
  - User balances: PUSD and G8S; refresh after tx; polling or event-driven.
  - Transaction center: Approve PUSD (needed allowance) → Buy G8S; pending/confirmed states; toast notifications; copyable tx hash and block explorer links.
- Receipts & Activity: Local history (indexed by backend when available), CSV export.
- Admin Panel (gated by owner wallet): Set price, pause/unpause, withdraw PUSD, sweep unsold (post-sale), view contract addresses and env.
- UX/Design: High interactivity inspired by https://www.totalenergies.com and https://www.polkastarter.com.
  - Motion/animations: Framer Motion micro-interactions (hover, progress, success).
  - Responsive, accessible (WCAG AA), keyboard nav, dark/light.
  - Performance budget: LCP < 2.5s, CLS < 0.1 on mid-tier devices.

### 5.3 Backend (Analytics & Indexer)
- Tech: Node.js (18+), Express, MongoDB (or Postgres), Ethers.js WebSocket provider.
- Responsibilities:
  - Subscribe to `Purchased` events and persist `{ txHash, buyer, pusdAmount, tokensOut, blockNumber, timestamp }`.
  - Expose REST:
    - `GET /healthz` → `{ ok: true }`
    - `GET /stats` → `{ totalRaisedPUSD, tokensSold, buyersCount }`
    - `GET /purchases/:wallet` → list purchases by wallet
  - Idempotency: dedupe by `txHash` unique index.
  - Resilience: reconnect, backfill from last processed block.

## 6) Non-Functional Requirements
- Security: Ownable + ReentrancyGuard; pausable sale; strict require messages; backend input validation; secrets in env; least-privilege infra.
- Reliability: 99.9% API uptime target during sale; autoscaling; WebSocket reconnection with backoff.
- Performance: Backend P95 < 200ms for reads; indexer can handle bursts (≥50 events/sec in tests).
- Accessibility: WCAG AA.
- Observability: Structured logs (JSON), healthchecks, metrics counters; alerting on failures (indexer lag, API 5xx).

## 7) Architecture (High-Level)
- Client (Next.js) ↔ RPC (Sepolia) for reads/writes via Ethers.
- Client ↔ Backend (REST) for analytics.
- Backend ↔ Sepolia (WebSocket) for event indexing → Database.
- Contracts deployed once per env; addresses configured in FE/BE via env.

## 8) Environment & Configuration
- Envs: `local` (Hardhat), `testnet` (Sepolia - staging), `prod` (Sepolia - production label).
- Secrets: RPC URLs (Alchemy/Infura), owner private key (deploy), DB URI.
- Config values:
  - PUSD address (Sepolia): `0xDd7639e3920426de6c59A1009C7ce2A9802d0920`
  - G8S token address: set post-deploy.
  - IDO address: set post-deploy.
  - Price (wei): e.g., `666670000000000000000` (666.67 PUSD/G8S).
  - Sale window: start/end timestamps.

## 9) API Specification (Backend)
- `GET /healthz`
  - 200: `{ ok: true, env, version }`
- `GET /stats`
  - 200: `{ totalRaisedPUSD: string, tokensSold: string, buyersCount: number, updatedAt: ISODate }`
- `GET /purchases/:wallet`
  - 200: `[{ txHash, buyer, pusdAmount, tokensOut, timestamp }]`
- Errors: RFC 7807 style `{ type, title, detail }`; 4xx client; 5xx server.
- Rate limiting: 60 req/min/IP (configurable).

## 10) Data Model (MongoDB)
- `purchases`
  - `_id`, `txHash` (unique), `buyer` (lowercase), `pusdAmount` (string), `tokensOut` (string), `blockNumber`, `timestamp` (Date)
- `cursor`
  - `_id`: `purchased:lastBlock`, `value`: last processed block
- Optional `wallets`
  - `address`, `firstSeenAt`, `lastActivityAt`

## 11) Detailed Acceptance Criteria
- Contracts
  - Deploys with valid params; rejects zero addresses; rejects invalid time/price.
  - Buying transfers PUSD in and G8S out with correct math; caps enforced; events emitted.
  - Pausing blocks buys; resume restores; withdraw and sweep work with access control.
- Frontend
  - Wallet connect shows account and network; prompts network switch to Sepolia.
  - Approve flow updates allowance state; buy flow shows pending → confirmed → balances refresh.
  - Admin-only actions gated by owner address; errors surfaced clearly.
- Backend
  - Indexer reliably persists all `Purchased` events exactly once; `/stats` reflects chain state.

## 12) UX & Content Requirements
- Pages: Home (hero, sale CTA), IDO Dashboard, How it works, FAQ, Admin, Legal/Docs, 404.
- Aesthetics: Motion-first, clean grid, strong contrast; microinteractions (hover, button states, progress animation). Inspiration: https://www.totalenergies.com and https://www.polkastarter.com.
- Copy: Clear steps to buy; risk note (“Testnet only. No real funds.”).
- Internationalization: English v1; structure for future locales.

## 13) Delivery Plan & Milestones
- M1: Contracts (token + IDO) with unit tests; local deploy scripts.
- M2: Frontend dashboard (read-only) pulling on-chain and backend mock.
- M3: Full buy flow (approve + buy), events + receipts.
- M4: Backend indexer + `/stats` + `/purchases/:wallet`.
- M5: Admin panel ops; pause/resume, price update, withdraw, sweep.
- M6: Hardening: security review, performance, accessibility; staging sign-off.
- M7: Production (Sepolia) release; smoke tests; runbook.

## 14) Risks & Mitigations
- RPC instability → Use multiple providers + retry/backoff.
- Price misconfiguration → Owner-only change + on-screen confirmation + event log.
- Reentrancy or allowance bugs → ReentrancyGuard, thorough tests, audits.
- UX friction → Guided steps, clear errors, loading states, optimistic UI with confirmations.

## 15) Success Metrics
- IDO: ≥90% of 300M sold in window.
- Adoption: ≥10k unique wallets on testnet.
- Tech: Contracts audited and stable on Sepolia; 0 critical incidents.
- Community: ≥5k combined community during IDO phase.

## 16) Requirement IDs (for Traceability)
- SC-REQ-1: IDO must accept PUSD at address above.
- SC-REQ-2: Price configurable by owner; emits `PriceUpdated`.
- SC-REQ-3: Enforce sale window and pause state.
- SC-REQ-4: Cap `tokensSold` ≤ `tokensForSale`; dust prevented.
- SC-REQ-5: Withdraw PUSD (owner-only); sweep unsold after end.
- FE-REQ-1: Wallet connect, network switch to Sepolia.
- FE-REQ-2: Display price, remaining tokens, balances, progress.
- FE-REQ-3: Approve + Buy flow with clear statuses and errors.
- FE-REQ-4: Admin panel for price/pause/withdraw/sweep.
- BE-REQ-1: Index `Purchased` events; idempotent by txHash.
- BE-REQ-2: Expose `/stats` and `/purchases/:wallet`.
- BE-REQ-3: Reconnect/backfill from last processed block.

---
Implementation Notes (for engineers):
- FE: Next.js, Tailwind, Framer Motion, Ethers.js, Wagmi; deploy to Vercel.
- SC: Hardhat, Solidity ^0.8.20, OpenZeppelin Ownable, ReentrancyGuard, Pausable.
- BE: Node/Express, MongoDB, Ethers provider (WebSocket), Dockerfile + CI.

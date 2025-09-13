# ✅ Test Strategy, Plan, and Cases — G8S_LPG IDO Platform

Project: G8S_LPG (FE, BE, Smart Contracts)
Version: v1.0 (Execution-Ready)
Date: 2025-09-10
Owner: QA Lead / Fullstack Builder

## 1) Objectives & Scope
- Validate correctness, security, and UX of the end-to-end IDO flow using PUSD on Sepolia.
- Cover Smart Contracts (unit + integration), Frontend (unit + E2E), Backend (unit + integration), and cross-stack scenarios.
- Target environments: local (Hardhat), testnet (Sepolia staging), prod (Sepolia “production”).

## 2) Test Approach
- Shift-left: write tests with implementation; use CI gate.
- Deterministic unit tests; realistic integration using Hardhat node or Sepolia fork.
- E2E with Playwright/Cypress against local stack and staging.

## 3) Tools & Frameworks
- Contracts: Hardhat, Mocha, Chai, OpenZeppelin test helpers.
- Frontend: Jest, React Testing Library, Playwright/Cypress.
- Backend: Jest, Supertest; MongoDB memory server (unit) or test DB.
- Infra: GitHub Actions (or similar) CI; coverage reports; ESLint/TS.

## 4) Entry/Exit Criteria
- Entry: Features complete in branch; env vars configured; deploy scripts ready.
- Exit: All must-run tests green; high-value green or risk-accepted; no P0/P1 defects; coverage ≥ 85% for SC/BE unit; critical E2E scenarios passing.

## 5) Test Data & Accounts
- Wallets: 3–5 funded test wallets with PUSD on local/sepolia.
- Tokens: Mock PUSD (local) and real PUSD on Sepolia at `0xDd7639e3920426de6c59A1009C7ce2A9802d0920`.
- Constants: `ONE = 1e18`, prices `{ 1e18, 3e18, 666670000000000000000 }`.

## 6) Smart Contracts — Unit Tests
- SC-U-01: ERC20 basic behavior — totalSupply, transfers, events, decimals=18.
- SC-U-02: Ownership & access — only owner can transferOwnership/owner ops.
- SC-U-03: IDO constructor validations — zero addresses, bad times, zero price/sale.
- SC-U-04: Params getters — pricePUSD, startTime, endTime, tokensForSale.
- SC-U-05: buyWithPUSD happy path — allowance, balances, events, accounting.
- SC-U-06: buyTokens happy path — compute pusdRequired; deliver tokens.
- SC-U-07: Insufficient allowance — revert; no state mutation.
- SC-U-08: Insufficient PUSD balance — revert; no state mutation.
- SC-U-09: Sale inactive — before start/after end — revert.
- SC-U-10: Pause/Unpause — buys revert while paused; succeed after resume.
- SC-U-11: Caps enforcement — cannot exceed tokensForSale; edge exact fill.
- SC-U-12: Rounding — floor behavior; dust check reverts.
- SC-U-13: Reentrancy guard — malicious PUSD cannot reenter.
- SC-U-14: withdrawPUSD owner-only — transfers funds out; non-owner reverts.
- SC-U-15: sweepUnsold after end — transfers unsold to treasury.
- SC-U-16: OnlyOwner access checks — verify reverts for non-owner.
- SC-U-17: Event correctness — Purchased values match state.
- SC-U-18: Tiny pusdAmount (dust) — revert, no PUSD pulled.
- SC-U-19: Large numbers safety — arithmetic correctness under extremes.

## 7) Smart Contracts — Integration
- SC-I-01: End-to-end sale lifecycle — multiple buyers; withdraw; sweep.
- SC-I-02: Race condition — low cap; concurrent buys; no oversell.
- SC-I-03: Sepolia PUSD integration — approval and buy with real PUSD.
- SC-I-04: Mid-sale price update — subsequent buys use new price.

## 8) Frontend — Unit Tests
- FU-U-01: Wallet connect component — displays account after connect.
- FU-U-02: Balance fetch & display — PUSD & G8S values and states.
- FU-U-03: Approve flow — allowance transitions to Approved.
- FU-U-04: Buy flow happy path — pending → confirmed; tx hash shown; balances refresh.
- FU-U-05: Insufficient allowance/balance — clear error; blocks tx.
- FU-U-06: Price & remaining tokens display — correct computation, live updates.
- FU-U-07: Error handling and retry UX — surfaces revert messages and retry.

## 9) Frontend — E2E
- FU-I-01: Full wallet-driven purchase flow — connect, approve, buy, confirm.
- FU-I-02: Multiple wallets buy — dashboard totals remain consistent.
- FU-I-03: Provider disconnect resilience — disconnect mid-tx; recover state.
- FU-I-04: Admin panel actions — set price, pause/unpause, withdraw, sweep.
- FU-I-05: Accessibility checks — keyboard nav, aria roles, contrast.

## 10) Backend — Unit
- BE-U-01: /healthz returns 200 and status JSON.
- BE-U-02: /stats with empty DB returns zeros.
- BE-U-03: Purchase insertion idempotency — unique txHash preserved.
- BE-U-04: /purchases/:wallet returns sorted list for wallet.
- BE-U-05: DB failures handled — returns 5xx, service stays up.

## 11) Backend — Integration
- BE-I-01: Event indexing E2E — emit Purchased; DB populated; /stats correct.
- BE-I-02: Reconnect recovery — outage; backfill from last block; no duplicates.
- BE-I-03: Concurrency & ordering — high throughput; counts accurate.

## 12) Cross-Stack Integration
- CI-01: Full pipeline — FE approve/buy; chain state; BE stats; all aligned.
- CI-02: Failure modes — chain revert → FE shows error; BE not updated. Lag → FE later reflects stats after indexing.

## 13) Non-Functional
- NF-SEC-01: Reentrancy protection validation (covered in SC-U-13).
- NF-SEC-02: Ownership hardening — owner-only enforced; no privilege escalation.
- NF-SEC-03: Input sanitization & error propagation — FE shows revert messages.
- NF-PERF-01: Gas regression — track and guard typical functions.
- NF-LOAD-01: Indexer & BE load — simulate N purchases/sec; acceptable backpressure.
- NF-UX-01: Performance budget — LCP/CLS within targets; FE E2E asserts.

## 14) Test Traceability Matrix (IDs → Requirements)
- SC-REQ-1..5 → SC-U-03/05/11/12/14/15; SC-I-01/03/04
- FE-REQ-1..4 → FU-U-01/04/05/06/07; FU-I-01/04/05
- BE-REQ-1..3 → BE-U-02/03/04/05; BE-I-01/02/03

## 15) Execution & CI
- Local dev:
  - `npx hardhat test` (contracts)
  - `npm run test` (backend, frontend unit)
  - `npx playwright test` or `npx cypress run` (E2E)
- CI stages:
  - Lint → Contracts Unit → Backend Unit → FE Unit → E2E (smoke on PR; full on nightly)
- Artifacts: coverage, junit, screenshots/videos for E2E.

## 16) Test Cases (Expanded Specs)

### Contracts — Key Cases (detailed)
1) SC-U-05 buyWithPUSD happy path
- Preconditions: IDO funded; buyer PUSD minted; allowance set; inside window.
- Steps: call `buyWithPUSD(pusdAmount)`.
- Expected: PUSD debited; G8S credited `pusdAmount * 1e18 / pricePUSD`; events match; counters updated.

2) SC-U-11 Caps limit
- Preconditions: tokensForSale small.
- Steps: buy below remaining (ok), attempt exceed (revert), buy exact remainder (ok).
- Expected: no oversell; final `tokensSold == tokensForSale`.

3) SC-U-12 Rounding & dust
- Preconditions: pricePUSD = 3e18; pusd=10e18.
- Steps: buy; tokensOut floors to 3e18; tiny pusd remainders stay with buyer.
- Expected: math matches; no rounding up.

4) SC-U-14 withdrawPUSD
- Preconditions: purchases exist.
- Steps: non-owner withdraw (revert); owner withdraw (success). Balance zero.

### Frontend — Key Cases (detailed)
1) FU-U-04 Buy flow happy path
- Steps: input 100 PUSD, approve, buy, wait confirm.
- Expected: status toasts; tx hash; balances refresh; dashboard updates.

2) FU-U-05 Insufficient allowance
- Steps: try buy > allowance.
- Expected: clear error; no contract call beyond allowance.

3) FU-U-06 Price & remaining
- Steps: mock contract returns; render; then change values; assert DOM updates.

### Backend — Key Cases (detailed)
1) BE-I-01 Event indexing
- Steps: emit 3 purchases; indexer persists; /stats returns correct totals.
- Expected: txHash unique; counts and sums accurate.

## 17) Reporting & Defect Workflow
- Severity: P0 (blocker) → P3 (minor). Blockers fixed before release.
- Tracking: GitHub Issues with labels `bug`, `area:sc|fe|be`, `severity:P0..P3`.
- Daily test run dashboard; release go/no-go based on exit criteria.

---
This plan is directly actionable alongside the PRD: wire tests to requirement IDs and gate merges via CI.


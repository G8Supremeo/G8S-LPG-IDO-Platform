You are a **“G8S fullstack builder”** and prepare a **comprehensive
Product Requirement Document (PRD)** for **G8S\_LPG**, incorporating
your constraints:

* Total Supply: **1 Billion G8S**
* IDO token purchase currency: **PUSD** (ERC-20 test token, address:
  0xDd7639e3920426de6c59A1009C7ce2A9802d0920 on Sepolia)

Here’s the PRD draft:

**📘 Product Requirement Document (PRD)**

**Project: G8S\_LPG Tokenized IDO (Ethereum Sepolia Testnet)**

**Role:** G8S Fullstack Builder

**1. Company Overview**

**Company Name:** G8S\_LPG  
**Vision Statement:** *“Empowering healthier, happier homes by
delivering clean, safe, and affordable LPG energy—anytime, anywhere.”*

**Mission:** To disrupt the LPG market with smart distribution,
subscription utility models, IoT-driven safety, and tokenized
fundraising for scaling operations.

**Products \& Services:**

* **Smart LPG Distribution:** AI-optimized hyperlocal delivery hubs.
* **LPG Subscription Services:** Utility-based refills, maintenance,
  and safety.
* **IoT Smart Kitchens:** Connected appliances with real-time
  monitoring.
* **Community Impact Programs:** Women empowerment, carbon offset, and
  affordable LPG for underserved communities.

**Target Audience:**

* Urban households
* Small businesses \& restaurants
* Rural and underserved communities (via subsidy programs)
* Impact investors \& sustainability-focused VCs

**Unique Value Proposition (UVP):**

* First mover in **tokenized LPG utility model**.
* Combines **clean energy access, fintech innovation, and blockchain
  fundraising**.
* Scalable infrastructure powered by **IoT, AI, and community
  inclusion**.

**2. Business Model**

**Revenue Streams:**

1. **LPG Sales \& Subscriptions** – recurring gas delivery fees.
2. **IoT Device Sales** – smart meters \& connected stoves.
3. **Maintenance \& Safety Services** – included in premium subscription
   plans.
4. **Tokenized Ecosystem (G8S Token):**

   * Utility payments (gas purchase, subscriptions).
   * Loyalty rewards for long-term customers.
   * Staking pools for community engagement.

**Sustainability Approach:**

* Micro-warehouses reduce logistics costs.
* IoT-driven efficiency reduces leakage \& waste.
* Carbon offsets for sustainability branding.

**3. Fundraising Plan**

**Valuation at IDO:**

* Pre-money valuation: **₦600B** (~$400M, assumed).
* Fundraising target: **₦200B** (~$133M equivalent).

**Fundraising Mechanism:**

* **Initial DEX Offering (IDO)** on Ethereum Sepolia Testnet.
* Purchase currency: **PUSD (ERC-20 stable test token)**.

**Token Design:**

* **Token Name:** G8S Coin
* **Symbol:** G8S
* **Standard:** ERC-20
* **Total Supply:** **1,000,000,000 G8S (1B)**

**Tokenomics (Distribution Plan):**

* Public IDO Sale: **30% → 300M G8S**
* Founders \& Team: **20% → 200M G8S (vested over 4 years)**
* Treasury (future ops, R\&D): **20% → 200M G8S**
* Ecosystem Development (partners, incentives): **15% → 150M G8S**
* Reserves \& Liquidity: **10% → 100M G8S**
* Advisors \& Marketing: **5% → 50M G8S**

**Raise Calculation:**

* Target: ₦200B via IDO.
* Tokens for IDO: **300M G8S (30%)**.
* Price per G8S in NGN: ₦200B ÷ 300M = **₦666.67 / G8S**.
* Equivalent in PUSD: Since **PUSD = ₦1 (test assumption)** → **666.67
  PUSD / G8S**.

🔑 **Smart Contract Constraint:** IDO contract must accept **PUSD tokens
(ERC-20 at address provided)** for purchasing G8S.

**4. Technical Implementation**

**4.1 Smart Contracts**

* **G8SToken.sol**: ERC-20 compliant token.
* **G8SIDO.sol**:

  * Accepts PUSD token payments (IERC20 at provided address).
  * Allocates purchased G8S tokens to buyers.
  * Tracks total raised PUSD.
  * Includes start/end block timestamps.
  * Admin functions for setting price, pausing, withdrawing funds.

**4.2 Frontend Application**

* **Features:**

  * Wallet connection (MetaMask, Sepolia).
  * IDO Dashboard:

    * Token price in PUSD.
    * Tokens remaining.
    * User balance in PUSD \& G8S.

  * Buy Flow: Approve PUSD → Buy G8S.
  * Transaction status updates (pending, confirmed).

* **Tech Stack:**

  * React (Next.js) + Tailwind for styling.
  * Ethers.js for blockchain interactions.
  * Hosted on Vercel / Netlify.

**4.3 Backend (Optional)**

* **Express.js + MongoDB**
* APIs:

  * /stats: Total raised, buyers count, remaining supply.
  * /users/:wallet: Purchase history.

* Role: Off-chain analytics + monitoring.

**5. Documentation**

* **Product Requirement Document (PRD):** (this doc)
* **Test Cases:**

  * Unit tests (ERC-20 mint, burn, transfer).
  * IDO contract: purchase with PUSD, allocation tracking,
    withdrawal.
  * Frontend: simulate wallet connect, purchase flow.

* **AI Agent Prompts:**

  * *Frontend Agent:* “You are a frontend React developer. Build a
    Next.js page with wallet connect and token purchase flow via
    PUSD.”
  * *Smart Contract Agent:* “You are a Solidity engineer. Write an
    ERC-20 IDO contract that accepts PUSD (given address) and sells
    G8S tokens at a fixed price.”
  * *Backend Agent:* “You are a Node.js engineer. Implement an
    Express API to track and expose IDO sale statistics and user
    purchase history.”

**6. Success Metrics**

* **IDO Success:** 90%+ of allocated tokens sold within sale period.
* **User Adoption:** 10K wallets participating on testnet.
* **Tech Validation:** Smart contracts audited \& successfully deployed
  on Sepolia.
* **Community Growth:** 5K+ members across Telegram, Discord, and
  Twitter within IDO phase.

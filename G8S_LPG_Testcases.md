**SMART CONTRACTS — Unit Tests (G8SToken + G8SIDO\_PUSD)**

**SC-U-01 — ERC20 basic behavior (G8SToken)**

-   Preconditions: Deploy G8SToken to local chain; owner = deployer.

-   Steps: assert totalSupply(), balanceOf(owner) == totalSupply,
    transfer X tokens to addrA, addrA transfers Y back.

-   Expected: balances update properly; Transfer events emitted;
    decimals == 18.

**SC-U-02 — Ownership & access (G8SToken)**

-   Preconditions: Deployer is owner.

-   Steps: non-owner tries to call transfer Ownership or any owner-only
    op (if present).

-   Expected: revert for non-owner; owner can transfer ownership.

**SC-U-03 — IDO constructor validations**

-   Preconditions: Try deploying G8SIDO\_PUSD with invalid params.

-   Steps:

    -   Deploy with token address = zero.

    -   Deploy with pusd address = zero.

    -   Deploy with endTime &lt;= startTime.

    -   Deploy with pricePUSD == 0 or tokensForSale == 0.

-   Expected: each deployment should revert with the appropriate require
    message.

**SC-U-04 — Price and time params getters**

-   Preconditions: Deploy IDO with specific values.

-   Steps: read pricePUSD, startTime, endTime, tokensForSale.

-   Expected: values match constructor inputs.

**SC-U-05 — buyWithPUSD happy path (single buyer)**

-   Preconditions:

    -   Deploy mock PUSD (ERC20), mint PUSD to buyer.

    -   Deploy G8S token with supply minted to deployer.

    -   Deploy IDO with tokensForSale (e.g., 1000 G8S \* 1e18) and
        pricePUSD (e.g., 1 PUSD per G8S == 1e18).

    -   Transfer tokensForSale from deployer to IDO contract.

    -   Buyer approves pusd allowance &gt;= pusdAmount.

    -   Current time within \[startTime, endTime\].

-   Steps: buyer calls buyWithPUSD(pusdAmount).

-   Expected:

    -   PUSD debited from buyer; PUSD balance of contract increases by
        pusdAmount.

    -   G8S tokens transferred to buyer: tokensOut = pusdAmount \* 1e18
        / pricePUSD.

    -   tokensSold increased by tokensOut; contributions\[buyer\]
        incremented by pusdAmount.

    -   Purchased event emitted with correct values.

**SC-U-06 — buyTokens (buy by tokensDesired) happy path**

-   Preconditions: same as SC-U-05.

-   Steps: buyer calls buyTokens(tokensDesired).

-   Expected: pusdRequired computed and transferred; tokens delivered;
    events emitted.

**SC-U-07 — Approval missing / insufficient allowance**

-   Preconditions: buyer has PUSD but did not approve or approved less
    than required.

-   Steps: buyer calls buyWithPUSD or buyTokens without sufficient
    allowance.

-   Expected: transferFrom reverts (contract reverts); no tokens
    transferred; no state changes.

**SC-U-08 — Insufficient PUSD balance**

-   Preconditions: buyer approval adequate but buyer PUSD balance &lt;
    required amount.

-   Steps: call buy.

-   Expected: transaction revert from PUSD transferFrom; no state
    mutated.

**SC-U-09 — Sale inactive (before start / after end)**

-   Preconditions: times outside sale window.

-   Steps: call buyWithPUSD / buyTokens.

-   Expected: revert with "sale not active".

**SC-U-10 — Pause / Unpause behavior**

-   Preconditions: sale active; owner calls pause().

-   Steps:

    -   Owner pauses, buyer attempts buy.

    -   Owner unpauses, buyer buys successfully.

-   Expected: buys revert while paused; succeed after unpause.

**SC-U-11 — Caps (tokensForSale limit)**

-   Preconditions: tokensForSale small (e.g., 10 G8S).

-   Steps:

    -   Buyer purchases less than remaining — success.

    -   Buyer attempts purchase that would exceed tokensForSale —
        revert.

    -   Buyer purchases exact remaining — success, tokensSold ==
        tokensForSale.

-   Expected: enforce tokensSold + tokensOut &lt;= tokensForSale.

**SC-U-12 — Integer division rounding behavior**

-   Preconditions: set pricePUSD = 3e18 (3 PUSD per G8S). Buyer has 10
    PUSD (=10e18).

-   Steps: buyer calls buyWithPUSD(10e18).

-   Expected: tokensOut = floor(10e18 \* 1e18 / 3e18) = floor(10/3 \*
    1e18) = 3 \* 1e18. Verify truncation and no rounding up. PUSD
    remainder (if any) remains with buyer.

**SC-U-13 — buyWithPUSD and reentrancy guard**

-   Preconditions: deploy a **malicious PUSD** token where transferFrom
    attempts to reenter buyWithPUSD.

-   Steps: malicious PUSD's transferFrom calls back into
    IDO.buyWithPUSD.

-   Expected: Reentrancy prevented (call reverts or guarded) and no
    double-spend; tokensSold unchanged after failed attempt.

**SC-U-14 — withdrawPUSD by owner**

-   Preconditions: Several buys performed; IDO contract holds PUSD.

-   Steps: non-owner attempts withdraw -&gt; revert. Owner calls
    withdrawPUSD(to).

-   Expected: PUSD transferred out to to; IDO PUSD balance zero; event
    (if implemented) or successful transfer.

**SC-U-15 — sweepUnsold after endTime**

-   Preconditions: endTime passed; unsold tokens remain in sale
    allocation.

-   Steps: owner calls sweepUnsold(to).

-   Expected: IDO transfers tokensForSale - tokensSold to to. After
    this, IDO should hold zero unsold allocation.

**SC-U-16 — OnlyOwner access control checks**

-   Preconditions: non-owner and owner present.

-   Steps: non-owner attempts owner-only calls (setPrice, pauseSale,
    resumeSale, withdrawPUSD, sweepUnsold).

-   Expected: non-owner calls revert; owner calls succeed.

**SC-U-17 — Event correctness**

-   Preconditions: successful buys.

-   Steps: purchase and capture logs.

-   Expected: Purchased events contain buyer, pusdAmount, tokensOut
    -&gt; match on-chain state.

**SC-U-18 — Corner case: tiny (dust) pusdAmount**

-   Preconditions: pusdAmount small enough that tokensOut == 0 (due to
    truncation).

-   Steps: buyer calls buyWithPUSD(tiny amount).

-   Expected: revert with "dust" (or tokensOut==0 check). Confirm no
    PUSD taken.

**SC-U-19 — Overflows / big numbers test**

-   Preconditions: extreme values near uint256 ceiling (simulate by
    using large numbers but within realistic limits).

-   Steps: attempt to set massive tokensForSale or price.

-   Expected: Solidity 0.8 safety will prevent under/overflow; tests
    should assert arithmetic correctness.

**SMART CONTRACTS — Integration Tests**

**SC-I-01 — End-to-end sale lifecycle**

-   Preconditions: Deploy mock PUSD, deploy G8S, deploy IDO; fund IDO
    with tokensForSale; mint PUSD to 3 buyers with varied balances.

-   Steps:

    1.  Buyer A approves & buys; check balances & tokensSold.

    2.  Buyer B approves & buys simultaneously (separate txs).

    3.  Owner calls withdrawPUSD and verify treasury receives PUSD.

    4.  Fast-forward time to after endTime; owner calls sweepUnsold.

-   Expected: tokens sold tracked, PUSD withdrawn, unsold tokens swept.

**SC-I-02 — Multiple buyers race condition**

-   Preconditions: tokensForSale low; several buyers attempt to buy
    concurrently.

-   Steps: send multiple buy transactions in quick succession (simulate
    mempool race).

-   Expected: only up to tokensForSale are sold; later txs revert or
    partially fail; no double-counting.

**SC-I-03 — Integration with real PUSD (if on Sepolia)**

-   Preconditions: use deployed test PUSD address (given).

-   Steps: buyer uses external PUSD tokens on Sepolia, approves IDO,
    buys tokens.

-   Expected: same behavior as local mocks; appropriate on-chain states
    updated.

**SC-I-04 — Price update and subsequent buys**

-   Preconditions: sale active; owner sets a new pricePUSD mid-sale.

-   Steps: owner updates price; buyer buys using new price.

-   Expected: tokensOut computed using current price; tokensSold
    increments correctly.

**FRONTEND — Unit Tests (components)**

Frameworks: Jest + React Testing Library.

**FU-U-01 — Wallet connect component**

-   Preconditions: mock window.ethereum provider.

-   Steps: render ConnectWallet, simulate user clicking Connect,
    provider returns accounts.

-   Expected: component displays connected address; calls
    eth\_requestAccounts; emits onConnect callback.

**FU-U-02 — Balance fetch & display**

-   Preconditions: mock provider + contract stubs returning balances for
    PUSD & G8S.

-   Steps: mount component, trigger balance fetch.

-   Expected: displayed balances reflect contract calls; loading and
    error states handled.

**FU-U-03 — BuyPanel approve flow (unit level)**

-   Preconditions: buyer not approved.

-   Steps:

    1.  Input PUSD amount.

    2.  Click Approve → simulate approval tx pending → confirm.

    3.  UI shows Approved state and shows allowance.

-   Expected: approve contract call invoked with correct allowance; UI
    transitions through pending → confirmed.

**FU-U-04 — BuyPanel buy flow (happy path)**

-   Preconditions: buyer has approved and has enough PUSD balance.

-   Steps: user clicks Buy; frontend calls buy With PUSD with
    pusdAmount; simulate tx mined.

-   Expected: UI shows pending → confirmed and displays tx hash; call to
    read updated tokensSold and user G8S balance occurs.

**FU-U-05 — BuyPanel insufficient allowance / balance handling**

-   Preconditions: either allowance &lt; required or balance &lt;
    required.

-   Steps: attempt buy.

-   Expected: UI shows a clear error and prevents buy; no further
    contract call.

**FU-U-06 — Token price & remaining tokens display**

-   Preconditions: IDO contract mocked to return price &
    tokensForSale/tokensSold.

-   Steps: render dashboard.

-   Expected: price and remaining tokens compute correctly and update
    when contract values change.

**FU-U-07 — Error handling and retry UX**

-   Preconditions: contract call fails with revert (e.g., "sold out" or
    "sale not active").

-   Steps: simulate revert response.

-   Expected: frontend surfaces revert message to user; offers retry/OK;
    does not assume success.

**FRONTEND — Integration / E2E Tests**

Use Cypress or Playwright.

**FU-I-01 — Full wallet-driven purchase flow (single user)**

-   Preconditions:

    -   Local Hardhat network or Sepolia fork running with deployed
        contracts.

    -   Test wallet loaded in browser extension with PUSD minted.

-   Steps:

    1.  Visit frontend.

    2.  Connect wallet.

    3.  Approve PUSD.

    4.  Execute buy for an amount.

    5.  Wait for confirmation.

-   Expected:

    -   Chain transactions executed successfully.

    -   UI updates: user G8S balance increased; tokens Sold and
        remaining tokens update; backend /stats (if integrated) updates.

**FU-I-02 — Multiple wallets buy and UI consistency**

-   Preconditions: multiple test wallets pre-funded.

-   Steps: run parallel tests for multiple wallets buying, observe
    dashboard aggregation.

-   Expected: aggregated totals consistent with on-chain state.

**FU-I-03 — Frontend resilience when provider disconnects**

-   Preconditions: provider disconnects mid-flow.

-   Steps: simulate provider disconnect during pending tx.

-   Expected: UI displays disconnected state, offers reconnect; pending
    tx state reconciled after reconnect.

**BACKEND — Unit Tests**

Frameworks: Jest + Supertest (HTTP), sqlite in-memory or a test DB.

**BE-U-01 — Health endpoint**

-   Preconditions: server running.

-   Steps: call /healthz.

-   Expected: 200 OK and basic status JSON.

**BE-U-02 — /stats endpoint when no purchases**

-   Preconditions: fresh DB.

-   Steps: call /stats.

-   Expected: { totalRaised: 0, tokensSold: 0, buyersCount: 0 }.

**BE-U-03 — Purchase insertion idempotency**

-   Preconditions: send the same Purchased event twice.

-   Steps: call internal handler or simulate webhook twice with same
    txhash.

-   Expected: DB contains only one record for txhash (unique
    constraint); handler returns success without duplicating.

**BE-U-04 — /purchases/:wallet**

-   Preconditions: insert few purchases with different buyers.

-   Steps: call /purchases/&lt;wallet&gt;.

-   Expected: returns list of purchases for given wallet sorted by
    timestamp.

**BE-U-05 — Error handling on DB failure**

-   Preconditions: simulate DB error (e.g., disk full or locked).

-   Steps: call endpoints; capture responses.

-   Expected: server returns 5xx with graceful error message; does not
    crash.

**BACKEND — Integration Tests**

**BE-I-01 — Event indexing (end-to-end)**

-   Preconditions:

    -   Run local WebSocket provider (Hardhat).

    -   Deploy IDO contract; emit Purchased events via test buys.

-   Steps:

    1.  Start backend indexer connected to provider and contract.

    2.  Emit several Purchased events by calling buy from test accounts.

    3.  Wait for event processing.

-   Expected:

    -   DB rows created with txHash, buyer, pusdAmount, tokensOut,
        timestamp.

    -   /stats reflects aggregated values.

**BE-I-02 — Reconnect recovery**

-   Preconditions: indexer running; network disconnect occurs.

-   Steps: kill provider or simulate temp outage; produce events while
    offline; reconnect indexer.

-   Expected: indexer picks up missed events (by scanning logs from last
    processed block or re-sync) without duplication.

**BE-I-03 — Concurrency & ordering**

-   Preconditions: high event throughput.

-   Steps: emit many events concurrently.

-   Expected: DB maintains integrity; counts and sums consistent; no
    race duplicates.

**CROSS-STACK INTEGRATION (Contracts ↔ Frontend ↔ Backend)**

**CI-01 — Full purchase pipeline verification**

-   Preconditions: local testnet with deployed contracts; backend
    listening; frontend pointing to contracts.

-   Steps:

    1.  User connects in frontend.

    2.  User approves PUSD.

    3.  User submits buy.

    4.  Wait for on-chain confirmation.

    5.  Check frontend balance, tokensSold; check backend /stats and DB
        purchase entry.

-   Expected: on-chain state, frontend, and backend are consistent and
    values match.

**CI-02 — End-to-end failure modes**

-   Preconditions: same as CI-01.

-   Steps:

    -   Simulate buy failing on-chain (e.g., insufficient allowance),
        ensure frontend shows failure and backend not updated.

    -   Simulate event processing lag: buy confirmed but backend
        indexing delayed; after indexer processes, frontend shows
        updated analytics.

-   Expected: consistent error handling; no phantom purchases in
    backend.

**NON-FUNCTIONAL / SECURITY TESTS**

**NF-SEC-01 — Reentrancy attack surface (already covered SC-U-13)**

-   Use malicious PUSD; ensure no reentrancy.

**NF-SEC-02 — Ownership takeover attempts**

-   Test deploying contracts with non-owner and attempt to call owner
    functions.

**NF-SEC-03 — Input sanitization & revert message propagation**

-   Ensure frontend surfaces revert messages from contract and does not
    swallow them.

**NF-PERF-01 — Gas cost regression**

-   Track gas usage for:

    -   buyWithPUSD typical case

    -   buyTokens

    -   withdrawPUSD and sweepUnsold

-   Expected: gas should be within acceptable bounds. Add a regression
    alert if gas &gt; threshold.

**NF-LOAD-01 — Load test for indexer & backend**

-   Simulate N purchases/sec (N determined by environment) and confirm
    indexer and DB can keep up, or that backpressure handling is
    acceptable.

**TEST DATA & HELPERS (recommended utilities)**

-   **Mock PUSD (ERC20Mintable)**: mint to test wallets quickly.

-   **Malicious PUSD**: custom token whose transferFrom attempts to
    reenter IDO to validate ReentrancyGuard.

-   **Helper functions:** mintPUSD(wallet, amount), approvePUSD(wallet,
    contractAddr, amount), fastForward(seconds) or evm\_increaseTime.

-   **Test constants:** use ONE = ethers.parseUnits("1", 18) for
    clarity. Use pricePUSD values:

    -   Simple case: pricePUSD = 1e18 (1 PUSD/G8S).

    -   Rounding test: pricePUSD = 3e18 (3 PUSD/G8S).

    -   Realistic example: pricePUSD = 666670000000000000000 (666.67
        PUSD/G8S) — test large numbers.

**TEST FRAMEWORK & EXECUTION (concise)**

-   **Contracts:** Hardhat + Mocha + Chai (npx hardhat test)

-   **Frontend unit:** Jest + React Testing Library (npm run test)

-   **Frontend E2E:** Cypress or Playwright (npx cypress open / npx
    playwright test)

-   **Backend:** Jest + Supertest for endpoints (npm run test)

-   **CI:** Run contract tests and backend unit tests in CI; run a smoke
    E2E deploy job manually or on scheduled runs.

**PRIORITIZATION (must-run vs nice-to-have)**

1.  **Must-run (critical):** SC-U-05/06/07/11/12/13/14/15, SC-I-01,
    FU-U-04, FU-I-01, BE-U-03, BE-I-01, CI-01.

2.  **High-value:** SC-U-10/16/17/18, FU-U-02/03/05, BE-U-02.

3.  **Nice-to-have:** Concurrency/load tests, gas regression tests,
    extended E2E parallel wallet tests.

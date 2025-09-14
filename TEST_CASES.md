# G8S LPG IDO Platform — Test Cases

## 1. Environment & Health
- TC-ENV-01: Backend health check returns 200
  - Step: GET Railway `/health`
  - Expect: 200, JSON includes services and env
- TC-ENV-02: Startup check passes
  - Step: Review logs for "All required environment variables are set!"
  - Expect: No missing required vars
- TC-ENV-03: CORS allows Vercel domain
  - Step: From Vercel frontend call any public API
  - Expect: No CORS errors

## 2. Auth (Supabase-native)
- TC-AUTH-01: Register
  - Step: POST `/api/auth/register` with email/password/firstName/lastName
  - Expect: 201, token returned, profile row in `users`
- TC-AUTH-02: Login
  - Step: POST `/api/auth/login` with valid credentials
  - Expect: 200, token and user object
- TC-AUTH-03: Me
  - Step: GET `/api/auth/me` with Bearer token
  - Expect: 200, user fields from Supabase profile
- TC-AUTH-04: Invalid login
  - Step: POST `/api/auth/login` with wrong password
  - Expect: 401
- TC-AUTH-05: Missing JWT
  - Step: GET `/api/auth/me` without token
  - Expect: 401

## 3. Admin Access
- TC-ADMIN-01: Non-admin blocked
  - Step: User role `user` → GET `/api/admin/...`
  - Expect: 403
- TC-ADMIN-02: Admin allowed
  - Step: Set `users.role='admin'` → GET `/api/admin/...`
  - Expect: 200

## 4. Wallet & Purchase Flow (Frontend)
- TC-WAL-01: Connect wallet
  - Step: Click Connect; choose MetaMask; on Sepolia
  - Expect: Connected address shown
- TC-WAL-02: Network switch
  - Step: While on wrong network, click Approve
  - Expect: Network switch prompt; then proceed
- TC-WAL-03: Approve PUSD
  - Step: Enter PUSD amount; click Approve
  - Expect: Wallet prompt → tx hash tracked → "Approval confirmed"
- TC-WAL-04: Buy G8S
  - Step: After approval, click Buy G8S
  - Expect: Wallet prompt → tx hash tracked → "Purchase confirmed"
- TC-WAL-05: Insufficient PUSD
  - Step: Enter amount > balance
  - Expect: UI shows "Insufficient PUSD balance", button disabled
- TC-WAL-06: Contract address invalid
  - Step: Temporarily set wrong address (staging)
  - Expect: Console error; UI error banner

## 5. Contract Reads
- TC-CR-01: Price read
  - Step: IDO page loads
  - Expect: Shows `pricePUSD` and sale status
- TC-CR-02: Paused status reflects
  - Step: Pause sale on-chain (staging)
  - Expect: UI shows paused; Buy disabled

## 6. Supabase Data
- TC-DB-01: User row exists
  - Step: After register
  - Expect: Row in `users` with id = auth user id
- TC-DB-02: Role update to admin
  - Step: Set role to `admin`
  - Expect: `/admin` accessible

## 7. Error Handling
- TC-ERR-01: RPC latency
  - Step: Use slow RPC
  - Expect: UI shows "Waiting for confirmation..." states
- TC-ERR-02: Wallet rejection
  - Step: Reject approve/purchase
  - Expect: UI shows error banner

## 8. Deployment
- TC-DEP-01: Vercel envs set
  - Check: WC project id, RPC, contract addresses, API URL
- TC-DEP-02: Railway envs set
  - Check: Supabase URL/keys, JWT, RPC, contracts, USE_MONGO=false

## 9. Security
- TC-SEC-01: JWT tamper
  - Step: Modify token and call `/me`
  - Expect: 401
- TC-SEC-02: CORS deny
  - Step: Call API from non-allowed origin
  - Expect: Blocked

## 10. Accessibility & UX
- TC-UX-01: Buttons disabled when invalid
  - Approve disabled when paused; Buy disabled until approval present
- TC-UX-02: Focus states, keyboard navigation
  - Expect: Basic accessibility works

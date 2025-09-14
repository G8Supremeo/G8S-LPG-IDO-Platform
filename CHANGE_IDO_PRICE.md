# Change IDO Token Price — Detailed Guide

This guide shows how to update the on-chain IDO price to meet your target raise without redeploying contracts.

Goal: Raise ₦700,000,000,000 by selling 300,000,000 G8S in the IDO.

- Required price per token (NGN): 700,000,000,000 ÷ 300,000,000 = ₦2,333.333333…
- With FX = ₦1,500 per $1: priceUSD = 2,333.333333… ÷ 1,500 = 1.5555555555555556 USD
- On-chain pricePUSD (18 decimals): 1.5555555555555556 × 1e18 = 1555555555555555600

You will call setPricePUSD(1555555555555555600) as the IDO owner.

---

## 0) Prerequisites
- IDO owner wallet (the account that deployed or now owns the IDO contract)
- IDO contract address on Sepolia
  - Backend env: `IDO_ADDRESS`
  - Frontend env: `NEXT_PUBLIC_IDO_ADDRESS`
- Network: Sepolia (the same network where your IDO is deployed)
- RPC: A reliable Sepolia RPC (Alchemy/Infura/QuickNode)

---

## 1) Method A — Etherscan (No code)
1. Go to Sepolia Etherscan and open your IDO contract page.
2. Click “Contract” → “Write Contract”.
3. Connect your owner wallet (MetaMask).
4. Find the function: `setPricePUSD(uint256 newPrice)`.
5. In the input box for `newPrice`, paste:
   - `1555555555555555600`
6. Click “Write” and confirm in your wallet.
7. Wait for 1 confirmation.

Verification:
- On the same contract page, go to “Read Contract” → `pricePUSD()` and verify it returns `1555555555555555600`.

---

## 2) Method B — Hardhat Console (Few lines)
Requirements:
- Your local Hardhat environment configured for Sepolia (`sepolia` network in `hardhat.config.js`).
- Your owner wallet’s private key set in env or config.

Steps:
```bash
npx hardhat console --network sepolia
```
```js
const idoAddr = process.env.IDO_ADDRESS || "<YOUR_IDO_ADDRESS>";
const abi = ["function setPricePUSD(uint256 newPrice) external"];
const { ethers } = require("ethers");

// Hardhat injects signer
const signer = await ethers.getSigner();
const ido = new ethers.Contract(idoAddr, abi, signer);
const tx = await ido.setPricePUSD("1555555555555555600");
await tx.wait();
console.log("Price updated.");
```

---

## 3) Method C — Minimal Node Script (Ethers v6)
Create `set-price.js` and run with Node 20+.

```js
import 'dotenv/config';
import { ethers } from 'ethers';

const IDO_ADDRESS = process.env.IDO_ADDRESS; // set in your .env
const RPC = process.env.SEPOLIA_RPC_URL;     // e.g. https://...
const PK = process.env.PRIVATE_KEY;          // owner wallet private key

const ABI = ["function setPricePUSD(uint256 newPrice) external"];

async function main() {
  if (!IDO_ADDRESS || !RPC || !PK) throw new Error('Missing IDO_ADDRESS / RPC / PRIVATE_KEY');
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet = new ethers.Wallet(PK, provider);
  const ido = new ethers.Contract(IDO_ADDRESS, ABI, wallet);
  const newPrice = 1555555555555555600n;
  const tx = await ido.setPricePUSD(newPrice);
  console.log('Sent:', tx.hash);
  await tx.wait();
  console.log('Confirmed');
}

main().catch(err => { console.error(err); process.exit(1); });
```
Run:
```bash
node set-price.js
```

---

## 4) Double‑Check the Math (If FX changes)
If FX (NGN per USD) ≠ 1,500, recompute:

- priceUSD = targetNGN ÷ (tokensForSale × FX)
- pricePUSD_wei = floor(priceUSD × 1e18)

Example: targetNGN = 700,000,000,000; tokensForSale = 300,000,000; FX = 1,500
- priceUSD = 700e9 ÷ (300e6 × 1500) = 1.5555555555555556
- pricePUSD_wei = 1.5555555555555556 × 1e18 ≈ 1555555555555555600

---

## 5) Keep Dashboards Consistent (Optional)
- Supabase `ido_settings.price_per_token`: set to `1.5555555555555556` so analytics reflect the same value the contract uses.
- Frontend reads on‑chain price directly; no code change required.

---

## 6) Validate End‑to‑End
- Read `pricePUSD()` on Etherscan → expect `1555555555555555600`.
- Open your frontend IDO page and confirm the displayed per‑token price matches.
- Try a small Approve + Buy to ensure math flows and no cap errors.

---

## 7) Troubleshooting
- “Only owner can set price” → Ensure the connected wallet is the IDO owner.
- “Invalid RPC / no prompt” → Switch to Sepolia, use a fast RPC, and retry.
- “Frontend shows old price” → Hard refresh; the UI reads from chain.
- “Analytics mismatch” → Update Supabase `ido_settings.price_per_token` to match on-chain.

---

## 8) Notes on Valuation & Raise
- With priceUSD ≈ 1.5555555556 and 300M tokens for sale:
  - Raise ≈ 466,666,666.67 PUSD
  - At ₦1,500/$ → ≈ ₦700,000,000,000
- FDV at this price: 1B × $1.5556 ≈ $1.5556B (≈ ₦2.3333T)

This change requires no new contract deployment; it’s a single owner transaction to update `pricePUSD`.

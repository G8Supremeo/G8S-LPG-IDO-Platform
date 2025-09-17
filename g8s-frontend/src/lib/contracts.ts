import type { Abi } from "viem";
import g8sToken from "@/lib/abi/g8sToken.json";
import g8sIdo from "@/lib/abi/g8sIdo.json";

export const CONTRACTS = {
  G8S_TOKEN_ADDRESS: process.env.NEXT_PUBLIC_G8S_TOKEN_ADDRESS || "0xCe28Eb32bbd8c66749b227A860beFcC12e612295",
  IDO_ADDRESS: process.env.NEXT_PUBLIC_IDO_ADDRESS || "0x182a1b31e2C57B44D6700eEBBD6733511b559782",
  PUSD_ADDRESS: process.env.NEXT_PUBLIC_PUSD_ADDRESS || "0xe1976f47c72409aE1De3572403E4D3E8EF447289", // Updated to match deployed contract
} as const;

// Standard ERC20 ABI for PUSD token
const erc20Abi = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ABI: { G8S: Abi; ERC20: Abi; IDO: Abi } = {
  G8S: (g8sToken as { abi: Abi }).abi,
  ERC20: erc20Abi,
  IDO: (g8sIdo as { abi: Abi }).abi,
};

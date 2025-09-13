require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

function normalizePrivateKey(pk) {
  if (!pk) return undefined;
  const trimmed = pk.trim().replace(/\s+/g, "");
  const withPrefix = trimmed.startsWith("0x") ? trimmed : `0x${trimmed}`;
  return withPrefix.length === 66 ? withPrefix : undefined; // 0x + 64 hex chars
}

const normalizedPK = normalizePrivateKey(PRIVATE_KEY);

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: SEPOLIA_RPC_URL || "",
      accounts: normalizedPK ? [normalizedPK] : [],
    },
  },
};

const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const ONE = ethers.parseUnits("1", 18);

  const PUSD_ADDRESS = process.env.PUSD_ADDRESS || "0xDd7639e3920426de6c59A1009C7ce2A9802d0920"; // Sepolia test PUSD
  const TOTAL_SUPPLY = ethers.parseUnits("1000000000", 18); // 1B
  const TOKENS_FOR_SALE = ethers.parseUnits("300000000", 18); // 300M
  const PRICE_PUSD = process.env.PRICE_PUSD || ethers.parseUnits("666.67", 18); // 666.67 PUSD per G8S

  const now = Math.floor(Date.now() / 1000);
  const START_TIME = parseInt(process.env.START_TIME || (now + 30)); // start ~now
  const END_TIME = parseInt(process.env.END_TIME || (START_TIME + 90 * 24 * 60 * 60)); // ~3 months

  const signers = await ethers.getSigners();
  if (!signers.length) {
    throw new Error("No signer available. Check contracts/.env -> SEPOLIA_RPC_URL and PRIVATE_KEY (0x + 64 hex chars)");
  }
  const deployer = signers[0];
  console.log("Deployer:", deployer.address);

  const G8S = await ethers.getContractFactory("G8SToken");
  const g8s = await G8S.deploy("G8S Coin", "G8S", TOTAL_SUPPLY, deployer.address);
  await g8s.waitForDeployment();
  console.log("G8S token:", await g8s.getAddress());

  const IDO = await ethers.getContractFactory("G8SIDO");
  const ido = await IDO.deploy(
    await g8s.getAddress(),
    PUSD_ADDRESS,
    PRICE_PUSD,
    TOKENS_FOR_SALE,
    START_TIME,
    END_TIME
  );
  await ido.waitForDeployment();
  console.log("IDO:", await ido.getAddress());

  // Fund IDO with sale allocation
  const tx = await g8s.transfer(await ido.getAddress(), TOKENS_FOR_SALE);
  await tx.wait();
  console.log("Funded IDO with", TOKENS_FOR_SALE.toString(), "G8S");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

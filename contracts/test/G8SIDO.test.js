const { expect } = require("chai");
const { ethers } = require("hardhat");

async function deployMockPUSD() {
  const ERC20 = await ethers.getContractFactory("MockERC20");
  const token = await ERC20.deploy("Mock PUSD", "PUSD", 18);
  await token.waitForDeployment();
  return token;
}

describe("G8SIDO", function () {
  it("constructor validations", async () => {
    const [owner] = await ethers.getSigners();
    const G8S = await ethers.getContractFactory("G8SToken");
    const g8s = await G8S.deploy("G8S", "G8S", ethers.parseUnits("100", 18), owner.address);
    await g8s.waitForDeployment();

    const now = Math.floor(Date.now() / 1000);
    const PUSD = await deployMockPUSD();
    await expect(
      (await ethers.getContractFactory("G8SIDO")).deploy(
        ethers.ZeroAddress,
        await PUSD.getAddress(),
        1,
        1,
        now + 10,
        now + 20
      )
    ).to.be.revertedWith("g8s=0");
  });

  it("buyWithPUSD happy path", async () => {
    const [owner, buyer] = await ethers.getSigners();

    const G8S = await ethers.getContractFactory("G8SToken");
    const total = ethers.parseUnits("1000000000", 18);
    const g8s = await G8S.deploy("G8S", "G8S", total, owner.address);
    await g8s.waitForDeployment();

    const PUSD = await deployMockPUSD();
    const ONE = ethers.parseUnits("1", 18);
    const price = ONE; // 1 PUSD per 1 G8S
    const sale = ethers.parseUnits("1000", 18);
    const now = Math.floor(Date.now() / 1000);

    const IDO = await ethers.getContractFactory("G8SIDO");
    const ido = await IDO.deploy(
      await g8s.getAddress(),
      await PUSD.getAddress(),
      price,
      sale,
      now - 10,
      now + 60
    );
    await ido.waitForDeployment();

    // fund IDO with tokens
    await (await g8s.transfer(await ido.getAddress(), sale)).wait();

    // mint PUSD to buyer and approve
    await (await PUSD.mint(buyer.address, ethers.parseUnits("100", 18))).wait();
    await (await PUSD.connect(buyer).approve(await ido.getAddress(), ethers.parseUnits("100", 18))).wait();

    const pusdAmount = ethers.parseUnits("10", 18);
    await expect(ido.connect(buyer).buyWithPUSD(pusdAmount))
      .to.emit(ido, "Purchased");

    const g8sBal = await g8s.balanceOf(buyer.address);
    expect(g8sBal).to.equal(pusdAmount); // 1:1 at price=1e18

    const sold = await ido.tokensSold();
    expect(sold).to.equal(pusdAmount);
  });
});

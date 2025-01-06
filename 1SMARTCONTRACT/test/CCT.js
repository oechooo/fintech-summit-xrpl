const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CarbonCreditToken", function () {
  it("Should deploy the contract and mint tokens", async function () {
    // Get the ContractFactory
    const CarbonCreditToken = await ethers.getContractFactory("CarbonCreditToken");

    // Get signers (accounts)
    const [owner, addr1] = await ethers.getSigners();

    // Deploy the contract and pass the owner address as the initialOwner
    const token = await CarbonCreditToken.deploy(owner.address);

    // Wait for deployment to be mined
    await token.waitForDeployment();

    // Check contract owner
    const contractOwner = await token.owner();
    expect(contractOwner).to.equal(owner.address);

    // Mint tokens using the owner account
    const mintAmount = ethers.parseUnits("1000", 18); // Mint 1000 tokens
    await token.connect(owner).mint(owner.address, mintAmount);

    // Verify the minted token balance
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(mintAmount);
  });
});

const hre = require("hardhat");

async function main() {
    const CarbonCreditToken = await hre.ethers.getContractFactory("CarbonCreditToken");

    const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    console.log("Deploying CarbonCreditToken...");
    const contract = await CarbonCreditToken.deploy(initialOwner);

    await contract.deployed();

    console.log("CarbonCreditToken deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

    // Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
    // Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load contract ABI
const ABI_PATH = path.resolve(
    __dirname,
    "/Users/atharva/Desktop/1SMARTCONTRACT/artifacts/contracts/CarbonCreditToken.sol/CarbonCreditToken.json"
  );
const abi = JSON.parse(fs.readFileSync(ABI_PATH, "utf8")).abi;

// Load environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

// Connect to Ethereum provider
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

async function mintTokens(address, amount) {
  try {
    const tx = await contract.mint(address, amount);
    await tx.wait();
    console.log(`Minted ${amount} tokens to ${address}`);
  } catch (error) {
    console.error("Error minting tokens:", error);
    throw error;
  }
}

module.exports = { mintTokens };
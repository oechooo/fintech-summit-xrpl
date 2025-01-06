require("dotenv").config();
const { ethers } = require("ethers");
const contractABI = require("./contractABI.json"); // Ensure the path is correct

// Load environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Initialize contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

module.exports = {
    // Example function: Mint tokens
    mintTokens: async (to, amount) => {
        try {
            const tx = await contract.mint(to, amount);
            console.log("Mint transaction sent:", tx.hash);
            await tx.wait();
            console.log("Mint transaction confirmed:", tx.hash);
        } catch (error) {
            console.error("Error minting tokens:", error);
            throw error;
        }
    },

    // Example function: Get token balance
    getTokenBalance: async (address) => {
        try {
            const balance = await contract.balanceOf(address);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error("Error fetching token balance:", error);
            throw error;
        }
    },
};
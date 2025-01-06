require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
    solidity: "0.8.20",
    networks: {
        localhost: {
            url: process.env.SEPOLIA_RPC_URL, // Make sure this is correctly set in your .env file
        },
    },
};
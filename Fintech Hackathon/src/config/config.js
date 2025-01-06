require("dotenv").config();

module.exports = {
    EVM_RPC_URL: process.env.EVM_RPC_URL,
    BRIDGE_PRIVATE_KEY: process.env.BRIDGE_PRIVATE_KEY,
    CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS,
    XRPL_RPC_URL: process.env.XRPL_RPC_URL,
    BRIDGE_XRP_WALLET: process.env.BRIDGE_XRP_WALLET,
};
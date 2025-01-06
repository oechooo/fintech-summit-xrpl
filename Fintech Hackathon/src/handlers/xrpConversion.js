const { fetchExchangeRate } = require("../utils");
const { burnXrplTokens } = require("./xrplInteraction");
const { sendEthToSeller } = require("../services/evmBridge");

// Mock function to retrieve seller's EVM address dynamically from listing
async function getSellerFromListing(listingId) {
    const mockSellerDatabase = {
        "listing123": "0xSellerEvmAddress123",
        "listing456": "0xSellerEvmAddress456",
    };
    return mockSellerDatabase[listingId];
}

// Convert ETH to XRP and process payment
async function handleXrpConversion(amountInEth, buyerAddress, listingId) {
    try {
        // Retrieve seller's EVM address from the listing ID
        const sellerEvmAddress = await getSellerFromListing(listingId);

        // Convert ETH to XRP
        const rate = await fetchExchangeRate("ETH", "XRP");
        const amountInXrp = amountInEth * rate;
        console.log(`Converting ${amountInEth} ETH to ${amountInXrp} XRP`);

        // Burn XRPL tokens
        await burnXrplTokens(amountInXrp);

        // Convert XRP to ETH
        const ethRate = await fetchExchangeRate("XRP", "ETH");
        const amountInEthConverted = amountInXrp * ethRate;

        // Send ETH to the seller's EVM wallet
        await sendEthToSeller(sellerEvmAddress, amountInEthConverted);

        console.log(`Processed payment: Buyer=${buyerAddress}, Seller=${sellerEvmAddress}, ETH Sent=${amountInEthConverted}`);
    } catch (error) {
        console.error(`Failed to process payment: ${error.message}`);
        throw new Error("Conversion or transfer failed");
    }
}

module.exports = { handleXrpConversion };
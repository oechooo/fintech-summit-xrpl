const { convertEthToXrp } = require("./ethToXRPConversion");
const { burnXrplTokens } = require("./xrplInteraction");
const { unlockTokens } = require("../services/evmBridge");

/**
 * Handles ETH payment detection and initiates subsequent actions.
 * @param {string} buyerAddress - The Ethereum address of the buyer.
 * @param {string} sellerAddress - The Ethereum address of the seller.
 * @param {number} ethAmount - The amount of ETH paid by the buyer.
 */
async function detectEthPayment(buyerAddress, sellerAddress, ethAmount) {
    try {
        console.log(`Detecting ETH payment from buyer: ${buyerAddress}, Amount: ${ethAmount} ETH.`);

        // Step 1.5: Convert ETH to XRP using the internal XRP fund
        const xrpAmount = await convertEthToXrp(buyerAddress, ethAmount);
        console.log(`ETH-to-XRP conversion successful. XRP Amount: ${xrpAmount} XRP.`);

        // Step 2: Burn XRP tokens on the XRPL (simulating token consumption)
        await burnXrplTokens(xrpAmount);
        console.log(`Burned ${xrpAmount} XRP on XRPL.`);

        // Step 3: Unlock ERC-20 tokens for the buyer
        const tokensToUnlock = xrpAmount; // Assuming 1 XRP = 1 token (modify if needed)
        await unlockTokens(buyerAddress, tokensToUnlock);
        console.log(`Unlocked ${tokensToUnlock} tokens for buyer: ${buyerAddress}.`);

        // Final Log
        console.log(`ETH payment processing complete for buyer: ${buyerAddress}, seller: ${sellerAddress}.`);
    } catch (error) {
        console.error(`Error during ETH payment detection and processing: ${error.message}`);
        throw new Error("Failed to process ETH payment.");
    }
}

module.exports = { detectEthPayment };


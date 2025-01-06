// Import required modules
const xrplFund = require("../services/xrpFund"); // Manages the XRPL reserve for the bridge.
const { fetchExchangeRate } = require("../utils"); // Fetches the exchange rate between cryptocurrencies.

// Converts ETH to XRP using the bridge's internal XRP reserve.
async function convertEthToXrp(buyerAddress, ethAmount) {
    try {
        // Fetch the current ETH-to-XRP exchange rate.
        const ethToXrpRate = await fetchExchangeRate("ethereum", "xrp");

        // Calculate the equivalent XRP amount based on the ETH amount and exchange rate.
        const xrpAmount = ethAmount * ethToXrpRate;
        console.log(`Converting ${ethAmount} ETH to ${xrpAmount} XRP at rate ${ethToXrpRate} XRP/ETH.`);

        // Deduct the calculated XRP amount from the bridge's reserve.
        const success = await xrplFund.deductXrpFromReserve(xrpAmount);
        if (!success) {
            // Throw an error if the bridge's reserve has insufficient XRP.
            throw new Error("Insufficient XRP in the reserve.");
        }

        // Log the successful conversion and reserve deduction.
        console.log(`Deducted ${xrpAmount} XRP from the fund for buyer: ${buyerAddress}.`);
        return xrpAmount; // Return the deducted XRP amount.
    } catch (error) {
        // Handle any errors that occur during the conversion process.
        console.error(`Error during ETH-to-XRP conversion: ${error.message}`);
        throw error; // Rethrow the error to handle it upstream.
    }
}

// Export the `convertEthToXrp` function for use in other modules.
module.exports = { convertEthToXrp };
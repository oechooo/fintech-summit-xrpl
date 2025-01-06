const { detectEthPayment } = require("../handlers/ethPayment");
const { handleXrpConversion } = require("../handlers/xrpConversion");

// Main payment router function
async function routePayment(buyerAddress, amountInEth) {
    console.log(`Routing payment for ${buyerAddress}`);

    // Step 1: Detect ETH payment
    await detectEthPayment(buyerAddress, amountInEth);

    // Step 2: Convert ETH to XRP and handle XRPL operations
    await handleXrpConversion(amountInEth, buyerAddress);
}

module.exports = { routePayment };
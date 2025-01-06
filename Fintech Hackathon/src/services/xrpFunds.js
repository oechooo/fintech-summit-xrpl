let xrpReserve = 1000000; // Example: Initial reserve of 1,000,000 XRP

/**
 * Deducts XRP from the bridge's reserve.
 * @param {number} xrpAmount - The amount of XRP to deduct.
 * @returns {boolean} - True if the deduction is successful, false otherwise.
 */
async function deductXrpFromReserve(xrpAmount) {
    if (xrpAmount > xrpReserve) {
        console.error(`Insufficient reserve: Attempted to deduct ${xrpAmount} XRP, but only ${xrpReserve} XRP is available.`);
        return false;
    }

    xrpReserve -= xrpAmount;
    console.log(`New XRP Reserve Balance: ${xrpReserve} XRP.`);
    return true;
}

/**
 * Gets the current XRP reserve balance.
 * @returns {number} - The current XRP reserve balance.
 */
function getXrpReserveBalance() {
    return xrpReserve;
}

module.exports = { deductXrpFromReserve, getXrpReserveBalance };
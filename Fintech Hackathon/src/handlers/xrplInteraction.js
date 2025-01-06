const xrpl = require("xrpl");

// Burn XRPL tokens
async function burnXrplTokens(amount) {
    const client = new xrpl.Client(process.env.XRPL_RPC_URL);
    await client.connect();

    const burnTransaction = {
        TransactionType: "Payment",
        Account: process.env.BRIDGE_XRP_WALLET,
        Destination: "rrrrrrrrrrrrrrrrrrrrrhoLvTp", // Black hole burn address
        Amount: xrpl.utils.xrpToDrops(amount.toString()),
    };

    const response = await client.submit(burnTransaction);
    console.log(`Burned ${amount} XRP tokens.`);
    await client.disconnect();
}

module.exports = { burnXrplTokens };
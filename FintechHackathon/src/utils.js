const fetch = require("node-fetch");

/**
 * Fetches the real-time exchange rate from CoinGecko API.
 * @param {string} base - The base currency (e.g., "ethereum").
 * @param {string} quote - The quote currency (e.g., "xrp").
 * @returns {number} - The exchange rate (e.g., XRP per ETH).
 */
async function fetchExchangeRate(base, quote) {
    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${base}&vs_currencies=${quote}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data[base] || !data[base][quote]) {
            throw new Error(`Exchange rate not available for ${base} to ${quote}`);
        }

        return data[base][quote];
    } catch (error) {
        console.error(`Failed to fetch exchange rate: ${error.message}`);
        throw error;
    }
}

module.exports = { fetchExchangeRate };
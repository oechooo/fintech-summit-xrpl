const express = require("express");
const { mintTokens } = require("./services/evmBridge");

const app = express();

app.post("/mint", async (req, res) => {
  const { address, amount } = req.body;
  try {
    await mintTokens(address, amount);
    res.send("Tokens minted successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error minting tokens");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
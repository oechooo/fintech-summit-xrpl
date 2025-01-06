const express = require("express");
const { routePayment } = require("../services/paymentRouter");

const router = express.Router();

// Route: Handle payment from buyer
router.post("/payment", async (req, res) => {
    const { buyerAddress, amountInEth } = req.body;

    try {
        await routePayment(buyerAddress, amountInEth);
        res.status(200).json({ message: "Payment processed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to process payment" });
    }
});

module.exports = router;
const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");
const authMiddleware = require("../middleware/authMiddleware");
const Investment = require("../models/Investment");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { coinName, amount, coinId } = req.body;
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });
    const investment = new Investment({
      userId: req.user.id,
      coinId,
      coinName,
      amount,
      razorpayOrderId: order.id,
      status: "pending",
    });
    await investment.save();
    res.json(order);
  } catch (error) {
    console.log(error,"failed to create order")
    res.status(500).json({ error: "failed to create order" });
  }
});
router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment Verification failed" });
    }
    await Investment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "completed",
        razorpayPaymentId: razorpay_payment_id,
      },
      {
        new: true,
      },
    );

    res.json({ message: "Payment succesfully completed" });
  } catch (error) {
    res.status(400).json({ error: " Verification Failed" });
  }
});

module.exports = router;

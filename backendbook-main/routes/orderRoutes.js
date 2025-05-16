const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/order");
const User = require("../models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order (client sends amount in rupees and list of book IDs)
router.post("/create-razorpay-order", authenticateToken, async (req, res) => {
  try {
    const { amount, books } = req.body;

    if (!amount || !books || books.length === 0) {
      return res.status(400).json({ message: "Amount or books missing" });
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      books,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify payment and save order details
router.post("/verify-payment", authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, books } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !books) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Save orders in DB for each book
    const userId = req.user.id;
    const savedOrders = [];

    for (const bookId of books) {
      const newOrder = new Order({
        user: userId,
        book: bookId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: "Order placed",
      });
      const savedOrder = await newOrder.save();

      // Optionally update user's orders and cart here
      await User.findByIdAndUpdate(userId, {
        $push: { orders: savedOrder._id },
        $pull: { cart: bookId },
      });

      savedOrders.push(savedOrder);
    }

    res.status(200).json({
      message: "Payment verified and order placed successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add your existing order routes here (order history, update status, etc)

module.exports = router;

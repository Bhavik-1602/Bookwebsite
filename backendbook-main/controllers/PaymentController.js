require("dotenv").config();
const { createRazorpayInstance } = require("../config/razorpay");
const crypto = require("crypto");


const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (req, res) => {
  const { courseId, amount } = req.body;

  const options = {
    amount: amount , // Amount in paisa
    currency: "INR",
    receipt: `receipt_order_${courseId}`,
  };

  try {
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Something went wrong",
        });
      }
      return res.status(200).json(order);
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(order_id + "|" + payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature === signature) {
    return res.status(200).json({
      success: true,
      message: "Payment Verified",
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "Payment not Verified",
    });
  }
};

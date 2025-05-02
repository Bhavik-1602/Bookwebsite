  const mongoose = require("mongoose");

  const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User", // Make sure your User model is named "User"
      },
      book: {
        type: mongoose.Types.ObjectId,
        ref: "bookRoutes", // ✅ This should match Book model name exactly
      },
      status: {
        type: String,
        default: "order placed",
        enum: ["order placed", "Out for delivery", "Delivered", "Canceled"], // ✅ Cleaned up enum
      },
    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Order", orderSchema);

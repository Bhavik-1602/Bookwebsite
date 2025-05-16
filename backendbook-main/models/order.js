  const mongoose = require("mongoose");

  const orderSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "user", // Make sure your User model is named "User"
      },
      book: {
        type: mongoose.Types.ObjectId,
        ref: "bookRoutes", // ✅ This should match Book model name exactly
      },
      status: {
  type: String, 
  enum: ['Order placed', 'canceled', 'completed'],
  default: 'Order placed' }, 


    },
    { timestamps: true }
  );

  module.exports = mongoose.model("Order", orderSchema);

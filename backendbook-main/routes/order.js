const router = require("express").Router();
const User = require("../models/user");
const authenticateToken = require("../routes/userAuth");
const Order = require("../models/order");

// ✅ Place an order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id, order } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: "Order list is empty" });
    }

    const orderIds = [];

    // Process each order and create an entry in the Order collection
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const savedOrder = await newOrder.save();

      orderIds.push(savedOrder._id);

      // Add order to user's orders array
      await User.findByIdAndUpdate(id, {
        $push: { orders: savedOrder._id },
      });

      // Remove books from user's cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }

    return res.status(200).json({
      message: "Order(s) placed successfully",
      orderIds: orderIds,
    });
  } catch (error) {
    console.error("Place-order error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch order history for a user
router.get("/order-history/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch orders for the user and populate book details
    const orders = await Order.find({ user: id })
      .populate("book")
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Return orders
    return res.status(200).json({
      message: "Order history fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Get order history error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Fetch all orders for admins
router.get("/all-orders", authenticateToken, async (req, res) => {
  try {
    const { role } = req.user;

    // Only allow admin access
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all orders with user and book details
    const orders = await Order.find()
      .populate("user", "username email") // Populate user name and email
      .populate("book") // Populate book info
      .sort({ createdAt: -1 }); // Recent orders first

    return res.status(200).json({
      message: "All orders fetched successfully",
      orders: orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Admin updates order status
router.put("/update-order", authenticateToken, async (req, res) => {
  try {
    const { id, status } = req.body;

    // Validate status value if needed
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      status: "Success",
      message: "Status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("Update-order error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

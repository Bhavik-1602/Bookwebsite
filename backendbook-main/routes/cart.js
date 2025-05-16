const router = require("express").Router();
const User = require("../models/user"); 
const authenticateToken = require("../routes/userAuth");

/// PUT: add book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.body;

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.status(200).json({ message: "Book is already in cart", cartCount: userData.cartCount });
    }

    userData.cart.push(bookid);
    userData.cartCount = userData.cart.length;
    await userData.save();

    return res.status(200).json({ message: "Book added to cart", cartCount: userData.cartCount });
  } catch (error) {
    console.error("Add-book-to-cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



/// PUT: remove book from cart
router.put("/remove-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.body;

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);
    if (!isBookInCart) {
      return res.status(400).json({ message: "Book is not in the cart", cartCount: userData.cartCount });
    }

    userData.cart = userData.cart.filter(b => b.toString() !== bookid);
    userData.cartCount = userData.cart.length;
    await userData.save();

    return res.status(200).json({ message: "Book removed from cart", cartCount: userData.cartCount });
  } catch (error) {
    console.error("Remove-from-cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


/// GET: get user cart
router.get("/get-cart/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const userData = await User.findById(userId).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optionally reverse cart order if needed:
    const cart = userData.cart.slice().reverse();

    res.status(200).json({ cart, cartCount: userData.cartCount || userData.cart.length });
  } catch (error) {
    console.error("Get-cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

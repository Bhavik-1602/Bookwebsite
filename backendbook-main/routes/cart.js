const router = require("express").Router();
const User = require("../models/user"); 
const authenticateToken = require("../routes/userAuth");


/// put book to cart 
router.put ("/add-to-cart" , authenticateToken, async (req,res) =>{
 try {
    const { bookid, id } = req.body;

    const userData = await User.findById(id); // ✅ Use User instead of UserActivation
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookinCart = userData.cart.includes(bookid); 
    if (isBookinCart) {
      return res.status(200).json({ message: "Book is already in cart" });
    }

    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });

    return res.status(200).json({ message: "Book added to cart" });
  } catch (error) {
    console.error("Add-book-to-favourites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/remove-from-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.body;

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookInCart = userData.cart.includes(bookid);
    if (!isBookInCart) {
      return res.status(400).json({ message: "Book is not in the cart" });
    }

    await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });

    return res.status(200).json({ message: "Book removed from cart" });
  } catch (error) {
    console.error("Remove-from-cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get-cart/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const userData = await User.findById(userId).populate("cart");
    const  cart =userData.cart.reverse();
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ cart: userData.cart});
  } catch (error) {
    console.error("Get-cart error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports =router
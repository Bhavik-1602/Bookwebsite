const router = require("express").Router();
const User = require("../models/user"); 
const authenticateToken = require("../routes/userAuth");

// Add book to favourites
router.put("/add-book-to-favourites", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.body;

    const userData = await User.findById(id); // ✅ Use User instead of UserActivation
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookFavourite = userData.favourites.includes(bookid); 
    if (isBookFavourite) {
      return res.status(200).json({ message: "Book is already in favourites" });
    }

    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });

    return res.status(200).json({ message: "Book added to favourites" });
  } catch (error) {
    console.error("Add-book-to-favourites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove book from favourites
router.put("/remove-book-from-favourites", authenticateToken, async (req, res) => {
  try {
    const { id, bookid } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book is in favourites
    if (!user.favourites.includes(bookid)) {
      return res.status(400).json({ message: "Book not found in favourites" });
    }

    // Remove book from favourites
    await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });

    res.status(200).json({ message: "Book removed from favourites" });
  } catch (error) {
    console.error("Remove-book-from-favourites error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Get favourite books of a user
router.get("/favourite-books/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("favourites");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    console.error("Get favourite-books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;



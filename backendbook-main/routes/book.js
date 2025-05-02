const router = require("express").Router();
const Book = require("../models/book");
const authenticateToken = require("../routes/userAuth");

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id, role } = req.user; // ✅ now directly available
    console.log("Decoded user:", req.user);

    if ( role!== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    }); 

    await book.save();
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    console.error("Add-book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid, url, title, author, price, desc, language } = req.body;

    console.log("Update request for bookid:", bookid);
    console.log("New data:", { url, title, author, price, desc, language });

    const updatedBook = await Book.findByIdAndUpdate(
      bookid,
      { url, title, author, price, desc, language },
      { new: true } // return updated doc
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    
    const { bookid } = req.body;

    // if (role !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admins only." });
    // }

   await Book.findByIdAndDelete(bookid);
      

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/all-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1}); // Fetch all books

    res.status(200).json({
      status:"Success",
      message: "Books fetched successfully",
      books: books,
    });
  } catch (error) {
    console.error("Fetch all books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// get recently added books limit 4
router.get("/all-recent-books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1}).limit(4); // Fetch all books

    res.status(200).json({
      status:"Success",
      message: "Books fetched successfully",
      books: books,
    });
  } catch (error) {
    console.error("Fetch all books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get book id  perticilar 
router.get("/all-book-byid/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const books = await Book.findById(id).sort({ createdAt: -1}); // Fetch all books

    res.status(200).json({
      status:"Success",
      message: "Books fetched successfully",
      books: books,
    });
  } catch (error) {
    console.error("Fetch all books error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;

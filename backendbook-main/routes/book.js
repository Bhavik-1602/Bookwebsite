const router = require("express").Router();
const Book = require("../models/book");
const authenticateToken = require("../routes/userAuth");
 const upload = require('../middlewares/upload'); 

router.post('/add-book', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const imageUrl = `/public/${req.file.filename}`;
    const { title, author, price, desc, language } = req.body;

    const book = new Book({
      url: imageUrl,
      title,
      author,
      price,
      desc,
      language
    });

    await book.save();

    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    console.error("Add-book error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Route: PUT /update-book/:id
router.put("/update-book/:id", authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, price, desc, language } = req.body;

    let url;
    if (req.file) {
      url = `/public/${req.file.filename}`;  // or your upload path pattern
    }

    const updateData = {
      title,
      author,
      price,
      desc,
      language,
    };

    // If image uploaded, update the url
    if (url) {
      updateData.url = url;
    }

    console.log("Update request for bookId:", bookId);
    console.log("Update data:", updateData);

    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });

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

const Book = require("../models/book");
const cloudinary = require('../config/cloudinary');

exports.addBook = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: "Admins only" });

    if (!req.cloudinaryUrl) return res.status(400).json({ message: "Image required" });

    const { title, author, price, desc, language } = req.body;
    const book = new Book({ url: req.cloudinaryUrl, title, author, price, desc, language });
    await book.save();

    res.status(200).json({ message: "Book added", book });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, price, desc, language } = req.body;

    const updateData = { title, author, price, desc, language };

    if (req.cloudinaryUrl) {
      updateData.url = req.cloudinaryUrl;

      const existingBook = await Book.findById(id);
      if (existingBook?.url) {
        const match = existingBook.url.match(/\/book_covers\/([^/]+)/);
        if (match && match[1]) {
          await cloudinary.uploader.destroy(`book_covers/${match[1].split('.')[0]}`);
        }
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({ message: "Book updated", updatedBook });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { bookid } = req.body;

    const book = await Book.findById(bookid);
    if (!book) return res.status(404).json({ message: "Not found" });

    if (book.url) {
      const match = book.url.match(/\/book_covers\/([^/]+)/);
      if (match && match[1]) {
        await cloudinary.uploader.destroy(`book_covers/${match[1].split('.')[0]}`);
      }
    }

    await Book.findByIdAndDelete(bookid);
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "Success", books });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

exports.getRecentBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    res.status(200).json({ status: "Success", books });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent books" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: "Fetch error" });
  }
};

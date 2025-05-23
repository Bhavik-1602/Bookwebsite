const router = require('express').Router();
const authenticateToken = require('./userAuth');
const upload = require('../middlewares/multerSetup');
const { handleFileUpload, uploadToCloudinary } = require('../middlewares/uploadMiddleware');
const bookController = require('../controllers/bookController');

// Add book
router.post('/add-book', authenticateToken, handleFileUpload(upload), uploadToCloudinary, bookController.addBook);

// Update book
router.put('/update-book/:id', authenticateToken, handleFileUpload(upload), uploadToCloudinary, bookController.updateBook);

// Delete book
router.delete('/delete-book', authenticateToken, bookController.deleteBook);

// Get all books
router.get('/all-books', bookController.getAllBooks);

// Get recent books
router.get('/all-recent-books', bookController.getRecentBooks);

// Get book by ID
router.get('/all-book-byid/:id', bookController.getBookById);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getProducts ,updateProduct,deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

// Client ko logged in hona chahiye products dekhne ke liye
router.get('/', protect, getProducts);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);


module.exports = router;
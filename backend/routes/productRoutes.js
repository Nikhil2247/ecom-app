// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Middleware for authentication and authorization
const {
  authenticateUser,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

const upload = require('../middlewares/multer'); 

// Routes for products

// Create a new product (admin only)
router.post(
  '/create',
  authenticateUser,
  // authorizeRoles,
  upload.array('images',10), // Adjust field name and max count as needed
  productController.createProduct
);

// Get all products
router.get('/get-products', productController.getProducts);

// Get a single product by ID
router.get('/:id', productController.getProductById);

// Update a product (admin only)
router.put(
  '/update/:id',
  authenticateUser,
  // authorizeRoles,
  upload.array('images', 10),
  productController.updateProduct
);

// Delete a product (admin only)
router.delete(
  '/delete/:id',
  authenticateUser,
  // authorizeRoles,
  productController.deleteProduct
);

// Route to get similar products
router.get('/similar/:id', productController.getSimilarProducts);

router.get('/category/:category', productController.getbyCategory)

// Search route
router.get('/search/:keyword', productController.searchProducts);

module.exports = router;

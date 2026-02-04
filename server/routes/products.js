const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  createProductReview,
  getProductReviews
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), upload.array('images', 5), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('vendor', 'admin'), upload.array('images', 5), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct);

router.get('/vendor/:id', getVendorProducts);

router.route('/:id/reviews')
  .post(protect, createProductReview)
  .get(getProductReviews);

module.exports = router;

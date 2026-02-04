const express = require('express');
const router = express.Router();
const { createProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// POST /api/produits/ajouter
router.post('/ajouter', protect, authorize('vendor', 'admin'), createProduct);

module.exports = router;

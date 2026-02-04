const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/wishlist')
  .get(getWishlist)
  .post(addToWishlist);

router.delete('/wishlist/:id', removeFromWishlist);

module.exports = router;

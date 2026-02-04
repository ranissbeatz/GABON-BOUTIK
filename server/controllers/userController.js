const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add to wishlist
// @route   POST /api/users/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/users/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

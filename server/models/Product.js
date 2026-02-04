const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // FCFA
  images: [{ type: String }], // Array of URLs
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  variations: [{
    name: String, // e.g., Size, Color
    options: [String] // e.g., S, M, L or Red, Blue
  }],
  
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);

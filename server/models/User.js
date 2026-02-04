const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['client', 'vendor', 'admin'], default: 'client' },
  
  // Vendor specific fields
  storeName: { type: String, unique: true, sparse: true },
  storeDescription: { type: String },
  storeCategory: { type: String },
  storeLogo: { type: String }, // URL
  storeBanner: { type: String }, // URL
  nif: { type: String },
  
  profilePicture: { type: String }, // URL for vendor profile
  phone: { type: String },
  address: {
    city: { type: String },
    quartier: { type: String },
  },
  
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  createdAt: { type: Date, default: Date.now },
});

// Password hash middleware
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// Match password method
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gabonboutik');
    console.log('Connected to MongoDB');

    const userCount = await User.countDocuments();
    console.log(`Users count: ${userCount}`);
    
    if (userCount > 0) {
        const users = await User.find({}, 'name email role');
        console.log('Users:', users);
    }

    const productCount = await Product.countDocuments();
    console.log(`Products count: ${productCount}`);

    if (productCount > 0) {
        const products = await Product.find({}, 'name vendor').populate('vendor', 'name');
        console.log('Products:', products);
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkData();

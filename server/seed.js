const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ganon_boutik');
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Data cleared');

    // Create Vendor
    // Note: Password hashing is handled in UserSchema.pre('save')
    const vendor = new User({
      name: 'Vendeur Test',
      email: 'vendeur@test.com',
      password: 'password123',
      role: 'vendor',
      storeName: 'Boutique de Test',
      storeDescription: 'Une boutique pour tester les fonctionnalités',
      storeCategory: 'Électronique',
      phone: '07000000',
      address: {
        city: 'Libreville',
        quartier: 'Centre-ville'
      },
      whatsapp: '07000000',
      logo: 'https://placehold.co/200x200?text=Logo',
      banniere: 'https://placehold.co/1200x300?text=Banniere'
    });
    await vendor.save();
    console.log('Vendor created: vendeur@test.com / password123');

    // Create Client
    const client = new User({
      name: 'Client Test',
      email: 'client@test.com',
      password: 'password123',
      role: 'client'
    });
    await client.save();
    console.log('Client created: client@test.com / password123');

    // Create Product
    const product = new Product({
      name: 'Smartphone Test',
      description: 'Un smartphone génial pour tester les achats.',
      price: 150000,
      category: 'Électronique',
      stock: 10,
      vendor: vendor._id,
      images: ['https://placehold.co/400x400?text=Smartphone'],
      variations: [
        { name: 'Couleur', options: ['Noir', 'Blanc'] },
        { name: 'Stockage', options: ['64Go', '128Go'] }
      ]
    });
    await product.save();
    console.log('Product created');

    console.log('Seed completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

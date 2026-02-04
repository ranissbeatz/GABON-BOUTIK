const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gabonboutik')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

const users = [
  {
    name: 'Admin User',
    email: 'admin@gabonboutik.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Maman Rose',
    email: 'rose@gabonboutik.com',
    password: 'password123',
    role: 'vendor',
    storeName: 'Saveurs du Haut-Ogooué',
    storeDescription: 'Produits frais de Léconi et Franceville.',
    phone: '074000001',
    address: { city: 'Franceville', quartier: 'Potos' }
  },
  {
    name: 'Jean le Bricoleur',
    email: 'jean@gabonboutik.com',
    password: 'password123',
    role: 'vendor',
    storeName: 'Art Gabon',
    storeDescription: 'Artisanat local et sculpture.',
    phone: '077000002',
    address: { city: 'Libreville', quartier: 'Nzeng-Ayong' }
  },
  {
    name: 'Client Test',
    email: 'client@gmail.com',
    password: 'password123',
    role: 'client'
  }
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.create(users);
    const vendor1 = createdUsers[1]._id;
    const vendor2 = createdUsers[2]._id;

    const products = [
      {
        name: 'Manioc de Léconi (Bâton)',
        description: 'Le meilleur manioc du Gabon, tendre et blanc.',
        price: 500,
        category: 'Alimentation',
        stock: 100,
        vendor: vendor1,
        images: ['https://placehold.co/600x400?text=Manioc']
      },
      {
        name: 'Piment de Cayenne (Sachet)',
        description: 'Piment fort séché.',
        price: 1000,
        category: 'Alimentation',
        stock: 50,
        vendor: vendor1,
        images: ['https://placehold.co/600x400?text=Piment']
      },
      {
        name: 'Masque Punu',
        description: 'Masque traditionnel Punu, bois blanc.',
        price: 45000,
        category: 'Artisanat',
        stock: 5,
        vendor: vendor2,
        images: ['https://placehold.co/600x400?text=Masque']
      },
      {
        name: 'Panier en Osier',
        description: 'Panier tressé à la main, solide.',
        price: 12000,
        category: 'Artisanat',
        stock: 20,
        vendor: vendor2,
        images: ['https://placehold.co/600x400?text=Panier']
      }
    ];

    await Product.create(products);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}


const users = [
  {
    _id: 'user1',
    name: 'Admin User',
    email: 'admin@gabonboutik.com',
    password: 'password123',
    role: 'admin'
  },
  {
    _id: 'vendor1',
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
    _id: 'vendor2',
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
    _id: 'client1',
    name: 'Client Test',
    email: 'client@gmail.com',
    password: 'password123',
    role: 'client'
  }
];

const products = [
  {
    _id: 'prod1',
    name: 'Manioc de Léconi (Bâton)',
    description: 'Le meilleur manioc du Gabon, tendre et blanc.',
    price: 500,
    category: 'Alimentation',
    stock: 100,
    vendor: 'vendor1',
    images: ['https://placehold.co/600x400?text=Manioc'],
    rating: 4.5,
    numReviews: 10
  },
  {
    _id: 'prod2',
    name: 'Piment de Cayenne (Sachet)',
    description: 'Piment fort séché.',
    price: 1000,
    category: 'Alimentation',
    stock: 50,
    vendor: 'vendor1',
    images: ['https://placehold.co/600x400?text=Piment'],
    rating: 5,
    numReviews: 5
  },
  {
    _id: 'prod3',
    name: 'Masque Punu',
    description: 'Masque traditionnel Punu, bois blanc.',
    price: 45000,
    category: 'Artisanat',
    stock: 5,
    vendor: 'vendor2',
    images: ['https://placehold.co/600x400?text=Masque'],
    rating: 4.8,
    numReviews: 2
  },
  {
    _id: 'prod4',
    name: 'Panier en Osier',
    description: 'Panier tressé à la main, solide.',
    price: 12000,
    category: 'Artisanat',
    stock: 20,
    vendor: 'vendor2',
    images: ['https://placehold.co/600x400?text=Panier'],
    rating: 4.2,
    numReviews: 8
  }
];

const orders = [];

module.exports = {
  users,
  products,
  orders
};

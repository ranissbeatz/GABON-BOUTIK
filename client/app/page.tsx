import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import HeroVideo from '@/components/HeroVideo';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  vendor: {
    _id: string;
    name: string;
    storeName: string;
  };
}

async function getProducts(): Promise<Product[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
    
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await res.json();
    const products = Array.isArray(data) ? data : data.products;
    
    // Map API response to match ProductCard props
     return products.map((product: any) => ({
       ...product,
       image: product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300?text=Produit',
       // Ensure vendor object has storeName or name
       vendor: product.vendor ? {
         _id: product.vendor._id,
         name: product.vendor.name,
         storeName: product.vendor.storeName || product.vendor.name
       } : { _id: 'unknown', name: 'Vendeur Inconnu', storeName: 'Boutique' }
     }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array on error to avoid crashing
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Hero Section */}
      <HeroVideo />

      {/* Categories Filter (Simple) */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Catégories Populaires</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {['Alimentation', 'Mode', 'Électronique', 'Maison', 'Artisanat'].map((cat) => (
            <button key={cat} className="bg-white px-6 py-2 rounded-full shadow hover:bg-gabon-green hover:text-white transition whitespace-nowrap border border-gray-200">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Produits Récents</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2026 GabonBoutik. Fait avec amour à Libreville.</p>
        </div>
      </footer>
    </div>
  );
}

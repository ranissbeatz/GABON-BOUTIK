"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';
import Rating from '@/components/Rating';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const categories = ['Alimentation', 'Mode', 'Électronique', 'Maison', 'Artisanat', 'Auto'];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams.toString());
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${apiUrl}/api/products?${params.toString()}`);
      
      const productList = Array.isArray(data) ? data : data.products;
      const meta = Array.isArray(data) ? { page: 1, pages: 1, total: data.length } : { page: data.page, pages: data.pages, total: data.total };

      // Map API response to match ProductCard props if needed
      const mappedProducts = productList.map((product: any) => ({
        ...product,
        image: product.images && product.images.length > 0 ? product.images[0] : (product.image || 'https://placehold.co/400x300?text=Produit'),
        vendor: product.vendor ? {
            _id: product.vendor._id,
            name: product.vendor.name,
            storeName: product.vendor.storeName || product.vendor.name
        } : { _id: 'unknown', name: 'Vendeur Inconnu', storeName: 'Boutique' }
      }));

      setProducts(mappedProducts);
      setPagination(meta);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newParams: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.keys(newParams).forEach(key => {
      if (newParams[key]) {
        params.set(key, newParams[key]);
      } else {
        params.delete(key);
      }
    });

    // Reset page on filter change
    if (!newParams.page) {
        params.set('page', '1');
    }

    router.push(`/search?${params.toString()}`);
  };

  const handleApplyFilters = () => {
    updateFilters({
      category,
      minPrice,
      maxPrice,
      rating,
      sort,
      page: '1' // Reset to page 1
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSort('newest');
    router.push('/search');
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage.toString() });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters - Desktop */}
        <aside className={`md:w-1/4 ${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}`}>
            <div className="flex justify-between items-center mb-6 md:hidden">
                <h2 className="text-xl font-bold">Filtres</h2>
                <button onClick={() => setShowFilters(false)}><X /></button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-4 text-gabon-green flex items-center gap-2">
                    <Filter size={20} /> Filtres
                </h3>
                
                {/* Categories */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Catégories</h4>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="category" 
                                checked={category === ''} 
                                onChange={() => setCategory('')}
                                className="text-gabon-green focus:ring-gabon-green"
                            />
                            <span>Toutes</span>
                        </label>
                        {categories.map(cat => (
                            <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="category" 
                                    checked={category === cat} 
                                    onChange={() => setCategory(cat)}
                                    className="text-gabon-green focus:ring-gabon-green"
                                />
                                <span>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Prix (FCFA)</h4>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Min" 
                            value={minPrice} 
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-1/2 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gabon-green"
                        />
                        <input 
                            type="number" 
                            placeholder="Max" 
                            value={maxPrice} 
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-1/2 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gabon-green"
                        />
                    </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <h4 className="font-semibold mb-2">Note minimum</h4>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map(star => (
                            <label key={star} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="rating" 
                                    checked={rating === star.toString()} 
                                    onChange={() => setRating(star.toString())}
                                    className="text-gabon-green focus:ring-gabon-green"
                                />
                                <Rating value={star} />
                                <span className="text-sm text-gray-500">& plus</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={handleApplyFilters}
                        className="w-full bg-gabon-green text-white py-2 rounded hover:bg-green-700 transition"
                    >
                        Appliquer
                    </button>
                    <button 
                        onClick={handleClearFilters}
                        className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
            {/* Header / Sort / Mobile Filter Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">
                    {keyword ? `Résultats pour "${keyword}"` : 'Tous les produits'}
                    <span className="text-sm font-normal text-gray-500 ml-2">({pagination.total} produits)</span>
                </h1>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        className="md:hidden flex-1 bg-white border border-gray-300 px-4 py-2 rounded flex items-center justify-center gap-2"
                        onClick={() => setShowFilters(true)}
                    >
                        <Filter size={18} /> Filtres
                    </button>
                    
                    <select 
                        value={sort} 
                        onChange={(e) => {
                            setSort(e.target.value);
                            updateFilters({ sort: e.target.value });
                        }}
                        className="flex-1 sm:w-48 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gabon-green bg-white"
                    >
                        <option value="newest">Plus récents</option>
                        <option value="price_asc">Prix croissant</option>
                        <option value="price_desc">Prix décroissant</option>
                        <option value="rating">Mieux notés</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gabon-green"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-sm text-center border border-gray-100">
                    <div className="text-4xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucun résultat trouvé</h2>
                    <p className="text-gray-500 mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
                    <button 
                        onClick={handleClearFilters}
                        className="text-gabon-green font-medium hover:underline"
                    >
                        Effacer tous les filtres
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2">
                            <button 
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronDown className="rotate-90" size={20} />
                            </button>
                            
                            {[...Array(pagination.pages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`w-10 h-10 rounded border flex items-center justify-center ${
                                        pagination.page === i + 1 
                                            ? 'bg-gabon-green text-white border-gabon-green' 
                                            : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button 
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronDown className="-rotate-90" size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center">Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}

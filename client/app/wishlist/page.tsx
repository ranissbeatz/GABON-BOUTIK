"use client";

import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlistItems, loading } = useWishlist();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gabon-green border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-gray-600">Chargement de vos favoris...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <span className="text-red-500">❤️</span> Ma Liste de Souhaits
      </h1>
      
      {wishlistItems.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm text-center border border-gray-100">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Votre liste est vide</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Vous n'avez pas encore ajouté de produits à vos favoris. Explorez notre catalogue pour trouver ce qui vous plaît !</p>
            <Link href="/" className="bg-gabon-green text-white px-8 py-3 rounded-full hover:bg-green-700 transition font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Découvrir nos produits
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

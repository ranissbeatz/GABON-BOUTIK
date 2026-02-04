"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Heart } from 'lucide-react';

interface ProductProps {
  _id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];
  category: string;
  vendor: {
    _id: string;
    name: string;
    storeName?: string;
  };
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product._id);
  const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      <Link href={`/product/${product._id}`}>
        <div className="relative h-48 w-full bg-gray-200">
          <Image
            src={displayImage || "https://placehold.co/400x300?text=Produit"}
            alt={product.name}
            fill
            className="object-cover"
          />
          <button 
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md transition-colors ${
              isWishlisted ? 'bg-white text-red-500' : 'bg-white text-gray-400 hover:text-red-500'
            }`}
            title={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <Link href={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="text-gabon-green font-bold text-lg">{product.price.toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Vendeur: {product.vendor?._id ? (
            <Link href={`/boutique/${product.vendor._id}`} className="text-gabon-blue hover:underline">
              {product.vendor?.storeName || product.vendor?.name || 'Inconnu'}
            </Link>
          ) : (
            <span className="text-gabon-blue">{product.vendor?.storeName || product.vendor?.name || 'Inconnu'}</span>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          className="w-full mt-3 bg-gabon-yellow text-gabon-green font-semibold py-2 rounded hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

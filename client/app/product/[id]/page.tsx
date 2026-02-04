"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { ShoppingCart, CreditCard, MessageCircle } from 'lucide-react';
import Rating from '@/components/Rating';
import ReviewList from '@/components/ReviewList';

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { startConversation } = useChat();

  const fetchProduct = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const { data } = await axios.get(`${apiUrl}/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError('Produit non trouvé');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id, fetchProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Optional: Toast notification
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      router.push('/cart');
    }
  };

  const handleContactVendor = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (product && product.vendor) {
      await startConversation(product.vendor._id);
      router.push('/messages');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-gray-500 hover:underline mb-4 inline-block">&larr; Retour aux produits</Link>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/2 relative h-[400px] md:h-auto bg-gray-200">
             <Image 
                src={product.images?.[0] || product.image || "https://placehold.co/600x600?text=Produit"} 
                alt={product.name}
                fill
                className="object-cover"
             />
          </div>
          
          {/* Details */}
          <div className="p-8 md:w-1/2 flex flex-col justify-between">
            <div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">{product.category}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="text-3xl font-bold text-gabon-green mb-6">{product.price.toLocaleString()} FCFA</div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-100">
                <p className="font-semibold text-gray-800 mb-1">Vendu par :</p>
                <div className="flex justify-between items-center">
                    {product.vendor?._id ? (
                      <Link href={`/boutique/${product.vendor._id}`} className="text-gabon-blue font-bold text-lg hover:underline">
                        {product.vendor?.storeName || product.vendor?.name || 'Inconnu'}
                      </Link>
                    ) : (
                      <p className="text-gabon-blue font-bold text-lg">{product.vendor?.storeName || product.vendor?.name || 'Inconnu'}</p>
                    )}
                    
                    {user?._id !== product.vendor?._id && (
                        <button 
                            onClick={handleContactVendor}
                            className="text-gabon-green hover:text-green-700 flex items-center gap-1 text-sm font-semibold border border-gabon-green px-3 py-1 rounded-full hover:bg-green-50 transition"
                        >
                            <MessageCircle size={16} />
                            Contacter
                        </button>
                    )}
                </div>
                {product.vendor?._id && (
                  <Link href={`/boutique/${product.vendor._id}`} className="text-sm text-gray-500 hover:underline mt-1 inline-block">
                    Voir la boutique
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
               <button 
                onClick={handleAddToCart}
                className="flex-1 bg-gabon-yellow text-gabon-green font-bold py-3 px-6 rounded shadow hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
               >
                 <ShoppingCart size={20} />
                 Ajouter au panier
               </button>
               <button 
                onClick={handleBuyNow}
                className="flex-1 bg-gabon-green text-white font-bold py-3 px-6 rounded shadow hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
               >
                 <CreditCard size={20} />
                 Acheter maintenant
               </button>
            </div>
          </div>
        </div>

        <ReviewList productId={id as string} refreshProduct={fetchProduct} />
      </div>
    </div>
  );
}

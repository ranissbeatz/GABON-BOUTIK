"use client";

import Header from '@/components/Header';
import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQty, removeFromCart, cartTotal } = useCart();
  const total = cartTotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Votre Panier</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow overflow-hidden">
             {cartItems.map((item) => (
               <div key={item._id} className="flex items-center p-4 border-b last:border-b-0">
                  <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                     <Image 
                        src={item.image || "https://placehold.co/100x100?text=Produit"} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                     />
                  </div>
                  <div className="ml-4 flex-1">
                     <h3 className="text-lg font-semibold">{item.name}</h3>
                     <p className="text-sm text-gray-500">Vendeur: {item.vendor}</p>
                     <p className="text-gabon-green font-bold">{item.price.toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center border rounded">
                        <button 
                            onClick={() => updateQty(item._id, item.qty - 1)}
                            className="p-1 hover:bg-gray-100"
                            disabled={item.qty <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="px-3 font-medium">{item.qty}</span>
                        <button 
                            onClick={() => updateQty(item._id, item.qty + 1)}
                            className="p-1 hover:bg-gray-100"
                        >
                            <Plus size={16} />
                        </button>
                     </div>
                     <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        title="Retirer du panier"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>
               </div>
             ))}
             {cartItems.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center">
                    <p className="text-gray-500 mb-4 text-lg">Votre panier est vide.</p>
                    <a href="/" className="text-gabon-green font-semibold hover:underline">Continuer vos achats</a>
                </div>
             )}
          </div>

          {/* Summary & Checkout */}
          <div className="lg:w-1/3">
             <div className="bg-white p-6 rounded-lg shadow sticky top-24">
                <h2 className="text-xl font-bold mb-4">Résumé</h2>
                <div className="flex justify-between mb-2">
                   <span className="text-gray-600">Sous-total</span>
                   <span className="font-medium">{total.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between mb-4">
                   <span className="text-gray-600">Livraison</span>
                   <span className="font-medium text-sm text-gray-500">Calculé à l'étape suivante</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl mb-6">
                   <span>Total</span>
                   <span className="text-gabon-green">{total.toLocaleString()} FCFA</span>
                </div>
                
                <a 
                   href="/checkout" 
                   className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                      cartItems.length === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none' 
                      : 'bg-gabon-green text-white hover:bg-green-700'
                   }`}
                >
                   Passer la commande
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

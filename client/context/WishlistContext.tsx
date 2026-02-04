"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  wishlistItems: any[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setWishlistItems([]);
    }
  }, [user, token]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${apiUrl}/api/users/wishlist`, config);
      
      setWishlistItems(data);
      setWishlist(data.map((item: any) => item._id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
        alert("Veuillez vous connecter pour ajouter aux favoris");
        return;
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${apiUrl}/api/users/wishlist`, { productId }, config);
      await fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${apiUrl}/api/users/wishlist/${productId}`, config);
      
      setWishlist(prev => prev.filter(id => id !== productId));
      setWishlistItems(prev => prev.filter(item => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

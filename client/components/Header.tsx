"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Search, Menu, LogOut, LayoutDashboard, Settings, MessageCircle, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const [keyword, setKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`);
    } else {
      router.push('/search');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-gabon-green text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-[150px] h-[50px]">
              <Image 
                src="/logo-gabonboutik.svg" 
                alt="GabonBoutik" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile initially, shown below or via toggle */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8 relative">
            <input
              type="text"
              placeholder="Rechercher manioc, tissus..."
              className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-gabon-yellow"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gabon-green hover:text-green-700">
              <Search size={20} />
            </button>
          </form>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative hover:text-gabon-yellow transition-colors hidden sm:block" title="Favoris">
              <Heart size={24} />
            </Link>

            <Link href="/cart" className="relative hover:text-gabon-yellow transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gabon-yellow text-gabon-green text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Bonjour, {user.name}</span>
                </div>
                
                {user.role !== 'vendor' && user.role !== 'admin' && (
                  <Link href="/create-shop" className="bg-gabon-yellow text-gabon-green px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-400 transition shadow-sm animate-pulse">
                    🏪 Créer ma boutique
                  </Link>
                )}
                
                {user.role === 'admin' && (
                  <Link href="/admin" className="flex items-center gap-1 hover:text-gabon-yellow" title="Administration">
                    <Settings size={20} />
                    <span className="text-sm">Admin</span>
                  </Link>
                )}

                <Link href="/messages" className="flex items-center gap-1 hover:text-gabon-yellow relative" title="Messages">
                  <MessageCircle size={20} />
                </Link>

                {user.role === 'vendor' && (
                  <Link href="/dashboard" className="flex items-center gap-1 hover:text-gabon-yellow" title="Tableau de bord Vendeur">
                    <LayoutDashboard size={20} />
                    <span className="text-sm">Boutique</span>
                  </Link>
                )}
                
                <button onClick={handleLogout} className="flex items-center gap-1 hover:text-red-200 transition-colors" title="Déconnexion">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block hover:text-gabon-yellow transition-colors">
                <div className="flex items-center gap-2">
                  <User size={24} />
                  <span className="text-sm">Connexion</span>
                </div>
              </Link>
            )}

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-green-600 pt-4">
             <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full py-2 px-4 rounded-full text-gray-800"
                />
             </div>
             
             {user ? (
               <>
                 <div className="py-2 text-gabon-yellow font-bold border-b border-green-600 mb-2">
                   {user.name} ({user.role === 'vendor' ? 'Vendeur' : user.role === 'admin' ? 'Admin' : 'Client'})
                 </div>
                 {user.role === 'admin' && (
                   <Link href="/admin" className="block py-2 hover:text-gabon-yellow">Administration</Link>
                 )}
                 {user.role === 'vendor' && (
                   <Link href="/dashboard" className="block py-2 hover:text-gabon-yellow">Ma Boutique</Link>
                 )}
                 <Link href="/messages" className="block py-2 hover:text-gabon-yellow">Mes Messages</Link>
                 <button onClick={handleLogout} className="block w-full text-left py-2 text-red-200 hover:text-white">Se déconnecter</button>
               </>
             ) : (
               <>
                 <Link href="/login" className="block py-2 hover:text-gabon-yellow">Se connecter</Link>
                 <Link href="/register" className="block py-2 hover:text-gabon-yellow">S'inscrire</Link>
                 <Link href="/register?role=vendor" className="block py-2 hover:text-gabon-yellow font-semibold">Vendre sur GabonBoutik</Link>
               </>
             )}
          </div>
        )}
      </div>
    </header>
  );
}

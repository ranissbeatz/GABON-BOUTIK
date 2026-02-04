"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-2xl font-black text-gabon-green tracking-tighter mb-4">
              GANON<span className="text-gabon-yellow">BOUTIK</span>
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              La première marketplace 100% Gabonaise. Achetez et vendez en toute confiance.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gabon-green transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gabon-green transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gabon-green transition-colors">
                <Twitter size={18} />
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gabon-green transition-colors">
                <Linkedin size={18} />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gabon-yellow">Liens Rapides</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Produits</Link></li>
              <li><Link href="/shops" className="hover:text-white transition-colors">Boutiques</Link></li>
              <li><Link href="/create-shop" className="hover:text-white transition-colors">Vendre sur GanonBoutik</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gabon-yellow">Service Client</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-white transition-colors">Mon Compte</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Mon Panier</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Suivre ma commande</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Aide & FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gabon-yellow">Contactez-nous</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gabon-blue" />
                <span>Libreville, Gabon</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gabon-blue" />
                <span>+241 74 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gabon-blue" />
                <span>contact@ganonboutik.ga</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} GanonBoutik. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

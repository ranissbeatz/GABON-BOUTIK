import Header from '@/components/Header';
import Link from 'next/link';
import { Check, Star, Zap, Crown, Percent, Smartphone, CreditCard } from 'lucide-react';

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gabon-yellow to-orange-500 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/pattern-wax-gabon.png')] opacity-10"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold mb-6 border border-white/30 animate-pulse text-black">
              🚀 Offre la plus populaire
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-black drop-shadow-sm">
              Passez au niveau supérieur<br />
              <span className="text-white drop-shadow-md text-stroke-sm">Abonnement Premium Annuel</span>
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 opacity-90 text-black">
              La solution ultime pour les vendeurs sérieux. Économisez 30% et débloquez tous les avantages exclusifs.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="container mx-auto px-4 -mt-16 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row border-4 border-gabon-yellow">
            {/* Left Side: Features */}
            <div className="p-8 md:p-12 md:w-2/3">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Crown className="text-gabon-yellow" /> Tout l'abonnement mensuel + :
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: Star, text: 'Mise en avant de votre boutique sur la page d\'accueil', color: 'text-gabon-yellow' },
                  { icon: Percent, text: '0% de commission pendant les 3 premiers mois', color: 'text-gabon-green' },
                  { icon: Crown, text: 'Logo "Premium Vendor" doré sur votre profil', color: 'text-yellow-600' },
                  { icon: Zap, text: 'Produits illimités en ligne', color: 'text-purple-600' },
                  { icon: Check, text: 'Accès anticipé aux nouvelles fonctionnalités', color: 'text-gray-600' },
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`mt-1 ${feature.color}`}>
                      <feature.icon size={20} />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </li>
                ))}
              </ul>

              {/* Testimonial */}
              <div className="mt-10 bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                     <img src="https://placehold.co/100x100?text=J" alt="Jean" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Jean K.</div>
                    <div className="text-sm text-gray-500">Grossiste "Tout pour la Maison"</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "L'offre annuelle est un investissement rentabilisé en 2 semaines grâce aux 0% de commission. Je ne peux que recommander !"
                </p>
              </div>
            </div>

            {/* Right Side: Pricing & CTA */}
            <div className="bg-gray-900 text-white p-8 md:p-12 md:w-1/3 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute -right-12 top-6 bg-red-600 text-white text-xs font-bold py-1 px-12 transform rotate-45 shadow-lg">
                -30% ÉCONOMIE
              </div>
              
              <div className="relative z-10">
                <div className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Prix Annuel</div>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                   <span className="text-gray-500 line-through text-lg">60 000</span>
                   <span className="text-5xl font-black text-gabon-yellow">45 000<span className="text-2xl">FCFA</span></span>
                </div>
                <div className="text-gray-300 text-sm mb-8">Payé en une fois pour 12 mois.</div>

                <button className="w-full bg-gradient-to-r from-gabon-yellow to-orange-500 text-white font-black py-4 px-6 rounded-xl shadow-lg hover:from-yellow-400 hover:to-orange-600 transition transform hover:scale-105 mb-4 flex items-center justify-center gap-2">
                  <CreditCard size={20} />
                  Devenir Premium
                </button>
                
                <div className="text-xs text-gray-400 flex flex-col gap-2">
                  <span className="flex items-center justify-center gap-1">
                    <Smartphone size={14} /> Mobile Money & Carte acceptés
                  </span>
                  <span className="text-gabon-green font-bold">
                    Satisfait ou remboursé (14j)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <section className="container mx-auto px-4 mt-12 text-center text-gray-500 text-sm">
          Besoin d'aide ? Contactez notre support commercial dédié au <a href="#" className="text-gabon-green font-bold hover:underline">+241 77 00 00 00</a>
        </section>
      </main>
    </div>
  );
}

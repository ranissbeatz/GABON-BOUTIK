import Header from '@/components/Header';
import Link from 'next/link';
import { Rocket, Megaphone, Search, Bell, TrendingUp, CreditCard, Smartphone } from 'lucide-react';

export default function PromotionPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gabon-green to-lime-600 text-white py-20 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-wax-gabon.png')] opacity-10 mix-blend-overlay"></div>
           
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block bg-gabon-yellow text-gabon-green px-4 py-1 rounded-full text-sm font-black mb-6 border border-white/30 shadow-lg animate-bounce">
              🔥 Visibilité Maximale
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Faites exploser vos ventes avec<br />
              <span className="text-gabon-yellow drop-shadow-md">le Pack Spotlight</span>
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 opacity-90">
              Mettez vos produits sous le feu des projecteurs et touchez des milliers d'acheteurs instantanément.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="container mx-auto px-4 -mt-16 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row border-t-8 border-gabon-yellow">
            {/* Left Side: Features */}
            <div className="p-8 md:p-12 md:w-2/3">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Rocket className="text-gabon-green" /> Boostez votre visibilité :
              </h2>
              <ul className="space-y-6">
                {[
                  { 
                    icon: Megaphone, 
                    title: 'Bannière d\'accueil pendant 7 jours', 
                    desc: 'Soyez la première chose que voient nos 50 000 visiteurs mensuels.',
                    color: 'text-gabon-green' 
                  },
                  { 
                    icon: Search, 
                    title: 'Top des résultats de recherche', 
                    desc: 'Apparaissez en premier sur les mots-clés liés à vos produits.',
                    color: 'text-yellow-600' 
                  },
                  { 
                    icon: Bell, 
                    title: 'Notification Push ciblée', 
                    desc: 'Nous envoyons une alerte "Bon Plan" à nos utilisateurs mobiles pour vos produits.',
                    color: 'text-gabon-green' 
                  },
                  { 
                    icon: TrendingUp, 
                    title: 'Stats de campagne détaillées', 
                    desc: 'Suivez le nombre de clics et de vues en temps réel.',
                    color: 'text-yellow-600' 
                  },
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className={`mt-1 p-2 bg-yellow-50 rounded-lg ${feature.color}`}>
                      <feature.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Testimonial */}
              <div className="mt-10 bg-green-50 p-6 rounded-2xl border border-green-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                     <img src="https://placehold.co/100x100?text=M" alt="Marc" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Marc O.</div>
                    <div className="text-sm text-gray-500">Vendeur High-Tech</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "J'ai pris le pack pour le lancement du nouvel iPhone. J'ai vidé mon stock en 3 jours ! La notification push est super puissante."
                </p>
              </div>
            </div>

            {/* Right Side: Pricing & CTA */}
            <div className="bg-gray-900 text-white p-8 md:p-12 md:w-1/3 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-gabon-green to-gray-900 opacity-90"></div>
              
              <div className="relative z-10">
                <div className="text-gabon-yellow uppercase text-xs font-bold tracking-wider mb-2">Prix du Pack</div>
                <div className="text-4xl font-black text-white mb-2">15 000<span className="text-xl text-gray-400">FCFA</span></div>
                <div className="text-gray-300 text-sm mb-8">/ mois (ou par campagne)</div>

                <button className="w-full bg-gabon-yellow text-gabon-green font-black py-4 px-6 rounded-xl shadow-lg hover:bg-yellow-400 transition transform hover:scale-105 mb-4 flex items-center justify-center gap-2">
                  <Rocket size={20} />
                  Lancer ma promo
                </button>
                
                <div className="text-xs text-gray-400 flex flex-col gap-2">
                  <span className="flex items-center justify-center gap-1">
                    <Smartphone size={14} /> Mobile Money & Carte acceptés
                  </span>
                  <span className="text-yellow-400 font-bold">
                    Places limitées chaque semaine
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

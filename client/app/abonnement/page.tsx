import Header from '@/components/Header';
import Link from 'next/link';
import { Check, CreditCard, Smartphone, Shield, BarChart, BadgeCheck } from 'lucide-react';

export default function AbonnementPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="pb-20">
        {/* Hero Section */}
        <section className="bg-gabon-green text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold mb-6 border border-white/30">
              💎 Formule Essentielle
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              Boostez vos ventes avec<br />
              <span className="text-gabon-yellow">l'Abonnement Mensuel</span>
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto mb-8 opacity-90">
              Profitez d'outils professionnels pour gérer votre boutique et fidéliser vos clients gabonais.
            </p>
          </div>
        </section>

        {/* Pricing Card */}
        <section className="container mx-auto px-4 -mt-16 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row">
            {/* Left Side: Features */}
            <div className="p-8 md:p-12 md:w-2/3">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Tout ce qui est inclus :</h2>
              <ul className="space-y-4">
                {[
                  { icon: BadgeCheck, text: 'Badge "Vendeur Vérifié" sur vos produits', color: 'text-blue-500' },
                  { icon: Shield, text: 'Support prioritaire 7j/7 (WhatsApp & Email)', color: 'text-green-600' },
                  { icon: BarChart, text: 'Accès aux statistiques de ventes détaillées', color: 'text-purple-500' },
                  { icon: Check, text: 'Jusqu\'à 50 produits en ligne', color: 'text-gray-600' },
                  { icon: Check, text: 'Personnalisation de votre boutique', color: 'text-gray-600' },
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
              <div className="mt-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                     <img src="https://placehold.co/100x100?text=S" alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Sarah M.</div>
                    <div className="text-sm text-gray-500">Boutique "Mode Libreville"</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Depuis que j'ai pris l'abonnement, mes clients me font plus confiance grâce au badge. Mes ventes ont augmenté de 40% le premier mois !"
                </p>
              </div>
            </div>

            {/* Right Side: Pricing & CTA */}
            <div className="bg-gray-900 text-white p-8 md:p-12 md:w-1/3 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gabon-green to-gray-900 opacity-50"></div>
              <div className="relative z-10">
                <div className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Prix Mensuel</div>
                <div className="text-5xl font-black text-gabon-yellow mb-2">5 000<span className="text-2xl">FCFA</span></div>
                <div className="text-gray-300 text-sm mb-8">Sans engagement, annulable à tout moment.</div>

                <button className="w-full bg-gabon-yellow text-gabon-green font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-yellow-400 transition transform hover:scale-105 mb-4 flex items-center justify-center gap-2">
                  <CreditCard size={20} />
                  Je m'abonne
                </button>
                
                <div className="text-xs text-gray-400 flex flex-col gap-2">
                  <span className="flex items-center justify-center gap-1">
                    <Smartphone size={14} /> Mobile Money & Carte acceptés
                  </span>
                  <span className="text-green-400 font-bold">
                    🎉 7 jours d'essai gratuit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods Logos */}
        <section className="container mx-auto px-4 mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Paiement sécurisé via Stripe</p>
          <div className="flex justify-center items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
            <div className="h-8 w-12 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">VISA</div>
            <div className="h-8 w-12 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">MC</div>
            <div className="h-8 w-12 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">Airtel</div>
            <div className="h-8 w-12 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">Moov</div>
          </div>
        </section>
      </main>
    </div>
  );
}

import Image from 'next/image'
import Link from 'next/link'

export default function BannerProduitsGabon() {
  return (
    <section className="relative bg-gradient-to-r from-green-600 via-yellow-500 to-orange-500 overflow-hidden h-[320px] md:h-[420px]">
      {/* Fond décoratif Gabon */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/pattern-wax-gabon.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>
      
      {/* Contenu principal */}
      <div className="relative container mx-auto px-4 h-full flex flex-col lg:flex-row items-center justify-center text-center lg:text-left text-white py-12">
        
        {/* BOUTONS PREMIUM - EN-HAUT À DROITE */}
        <div className="absolute top-6 right-6 hidden md:flex gap-3 z-20">
          
          {/* 1. ABONNEMENT MENSUEL */}
          <Link 
            href="/abonnement" 
            className="group bg-white/90 backdrop-blur-sm text-green-700 px-6 py-3 rounded-2xl text-sm font-bold border-2 border-white/50 hover:bg-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-2xl hover:scale-105 hover:shadow-3xl flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full group-hover:animate-ping"></span>
            💎 ABONNEMENT
            <span className="text-xs bg-gradient-to-r from-green-500 to-yellow-500 text-transparent bg-clip-text ml-1">
              5 000FCFA/mois
            </span>
          </Link>

          {/* 2. PREMIUM ANNUEL */}
          <Link 
            href="/premium" 
            className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-black border-2 border-white/30 shadow-2xl hover:shadow-3xl hover:scale-105 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center gap-2 relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all"></span>
            🚀 PREMIUM
            <span className="text-xs font-normal ml-1">Annuel</span>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-pulse">
              -30%
            </div>
          </Link>

          {/* 3. PROMOTION SPOTLIGHT */}
          <Link 
            href="/promotion" 
            className="group bg-gradient-to-br from-purple-600 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-2xl hover:shadow-3xl hover:scale-105 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 relative"
          >
            🔥 PROMOTION
            <span className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold animate-bounce text-purple-900">
              TOP
            </span>
          </Link>
        </div>

        {/* Texte principal */}
        <div className="lg:w-1/2 lg:pr-8 mb-8 lg:mb-0 z-10">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 drop-shadow-2xl animate-pulse">
            🇬🇦 <span className="text-yellow-200">PRODUITS</span>
            <br />
            <span className="text-4xl md:text-6xl lg:text-7xl">DU GABON</span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 font-light drop-shadow-lg">
            Mode • Électronique • Artisanat • Agri Local
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Link
              href="/boutiques?cat=mode"
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-200 transition-all shadow-xl hover:scale-105"
            >
              🛍️ DÉCOUVRIR MODE
            </Link>
            <Link
              href="/boutiques?cat=electronique"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-green-600 transition-all shadow-xl hover:scale-105"
            >
              📱 ÉLECTRONIQUE
            </Link>
          </div>
          
          {/* Compteur fictif */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm md:text-base font-semibold">
            <div className="bg-black/20 px-3 py-1 rounded-full">⭐ 12 547 Produits</div>
            <div className="bg-black/20 px-3 py-1 rounded-full">🏪 847 Boutiques</div>
            <div className="bg-black/20 px-3 py-1 rounded-full">🚚 Livraison Gabon</div>
          </div>
        </div>

        {/* Visuel produits */}
        <div className="lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 z-10">
          
          {/* Produit 1 - Pagne Wax */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl hover:scale-110 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2 text-3xl">
              👗
            </div>
            <div className="text-xs font-bold">Pagne Wax</div>
            <div className="text-lg font-black text-yellow-300">25 000<span className="text-xs">FCFA</span></div>
          </div>

          {/* Produit 2 - Smartphone */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl hover:scale-110 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 text-3xl">
              📱
            </div>
            <div className="text-xs font-bold">iPhone 15</div>
            <div className="text-lg font-black text-yellow-300">450 000<span className="text-xs">FCFA</span></div>
          </div>

          {/* Produit 3 - Manioc Bio */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl hover:scale-110 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2 text-3xl">
              🌾
            </div>
            <div className="text-xs font-bold">Manioc Bio</div>
            <div className="text-lg font-black text-yellow-300">3 500<span className="text-xs">FCFA</span></div>
          </div>

          {/* Produit 4 - Baskets */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl hover:scale-110 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2 text-3xl">
              👟
            </div>
            <div className="text-xs font-bold">Baskets Nike</div>
            <div className="text-lg font-black text-yellow-300">85 000<span className="text-xs">FCFA</span></div>
          </div>

          {/* Produit 5 - PC Portable */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-2xl hover:scale-110 transition-all md:col-span-2 lg:col-span-1 col-span-2">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-2 text-3xl">
              💻
            </div>
            <div className="text-xs font-bold">Dell XPS 13</div>
            <div className="text-lg font-black text-yellow-300">950 000<span className="text-xs">FCFA</span></div>
          </div>
        </div>
      </div>

      {/* Flèche scroll down */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

import Link from 'next/link';

export default function HeroVideo() {
  return (
    <section className="relative h-[500px] w-full overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/pattern-wax-gabon.png"
      >
        <source src="/hero-video-small.webm" type="video/webm" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Overlay Gradient for Readability */}
      <div className="absolute inset-0 bg-black/50 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center text-white z-10">
        
        {/* Main Text */}
        <div className="max-w-2xl animate-fade-in-up">
          <span className="inline-block bg-gabon-yellow text-gabon-blue px-3 py-1 rounded-full text-sm font-bold mb-4">
            🇬🇦 Made in Gabon
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight drop-shadow-lg">
            DÉCOUVREZ L'ART <br />
            <span className="text-gabon-yellow">ET LA CULTURE</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 font-light max-w-lg">
            Une sélection unique de produits locaux, de la mode à l'artisanat, directement des vendeurs gabonais.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/boutiques"
              className="bg-gabon-green text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-700 transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            >
              🛍️ Acheter Maintenant
            </Link>
            <Link
              href="/vendre"
              className="bg-white/10 backdrop-blur-md border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-gabon-blue transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            >
              🏪 Devenir Vendeur
            </Link>
          </div>
        </div>

        {/* Floating Stats or Features (Optional) */}
        <div className="absolute bottom-8 right-4 md:right-12 hidden md:flex gap-6">
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-gabon-yellow">100%</div>
            <div className="text-xs text-gray-300">Authentique</div>
          </div>
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <div className="text-2xl font-bold text-gabon-yellow">24/7</div>
            <div className="text-xs text-gray-300">Support Client</div>
          </div>
        </div>

      </div>
    </section>
  );
}

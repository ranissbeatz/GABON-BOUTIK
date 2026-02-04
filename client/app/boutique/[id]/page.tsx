
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import ContactVendorButton from '@/components/ContactVendorButton';
import Image from 'next/image';
import { MapPin, Phone, User } from 'lucide-react';

async function getBoutique(id: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/boutiques/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Error fetching boutique:", error);
    return null;
  }
}

async function getVendorProducts(vendorId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/products?vendor=${vendorId}`, { cache: 'no-store' });
    if (!res.ok) return [];
    
    const products = await res.json();
    
    // Map API response to match ProductCard props
     return products.map((product: any) => ({
       ...product,
       image: product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x300?text=Produit',
       vendor: product.vendor ? {
         _id: product.vendor._id,
         name: product.vendor.name,
         storeName: product.vendor.storeName || product.vendor.name
       } : { _id: 'unknown', name: 'Vendeur Inconnu', storeName: 'Boutique' }
     }));
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    return [];
  }
}

export default async function BoutiquePage({ params }: { params: { id: string } }) {
  const boutique = await getBoutique(params.id);

  if (!boutique) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Boutique introuvable</h1>
          <p className="text-gray-600 mt-2">Cette boutique n'existe pas ou a été supprimée.</p>
        </div>
      </div>
    );
  }

  // Determine the actual vendor ID string
  const vendorIdString = typeof boutique.vendeurId === 'object' ? boutique.vendeurId._id : boutique.vendeurId;
  const products = await getVendorProducts(vendorIdString);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Boutique Header / Banner */}
      <div className="bg-white shadow-sm pb-8">
        {/* Banner */}
        <div className="relative h-[200px] md:h-[300px] bg-gray-200 w-full">
            {boutique.banniere ? (
                <Image 
                    src={boutique.banniere}
                    alt={`Bannière de ${boutique.nom}`}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gabon-green to-gabon-blue text-white opacity-80">
                    <span className="text-4xl font-bold opacity-30">{boutique.nom}</span>
                </div>
            )}
            <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Info Container */}
        <div className="container mx-auto px-4 relative -mt-16 z-10">
            <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Logo */}
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow overflow-hidden bg-white shrink-0">
                    {boutique.logo ? (
                        <Image 
                            src={boutique.logo}
                            alt={`Logo de ${boutique.nom}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            <User size={48} />
                        </div>
                    )}
                </div>

                {/* Text Info */}
                <div className="flex-1 text-center md:text-left pt-2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{boutique.nom}</h1>
                    <p className="text-gray-600 mb-4 max-w-2xl">{boutique.description || "Aucune description disponible."}</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                        {(boutique.ville || boutique.adresse) && (
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span>{boutique.adresse}, {boutique.ville}</span>
                            </div>
                        )}
                        {boutique.whatsapp && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                <Phone size={16} />
                                <span>{boutique.whatsapp}</span>
                            </div>
                        )}
                        <div className="bg-gray-100 px-2 py-0.5 rounded text-xs uppercase tracking-wider font-semibold">
                            {boutique.categorie || "Divers"}
                        </div>
                    </div>
                </div>

                {/* Actions (Future: Follow, Share) */}
                <div className="mt-4 md:mt-0">
                    <ContactVendorButton vendorId={vendorIdString} vendorName={boutique.nom} />
                </div>
            </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Produits de la boutique ({products.length})</h2>
            
            {/* Filter/Sort could go here */}
            <select className="border rounded-md px-3 py-1 text-sm bg-white">
                <option>Les plus récents</option>
                <option>Prix croissant</option>
                <option>Prix décroissant</option>
            </select>
        </div>

        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">Cette boutique n'a pas encore ajouté de produits.</p>
            </div>
        )}
      </div>
      
    </div>
  );
}

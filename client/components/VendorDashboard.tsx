"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string; // Display image
  images: string[]; // All images
}

export default function VendorDashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user: authUser, token } = useAuth(); // Ensure we have the latest auth state if needed

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Alimentation',
    stock: '',
    image1: '',
    image2: '',
    image3: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Settings State
  const [boutiqueSettings, setBoutiqueSettings] = useState({
    storeName: '',
    storeDescription: '',
    phone: '',
    city: '',
    quartier: '',
    storeCategory: 'Alimentation',
    logo: '',
    banner: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (user && activeTab === 'products') {
      fetchVendorProducts();
    }
    if (user && activeTab === 'settings') {
      fetchBoutiqueSettings();
    }
  }, [user, activeTab]);

  const fetchBoutiqueSettings = async () => {
    setSettingsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/boutiques/${user._id}`);
      const data = res.data;
      setBoutiqueSettings({
        storeName: data.nom || '',
        storeDescription: data.description || '',
        phone: data.whatsapp || '',
        city: data.ville || '',
        quartier: data.adresse || '',
        storeCategory: data.categorie || 'Alimentation',
        logo: data.logo || '',
        banner: data.banniere || ''
      });
    } catch (error) {
      console.error("Error fetching boutique settings", error);
      setSettingsError("Impossible de charger les paramètres de la boutique.");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBoutiqueSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'logo') setLogoFile(e.target.files[0]);
      if (type === 'banner') setBannerFile(e.target.files[0]);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('storeName', boutiqueSettings.storeName);
      formData.append('storeDescription', boutiqueSettings.storeDescription);
      formData.append('phone', boutiqueSettings.phone);
      formData.append('city', boutiqueSettings.city);
      formData.append('quartier', boutiqueSettings.quartier);
      formData.append('storeCategory', boutiqueSettings.storeCategory);
      
      if (logoFile) formData.append('logo', logoFile);
      if (bannerFile) formData.append('banner', bannerFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${apiUrl}/api/boutiques/${user._id}/update`, formData, config);
      
      setSettingsSuccess('Paramètres mis à jour avec succès !');
      // Refresh data slightly later to allow server update
      setTimeout(fetchBoutiqueSettings, 500);
    } catch (error: any) {
      console.error(error);
      setSettingsError(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchVendorProducts = async () => {
    setLoadingProducts(true);
    try {
      // Fetch products where vendor is the current user
      const res = await axios.get(`http://localhost:5000/api/products?vendor=${user._id}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    try {
      const images = [formData.image1, formData.image2, formData.image3].filter(Boolean);
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        images: images.length > 0 ? images : ['https://placehold.co/600x400?text=No+Image'],
        variations: [] // Add variations logic later
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/products`, productData);
      
      setFormSuccess('Produit ajouté avec succès !');
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Alimentation',
        stock: '',
        image1: '',
        image2: '',
        image3: ''
      });
      setShowAddForm(false);
      fetchVendorProducts(); // Refresh list
    } catch (error: any) {
      setFormError(error.response?.data?.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Tableau de bord Vendeur - {user.storeName}</h2>
      
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'products' ? 'text-gabon-green border-b-2 border-gabon-green' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('products')}
        >
          Mes Produits
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'orders' ? 'text-gabon-green border-b-2 border-gabon-green' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('orders')}
        >
          Commandes
        </button>
        <button
          className={`py-2 px-4 font-medium whitespace-nowrap ${activeTab === 'settings' ? 'text-gabon-green border-b-2 border-gabon-green' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('settings')}
        >
          Paramètres Boutique
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Liste des produits ({products.length})</h3>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gabon-green text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              {showAddForm ? 'Annuler' : '+ Ajouter un produit'}
            </button>
          </div>

          {showAddForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
              <h4 className="font-bold text-lg mb-4 text-gray-800">Nouveau Produit</h4>
              {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{formError}</div>}
              {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{formSuccess}</div>}
              
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border rounded p-2 focus:ring-gabon-green focus:border-gabon-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full border rounded p-2 focus:ring-gabon-green focus:border-gabon-green">
                      <option value="Alimentation">Alimentation</option>
                      <option value="Mode">Mode & Vêtements</option>
                      <option value="High-Tech">High-Tech & Électronique</option>
                      <option value="Maison">Maison & Déco</option>
                      <option value="Beauté">Beauté & Santé</option>
                      <option value="Artisanat">Artisanat Gabonais</option>
                      <option value="Auto">Auto & Moto</option>
                      <option value="Autres">Autres</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={3} className="w-full border rounded p-2 focus:ring-gabon-green focus:border-gabon-green"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" className="w-full border rounded p-2 focus:ring-gabon-green focus:border-gabon-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required min="0" className="w-full border rounded p-2 focus:ring-gabon-green focus:border-gabon-green" />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Images (URLs pour l'instant)</label>
                   <div className="space-y-2">
                     <input type="url" name="image1" placeholder="URL Image principale (ex: https://...)" value={formData.image1} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                     <input type="url" name="image2" placeholder="URL Image 2 (optionnel)" value={formData.image2} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                     <input type="url" name="image3" placeholder="URL Image 3 (optionnel)" value={formData.image3} onChange={handleInputChange} className="w-full border rounded p-2 text-sm" />
                   </div>
                   <p className="text-xs text-gray-500 mt-1">Note: L'upload de fichiers sera activé prochainement.</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={submitting} className="bg-gabon-green text-white font-bold py-2 px-6 rounded hover:bg-green-700 disabled:opacity-50">
                    {submitting ? 'Ajout en cours...' : 'Enregistrer le produit'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {loadingProducts ? (
            <div className="text-center py-8">Chargement des produits...</div>
          ) : products.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded text-center text-gray-500 border border-dashed border-gray-300">
              <p className="mb-2">Vous n'avez pas encore ajouté de produits.</p>
              <button onClick={() => setShowAddForm(true)} className="text-gabon-green font-medium hover:underline">
                Commencer à vendre
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    <Image 
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x400?text=No+Image'} 
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg mb-1 truncate">{product.name}</h4>
                    <p className="text-gabon-green font-bold mb-2">{product.price.toLocaleString()} FCFA</p>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Stock: {product.stock}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs flex items-center">{product.category}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 border border-gray-300 text-gray-700 py-1 rounded hover:bg-gray-50 text-sm">Modifier</button>
                      <button className="flex-1 border border-red-200 text-red-600 py-1 rounded hover:bg-red-50 text-sm">Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
           <h3 className="text-lg font-semibold mb-4">Commandes reçues</h3>
           <div className="bg-gray-50 p-8 rounded text-center text-gray-500 border border-dashed border-gray-300">
            Aucune commande pour le moment.
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div>
           <h3 className="text-lg font-semibold mb-4">Paramètres de la boutique</h3>
           
           {settingsLoading ? (
             <div className="text-center py-8">Chargement des paramètres...</div>
           ) : (
             <form onSubmit={handleSettingsSubmit} className="space-y-4 max-w-2xl">
               {settingsError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{settingsError}</div>}
               {settingsSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{settingsSuccess}</div>}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Nom de la boutique</label>
                   <input 
                     type="text" 
                     name="storeName"
                     value={boutiqueSettings.storeName} 
                     onChange={handleSettingsChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                   <select 
                     name="storeCategory"
                     value={boutiqueSettings.storeCategory}
                     onChange={handleSettingsChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                   >
                     <option value="Alimentation">Alimentation</option>
                     <option value="Mode">Mode & Vêtements</option>
                     <option value="Électronique">Électronique</option>
                     <option value="Maison">Maison & Déco</option>
                     <option value="Beauté">Beauté & Santé</option>
                     <option value="Artisanat">Artisanat</option>
                     <option value="Auto">Auto & Moto</option>
                     <option value="Agro">Agro-alimentaire</option>
                     <option value="Services">Services</option>
                     <option value="Autre">Autre</option>
                   </select>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Description</label>
                 <textarea 
                   name="storeDescription"
                   value={boutiqueSettings.storeDescription} 
                   onChange={handleSettingsChange}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                   rows={3}
                 ></textarea>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Ville</label>
                   <select 
                     name="city"
                     value={boutiqueSettings.city}
                     onChange={handleSettingsChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                   >
                     <option value="">Sélectionner une ville</option>
                     <option value="Libreville">Libreville</option>
                     <option value="Port-Gentil">Port-Gentil</option>
                     <option value="Lambaréné">Lambaréné</option>
                     <option value="Franceville">Franceville</option>
                     <option value="Oyem">Oyem</option>
                     <option value="Mouila">Mouila</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Quartier / Adresse</label>
                   <input 
                     type="text" 
                     name="quartier"
                     value={boutiqueSettings.quartier} 
                     onChange={handleSettingsChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700">Téléphone / WhatsApp</label>
                 <input 
                   type="text" 
                   name="phone"
                   value={boutiqueSettings.phone} 
                   onChange={handleSettingsChange}
                   className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                   {boutiqueSettings.logo && (
                     <div className="mb-2 relative w-24 h-24 border rounded overflow-hidden">
                       <Image src={boutiqueSettings.logo} alt="Logo actuel" fill className="object-cover" />
                     </div>
                   )}
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={(e) => handleFileChange(e, 'logo')}
                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-gabon-green hover:file:bg-green-100" 
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Bannière</label>
                   {boutiqueSettings.banner && (
                     <div className="mb-2 relative w-full h-24 border rounded overflow-hidden">
                       <Image src={boutiqueSettings.banner} alt="Bannière actuelle" fill className="object-cover" />
                     </div>
                   )}
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={(e) => handleFileChange(e, 'banner')}
                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-gabon-green hover:file:bg-green-100" 
                   />
                 </div>
               </div>

               <div className="pt-4">
                 <button 
                   type="submit" 
                   disabled={submitting}
                   className="bg-gabon-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                 >
                   {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                 </button>
               </div>
             </form>
           )}
        </div>
      )}
    </div>
  );
}

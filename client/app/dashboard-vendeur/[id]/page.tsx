"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  CreditCard, 
  Settings, 
  LogOut,
  Plus,
  Search,
  Bell,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Truck,
  Clock,
  MessageCircle
} from 'lucide-react';
import axios from 'axios';
import ChatInterface from '@/components/Chat/ChatInterface';

export default function VendorDashboardPage() {
  const { user, loading, logout, token, updateUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [stats, setStats] = useState({
    salesToday: 0,
    salesWeekly: 0,
    totalRevenue: 2500000, // Mock data as per request
    totalSales: 12 // Mock data as per request
  });

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
  const [submitting, setSubmitting] = useState(false);

  // Product Management State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Alimentation',
    description: '',
    stock: '',
    existingImages: [] as string[],
  });
  const [productImages, setProductImages] = useState<File[]>([]);

  // Verify access
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'vendor') {
        router.push('/dashboard');
      } else if (user._id !== params.id) {
         // Optionally restrict access to own dashboard only
         // router.push(`/dashboard-vendeur/${user._id}`);
      }
    }
  }, [user, loading, router, params.id]);

  useEffect(() => {
    if (user && activeTab === 'settings') {
      fetchBoutiqueSettings();
    }
    if (user && activeTab === 'products') {
        fetchVendorProducts();
    }
    if (user && activeTab === 'orders') {
        fetchVendorOrders();
    }
  }, [user, activeTab]);

  const fetchVendorOrders = async () => {
    if (!user) return;
    setOrderLoading(true);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/orders/vendor/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
    } catch (error) {
        console.error("Error fetching orders", error);
    } finally {
        setOrderLoading(false);
    }
  };

  const handleOrderStatus = async (orderId: string, status: string) => {
      try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          await axios.put(`${apiUrl}/api/orders/${orderId}/deliver`, { status }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchVendorOrders(); // Refresh list
      } catch (error) {
          console.error("Error updating order status", error);
          alert("Erreur lors de la mise à jour du statut");
      }
  };

  const fetchVendorProducts = async () => {
    if (!user) return;
    setProductLoading(true);
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/products/vendor/${user?._id}`);
        setProducts(res.data);
    } catch (error) {
        console.error("Error fetching products", error);
    } finally {
        setProductLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setProductLoading(true);
      try {
          const formData = new FormData();
          formData.append('name', productForm.name);
          formData.append('price', productForm.price);
          formData.append('category', productForm.category);
          formData.append('description', productForm.description);
          formData.append('stock', productForm.stock);
          
          // Existing images (if editing)
          if (productForm.existingImages && productForm.existingImages.length > 0) {
             productForm.existingImages.forEach(img => formData.append('images', img));
          }

          // New images
          productImages.forEach(file => {
              formData.append('images', file);
          });

          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          };

          if (editingProduct) {
              await axios.put(`${apiUrl}/api/products/${editingProduct._id}`, formData, config);
          } else {
              await axios.post(`${apiUrl}/api/products`, formData, config);
          }
          
          setIsProductModalOpen(false);
          resetProductForm();
          fetchVendorProducts();
      } catch (error) {
          console.error("Error saving product", error);
          alert("Erreur lors de l'enregistrement du produit");
      } finally {
          setProductLoading(false);
      }
  };

  const handleDeleteProduct = async (id: string) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
      try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          await axios.delete(`${apiUrl}/api/products/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchVendorProducts();
      } catch (error) {
          console.error("Error deleting product", error);
      }
  };

  const openEditModal = (product: any) => {
      setEditingProduct(product);
      setProductForm({
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          stock: product.stock,
          existingImages: product.images || []
      });
      setProductImages([]);
      setIsProductModalOpen(true);
  };
  
  const openCreateModal = () => {
      resetProductForm();
      setIsProductModalOpen(true);
  };

  const resetProductForm = () => {
      setEditingProduct(null);
      setProductForm({
          name: '',
          price: '',
          category: 'Alimentation',
          description: '',
          stock: '',
          existingImages: []
      });
      setProductImages([]);
  };

  const fetchBoutiqueSettings = async () => {
    if (!user) return;
    setSettingsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/boutiques/${user?._id}`);
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

      const res = await axios.put(`${apiUrl}/api/boutiques/${user?._id}/update`, formData, config);
       
       if (res.data) {
          updateUser({
            storeName: res.data.nom,
            storeLogo: res.data.logo,
            storeBanner: res.data.banniere
          });
       }

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

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gabon-green font-bold">Chargement...</div>;

  const SidebarItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${
        activeTab === id 
          ? 'bg-gabon-green text-white border-r-4 border-yellow-400' 
          : 'text-gray-600 hover:bg-green-50 hover:text-gabon-green'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
            <Link href="/" className="text-2xl font-black text-gabon-green tracking-tighter">
              GANON<span className="text-gabon-yellow">BOUTIK</span>
            </Link>
        </div>

        <div className="py-6 flex flex-col h-[calc(100vh-80px)] justify-between">
          <nav className="space-y-1">
            <SidebarItem id="dashboard" icon={LayoutDashboard} label="Tableau de bord" />
            <SidebarItem id="products" icon={Package} label="Produits" />
            <SidebarItem id="orders" icon={ShoppingBag} label="Commandes" />
            <SidebarItem id="messages" icon={MessageCircle} label="Messages" />
            <SidebarItem id="analytics" icon={BarChart3} label="Analytics" />
            <SidebarItem id="subscription" icon={CreditCard} label="Abonnements" />
            <SidebarItem id="settings" icon={Settings} label="Paramètres" />
          </nav>

          <div className="px-6 pb-6">
            <div className="bg-green-50 p-4 rounded-xl mb-4">
              <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Votre Offre</p>
              <p className="text-sm font-bold text-gabon-green flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gabon-yellow"></span>
                Standard (5%)
              </p>
            </div>
            <button 
              onClick={logout}
              className="w-full flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden md:block">
              {activeTab === 'dashboard' && 'Vue d\'ensemble'}
              {activeTab === 'products' && 'Gestion des Produits'}
              {activeTab === 'orders' && 'Commandes Clients'}
              {activeTab === 'messages' && 'Messagerie Client'}
              {activeTab === 'analytics' && 'Statistiques & Rapports'}
              {activeTab === 'subscription' && 'Mon Abonnement'}
              {activeTab === 'settings' && 'Paramètres de la Boutique'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-gabon-green w-64 text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.storeName}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                {(user as any)?.profilePicture ? (
                    <Image src={(user as any).profilePicture} alt="Profile" width={40} height={40} className="object-cover w-full h-full" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gabon-green text-white font-bold">
                        {user.name.charAt(0)}
                    </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            
            {/* DASHBOARD CONTENT */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                    {/* Banner Section */}
                    <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gray-800 shadow-lg group">
                        {user.storeBanner ? (
                            <Image src={user.storeBanner} alt="Banner" fill className="object-cover opacity-80 group-hover:scale-105 transition duration-700" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center text-gray-500">
                                Pas de bannière
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:p-8">
                            <div className="flex items-end gap-6 w-full">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white p-1 shadow-2xl relative -mb-12 md:-mb-16 z-10">
                                    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100 relative">
                                        {user.storeLogo ? (
                                            <Image src={user.storeLogo} alt="Logo" fill className="object-contain" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400 font-bold">LOGO</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 text-white pb-2">
                                    <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-1">{user.storeName}</h1>
                                    <p className="text-gray-300 flex items-center gap-2 text-sm md:text-base">
                                        <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded text-xs font-bold uppercase border border-green-500/30">Vérifié</span>
                                        {(user as any)?.storeCategory} • {(user as any)?.address?.city}
                                    </p>
                                </div>
                                <div className="hidden md:block pb-4">
                                    <Link href={`/boutique/${user._id}`} target="_blank" className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition shadow-lg inline-block">
                                        Voir ma boutique
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Spacer for Logo overlap */}
                    <div className="h-6 md:h-10"></div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                                    <DollarSign size={24} />
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <TrendingUp size={12} /> +12%
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Chiffre d'Affaires</p>
                                <h3 className="text-2xl font-black text-gray-800">{stats.totalRevenue.toLocaleString()} FCFA</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                                    <ShoppingBag size={24} />
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <TrendingUp size={12} /> +5%
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Ventes Totales</p>
                                <h3 className="text-2xl font-black text-gray-800">{stats.totalSales} ventes</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                                    <Package size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Produits Actifs</p>
                                <h3 className="text-2xl font-black text-gray-800">24</h3>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-pink-50 text-pink-600">
                                    <Users size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">Vues Boutique</p>
                                <h3 className="text-2xl font-black text-gray-800">1.2k</h3>
                            </div>
                        </div>
                    </div>

                    {/* Actions & Recent */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Action Area */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Actions Rapides</h3>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setActiveTab('products')}
                                    className="p-6 rounded-xl border-2 border-dashed border-gray-200 hover:border-gabon-green hover:bg-green-50 transition group text-left flex flex-col gap-3"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gabon-green text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                        <Plus size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 group-hover:text-gabon-green">Ajouter un Produit</h4>
                                        <p className="text-sm text-gray-500">Mettre en ligne un nouvel article</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => setActiveTab('orders')}
                                    className="p-6 rounded-xl border border-gray-100 hover:shadow-md transition text-left flex flex-col gap-3 bg-gray-50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Gérer les Commandes</h4>
                                        <p className="text-sm text-gray-500">2 commandes en attente</p>
                                    </div>
                                </button>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Performance de la Semaine</h3>
                                <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm border border-gray-100">
                                    [Graphique des Ventes à intégrer ici]
                                </div>
                            </div>
                        </div>

                        {/* Notifications / Side Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Dernières Activités</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex-shrink-0 flex items-center justify-center">
                                            <ShoppingBag size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">Nouvelle commande #24{i}</p>
                                            <p className="text-xs text-gray-500">Il y a {i*2} heures • 15.000 FCFA</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Support Vendeur</h3>
                                <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800">
                                    <p className="mb-2 font-semibold">Besoin d'aide ?</p>
                                    <p className="mb-3 opacity-80">Contactez notre équipe support dédiée aux vendeurs.</p>
                                    <button className="text-blue-600 font-bold hover:underline">Contacter le support &rarr;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MESSAGES CONTENT */}
            {activeTab === 'messages' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 h-[calc(100vh-140px)] overflow-hidden">
                    <ChatInterface />
                </div>
            )}

            {/* PRODUCTS CONTENT */}
            {activeTab === 'products' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">Vos Produits</h3>
                        <button 
                            onClick={openCreateModal}
                            className="bg-gabon-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-lg"
                        >
                            <Plus size={20} /> Ajouter un produit
                        </button>
                    </div>
            
                    {/* Product List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-bold text-gray-600">Produit</th>
                                        <th className="p-4 font-bold text-gray-600">Catégorie</th>
                                        <th className="p-4 font-bold text-gray-600">Prix</th>
                                        <th className="p-4 font-bold text-gray-600">Stock</th>
                                        <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                                Aucun produit trouvé. Commencez par en ajouter un !
                                            </td>
                                        </tr>
                                    ) : (
                                        products.map((product: any) => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                                            {product.images && product.images[0] ? (
                                                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <Package size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{product.name}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-gray-800">
                                                    {product.price} FCFA
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        product.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        {product.stock} en stock
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => openEditModal(product)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        >
                                                            <Settings size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProduct(product._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <LogOut size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
            
                    {/* Modal */}
                    {isProductModalOpen && (
                        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fadeIn">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                                    </h3>
                                    <button 
                                        onClick={() => setIsProductModalOpen(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
            
                                <form onSubmit={handleProductSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
                                            <input 
                                                type="text" 
                                                required
                                                value={productForm.name}
                                                onChange={e => setProductForm({...productForm, name: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-gabon-green focus:border-gabon-green"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                                            <select 
                                                value={productForm.category}
                                                onChange={e => setProductForm({...productForm, category: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-gabon-green focus:border-gabon-green"
                                            >
                                                <option value="Alimentation">Alimentation</option>
                                                <option value="Mode">Mode & Vêtements</option>
                                                <option value="Électronique">Électronique</option>
                                                <option value="Maison">Maison & Déco</option>
                                                <option value="Beauté">Beauté & Santé</option>
                                                <option value="Artisanat">Artisanat</option>
                                            </select>
                                        </div>
                                    </div>
            
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA)</label>
                                            <input 
                                                type="number" 
                                                required
                                                min="0"
                                                value={productForm.price}
                                                onChange={e => setProductForm({...productForm, price: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-gabon-green focus:border-gabon-green"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                            <input 
                                                type="number" 
                                                required
                                                min="0"
                                                value={productForm.stock}
                                                onChange={e => setProductForm({...productForm, stock: e.target.value})}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-gabon-green focus:border-gabon-green"
                                            />
                                        </div>
                                    </div>
            
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea 
                                            required
                                            rows={4}
                                            value={productForm.description}
                                            onChange={e => setProductForm({...productForm, description: e.target.value})}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-gabon-green focus:border-gabon-green"
                                        ></textarea>
                                    </div>
            
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Images du produit</label>
                                        
                                        {/* Existing Images Preview */}
                                        {productForm.existingImages.length > 0 && (
                                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                                {productForm.existingImages.map((img, idx) => (
                                                    <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg border overflow-hidden group">
                                                        <Image src={img} alt="Product" fill className="object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newImages = productForm.existingImages.filter((_, i) => i !== idx);
                                                                setProductForm({...productForm, existingImages: newImages});
                                                            }}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
            
                                        <input 
                                            type="file" 
                                            multiple
                                            accept="image/*"
                                            onChange={e => {
                                                if (e.target.files) {
                                                    setProductImages(Array.from(e.target.files));
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-gabon-green hover:file:bg-green-100 transition"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Max 5 images.</p>
                                    </div>
            
                                    <div className="flex justify-end gap-4 pt-4 border-t">
                                        <button 
                                            type="button"
                                            onClick={() => setIsProductModalOpen(false)}
                                            className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition"
                                        >
                                            Annuler
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={productLoading}
                                            className="px-6 py-2 bg-gabon-green text-white font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                        >
                                            {productLoading ? 'Enregistrement...' : 'Enregistrer'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ORDERS CONTENT */}
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Commandes Clients</h3>
                    
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-bold text-gray-600">ID Commande</th>
                                        <th className="p-4 font-bold text-gray-600">Client</th>
                                        <th className="p-4 font-bold text-gray-600">Date</th>
                                        <th className="p-4 font-bold text-gray-600">Total</th>
                                        <th className="p-4 font-bold text-gray-600">Statut</th>
                                        <th className="p-4 font-bold text-gray-600 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orderLoading ? (
                                        <tr><td colSpan={6} className="p-8 text-center">Chargement...</td></tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                                Aucune commande pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order: any) => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition">
                                                <td className="p-4 font-mono text-sm font-bold text-gray-800">
                                                    #{order._id.substring(20, 24)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-gray-800">{order.user?.name || 'Client Inconnu'}</div>
                                                    <div className="text-xs text-gray-500">{order.shippingAddress?.city}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 font-bold text-gabon-green">
                                                    {order.totalPrice.toLocaleString()} FCFA
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                                                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {order.status === 'Delivered' && <CheckCircle size={12} />}
                                                        {order.status === 'Shipped' && <Truck size={12} />}
                                                        {order.status === 'Pending' && <Clock size={12} />}
                                                        {order.status === 'Delivered' ? 'Livré' : 
                                                         order.status === 'Shipped' ? 'Expédié' : 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {order.status !== 'Delivered' && (
                                                        <select 
                                                            className="text-sm border border-gray-200 rounded-lg p-1 bg-white"
                                                            onChange={(e) => handleOrderStatus(order._id, e.target.value)}
                                                            value={order.status}
                                                        >
                                                            <option value="Pending">En attente</option>
                                                            <option value="Shipped">Expédié</option>
                                                            <option value="Delivered">Livré</option>
                                                        </select>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* MESSAGES TAB */}
            {activeTab === 'messages' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <ChatInterface />
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                 <h3 className="text-xl font-bold text-gray-800 mb-6">Paramètres de la boutique</h3>
                 
                 {settingsLoading ? (
                   <div className="text-center py-8">Chargement des paramètres...</div>
                 ) : (
                   <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-3xl">
                     {settingsError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{settingsError}</div>}
                     {settingsSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{settingsSuccess}</div>}
      
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la boutique</label>
                         <input 
                           type="text" 
                           name="storeName"
                           value={boutiqueSettings.storeName} 
                           onChange={handleSettingsChange}
                           className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-gabon-green focus:border-gabon-green transition" 
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                         <select 
                           name="storeCategory"
                           value={boutiqueSettings.storeCategory}
                           onChange={handleSettingsChange}
                           className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-gabon-green focus:border-gabon-green transition"
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
                       <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                       <textarea 
                         name="storeDescription"
                         value={boutiqueSettings.storeDescription} 
                         onChange={handleSettingsChange}
                         className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-gabon-green focus:border-gabon-green transition" 
                         rows={4}
                       ></textarea>
                     </div>
      
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                         <select 
                           name="city"
                           value={boutiqueSettings.city}
                           onChange={handleSettingsChange}
                           className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-gabon-green focus:border-gabon-green transition"
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
                         <label className="block text-sm font-medium text-gray-700 mb-2">Quartier / Adresse</label>
                         <input 
                           type="text" 
                           name="quartier"
                           value={boutiqueSettings.quartier} 
                           onChange={handleSettingsChange}
                           className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-gabon-green focus:border-gabon-green transition" 
                         />
                       </div>
                     </div>
      
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone / WhatsApp</label>
                       <input 
                         type="text" 
                         name="phone"
                         value={boutiqueSettings.phone} 
                         onChange={handleSettingsChange}
                         className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-gabon-green focus:border-gabon-green transition" 
                       />
                     </div>
      
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                         {boutiqueSettings.logo && (
                           <div className="mb-3 relative w-24 h-24 border rounded-lg overflow-hidden bg-gray-50">
                             <Image src={boutiqueSettings.logo} alt="Logo actuel" fill className="object-cover" />
                           </div>
                         )}
                         <input 
                           type="file" 
                           accept="image/*"
                           onChange={(e) => handleFileChange(e, 'logo')}
                           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-gabon-green hover:file:bg-green-100 transition" 
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">Bannière</label>
                         {boutiqueSettings.banner && (
                           <div className="mb-3 relative w-full h-32 border rounded-lg overflow-hidden bg-gray-50">
                             <Image src={boutiqueSettings.banner} alt="Bannière actuelle" fill className="object-cover" />
                           </div>
                         )}
                         <input 
                           type="file" 
                           accept="image/*"
                           onChange={(e) => handleFileChange(e, 'banner')}
                           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-gabon-green hover:file:bg-green-100 transition" 
                         />
                       </div>
                     </div>
      
                     <div className="pt-6 border-t border-gray-100 flex justify-end">
                       <button 
                         type="submit" 
                         disabled={submitting}
                         className="bg-gabon-blue text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-bold shadow-lg"
                       >
                         {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                       </button>
                     </div>
                   </form>
                 )}
              </div>
            )}

             {/* OTHER TABS PLACEHOLDER */}
             {['analytics', 'subscription'].includes(activeTab) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-6">
                        <Settings size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Section en construction</h2>
                    <p className="text-gray-500 max-w-md">La section {activeTab} sera bientôt disponible.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

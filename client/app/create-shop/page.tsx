"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import axios from 'axios';
import { Store, MapPin, Phone, FileText, Upload, Image as ImageIcon, Briefcase, CheckCircle, AlertCircle, User, Mail, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';

// Validation Schema
const shopSchema = z.object({
  // Etape 1 : Boutique
  storeName: z.string().min(3, 'Le nom doit contenir au moins 3 caractères').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  storeDescription: z.string().max(200, 'La description ne peut pas dépasser 200 caractères'),
  storeCategory: z.enum(['Mode', 'Électronique', 'Agro', 'Artisanat', 'Auto', 'Maison']),
  city: z.enum(['Libreville', 'Port-Gentil', 'Lambaréné', 'Franceville', 'Oyem', 'Mouila']),
  quartier: z.string().min(2, 'Le quartier est requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide').regex(/^\+?[0-9\s]+$/, 'Format invalide'),
  nif: z.string().optional(),
  logo: z.any()
    .refine((files) => files?.length === 1, "Le logo est requis")
    .refine((files) => files?.[0]?.size <= 2000000, "La taille maximale est de 2Mo")
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Formats acceptés: .jpg, .png, .webp"
    ),
  banner: z.any()
    .refine((files) => files?.length === 1, "La bannière est requise")
    .refine((files) => files?.[0]?.size <= 5000000, "La taille maximale est de 5Mo")
    .refine(
      (files) => ['image/jpeg', 'image/png', 'image/webp'].includes(files?.[0]?.type),
      "Formats acceptés: .jpg, .png, .webp"
    ),

  // Etape 2 : Vendeur
  fullName: z.string().min(2, 'Le nom complet est requis'),
  profilePicture: z.any()
    .optional()
    .refine((files) => !files || files.length === 0 || files[0].size <= 2000000, "La taille maximale est de 2Mo")
    .refine(
      (files) => !files || files.length === 0 || ['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type),
      "Formats acceptés: .jpg, .png, .webp"
    ),
  acceptTerms: z.literal(true),
});

type ShopFormData = z.infer<typeof shopSchema>;

export default function CreateShopPage() {
  const { user, token, updateUser, loading } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
    setValue
  } = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      fullName: user?.name || '',
    }
  });

  // Watch files for previews
  const logoFile = watch('logo');
  const bannerFile = watch('banner');
  const profileFile = watch('profilePicture');

  useEffect(() => {
    if (user) {
      setValue('fullName', user.name);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (logoFile && logoFile.length > 0) {
      const file = logoFile[0];
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [logoFile]);

  useEffect(() => {
    if (bannerFile && bannerFile.length > 0) {
      const file = bannerFile[0];
      const url = URL.createObjectURL(file);
      setBannerPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [bannerFile]);

  useEffect(() => {
    if (profileFile && profileFile.length > 0) {
      const file = profileFile[0];
      const url = URL.createObjectURL(file);
      setProfilePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [profileFile]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/create-shop');
    }
    if (!loading && user && user.role === 'vendor') {
      router.push(`/dashboard-vendeur/${user._id}`);
    }
  }, [user, loading, router]);

  const validateStep1 = async () => {
    const result = await trigger([
      'storeName', 'storeDescription', 'storeCategory', 'city', 'quartier', 'phone', 'nif', 'logo', 'banner'
    ]);
    if (result) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data: ShopFormData) => {
    setSubmitError('');

    try {
      const formData = new FormData();
      // Step 1 Data
      formData.append('storeName', data.storeName);
      formData.append('storeDescription', data.storeDescription);
      formData.append('storeCategory', data.storeCategory);
      formData.append('city', data.city);
      formData.append('quartier', data.quartier);
      formData.append('phone', data.phone);
      if (data.nif) formData.append('nif', data.nif);
      formData.append('logo', data.logo[0]);
      formData.append('banner', data.banner[0]);

      // Step 2 Data
      formData.append('name', data.fullName);
      if (data.profilePicture && data.profilePicture.length > 0) {
        formData.append('profilePicture', data.profilePicture[0]);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/create-shop`, formData, config);
      
      updateUser(response.data);
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.response?.data?.message || 'Une erreur est survenue lors de la création de la boutique');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header Progress */}
          <div className="bg-gradient-to-r from-gabon-green to-green-700 p-8 text-white text-center">
            <h1 className="text-3xl font-black mb-2">Configurez votre Boutique</h1>
            <div className="flex justify-center items-center gap-4 mt-4 text-sm font-bold">
              <div className={`px-4 py-1 rounded-full ${step === 1 ? 'bg-white text-gabon-green' : 'bg-green-800 text-gray-300'}`}>1. Infos Boutique</div>
              <div className="w-8 h-1 bg-green-600"></div>
              <div className={`px-4 py-1 rounded-full ${step === 2 ? 'bg-white text-gabon-green' : 'bg-green-800 text-gray-300'}`}>2. Infos Vendeur</div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">
            {submitError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center gap-2" role="alert">
                <AlertCircle />
                <p>{submitError}</p>
              </div>
            )}

            {/* STEP 1: SHOP INFO */}
            {step === 1 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Identité */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Store className="text-gabon-green" /> Identité de la Boutique
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">Nom de la Boutique <span className="text-red-500">*</span></label>
                      <input
                        {...register('storeName')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.storeName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition`}
                        placeholder="Ex: Ma Boutique Mode"
                      />
                      {errors.storeName && <p className="text-red-500 text-xs mt-1">{errors.storeName.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FileText size={16} /> Description (Max 200 car.)
                      </label>
                      <textarea
                        {...register('storeDescription')}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.storeDescription ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition`}
                        placeholder="Décrivez votre boutique..."
                      />
                      {errors.storeDescription && <p className="text-red-500 text-xs mt-1">{errors.storeDescription.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="storeCategory" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Briefcase size={16} /> Catégorie Principale <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('storeCategory')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.storeCategory ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition bg-white`}
                      >
                        <option value="">Sélectionner...</option>
                        <option value="Mode">Mode</option>
                        <option value="Électronique">Électronique</option>
                        <option value="Agro">Agro-alimentaire</option>
                        <option value="Artisanat">Artisanat</option>
                        <option value="Auto">Auto & Moto</option>
                        <option value="Maison">Maison & Déco</option>
                      </select>
                      {errors.storeCategory && <p className="text-red-500 text-xs mt-1">{errors.storeCategory.message}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">NIF / SIRET (Optionnel)</label>
                      <input
                        {...register('nif')}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition"
                        placeholder="Numéro d'identification fiscale"
                      />
                    </div>
                  </div>
                </div>

                {/* Visuels */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <ImageIcon className="text-purple-500" /> Visuels
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo (400x150px, Max 2Mo) <span className="text-red-500">*</span></label>
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition hover:bg-gray-50 ${errors.logo ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                        <input
                          type="file"
                          accept="image/*"
                          {...register('logo')}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gabon-green file:text-white hover:file:bg-green-700"
                        />
                        {logoPreview && (
                          <div className="mt-4 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                            <Image src={logoPreview} alt="Logo Preview" width={200} height={75} className="object-contain max-h-full" />
                          </div>
                        )}
                      </div>
                      {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo.message as string}</p>}
                    </div>

                    {/* Banner Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bannière (1200x400px) <span className="text-red-500">*</span></label>
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition hover:bg-gray-50 ${errors.banner ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                        <input
                          type="file"
                          accept="image/*"
                          {...register('banner')}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gabon-green file:text-white hover:file:bg-green-700"
                        />
                        {bannerPreview && (
                          <div className="mt-4 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                            <Image src={bannerPreview} alt="Banner Preview" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                      {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner.message as string}</p>}
                    </div>
                  </div>
                </div>

                {/* Localisation & Contact */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <MapPin className="text-gabon-yellow" /> Localisation & Contact
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville <span className="text-red-500">*</span></label>
                      <select
                        {...register('city')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition bg-white`}
                      >
                        <option value="">Sélectionner une ville</option>
                        <option value="Libreville">Libreville</option>
                        <option value="Port-Gentil">Port-Gentil</option>
                        <option value="Franceville">Franceville</option>
                        <option value="Oyem">Oyem</option>
                        <option value="Moanda">Moanda</option>
                        <option value="Mouila">Mouila</option>
                        <option value="Lambaréné">Lambaréné</option>
                        <option value="Tchibanga">Tchibanga</option>
                        <option value="Koulamoutou">Koulamoutou</option>
                        <option value="Makokou">Makokou</option>
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="quartier" className="block text-sm font-medium text-gray-700 mb-1">Quartier / Adresse <span className="text-red-500">*</span></label>
                      <input
                        {...register('quartier')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.quartier ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition`}
                        placeholder="Ex: Louis, Charbonnages..."
                      />
                      {errors.quartier && <p className="text-red-500 text-xs mt-1">{errors.quartier.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone size={16} /> Téléphone (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition`}
                        placeholder="+241 77 00 00 00"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={validateStep1}
                    className="bg-gabon-green text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-700 transition transform hover:scale-105"
                  >
                    Suivant &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: VENDOR INFO */}
            {step === 2 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <User className="text-blue-500" /> Informations Personnelles
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet <span className="text-red-500">*</span></label>
                      <input
                        {...register('fullName')}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-gabon-green focus:border-transparent outline-none transition`}
                        placeholder="Votre nom complet"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Mail size={16} /> Email (Connexion)
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié ici.</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo de Profil (Optionnel)</label>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border-2 border-white shadow">
                          {profilePreview ? (
                            <Image src={profilePreview} alt="Profile" width={96} height={96} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <User size={40} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            {...register('profilePicture')}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500 mt-2">JPG, PNG ou WebP. Max 2Mo.</p>
                        </div>
                      </div>
                      {errors.profilePicture && <p className="text-red-500 text-xs mt-1">{errors.profilePicture.message as string}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <ShieldCheck className="text-green-600" /> Conditions & Commissions
                  </h2>

                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-sm text-blue-800">
                    <h3 className="font-bold mb-2">Commissions GabonBoutik</h3>
                    <p className="mb-2">En créant votre boutique, vous acceptez le modèle de commission suivant :</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>5% de commission</strong> sur chaque vente réalisée via la plateforme.</li>
                      <li>Pas de frais d'abonnement mensuel (Offre de lancement).</li>
                      <li>Les paiements vous sont reversés chaque semaine via Mobile Money ou Virement.</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      {...register('acceptTerms')}
                      className="mt-1 w-5 h-5 text-gabon-green border-gray-300 rounded focus:ring-gabon-green"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer select-none">
                      J'accepte les <a href="#" className="text-gabon-green font-bold underline">Conditions Générales de Vente (CGV)</a> et la politique de commission de 5% de GabonBoutik.
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms.message}</p>}
                </div>

                <div className="pt-4 flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition"
                  >
                    &larr; Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-gradient-to-r from-gabon-yellow to-orange-500 text-white font-black py-4 px-6 rounded-xl shadow-lg hover:from-yellow-400 hover:to-orange-600 transition transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Validation...' : '🚀 CONFIRMER MA BOUTIQUE'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
}

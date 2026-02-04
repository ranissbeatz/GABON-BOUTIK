"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isVendor: false,
    storeName: '',
    city: '',
    quartier: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const { name, email, password, confirmPassword, isVendor, storeName, city, quartier } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const payload = {
        name,
        email,
        password,
        role: isVendor ? 'vendor' : 'client',
        storeName: isVendor ? storeName : undefined,
        city,
        quartier
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // 1. Register user
      const { data } = await axios.post(`${apiUrl}/api/auth/register`, payload, config);
      
      // 2. Auto-login with NextAuth
      const result = await signIn('credentials', { 
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        // If auto-login fails but registration succeeded, redirect to login
        router.push('/login?registered=true');
      } else {
        // 4. Redirect based on role
        if (isVendor) {
           router.push('/dashboard');
        } else {
           router.push('/');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link href="/login" className="font-medium text-gabon-green hover:text-gabon-blue">
              se connecter à un compte existant
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
           <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gabon-green"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            S'inscrire avec Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou avec email</span>
            </div>
          </div>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                value={name}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                value={email}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4">
                <div className="w-1/2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                    <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="Libreville"
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                        value={city}
                        onChange={handleChange}
                    />
                </div>
                <div className="w-1/2">
                    <label htmlFor="quartier" className="block text-sm font-medium text-gray-700">Quartier</label>
                    <input
                        id="quartier"
                        name="quartier"
                        type="text"
                        placeholder="Louis"
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                        value={quartier}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                value={password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmer mot de passe</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                value={confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center">
              <input
                id="isVendor"
                name="isVendor"
                type="checkbox"
                className="h-4 w-4 text-gabon-green focus:ring-gabon-green border-gray-300 rounded"
                checked={isVendor}
                onChange={handleChange}
              />
              <label htmlFor="isVendor" className="ml-2 block text-sm text-gray-900">
                Je veux vendre sur GabonBoutik
              </label>
            </div>

            {isVendor && (
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Nom de la boutique</label>
                <input
                  id="storeName"
                  name="storeName"
                  type="text"
                  required={isVendor}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-gabon-green focus:border-gabon-green sm:text-sm"
                  value={storeName}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gabon-green hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gabon-green`}
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

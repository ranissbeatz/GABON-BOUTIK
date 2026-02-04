"use client";

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl });
  };

  const handleQuickLogin = (role: string) => {
    if (role === 'vendor') {
      setEmail('jean.koumba@boutique.ga');
      setPassword('password123');
    } else {
      setEmail('client@test.com');
      setPassword('password123');
    }
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connexion à GabonBoutik
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link href="/register" className="font-medium text-gabon-green hover:text-gabon-blue">
              créer un nouveau compte
            </Link>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gabon-green"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Continuer avec Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou avec email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Adresse Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gabon-green focus:border-gabon-green focus:z-10 sm:text-sm"
                  placeholder="Adresse Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gabon-green focus:border-gabon-green focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gabon-green hover:bg-green-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gabon-green`}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t pt-4">
             <p className="text-center text-sm text-gray-500 mb-2">Mode Test - Connexion Rapide</p>
             <div className="flex gap-2">
               <button
                 type="button"
                 onClick={() => handleQuickLogin('vendor')}
                 className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-yellow-50 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
               >
                 Vendeur
               </button>
               <button
                 type="button"
                 onClick={() => handleQuickLogin('client')}
                 className="w-1/2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-blue-50 text-sm font-medium text-blue-700 hover:bg-blue-100"
               >
                 Client
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}

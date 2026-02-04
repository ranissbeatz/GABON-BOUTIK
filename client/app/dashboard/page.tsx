"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'vendor') {
        router.push(`/dashboard-vendeur/${user._id}`);
      }
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mon Compte</h1>
            <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium">Déconnexion</button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Bienvenue, {user.name} !</h2>
            <p className="mb-4">Voici votre tableau de bord client.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded p-4">
                    <h3 className="font-semibold text-lg mb-2">Mes Commandes</h3>
                    <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
                    <Link href="/" className="text-gabon-green hover:underline mt-2 inline-block">Commencer vos achats</Link>
                </div>
                <div className="border rounded p-4">
                    <h3 className="font-semibold text-lg mb-2">Mes Infos</h3>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
                <div className="border rounded p-4">
                    <h3 className="font-semibold text-lg mb-2">Mes Messages</h3>
                    <p className="text-gray-500 mb-2">Discutez avec les vendeurs.</p>
                    <Link href="/messages" className="text-gabon-blue hover:underline">Voir mes messages</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

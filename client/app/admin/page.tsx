"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import axios from 'axios';

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
      totalUsers: 0,
      totalVendors: 0,
      totalOrders: 0,
      totalRevenue: 0
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock fetch stats
  useEffect(() => {
      // In real app, fetch from API
      setStats({
          totalUsers: 150,
          totalVendors: 12,
          totalOrders: 45,
          totalRevenue: 1250000
      });
  }, []);

  if (loading || !user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Administration GabonBoutik</h1>
            <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium bg-white px-4 py-2 rounded shadow">Déconnexion</button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gabon-green">
                <h3 className="text-gray-500 text-sm uppercase font-bold">Revenu Total</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString()} FCFA</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gabon-yellow">
                <h3 className="text-gray-500 text-sm uppercase font-bold">Commandes</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gabon-blue">
                <h3 className="text-gray-500 text-sm uppercase font-bold">Vendeurs</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalVendors}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
                <h3 className="text-gray-500 text-sm uppercase font-bold">Utilisateurs</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vendor Validation Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Vendeurs en attente de validation</h2>
                <div className="space-y-4">
                    {/* Mock Pending Vendors */}
                    {[1, 2].map((i) => (
                        <div key={i} className="flex justify-between items-center p-4 border rounded bg-gray-50">
                            <div>
                                <h4 className="font-bold">Boutique Test {i}</h4>
                                <p className="text-sm text-gray-600">vendeur{i}@test.com</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Accepter</button>
                                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Refuser</button>
                            </div>
                        </div>
                    ))}
                    <p className="text-center text-gray-500 italic mt-4">Aucun autre vendeur en attente.</p>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Dernières Commandes</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">Client</th>
                                <th className="px-4 py-2">Montant</th>
                                <th className="px-4 py-2">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                             {[1, 2, 3].map((i) => (
                                <tr key={i} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">#CMD-00{i}</td>
                                    <td className="px-4 py-3">Client {i}</td>
                                    <td className="px-4 py-3">{(i * 5000).toLocaleString()} FCFA</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">En cours</span>
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

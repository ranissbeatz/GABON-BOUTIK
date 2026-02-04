"use client";
import Header from '@/components/Header';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (payment_intent_client_secret) {
      // In a real app, you might want to retrieve the payment intent status from Stripe here
      // or verify it with your backend.
      setStatus('success');
    } else {
       // If no query param, it might be a mobile money success redirect (which we handled via router.push)
       setStatus('success');
    }
  }, [payment_intent_client_secret]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gabon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Paiement Réussi !</h1>
          <p className="text-gray-600 mb-8">
              Merci pour votre commande. Vous recevrez bientôt un email de confirmation.
          </p>
          
          <div className="space-y-4">
              <Link href="/dashboard" className="block w-full bg-gabon-blue text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors">
                  Voir ma commande
              </Link>
              <Link href="/" className="block w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded hover:bg-gray-50 transition-colors">
                  Continuer mes achats
              </Link>
          </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Chargement...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}

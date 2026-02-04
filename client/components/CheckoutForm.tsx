"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CheckoutForm = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "An unexpected error occurred.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full bg-gabon-blue text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner">Traitement...</div> : `Payer ${amount.toLocaleString()} FCFA`}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-600 text-sm mt-2">{message}</div>}
    </form>
  );
};

export default function StripeWrapper({ amount }: { amount: number }) {
  const [clientSecret, setClientSecret] = useState("");
  const { user } = useAuth();

  useState(() => {
    // Create PaymentIntent as soon as the page loads
    axios.post("http://localhost:5000/api/payment/create-payment-intent", { 
        amount: amount,
        currency: 'xaf' 
    }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("Error creating payment intent", err));
  });

  const appearance = {
    theme: 'stripe' as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="w-full">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm amount={amount} />
        </Elements>
      ) : (
        <div className="flex justify-center p-4">Chargement du paiement sécurisé...</div>
      )}
    </div>
  );
}

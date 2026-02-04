"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import StripeWrapper from '@/components/CheckoutForm';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money'>('mobile_money');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState<'Airtel' | 'Moov'>('Airtel');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Shipping Address State
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    quartier: '',
    phone: ''
  });

  const totalAmount = cartTotal;

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login?redirect=/checkout');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-8 text-center">Chargement...</div>;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
      try {
          // 1. Validate Address
          if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.quartier || !shippingAddress.phone) {
              alert("Veuillez remplir tous les champs de l'adresse de livraison.");
              return;
          }

          setProcessing(true);
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const token = localStorage.getItem('token');

          // 2. Create Order
          const orderData = {
              orderItems: cartItems.map(item => ({
                  product: item._id,
                  name: item.name,
                  qty: item.qty,
                  price: item.price,
                  image: item.image,
                  vendor: item.vendorId
              })),
              shippingAddress,
              paymentMethod: paymentMethod === 'card' ? 'Stripe' : (mobileMoneyProvider === 'Airtel' ? 'AirtelMoney' : 'MoovMoney'),
              itemsPrice: totalAmount,
              shippingPrice: 0, // Calculate shipping if needed
              totalPrice: totalAmount,
          };

          const { data: createdOrder } = await axios.post(`${apiUrl}/api/orders`, orderData, {
              headers: { Authorization: `Bearer ${token}` }
          });

          // 3. Process Payment (Mock or Stripe)
          if (paymentMethod === 'mobile_money') {
             // Simulate Mobile Money Payment
             const paymentRes = await axios.post(`${apiUrl}/api/payment/mobile-money`, {
                  provider: mobileMoneyProvider,
                  phoneNumber,
                  amount: totalAmount
             }, {
                headers: { Authorization: `Bearer ${token}` }
             });

             if (paymentRes.data.success) {
                 // Update order to paid
                 await axios.put(`${apiUrl}/api/orders/${createdOrder._id}/pay`, {
                     id: paymentRes.data.transactionId || `MOCK_PAYMENT_${Date.now()}`,
                     status: 'COMPLETED',
                     update_time: new Date().toISOString(),
                     email_address: user.email
                 }, {
                     headers: { Authorization: `Bearer ${token}` }
                 });

                 clearCart();
                 router.push('/checkout/success');
             }
          } else {
              // Stripe flow usually handled by StripeWrapper, passing orderId
              // For now, let's assume StripeWrapper handles it or we use a simple mock here for 'card' if Stripe isn't fully set up
              alert("Paiement par carte non encore intégré complètement. Utilisez Mobile Money pour le test.");
          }

      } catch (error: any) {
          console.error(error);
          alert(error.response?.data?.message || "Erreur lors de la commande");
      } finally {
          setProcessing(false);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {processing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
                {paymentMethod === 'mobile_money' ? (
                    <>
                        <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-4xl">📱</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Vérifiez votre téléphone</h3>
                        <p className="text-gray-600 mb-6">
                            Une demande de paiement de <span className="font-bold text-gabon-green">{totalAmount.toLocaleString()} FCFA</span> a été envoyée au 
                            <br/><span className="font-mono bg-gray-100 px-2 py-1 rounded ml-1">+241 {phoneNumber}</span>
                        </p>
                        <div className="flex justify-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-gabon-green rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-gabon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gabon-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <p className="text-sm text-gray-400">Veuillez valider la transaction pour finaliser votre commande.</p>
                    </>
                ) : (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gabon-green mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold">Traitement en cours...</h3>
                    </>
                )}
            </div>
        </div>
      )}

      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Caisse</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Adresse de Livraison</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse (Rue, Porte...)</label>
                            <input 
                                type="text" 
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleAddressChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                            <input 
                                type="text" 
                                name="city"
                                value={shippingAddress.city}
                                onChange={handleAddressChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                            <input 
                                type="text" 
                                name="quartier"
                                value={shippingAddress.quartier}
                                onChange={handleAddressChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                            <input 
                                type="text" 
                                name="phone"
                                value={shippingAddress.phone}
                                onChange={handleAddressChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-6">Moyen de paiement</h2>
                    
                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={() => setPaymentMethod('card')}
                            className={`flex-1 py-3 px-4 rounded border-2 font-medium ${paymentMethod === 'card' ? 'border-gabon-blue bg-blue-50 text-gabon-blue' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            Carte Bancaire
                        </button>
                        <button 
                            onClick={() => setPaymentMethod('mobile_money')}
                            className={`flex-1 py-3 px-4 rounded border-2 font-medium ${paymentMethod === 'mobile_money' ? 'border-gabon-green bg-green-50 text-gabon-green' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            Mobile Money
                        </button>
                    </div>

                    {paymentMethod === 'card' && (
                        <div className="p-4 border rounded bg-gray-50 text-center text-gray-500">
                           Module Stripe (En maintenance, utilisez Mobile Money)
                        </div>
                    )}

                    {paymentMethod === 'mobile_money' && (
                        <div className="space-y-6 mt-6">
                            <p className="text-sm text-gray-600">Sélectionnez votre opérateur :</p>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${mobileMoneyProvider === 'Airtel' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="provider" 
                                        className="hidden"
                                        checked={mobileMoneyProvider === 'Airtel'} 
                                        onChange={() => setMobileMoneyProvider('Airtel')}
                                    />
                                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
                                    <span className="font-bold text-gray-800">Airtel Money</span>
                                </label>
                                
                                <label className={`cursor-pointer border-2 rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${mobileMoneyProvider === 'Moov' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <input 
                                        type="radio" 
                                        name="provider" 
                                        className="hidden"
                                        checked={mobileMoneyProvider === 'Moov'} 
                                        onChange={() => setMobileMoneyProvider('Moov')}
                                    />
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">M</div>
                                    <span className="font-bold text-gray-800">Moov Money</span>
                                </label>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Numéro de téléphone ({mobileMoneyProvider})
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+241</span>
                                    <input 
                                        type="tel" 
                                        placeholder={mobileMoneyProvider === 'Airtel' ? "074XXXXXX" : "066XXXXXX"}
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            if (val.length <= 9) setPhoneNumber(val);
                                        }}
                                        className="w-full pl-14 pr-4 py-3 border rounded focus:ring-2 focus:ring-gabon-green focus:border-gabon-green outline-none text-lg tracking-wide"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Vous recevrez une notification sur ce numéro pour valider le paiement.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>
                    <div className="space-y-4 mb-6">
                        {cartItems.map(item => (
                            <div key={item._id} className="flex justify-between text-sm">
                                <span>{item.qty}x {item.name}</span>
                                <span>{(item.price * item.qty).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg mb-6">
                        <span>Total à payer</span>
                        <span className="text-gabon-green">{totalAmount.toLocaleString()} FCFA</span>
                    </div>
                    
                    <button 
                        onClick={placeOrder}
                        disabled={processing || cartItems.length === 0}
                        className="w-full py-3 bg-gabon-green text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                        {processing ? 'Traitement...' : 'Confirmer la commande'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

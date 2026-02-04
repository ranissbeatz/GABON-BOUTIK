const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'xaf' } = req.body;

    // Stripe requires amount in smallest currency unit (e.g., cents)
    // For XAF (FCFA), it's zero-decimal currency, but let's check Stripe docs.
    // XAF is indeed a zero-decimal currency on Stripe usually, but sometimes treated as standard.
    // However, usually API expects integer.
    // Let's assume passed amount is in FCFA integer.
    
    // Note: Stripe might not support XAF directly in all test modes or regions similarly.
    // If XAF is not supported, we might need to convert to USD/EUR or use 'eur'.
    // For this MVP, let's try 'xaf' or fallback to 'eur' if issues.
    // Let's use 'eur' for safety in test mode if XAF fails, but user asked for Gabon Payments.
    // We will stick to what user asked, but handle potential errors.
    
    // Actually, Stripe supports XAF. It is zero-decimal.
    // So 5000 FCFA = 5000 units.
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process Mobile Money Payment (Mock)
// @route   POST /api/payment/mobile-money
// @access  Private
exports.processMobileMoney = (req, res) => {
    const { provider, phoneNumber, amount } = req.body;
    
    // Simulate processing delay
    setTimeout(() => {
        // Simple mock validation
        if (phoneNumber && amount > 0) {
            res.json({
                success: true,
                message: `Paiement de ${amount} FCFA via ${provider} réussi.`,
                transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Détails de paiement invalides"
            });
        }
    }, 2000);
};

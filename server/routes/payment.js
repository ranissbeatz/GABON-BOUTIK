const express = require('express');
const router = express.Router();
const { createPaymentIntent, processMobileMoney } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/mobile-money', protect, processMobileMoney);

module.exports = router;

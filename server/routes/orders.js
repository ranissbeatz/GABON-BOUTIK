const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrderById, 
    updateOrderToPaid, 
    updateOrderStatus,
    getMyOrders,
    getVendorOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .post(protect, createOrder);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/vendor/:vendorId')
    .get(protect, authorize('vendor', 'admin'), getVendorOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/pay')
    .put(protect, updateOrderToPaid);

router.route('/:id/deliver')
    .put(protect, authorize('vendor', 'admin'), updateOrderStatus);

module.exports = router;

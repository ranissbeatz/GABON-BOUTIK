const Order = require('../models/Order');
const mongoose = require('mongoose');
const { orders } = require('../mockData');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log('Using Mock Data for CreateOrder');
            const newOrder = {
                _id: 'mock_order_' + Date.now(),
                user: req.user._id,
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
                isPaid: false,
                isDelivered: false,
                status: 'Pending',
                createdAt: new Date()
            };
            orders.push(newOrder);
            return res.status(201).json(newOrder);
        }

        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
      if (mongoose.connection.readyState !== 1) {
          const order = orders.find(o => o._id === req.params.id);
          if (order) {
              return res.json({ ...order, user: { name: 'Mock User', email: 'mock@test.com' } });
          }
          return res.status(404).json({ message: 'Order not found' });
      }

      const order = await Order.findById(req.params.id).populate('user', 'name email');

      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports.updateOrderToPaid = async (req, res) => {
  try {
      if (mongoose.connection.readyState !== 1) {
          const orderIndex = orders.findIndex(o => o._id === req.params.id);
          if (orderIndex !== -1) {
              orders[orderIndex].isPaid = true;
              orders[orderIndex].paidAt = Date.now();
              orders[orderIndex].paymentResult = {
                  id: req.body.id,
                  status: req.body.status,
                  update_time: req.body.update_time,
                  email_address: req.body.email_address,
              };
              return res.json(orders[orderIndex]);
          }
          return res.status(404).json({ message: 'Order not found' });
      }

      const order = await Order.findById(req.params.id);

      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// @desc    Update order to delivered/status
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin/Vendor
exports.updateOrderStatus = async (req, res) => {
  try {
      if (mongoose.connection.readyState !== 1) {
          const orderIndex = orders.findIndex(o => o._id === req.params.id);
          if (orderIndex !== -1) {
              orders[orderIndex].status = req.body.status || orders[orderIndex].status;
              
              if (req.body.status === 'Delivered') {
                  orders[orderIndex].isDelivered = true;
                  orders[orderIndex].deliveredAt = Date.now();
              }
              return res.json(orders[orderIndex]);
          }
          return res.status(404).json({ message: 'Order not found' });
      }

      const order = await Order.findById(req.params.id);

      if (order) {
        order.status = req.body.status || order.status;
        
        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
      if (mongoose.connection.readyState !== 1) {
          const myOrders = orders.filter(o => o.user === req.user._id);
          return res.json(myOrders);
      }

      const ordersList = await Order.find({ user: req.user._id });
      res.json(ordersList);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor orders
// @route   GET /api/orders/vendor/:vendorId
// @access  Private/Vendor
exports.getVendorOrders = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            // Mock filtering: check if any item in orderItems belongs to vendor
            // Note: In mock data, orderItems might not have vendor populated as object but as string ID.
            // Let's assume vendor ID string.
            const vendorOrders = orders.filter(o => 
                o.orderItems.some(item => item.vendor === req.params.vendorId)
            );
            return res.json(vendorOrders);
        }

        // Find orders where at least one item belongs to this vendor
        // Note: In a real complex app, you might want to aggregate or split orders.
        // For now, we return the whole order if it contains vendor items.
        const ordersList = await Order.find({ 'orderItems.vendor': req.params.vendorId })
                                .populate('user', 'name email')
                                .sort({ createdAt: -1 });
        res.json(ordersList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

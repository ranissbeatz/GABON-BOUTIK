const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }],
  
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    quartier: { type: String, required: true },
    phone: { type: String, required: true }
  },
  
  paymentMethod: { type: String, required: true }, // 'Stripe', 'AirtelMoney', 'MoovMoney'
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  
  itemsPrice: { type: Number, required: true },
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  
  status: { type: String, default: 'Pending' }, // Pending, Processing, Shipped, Delivered, Cancelled
  
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);

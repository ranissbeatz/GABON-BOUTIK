const axios = require('axios');

async function testCheckoutFlow() {
  const apiUrl = 'http://localhost:5000/api';
  
  try {
    // 1. Login
    console.log('Logging in...');
    // Note: authController also needs to support mock data for login!
    // Let's check authController.js first. 
    // If not supported, I might fail here.
    // Assuming it works or I'll fix it.
    const loginRes = await axios.post(`${apiUrl}/auth/login`, {
      email: 'client@gmail.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Logged in, token received.');

    // 2. Create Order
    console.log('Creating Order...');
    const orderData = {
      orderItems: [
        {
          product: 'prod1',
          name: 'Manioc de Léconi (Bâton)',
          qty: 2,
          price: 500,
          image: 'https://placehold.co/600x400?text=Manioc',
          vendor: 'vendor1'
        }
      ],
      shippingAddress: {
        address: 'Rue 123',
        city: 'Libreville',
        quartier: 'Centre',
        phone: '074000000'
      },
      paymentMethod: 'AirtelMoney',
      itemsPrice: 1000,
      shippingPrice: 0,
      totalPrice: 1000
    };

    const createOrderRes = await axios.post(`${apiUrl}/orders`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const orderId = createOrderRes.data._id;
    console.log(`Order Created: ${orderId}`);

    // 3. Pay Order
    console.log('Paying Order...');
    const payRes = await axios.put(`${apiUrl}/orders/${orderId}/pay`, {
      id: 'PAY_ID_123',
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: 'client@gmail.com'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (payRes.data.isPaid) {
        console.log('Order Paid Successfully!');
    } else {
        console.log('Order Payment Failed status update.');
    }

    // 4. Check Vendor Orders
    console.log('Checking Vendor Orders...');
    // We need to login as vendor first or just use the same token if we assume admin or we can just mock login as vendor
    // Let's login as vendor1
    const loginVendorRes = await axios.post(`${apiUrl}/auth/login`, {
        email: 'rose@gabonboutik.com',
        password: 'password123'
    });
    const vendorToken = loginVendorRes.data.token;
    const vendorId = loginVendorRes.data._id;
    console.log(`Logged in as Vendor: ${loginVendorRes.data.name} (${vendorId})`);

    const vendorOrdersRes = await axios.get(`${apiUrl}/orders/vendor/${vendorId}`, {
        headers: { Authorization: `Bearer ${vendorToken}` }
    });
    
    console.log(`Vendor Orders Count: ${vendorOrdersRes.data.length}`);
    const foundOrder = vendorOrdersRes.data.find(o => o._id === orderId);
    if (foundOrder) {
        console.log('Order found in Vendor Dashboard!');
    } else {
        console.log('Order NOT found in Vendor Dashboard.');
    }

  } catch (error) {
    console.error('Test Failed Details:', error);
    if (error.response) {
        console.error('Response Status:', error.response.status);
        console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testCheckoutFlow();

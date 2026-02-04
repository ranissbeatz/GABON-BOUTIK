const axios = require('axios');

async function run() {
  const BASE_URL = 'http://127.0.0.1:5000/api';
  
  // 1. Register Vendor
  const vendorEmail = `vendor_${Date.now()}@test.com`;
  const vendorPassword = 'password123';
  
  console.log('1. Registering Vendor...');
  try {
    const regRes = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test Vendor',
        email: vendorEmail,
        password: vendorPassword,
        role: 'vendor',
        storeName: 'Test Store'
    });
    const regData = regRes.data;
    console.log('Register Response:', regData.token ? 'Success' : regData);
    
    if (!regData.token) {
        console.error('Registration failed');
        return;
    }
    const token = regData.token;
    // Vendor ID might be in user object or directly in response depending on controller
    const vendorId = regData.user ? regData.user._id : regData._id; 

    // 2. Create Product
    console.log('\n2. Creating Product...');
    const productRes = await axios.post(`${BASE_URL}/products`, {
        name: 'Manioc Test',
        description: 'Manioc frais',
        price: 5000,
        category: 'Alimentation',
        stock: 10,
        images: ['http://example.com/image.jpg']
    }, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const productData = productRes.data;
    console.log('Create Product Response:', productData._id ? 'Success' : productData);

    // 3. List Products by Vendor
    console.log('\n3. Listing Products...');
    const listRes = await axios.get(`${BASE_URL}/products?vendor=${vendorId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const listData = listRes.data;
    console.log('List Products Response:', Array.isArray(listData) ? `${listData.length} products found` : listData);
    
    if (Array.isArray(listData) && listData.length > 0) {
        console.log('Verification PASSED');
    } else {
        console.log('Verification FAILED');
    }
  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  }
}

run();

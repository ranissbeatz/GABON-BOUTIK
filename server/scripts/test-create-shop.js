
const axios = require('axios');

const testCreateShop = async () => {
  const email = `vendor-${Date.now()}@example.com`;
  const password = 'password123';
  
  console.log(`1. Registering potential vendor: ${email}`);

  try {
    // 1. Register
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Future Vendor',
      email,
      password,
      role: 'client', // Starts as client
      city: 'Libreville',
      quartier: 'Louis'
    });
    
    const token = regRes.data.token;
    console.log('   Registration successful. Token obtained.');

    // 2. Create Shop (Become Vendor)
    console.log('\n2. Creating Shop...');
    
    // We use a simple JSON payload first to see if it works without files (server allows it, client enforces it)
    // But since we are calling API directly, we can skip files.
    // However, the route uses 'multer' which expects multipart/form-data.
    // Sending JSON to a multer route might fail or multer might just ignore it and pass body.
    // Let's try sending standard JSON first. If it fails, we know we need form-data.
    // Actually, multer usually parses body only if content-type is multipart/form-data.
    // If we send JSON, req.body might be empty or multer might skip.
    // Let's use 'form-data' library if possible, but standard node doesn't have it built-in.
    // We can manually construct a multipart body or just use axios with an object if we don't send files?
    // No, axios serializes to JSON by default.
    // Let's try to mock the behavior by sending x-www-form-urlencoded which multer accepts for text fields?
    // Multer handles multipart/form-data primarily.
    
    // Simplest way: use 'form-data' package if available.
    // If not, we can try to rely on the fact that we might not need to test file upload strictly right now.
    
    // Let's check if form-data is in package.json? No easy way to check without reading.
    // Assuming 'axios' is there.
    
    // Let's try sending JSON. If the server route is strictly expecting multipart, it might hang or fail.
    // But let's try.
    
    const shopData = {
        storeName: `Boutique ${Date.now()}`,
        storeDescription: 'Une super boutique de test',
        storeCategory: 'Mode',
        city: 'Libreville',
        quartier: 'Centre-Ville',
        phone: '+24177889900',
        nif: '123456789'
    };

    // Note: If this fails due to content-type, we'll know.
    const shopRes = await axios.post('http://localhost:5000/api/auth/create-shop', shopData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    console.log('   Shop Created Successfully!');
    console.log('   New Role:', shopRes.data.role);
    console.log('   Store Name:', shopRes.data.storeName);
    
    if (shopRes.data.role === 'vendor') {
        console.log('   TEST PASSED: User is now a vendor.');
    } else {
        console.log('   TEST FAILED: User role is not vendor.');
    }

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 500) {
        console.log('   (Note: 500 might be due to missing multipart boundary if sending JSON to multer)');
    }
  }
};

testCreateShop();

const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/products');
    console.log('Status:', res.status);
    console.log('Data length:', res.data.length);
    if (res.data.length > 0) {
      console.log('First product sample:', JSON.stringify(res.data[0], null, 2));
    } else {
        console.log('No products found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApi();

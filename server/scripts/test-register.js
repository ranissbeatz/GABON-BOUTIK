
const axios = require('axios');

const testRegister = async () => {
  const email = `test-${Date.now()}@example.com`;
  const password = 'password123';
  
  console.log(`Attempting to register user: ${email}`);

  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email,
      password,
      role: 'client',
      city: 'Libreville',
      quartier: 'Centre'
    });

    console.log('Registration Successful!');
    console.log('User ID:', response.data._id);
    console.log('Token received:', !!response.data.token);
    
    // Test Login immediately after to ensure credentials work
    console.log('\nAttempting login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
    });
    
    console.log('Login Successful!');
    console.log('Token received:', !!loginResponse.data.token);

  } catch (error) {
    console.error('Test Failed:', error.response ? error.response.data : error.message);
  }
};

testRegister();

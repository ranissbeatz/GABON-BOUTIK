const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gabonboutik';

console.log('Testing connection to:', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });

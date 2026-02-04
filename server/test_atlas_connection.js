
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(uri)
  .then(() => {
    console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERROR: Could not connect to MongoDB Atlas.');
    console.error('Error details:', err.message);
    process.exit(1);
  });

const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello'));

app.listen(5001, () => {
  console.log('Test server running on 5001');
  // Keep alive
  setInterval(() => {
    console.log('Heartbeat');
  }, 5000);
});

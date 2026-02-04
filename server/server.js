const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const path = require('path');

// Socket.io Logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation: ${conversationId}`);
  });

  // Send message
  socket.on('send_message', (data) => {
    socket.to(data.conversationId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Middleware
app.use(limiter);
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gabonboutik';
mongoose.set('bufferCommands', false); // Disable buffering to fail fast if no connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error (Running in Mock Mode):', err.message));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/chat', require('./routes/chat'));

// New Routes requested
app.use('/api/boutiques', require('./routes/boutiques'));
app.use('/api/produits', require('./routes/produits'));

app.get('/', (req, res) => {
  res.send('GabonBoutik API Running');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

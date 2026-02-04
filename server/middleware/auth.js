const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const { users } = require('../mockData');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (mongoose.connection.readyState !== 1) {
          const user = users.find(u => u._id === decoded.id);
          if (user) {
              req.user = user; // Mock user object
              req.user.id = user._id; // Ensure id is accessible
              return next();
          } else {
              throw new Error('User not found in mock data');
          }
      }

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };

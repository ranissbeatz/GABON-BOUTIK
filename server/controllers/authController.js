const User = require('../models/User');
const Boutique = require('../models/Boutique');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { users } = require('../mockData');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role, storeName, phone, city, quartier } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client',
      storeName: role === 'vendor' ? storeName : undefined,
      phone,
      address: { city, quartier }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
     // Check if DB is connected
     if (mongoose.connection.readyState !== 1) {
        console.log('Using Mock Data for Login');
        const user = users.find(u => u.email === email);
        
        if (user && user.password === password) { // Simple check for mock
             return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeName: user.storeName,
                token: generateToken(user._id),
              });
        } else {
             return res.status(401).json({ message: 'Invalid email or password' });
        }
    }

     // Check if DB is connected
     if (mongoose.connection.readyState !== 1) {
        console.log('Using Mock Data for Login');
        const user = users.find(u => u.email === email);
        
        if (user && user.password === password) { // Simple check for mock
             return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeName: user.storeName,
                token: generateToken(user._id),
              });
        } else {
             return res.status(401).json({ message: 'Invalid email or password' });
        }
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Fetch boutique info if vendor
      let boutiqueInfo = {};
      if (user.role === 'vendor') {
         const boutique = await Boutique.findOne({ vendeurId: user._id });
         if (boutique) {
             boutiqueInfo = {
                 storeName: boutique.nom,
                 storeLogo: boutique.logo,
                 storeBanner: boutique.banniere,
                 storeDescription: boutique.description
             };
         } else {
             // Fallback to user fields
             boutiqueInfo = {
                 storeName: user.storeName,
                 storeLogo: user.storeLogo,
                 storeBanner: user.storeBanner
             };
         }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...boutiqueInfo,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create shop (Become a vendor)
// @route   PUT /api/auth/create-shop
// @access  Private
exports.createShop = async (req, res) => {
  const { storeName, storeDescription, phone, city, quartier, storeCategory, nif, name } = req.body;

  let storeLogo = '';
  let storeBanner = '';
  let profilePicture = '';

  const getFilePath = (file) => file.path || `/uploads/${file.filename}`;

  if (req.files) {
    if (req.files.logo) {
        storeLogo = getFilePath(req.files.logo[0]);
    }
    if (req.files.banner) {
        storeBanner = getFilePath(req.files.banner[0]);
    }
    if (req.files.profilePicture) {
        profilePicture = getFilePath(req.files.profilePicture[0]);
    }
  }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if user already has a boutique
      let boutique = await Boutique.findOne({ vendeurId: user._id });
      if (boutique) {
          return res.status(400).json({ message: 'Vous avez déjà une boutique' });
      }

      // Create Boutique Document
      boutique = await Boutique.create({
        nom: storeName,
        description: storeDescription,
        categorie: storeCategory,
        ville: city,
        adresse: quartier,
        whatsapp: phone,
        vendeurId: user._id,
        logo: storeLogo,
        banniere: storeBanner
      });

      // Update User Role and Info
      user.role = 'vendor';
      if (name) user.name = name;
      user.storeName = storeName; // Legacy support
      user.storeDescription = storeDescription; // Legacy support
      user.storeCategory = storeCategory; // Legacy support
      if (storeLogo) user.storeLogo = storeLogo;
      if (storeBanner) user.storeBanner = storeBanner;
      if (profilePicture) user.profilePicture = profilePicture;
      user.nif = nif || user.nif;
      user.phone = phone || user.phone;
      user.address = {
        city: city || user.address.city,
        quartier: quartier || user.address.quartier
      };

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        storeName: updatedUser.storeName,
        storeLogo: updatedUser.storeLogo,
        profilePicture: updatedUser.profilePicture,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Ce nom de boutique est déjà utilisé' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    let boutiqueInfo = {};
    if (user.role === 'vendor') {
        const boutique = await Boutique.findOne({ vendeurId: user._id });
        if (boutique) {
            boutiqueInfo = {
                storeName: boutique.nom,
                storeLogo: boutique.logo,
                storeBanner: boutique.banniere,
                storeDescription: boutique.description
            };
        } else {
             // Fallback
             boutiqueInfo = {
                 storeName: user.storeName,
                 storeLogo: user.storeLogo,
                 storeBanner: user.storeBanner
             };
        }
    }

    res.json({
        ...user.toObject(),
        ...boutiqueInfo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

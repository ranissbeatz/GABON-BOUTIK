const express = require('express');
const router = express.Router();
const { register, login, getMe, createShop } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../utils/validationSchemas');
const { upload } = require('../config/cloudinary');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/create-shop', protect, upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'banner', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]), createShop);
router.get('/me', protect, getMe);

module.exports = router;

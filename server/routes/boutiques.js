const express = require('express');
const router = express.Router();
const { createBoutique, getBoutiqueById, updateBoutique, getAllBoutiques } = require('../controllers/boutiqueController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBoutiqueSchema } = require('../utils/validationSchemas');
const { upload } = require('../config/cloudinary');

// POST /api/boutiques/creer
router.post('/creer', protect, upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'banner', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]), validate(createBoutiqueSchema), createBoutique);

// GET /api/boutiques/[id]
router.get('/:id', getBoutiqueById);

// PUT /api/boutiques/[id]/update
router.put('/:id/update', protect, upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'banner', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]), updateBoutique);

// GET /api/boutiques (publishing homepage)
router.get('/', getAllBoutiques);

module.exports = router;

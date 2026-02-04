const Boutique = require('../models/Boutique');
const User = require('../models/User');

// @desc    Créer une boutique (Devenir vendeur)
// @route   POST /api/boutiques/creer
// @access  Private
exports.createBoutique = async (req, res) => {
    const { storeName, storeDescription, phone, city, quartier, storeCategory, nif } = req.body;

    let storeLogo = '';
    let storeBanner = '';
    // Profile picture is user specific, but user wanted "logo" and "banniere" in Boutique model
    // User interface provided: logo: string // URL Cloudinary, banniere: string

    if (req.files) {
        if (req.files.logo) {
            const file = req.files.logo[0];
            storeLogo = (file.path && (file.path.startsWith('http') || file.path.startsWith('https'))) 
                ? file.path 
                : `/uploads/${file.filename}`;
        }
        if (req.files.banner) {
            const file = req.files.banner[0];
            storeBanner = (file.path && (file.path.startsWith('http') || file.path.startsWith('https'))) 
                ? file.path 
                : `/uploads/${file.filename}`;
        }
        // If profilePicture is sent, we might still update User model or ignore for Boutique model as it's not in the interface
    }

    try {
        // Check if user already has a boutique
        const existingBoutique = await Boutique.findOne({ vendeurId: req.user._id });
        if (existingBoutique) {
            return res.status(400).json({ message: 'Vous avez déjà une boutique' });
        }

        // Create Boutique
        const boutique = await Boutique.create({
            nom: storeName,
            description: storeDescription,
            categorie: storeCategory,
            ville: city,
            adresse: quartier, // Mapping 'quartier' to 'adresse' as per schema discussion
            whatsapp: phone,
            vendeurId: req.user._id,
            logo: storeLogo || undefined,
            banniere: storeBanner || undefined,
            // nif is not in the TS interface but was in previous code. 
            // We'll stick to the requested TS interface fields mostly, but Mongoose allows strict:false if needed.
            // The TS interface didn't list NIF, but it's likely needed for real apps. I'll omit if not in schema or add to schema if I want to keep it.
            // Schema has it? No.
        });

        // Update User role
        const user = await User.findById(req.user._id);
        if (user) {
            user.role = 'vendor';
            // We can still keep legacy fields on User for now or clear them
            user.storeName = storeName; 
            user.storeLogo = storeLogo;
            await user.save();
        }

        res.status(201).json(boutique);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir les détails d'une boutique
// @route   GET /api/boutiques/:id
// @access  Public
exports.getBoutiqueById = async (req, res) => {
    try {
        // Try to find by Boutique ID first
        let boutique = await Boutique.findById(req.params.id).populate('vendeurId', 'name email');
        
        if (!boutique) {
            // Fallback: Check if ID is a User ID (Vendor ID)
             boutique = await Boutique.findOne({ vendeurId: req.params.id }).populate('vendeurId', 'name email');
        }

        if (boutique) {
            res.json(boutique);
        } else {
            // Fallback for legacy users who might not have a Boutique document yet
            const user = await User.findById(req.params.id).select('-password');
            if (user && user.role === 'vendor') {
                // Return a structure matching Boutique interface constructed from User
                return res.json({
                    _id: user._id, // Using user ID as pseudo boutique ID
                    nom: user.storeName,
                    description: user.storeDescription,
                    logo: user.storeLogo,
                    banniere: user.storeBanner,
                    vendeurId: user._id,
                    ville: user.address?.city,
                    adresse: user.address?.quartier,
                    whatsapp: user.phone,
                    etat: 'active',
                    isLegacy: true
                });
            }
            res.status(404).json({ message: 'Boutique non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour une boutique
// @route   PUT /api/boutiques/:id/update
// @access  Private
exports.updateBoutique = async (req, res) => {
    try {
        let boutique = await Boutique.findById(req.params.id);
        
        // If not found by ID, try finding by vendor ID (User ID)
        if (!boutique) {
            boutique = await Boutique.findOne({ vendeurId: req.params.id });
        }
        
        // If still not found, check if it's a legacy user request (User ID passed as param)
        // and we need to Create or Update the User model
        if (!boutique) {
             // If user is owner, maybe we should create the boutique doc now?
             // For now, let's assume we work with Boutique docs. 
             // If user passes User ID and has no Boutique doc, we might need to migrate or fail.
             // Let's fail for now unless it matches req.user._id
             if (req.params.id === req.user._id.toString()) {
                 // Try to find boutique by logged in user again just in case
                 boutique = await Boutique.findOne({ vendeurId: req.user._id });
             }
        }

        if (!boutique) {
            return res.status(404).json({ message: 'Boutique non trouvée' });
        }

        // Verify ownership
        if (boutique.vendeurId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
             return res.status(401).json({ message: 'Non autorisé à modifier cette boutique' });
        }

        const { storeName, storeDescription, phone, city, quartier, storeCategory } = req.body;

        if (storeName) boutique.nom = storeName;
        if (storeDescription) boutique.description = storeDescription;
        if (storeCategory) boutique.categorie = storeCategory;
        if (phone) boutique.whatsapp = phone;
        if (city) boutique.ville = city;
        if (quartier) boutique.adresse = quartier;

        // Handle file uploads
        if (req.files) {
            if (req.files.logo) {
                const file = req.files.logo[0];
                boutique.logo = (file.path && (file.path.startsWith('http') || file.path.startsWith('https'))) 
                    ? file.path 
                    : `/uploads/${file.filename}`;
            }
            if (req.files.banner) {
                const file = req.files.banner[0];
                boutique.banniere = (file.path && (file.path.startsWith('http') || file.path.startsWith('https'))) 
                    ? file.path 
                    : `/uploads/${file.filename}`;
            }
        }

        const updatedBoutique = await boutique.save();
        res.json(updatedBoutique);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lister toutes les boutiques
// @route   GET /api/boutiques
// @access  Public
exports.getAllBoutiques = async (req, res) => {
    try {
        const boutiques = await Boutique.find({ etat: 'active' });
        res.json(boutiques);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

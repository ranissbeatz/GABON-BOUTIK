const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: [true, 'Le nom de la boutique est requis'],
    unique: true,
    trim: true
  },
  slug: { 
    type: String, 
    unique: true,
    lowercase: true,
    index: true
  },
  description: { 
    type: String,
    required: [true, 'Une description est requise']
  },
  logo: { 
    type: String,
    default: 'no-photo.jpg'
  },
  banniere: { 
    type: String,
    default: 'no-banner.jpg'
  },
  categorie: { 
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: [
      'Alimentation', 
      'Mode', 
      'Électronique', 
      'Beauté', 
      'Maison', 
      'Services', 
      'Agro',
      'Artisanat',
      'Auto',
      'Autre'
    ]
  },
  ville: { 
    type: String,
    required: [true, 'La ville est requise']
  },
  adresse: { 
    type: String, // Quartier/Précisions
    required: [true, 'L\'adresse est requise']
  },
  whatsapp: { 
    type: String,
    required: [true, 'Le numéro WhatsApp est requis']
  },
  vendeurId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true // Un utilisateur ne peut avoir qu'une seule boutique pour le moment
  },
  produits: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  etat: { 
    type: String, 
    enum: ['en_attente', 'active', 'suspendue'],
    default: 'en_attente'
  },
  abo: { 
    type: String, 
    enum: ['gratuit', 'premium', 'spotlight'],
    default: 'gratuit'
  },
  stats: {
    ventes: { type: Number, default: 0 },
    ca: { type: Number, default: 0 }
  },
  creeLe: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware pour générer le slug avant la validation
BoutiqueSchema.pre('validate', async function(next) {
  if (this.nom && (!this.slug || this.isModified('nom'))) {
    let baseSlug = this.nom
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // Check for uniqueness
    let slug = baseSlug;
    let counter = 1;
    let exists = await mongoose.models.Boutique.findOne({ slug: slug, _id: { $ne: this._id } });
    
    while (exists) {
        slug = `${baseSlug}-${counter}`;
        exists = await mongoose.models.Boutique.findOne({ slug: slug, _id: { $ne: this._id } });
        counter++;
    }
    
    this.slug = slug;
  }
  next();
});

module.exports = mongoose.model('Boutique', BoutiqueSchema);

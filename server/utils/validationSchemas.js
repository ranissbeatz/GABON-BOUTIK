const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['client', 'vendor', 'admin']).optional(),
  phone: z.string().optional(),
  city: z.string().optional(),
  quartier: z.string().optional(),
  storeName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const createBoutiqueSchema = z.object({
  storeName: z.string().min(3, 'Le nom de la boutique doit contenir au moins 3 caractères'),
  storeDescription: z.string().min(10, 'La description doit être plus détaillée'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  city: z.string().min(1, 'La ville est requise'),
  quartier: z.string().min(1, 'Le quartier est requis'),
  storeCategory: z.string().min(1, 'La catégorie est requise'),
  nif: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createBoutiqueSchema,
};

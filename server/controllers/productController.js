const Product = require('../models/Product');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const { products } = require('../mockData');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        console.log('Using Mock Data for GetProducts');
        let filtered = [...products];
        if (req.query.vendor) {
            filtered = filtered.filter(p => p.vendor === req.query.vendor);
        }
        if (req.query.category) {
            filtered = filtered.filter(p => p.category === req.query.category);
        }
        // Mock populate
        filtered = filtered.map(p => ({
            ...p,
            vendor: { _id: p.vendor, name: 'Mock Vendor', storeName: 'Mock Store' }
        }));
        return res.json(filtered);
    }

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const vendor = req.query.vendor ? { vendor: req.query.vendor } : {};
    
    // Price Filter
    let priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter = { price: {} };
      if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // Rating Filter
    let ratingFilter = {};
    if (req.query.rating) {
      ratingFilter = { rating: { $gte: Number(req.query.rating) } };
    }

    // Sorting
    let sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc': sort = { price: 1 }; break;
        case 'price_desc': sort = { price: -1 }; break;
        case 'rating': sort = { rating: -1 }; break;
        case 'newest': sort = { createdAt: -1 }; break;
        default: sort = { createdAt: -1 };
      }
    } else {
        sort = { createdAt: -1 };
    }
    
    // Pagination
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;

    const count = await Product.countDocuments({ ...keyword, ...category, ...vendor, ...priceFilter, ...ratingFilter });
    
    const productList = await Product.find({ ...keyword, ...category, ...vendor, ...priceFilter, ...ratingFilter })
      .populate('vendor', 'name storeName')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
      
    res.json({ products: productList, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = await Review.findOne({
        product: req.params.id,
        user: req.user._id,
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = new Review({
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
        product: req.params.id,
      });

      await review.save();

      // Recalculate rating
      const reviews = await Review.find({ product: req.params.id });
      product.numReviews = reviews.length;
      product.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) /
        reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Vendor/Admin
exports.deleteProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        const index = products.findIndex(p => p._id === req.params.id);
        if (index !== -1) {
             const product = products[index];
             if (product.vendor !== (req.user.id || req.user._id) && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized' });
             }
             products.splice(index, 1);
             return res.json({ message: 'Product removed' });
        }
        return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }
      
      await product.deleteOne();

      // Remove product from boutique
      await Boutique.findOneAndUpdate(
        { vendeurId: req.user._id },
        { $pull: { produits: req.params.id } }
      );

      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vendor products
// @route   GET /api/products/vendor/:id
// @access  Public
exports.getVendorProducts = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const vendorProducts = products.filter(p => p.vendor === req.params.id);
            return res.json(vendorProducts);
        }

        const productList = await Product.find({ vendor: req.params.id });
        res.json(productList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
        const product = products.find(p => p._id === req.params.id);
        if (product) {
            return res.json({
                ...product,
                vendor: { _id: product.vendor, name: 'Mock Vendor', storeName: 'Mock Store' }
            });
        }
        return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id).populate('vendor', 'name storeName email');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor/Admin
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, variations } = req.body;
    
    // Handle image uploads
    let productImages = [];
    if (req.files && req.files.length > 0) {
        productImages = req.files.map(file => {
            // Check if path is a URL (Cloudinary) or local path
            if (file.path && (file.path.startsWith('http') || file.path.startsWith('https'))) {
                return file.path;
            }
            // Local fallback
            return `/uploads/${file.filename}`;
        });
    } else if (req.body.images) {
        // Fallback if images are passed as URLs strings
        productImages = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
        // Default image
        productImages = ['https://placehold.co/600x400?text=No+Image'];
    }

    if (mongoose.connection.readyState !== 1) {
        const newProduct = {
            _id: 'mock_prod_' + Date.now(),
            name,
            price,
            description,
            images: productImages,
            category,
            stock,
            variations,
            vendor: req.user.id || req.user._id // Handle both cases
        };
        products.push(newProduct);
        return res.status(201).json(newProduct);
    }

    const product = new Product({
      name,
      price,
      description,
      images: productImages,
      category,
      stock,
      variations: variations ? JSON.parse(variations) : [], // Expecting JSON string if from FormData
      vendor: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Vendor/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, stock, variations } = req.body;

    if (mongoose.connection.readyState !== 1) {
        // ... Mock update logic ...
        const index = products.findIndex(p => p._id === req.params.id);
        if (index !== -1) {
             const product = products[index];
             if (product.vendor !== (req.user.id || req.user._id) && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized' });
             }
             
             let newImages = [];
             if (req.files && req.files.length > 0) {
                 newImages = req.files.map(file => file.path || `/uploads/${file.filename}`);
             }
             
             let finalImages = product.images;
             if (req.body.images !== undefined) {
                 let kept = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
                 kept = kept.filter(img => img && typeof img === 'string' && img.length > 0);
                 finalImages = [...kept, ...newImages];
             } else if (newImages.length > 0) {
                 finalImages = [...finalImages, ...newImages];
             }

             products[index] = {
                 ...product,
                 name: name || product.name,
                 price: price || product.price,
                 description: description || product.description,
                 images: finalImages,
                 category: category || product.category,
                 stock: stock || product.stock,
                 variations: variations ? JSON.parse(variations) : product.variations
             };
             return res.json(products[index]);
        }
        return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (variations) product.variations = JSON.parse(variations);

    let newImages = [];
    if (req.files && req.files.length > 0) {
        newImages = req.files.map(file => file.path || `/uploads/${file.filename}`);
    }

    if (req.body.images !== undefined) {
        let kept = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        kept = kept.filter(img => img && typeof img === 'string' && img.length > 0);
        product.images = [...kept, ...newImages];
    } else if (newImages.length > 0) {
        product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

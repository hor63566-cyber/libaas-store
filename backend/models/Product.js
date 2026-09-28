// ------------------------------------------------------------
// Product model
// One document per sellable item in the Libaas store.
// ------------------------------------------------------------

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        // Unstitched
        'unstitched-summer',
        'unstitched-embroidered',
        'unstitched-printed',
        'unstitched-lawn',
        // Ready to wear / Pret
        'pret-embroidered',
        'pret-printed',
        'pret-solids',
        'pret-coords',
        'pret-festive',
        'pret-kurtis',
        'pret-bottoms',
        'men-pret',
        // Collections
        'signature',
        'silk',
        'western',
        // Fragrances
        'fragrance-men',
        'fragrance-women',
        // Accessories
        'acc-bags',
        'acc-footwear',
        'acc-jewelry',
        'acc-shawls',
        'acc-scarves',
        'acc-sunglasses',
        'acc-hair',
        'acc-watches',
        'acc-mufflers',
        'acc-dupattas',
      ],
    },
    sku: {
      type: String,
      default: '',
      trim: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    fabric: {
      type: String,
      default: '',
    },
    care: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// Auto-generate a URL-friendly slug from the name when missing.
productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

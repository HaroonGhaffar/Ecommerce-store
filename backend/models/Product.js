const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    ratings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

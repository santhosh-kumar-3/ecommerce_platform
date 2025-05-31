const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  makingPrice: { type: Number },
  mainImage: { type: String, required: true }, 
  subImages: {
    type: [String],
    validate: [arr => arr.length >= 2 && arr.length <= 4, 'SubImages must have 2 to 4 items'],
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

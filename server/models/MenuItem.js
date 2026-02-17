const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    isAvailable: { type: Boolean, default: true },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);

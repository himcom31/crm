const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    Category: { type: String, required: true },
    Mature_Amount: { type: Number, required: true },
    Date_Mature: { type: Date, required: true },

    // YAHAN RELATION HAI: User Model ki ID store hogi
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Ye wahi naam hona chahiye jo User model mein export kiya hai
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
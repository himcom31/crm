const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', 
        required: true
    },
    investmentDate: {
        type: Date,
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent', 
        required: true
    },
    commissionPercentage: {
        type: Number,
        required: true
    },
    commissionAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number, // Product ka actual price us waqt kya tha
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Admin jisne entry ki
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', SaleSchema);
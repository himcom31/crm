const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    mobile: { type: String },
    Date_of_Birth: { type: Date },
    Date_of_Investment: { type: Date },
    Pan_card_Number:{ type: String },
    Adhar_card_Number:{ type: String },
    Bank_Account_Number:{ type: String },
    IFSC_Code:{ type: String },
    Bank_Account_Name:{ type: String },
    Bank_Branch:{ type: String },
    role: { type: String, enum: ['admin', 'client'], default: 'client' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
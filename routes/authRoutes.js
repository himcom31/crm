const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 

// @route   POST /api/auth/login
router.post('/login', login);

// @route   POST /api/auth/register-admin
router.post('/register-admin', async (req, res) => {
    try {
        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        // User creation
        const user = await User.create({
            ...req.body,
            password: hashedPassword,
            role: 'admin'
        });

    
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile
            }
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
});


module.exports = router;
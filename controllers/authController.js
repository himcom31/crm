const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    //console.log("Login Attempt:", { email, role,password }); // Terminal mein check karein
    try {
        // 1. Check user exists with the specific role
        const user = await User.findOne({ email, role });
        if (!user) return res.status(404).json({ message: "User not found with this role" });

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 3. Generate JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                mobile: user.mobile,
                
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
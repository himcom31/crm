const nodemailer = require('nodemailer');

const sendEmail = async (email, password, name) => {
    // Transporter configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Aapka Gmail
            pass: process.env.EMAIL_PASS  // Aapka 16-digit App Password
        }
    });

    // Email content
    const mailOptions = {
        from: `"Chaudhary & Sons Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Dashboard Login Credentials',
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
                <h2 style="color: #4CAF50;">Welcome, ${name}!</h2>
                <p>Your password is created:</p>
                <p><strong>Login Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <p style="color: #888; font-size: 12px;">Security ke liye login karne ke baad apna password change kar lein.</p>
            </div>
        `
    };

    // Send Mail
    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
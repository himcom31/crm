const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
// adminController.js ke top par ye add karein
const Sales = require('../models/Sale'); // Path check kar lein ki aapka Sales model kahan hai
//const User = require('../models/User');   // Agar User ka bhi error aaye toh ise bhi add karein
 const Agent=require('../models/Agent');

// @desc    Create a new client & send credentials via email
// @route   POST /api/admin/create-client
exports.createClient = async (req, res) => {
    const { name, email, mobile, password,
        Date_of_Birth, Date_of_Investment,
        Pan_card_Number, Adhar_card_Number, Bank_Account_Number,
        IFSC_Code, Bank_Account_Name, Bank_Branch } = req.body;

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // 2. Hash the password for database security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Save Client to Database
        const newClient = new User({
            name,
            email,
            mobile,
            Date_of_Birth,
            Date_of_Investment,
            Pan_card_Number,
            Adhar_card_Number,
            Bank_Account_Number,
            IFSC_Code,
            Bank_Account_Name,
            Bank_Branch,
            password: hashedPassword,
            role: 'client'
        });

        await newClient.save();

        // 4. Send Email with PLAIN PASSWORD (not hashed)
        let emailStatus = "Sent Successfully";
        try {
            // Hum password (plain text) bhej rahe hain taaki client login kar sake
            await sendEmail(email, password, name);
            console.log(`✅ Email sent successfully to: ${email}`);
        } catch (mailErr) {
            emailStatus = "Failed to send email";
            console.error("❌ Nodemailer Error:", mailErr.message);
            // Note: Hum error return nahi kar rahe kyunki user DB mein ban chuka hai
        }

        res.status(201).json({
            success: true,
            message: `Client created. Email Status: ${emailStatus}`,
            client: {
                id: newClient._id,
                name: newClient.name,
                email: newClient.email
            }
        });

    } catch (err) {
        console.error("❌ Server Error:", err.message);
        res.status(500).json({ success: false, message: "Error creating client", error: err.message });
    }
};

// @desc    Get all clients for Admin view
// @route   GET /api/admin/clients
exports.getAllClients = async (req, res) => {
    try {
        // Sirf un users ko fetch karein jinka role 'client' hai
        // .select('-password') se password field hide ho jayegi security ke liye
        const clients = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: clients.length,
            data: clients
        });
    } catch (err) {
        console.error("❌ Fetching Clients Error:", err.message);
        res.status(500).json({ success: false, message: "Error fetching clients" });
    }
};

exports.updateClient = async (req, res) => {
    try {
        let updateData = { ...req.body };

        // Agar password update ho raha hai, toh use dobara hash karna padega
        if (updateData.password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(updateData.password, salt);
        } else {
            // Password blank nahi bhejna DB mein warna hashed password kharab ho jayega
            delete updateData.password;
        }

        const updatedClient = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, 
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedClient) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        res.status(200).json({
            success: true,
            message: "Client updated successfully",
            data: updatedClient
        });

    } catch (err) {
        console.error("❌ Update Error:", err.message);
        res.status(500).json({ success: false, message: "Error updating client" });
    }
};

// 4. ✅ DELETE CLIENT
// @route   DELETE /api/admin/client/:id
exports.deleteClient = async (req, res) => {
    try {
        const client = await User.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        // Security Check: Kahin galti se Admin delete na ho jaye
        if (client.role === 'admin') {
            return res.status(403).json({ success: false, message: "Cannot delete an admin account" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Client deleted successfully from database"
        });

    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).json({ success: false, message: "Error deleting client" });
    }
};

exports.dashboard = async (req, res) => {
  try {
    // 1. Total Gross Revenue (Sum of totalAmount from Sales)
    const totalSales = await Sales.aggregate([
      { 
        $group: { 
          _id: null, 
          total: { $sum: "$totalAmount" } 
        } 
      }
    ]);

    // 2. Total Agents Count (Role base filter)
    // Maan lete hain ki aapka Agent data 'User' model mein 'role' field ke saath hai
    const totalAgents = await Agent.countDocuments();

    // 3. Total Clients Count
    const totalClients = await User.countDocuments({role:'client'}); // 'Client' aapka model name hai

    // 4. Monthly Revenue Data (Graph ke liye)
    const monthlyRevenue = await Sales.aggregate([
      {
        $group: {
          _id: { $month: "$investmentDate" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Month names array for cleaner Graph Labels
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // 5. Top Agents Ranking
    const topAgents = await Sales.aggregate([
      {
        $group: {
          _id: "$agent", 
          revenue: { $sum: "$totalAmount" },
          deals: { $sum: 1 }
        }
      },
      { $lookup: { from: "agents", localField: "_id", foreignField: "_id", as: "agentData" } },
      { $unwind: "$agentData" },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // Final Response sending all 3 card values
    res.json({
      totalRevenue: totalSales[0]?.total || 0,
      totalAgents: totalAgents || 0,
      totalClients: totalClients || 0,
      chartData: monthlyRevenue.map(item => ({
        name: monthNames[item._id - 1], // "Month 1" ki jagah "Jan" dikhega
        revenue: item.revenue
      })),
      agents: topAgents.map(a => ({
        name: a.agentData.name,
        revenue: a.revenue,
        deals: a.deals
      }))
    });

  } catch (err) {
    console.error("Dashboard Error Details:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Logged-in Admin Profile
exports.getAdminProfile = async (req, res) => {
  try {
    // req.user.id from authMiddleware s=
    const admin = await User.findById(req.user.id).select('-password'); 
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
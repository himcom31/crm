const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");

// ✅ 1. Create Agent (POST /api/admin/agent/form)
exports.createAgent = async (req, res) => {
  try {
    const { name, email, phone, role, status, Emr_phone } = req.body;

    // Check duplicate
    const exists = await Agent.findOne({ email });
    if (exists) return res.status(400).json({ message: "Agent already exists with this email" });

    // Hash default password
    const hashedPassword = await bcrypt.hash("Agent@123", 10);

    const newAgent = new Agent({
      name,
      email,
      phone,
      role,
      status,
      Emr_phone
      
    });

    await newAgent.save();
    res.status(201).json({ message: "Agent added to CRM", agent: newAgent });
  } catch (error) {
    res.status(500).json({ message: "Database Error", error: error.message });
  }
};

// ✅ 2. Get All Agents (GET /api/admin/agent/form)
exports.getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agents" });
  }
};

// ✅ 3. Delete Agent (DELETE /api/admin/agent/form/:id)

// controllers/agentController.js

exports.deleteAgentByEmail = async (req, res) => {
  try {
    const { email } = req.params; // URL se email nikalenge

    // findOneAndDelete: Ye email match karega aur delete kar dega
    const deletedAgent = await Agent.findOneAndDelete({ email: email });

    if (!deletedAgent) {
      return res.status(404).json({ message: "Is email ka koi agent nahi mila!" });
    }

    res.json({ message: `Agent with email ${email} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Delete karne mein error aayi" });
  }
};



exports.updateAgent = async (req, res) => {
  try {
    const { email } = req.params; 
    const updateData = req.body;  

    
    
    const updatedAgent = await Agent.findOneAndUpdate(
      { email: email }, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent nahi mila!" });
    }

    res.json({ message: "Agent details updated successfully", agent: updatedAgent });
  } catch (error) {
    res.status(500).json({ message: "Update karne mein error aayi", error: error.message });
  }
};


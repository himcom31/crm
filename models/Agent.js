const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  Emr_phone:{ type: String, required: true },
  role: { 
    type: String, 
    required: true,
    default: "Sales Agent" 
  },
  status: { 
    type: String, 
    enum: ["Active", "On Leave", "Inactive"], 
    default: "Active" 
  },
  // Agar aap agent ko login dena chahte hain toh password rakhein
  
}, { timestamps: true });

module.exports = mongoose.model("Agent", AgentSchema);
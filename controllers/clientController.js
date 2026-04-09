const Sales = require('../models/Sale');
const mongoose = require('mongoose');
const User = require('../models/User');  

exports.getClientPurchases = async (req, res) => {
    try {
        
        const clientId = req.user.id; 

        const purchases = await Sales.aggregate([
            { 
                
                $match: { client: new mongoose.Types.ObjectId(clientId) } 
            },
            {
                
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                
                $lookup: {
                    from: "agents",
                    localField: "agent",
                    foreignField: "_id",
                    as: "agentDetails"
                }
            },
            { $unwind: "$agentDetails" },
            {
                
                $project: {
                    _id: 1,
                    productName: "$productDetails.name",
                    totalAmount: 1,
                    investmentDate: 1,
                    agentName: "$agentDetails.name",
                    
                    expiryDate: { 
                        $dateAdd: { 
                            startDate: "$investmentDate", 
                            unit: "year", 
                            amount: 1 
                        } 
                    },
                    status: {
                        $cond: {
                            if: { $gt: [ { $dateAdd: { startDate: "$investmentDate", unit: "year", amount: 1 } }, new Date() ] },
                            then: "Active",
                            else: "Expired"
                        }
                    }
                }
            },
            { $sort: { investmentDate: -1 } }
        ]);

        res.status(200).json({
            success: true,
            count: purchases.length,
            data: purchases
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

exports.getClientProfile = async (req, res) => {
    try {
        // req.user.id authMiddleware se aa raha hai
        const client = await User.findById(req.user.id).select("-password"); 
        
        if (!client) {
            return res.status(404).json({ message: "Client profile not found" });
        }

        res.status(200).json({ success: true, data: client });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
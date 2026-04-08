const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res) => {
    try {
        // Frontend se ab 'productIds' (array) aa raha hai
        const { clientId, productIds, investmentDate, agentId, commissionLabel } = req.body;

        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "At least one product must be selected" });
        }

        const salesRecords = [];

        // 1. Har Product ke liye Loop chalana
        for (let productId of productIds) {
            const productData = await Product.findById(productId);
            
            if (!productData) {
                console.log(`Product not found: ${productId}`);
                continue; // Agar koi product nahi mila toh use skip karke agle pe jao
            }

            // 2. Commission calculation for this specific product
            const calculatedCommission = (productData.price * commissionLabel) / 100;

            // 3. Sale Object taiyar karna
            const newSale = new Sale({
                client: clientId,
                product: productId,
                investmentDate,
                agent: agentId,
                commissionPercentage: commissionLabel,
                commissionAmount: calculatedCommission,
                totalAmount: productData.price,
                createdBy: req.user.id 
            });

            // 4. Database mein save karna
            const savedSale = await newSale.save();
            salesRecords.push(savedSale);
        }

        res.status(201).json({ 
            success: true, 
            message: `${salesRecords.length} sales recorded successfully`,
            data: salesRecords 
        });

    } catch (error) {
        console.error("Sale Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Sales History (Populate same rahega)
exports.getSalesHistory = async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate('client', 'name email')
            .populate('product', 'name price')
            .populate('agent', 'name')
            .sort({ createdAt: -1 });
            
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
};
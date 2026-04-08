const Product = require('../models/Product');

// Admin adds a product
exports.addProduct = async (req, res) => {
    // 1. Destructure data from body
    const { name, price, description, Category,Mature_Amount,Date_Mature, } = req.body;

    try {
        // 2. Add product with "createdBy" field
        const newProduct = new Product({ 
            name, 
            price, 
            description, 
            Category,
            Mature_Amount,
            Date_Mature,
        
            createdBy: req.user._id // Ye ID humein protect middleware se milti hai
        });

        // 3. Save to Database
        await newProduct.save();
        
        res.status(201).json(newProduct);
    } catch (err) {
        // Validation error check karne ke liye console.log karein
        console.log("Add Product Error:", err); 
        res.status(500).json({ message: "Error adding product", error: err.message });
    }
};

// Everyone can see products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products" });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: "Error updating product" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product" });
    }
};
const Category = require("../models/Category");

// ✅ Add Category
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    const newCat = new Category({ name, description });
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    
    const deleted = await Category.findOneAndDelete({ name: req.params.id }); 
    
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed server error" });
  }
};
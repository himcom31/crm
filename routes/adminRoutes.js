const express = require('express');
const router = express.Router();
const { createClient, getAllClients ,updateClient, deleteClient,dashboard} = require('../controllers/adminController');
const { addProduct } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { createAgent, getAllAgents, deleteAgentByEmail ,updateAgent} = require("../controllers/agentController");
const { addCategory, getCategories, deleteCategory } = require("../controllers/categoryController");
const { createSale, getSalesHistory } = require('../controllers/saleController');
// Sabhi routes ke liye Admin hona zaroori hai
router.use(protect);
router.use(admin);

// @route   POST /api/admin/create-client
// @desc    Admin creates a new client and sends email
router.post('/create-client', createClient);

// @route   GET /api/admin/clients
// @desc    Get list of all registered clients
router.get('/clients', getAllClients);

router.put('/client/:id', protect, admin, updateClient);   
router.delete('/client/:id', protect, admin, deleteClient); 

// @route   POST /api/admin/add-product
// @desc    Admin adds a new product or package
router.post('/add-product', addProduct);

// Agent Routses
router.post("/agent/form", protect, createAgent);
router.get("/agent/all", protect, getAllAgents);
router.delete("/agent/all/:email", protect, deleteAgentByEmail);
router.put("/agent/update/:email", protect, updateAgent);

//category routes
router.post("/category/form", protect, addCategory);
router.get("/category/all", protect, getCategories);
router.delete("/category/all/:id", protect, deleteCategory);

// Sales Routes
router.post('/sales/add', protect, admin, createSale);
router.get('/sales/history', protect, admin, getSalesHistory);


router.get("/dashboard-stats",dashboard)

module.exports = router;
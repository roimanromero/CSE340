const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const accountController = require("../controllers/accountController"); // ✅ Corrected import for accountController
const utilities = require("../utilities"); // ✅ Ensure utilities is correctly imported

// View inventory by classification
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

// Vehicle detail view
router.get("/detail/:inv_id", inventoryController.buildDetailPage);

// Add classification
router.get("/add-classification", inventoryController.getAddClassification);
router.post("/add-classification", inventoryController.addClassification);

// Add inventory
router.get("/add-inventory", inventoryController.getAddInventory);
router.post("/add-inventory", inventoryController.addInventory);

// Inventory management main page
router.get("/", inventoryController.showManagement);

// Admin-only route (example dashboard)
router.get("/admin", utilities.checkAdmin, accountController.buildAdminDashboard); // ✅ Fixed the route handler

// Add classification with middleware
router.get("/add-classification", utilities.checkLogin, utilities.checkEmployeeOrAdmin, inventoryController.buildAddClassification); // ✅ Fixed invController to inventoryController

module.exports = router;

const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// View inventory by classification
router.get("/type/:classificationId", inventoryController.buildByClassificationId);

// Vehicle detail view
router.get("/detail/:inv_id", inventoryController.buildDetailPage);

// Inventory management main page
router.get("/", inventoryController.showManagement);

// Admin-only dashboard route
router.get("/admin", utilities.checkAdmin, accountController.buildAdminDashboard);

// Add classification form
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  inventoryController.getAddClassification
);

// Handle add classification form submission
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  inventoryController.addClassification
);

// Add vehicle form
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  inventoryController.getAddInventory
);

// Handle add vehicle form submission
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  inventoryController.addInventory
);

module.exports = router;

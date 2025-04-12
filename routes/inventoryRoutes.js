// routes/inventoryRoute.js

const express = require("express");
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Existing routes
router.get("/type/:classificationId", inventoryController.buildByClassificationId);
router.get("/detail/:inv_id", inventoryController.buildDetailPage);

// New routes for Add Classification view
router.get("/add-classification", inventoryController.getAddClassification);
router.post("/add-classification", inventoryController.addClassification);

// Management view
router.get('/inv', inventoryController.showManagement);

module.exports = router;

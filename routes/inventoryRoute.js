const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Route for classification inventory view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view
router.get("/detail/:inv_id", invController.buildDetailView);

module.exports = router;

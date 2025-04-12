const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

router.get("/type/:classificationId", inventoryController.buildByClassificationId);
router.get("/detail/:inv_id", inventoryController.buildDetailPage);

router.get("/add-classification", inventoryController.getAddClassification);
router.post("/add-classification", inventoryController.addClassification);

router.get("/add-inventory", inventoryController.getAddInventory);
router.post("/add-inventory", inventoryController.addInventory);

router.get("/", inventoryController.showManagement);

module.exports = router;

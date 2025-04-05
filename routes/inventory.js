// routes/inventory.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Route to display vehicle details
router.get('/:id', inventoryController.getVehicleDetails);

module.exports = router;
// routes/inventory.js (or a new routes file for task 3)
router.get('/trigger-error', (req, res, next) => {
    throw new Error('Intentional server error');
});

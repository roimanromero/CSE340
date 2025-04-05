// controllers/inventoryController.js
const inventoryModel = require('../models/inventoryModel');
const utilities = require('../utils/index');

// Controller to get vehicle details
exports.getVehicleDetails = async (req, res, next) => {
    try {
        const vehicleId = req.params.id;
        const vehicleData = await inventoryModel.getVehicleById(vehicleId);

        if (!vehicleData) {
            return next(new Error('Vehicle not found'));
        }

        const vehicleHTML = utilities.formatVehicleData(vehicleData);
        res.render('inventory/detail', { vehicleHTML });
    } catch (err) {
        next(err); // Pass error to middleware
    }
};

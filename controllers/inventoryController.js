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
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildVehicleDetailView(req, res, next) {
  const invId = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();

  try {
    const vehicleData = await invModel.getVehicleById(invId);
    if (!vehicleData) {
      throw new Error("Vehicle not found.");
    }

    const vehicleHtml = utilities.buildVehicleDetailHtml(vehicleData);

    res.render("./inventory/vehicle-detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHtml,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildVehicleDetailView,
  // other controller functions...
};

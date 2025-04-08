const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

// Controller for classification list view
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();

    if (!data || data.length === 0) {
      throw new Error("No vehicles found for this classification.");
    }

    // ✅ NEW: fetch classification name directly
    const classificationName = await invModel.getClassificationNameById(classification_id);

    const grid = utilities.buildClassificationGrid(data);

    res.render("inventory/classification", {
      title: `${classificationName} Vehicles`,
      nav,
      grid
    });
  } catch (error) {
    next(error);
  }
}



// Controller for vehicle detail view
async function buildDetailView(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await invModel.getVehicleById(inv_id);
    const nav = await utilities.getNav();

    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }

    const detailHtml = utilities.buildVehicleDetailHtml(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail: detailHtml,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildByClassificationId,
  buildDetailView,
};

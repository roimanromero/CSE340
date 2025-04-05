const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

async function buildDetailView(req, res, next) {
  const invId = req.params.inv_id;

  try {
    const vehicleData = await invModel.getVehicleById(invId);
    const vehicleHtml = utilities.buildVehicleDetailHtml(vehicleData);

    const nav = await utilities.getNav();

    res.render("inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHtml,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildDetailView,
  // other functions...
};

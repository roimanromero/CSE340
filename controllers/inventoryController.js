// controllers/inventoryController.js

const invModel = require('../models/inventory-model');
const utilities = require('../utilities/');

const buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassification(classificationId);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();

    res.render('./inventory/classification', {
      title: data[0]?.classification_name + ' Vehicles',
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

const buildDetailPage = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  try {
    const vehicle = await invModel.getVehicleById(inv_id);
    if (!vehicle) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      return next(error);
    }
    const nav = await utilities.getNav();
    const detail = await utilities.buildVehicleDetailHtml(vehicle);

    res.render('./inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail, // This variable now matches what detail.ejs expects.
    });
  } catch (error) {
    next(error);
  }
};

const showManagement = async function (req, res) {
  const nav = await utilities.getNav();
  res.render('./inventory/management', {
    title: 'Inventory Management',
    nav,
    message: req.flash('message'),
  });
};

// === New Functions for Add Classification ===

// Renders the form view for adding a new classification.
const getAddClassification = async function (req, res) {
  const nav = await utilities.getNav();
  res.render('./inventory/add-classification', {
    title: 'Add New Classification',
    nav,
    message: req.flash('message'),
    error: null,
  });
};

// Processes the form submission for a new classification.
const addClassification = async function (req, res, next) {
  const { classificationName } = req.body;

  // Server-side validation: Only allow alphanumeric strings
  if (!/^[A-Za-z0-9]+$/.test(classificationName)) {
    req.flash('message', 'Classification name must only contain letters and numbers.');
    const nav = await utilities.getNav();
    return res.render('./inventory/add-classification', {
      title: 'Add New Classification',
      nav,
      error: 'Invalid classification name.',
      message: req.flash('message'),
    });
  }

  try {
    // Call the model to insert new classification
    const result = await invModel.addClassification(classificationName);
    if (result.rowCount > 0) {
      req.flash('message', `Successfully added ${classificationName} classification.`);
      // Rebuild nav to display the new classification immediately
      const nav = await utilities.getNav();
      return res.render('./inventory/management', {
        title: 'Inventory Management',
        nav,
        message: req.flash('message'),
      });
    } else {
      req.flash('message', 'Failed to add classification. Please try again.');
      const nav = await utilities.getNav();
      return res.render('./inventory/add-classification', {
        title: 'Add New Classification',
        nav,
        error: 'Failed to add classification.',
        message: req.flash('message'),
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  buildByClassificationId,
  buildDetailPage,
  showManagement,
  getAddClassification,  // New
  addClassification,     // New
};

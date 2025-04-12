const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const buildByClassificationId = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassification(classificationId);
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();

    res.render("./inventory/classification", {
      title: data[0]?.classification_name + " Vehicles",
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
      return next({ status: 404, message: "Vehicle not found" });
    }

    const nav = await utilities.getNav();
    const detail = await utilities.buildVehicleDetailHtml(vehicle);

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail,
    });
  } catch (error) {
    next(error);
  }
};

const showManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      
    });
  } catch (error) {
    next(error);
  }
};

const getAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

const addClassification = async function (req, res, next) {
  const { classificationName } = req.body;

  // Validate input
  if (!/^[A-Za-z0-9]+$/.test(classificationName)) {
    req.flash("message", "Classification name must only contain letters and numbers.");
    const nav = await utilities.getNav();
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      error: "Invalid classification name.",
      
    });
  }

  try {
    const result = await invModel.addClassification(classificationName);
    const nav = await utilities.getNav();

    if (result.rowCount > 0) {
      req.flash("message", `Successfully added ${classificationName} classification.`);
      return res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        
      });
    } else {
      req.flash("message", "Failed to add classification. Please try again.");
      return res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        error: "Failed to add classification.",
        
      });
    }
  } catch (error) {
    next(error);
  }
};
const getAddInventory = async function(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();

    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      
      error: null
    });
  } catch (error) {
    next(error);
  }
};

const addInventory = async function(req, res, next) {
  try {
    const {
      classification_id,
      make,
      model,
      year,
      description,
      price,
      image_path,
      thumbnail_path,
      miles,
      color
    } = req.body;

    const vehicleData = {
      classification_id,
      inv_make: make,
      inv_model: model,
      inv_year: year,
      inv_description: description,
      inv_image: image_path,
      inv_thumbnail: thumbnail_path,
      inv_price: price,
      inv_miles: miles,
      inv_color: color
    };

    const result = await invModel.addInventory(vehicleData);

    const nav = await utilities.getNav();

    if (result.rowCount > 0) {
      req.flash("message", "New vehicle added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add vehicle. Please try again.");
      res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect: await utilities.buildClassificationList(), // also add this back
        
        error: "Database insert failed."
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
  getAddClassification,
  addClassification,
  getAddInventory, // <-- new
  addInventory  
};

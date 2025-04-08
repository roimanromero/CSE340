const pool = require("../database/");

/* Get all classification names */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* Example: Get vehicle by ID (you'll use this later for detail view) */
async function getVehicleById(id) {
  return await pool.query("SELECT * FROM inventory WHERE inv_id = $1", [id]);
}

module.exports = {
  getClassifications,
  getVehicleById,
};

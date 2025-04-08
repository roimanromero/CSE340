// Add this near the bottom, after classification route
router.get("/detail/:inv_id", invController.buildDetailView);
const pool = require("../database/");

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error: " + error);
    throw error;
  }
}

module.exports = {
  getVehicleById,
  // other functions...
};
// Route to display a specific vehicle's detail page
router.get("/detail/:inv_id", invController.buildVehicleDetailView);

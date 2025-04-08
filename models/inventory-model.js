const pool = require("../database/");

async function getClassifications() {
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return data.rows;
  } catch (error) {
    console.error("getClassifications error:", error);
    throw error;
  }
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE classification_id = $1",
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    throw error;
  }
}

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inv_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error:", error);
    throw error;
  }
}

async function getClassificationNameById(classification_id) {
  const sql = "SELECT classification_name FROM classification WHERE classification_id = $1";
  const data = await pool.query(sql, [classification_id]);
  return data.rows[0]?.classification_name || "Unknown";
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  getClassificationNameById,
};

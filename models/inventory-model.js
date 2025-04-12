// models/inventory-model.js

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

async function getInventoryByClassification(classificationId) {
  try {
    const data = await pool.query(
      "SELECT * FROM public.inventory WHERE classification_id = $1",
      [classificationId]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassification error:", error);
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
  const sql =
    "SELECT classification_name FROM classification WHERE classification_id = $1";
  const data = await pool.query(sql, [classification_id]);
  return data.rows[0]?.classification_name || "Unknown";
}

// === New Function to Insert a New Classification ===
async function addClassification(classificationName) {
  try {
    const sql = `
      INSERT INTO public.classification (classification_name)
      VALUES ($1)
      RETURNING *
    `;
    const data = await pool.query(sql, [classificationName]);
    return data;
  } catch (error) {
    console.error("addClassification error:", error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassification,
  getVehicleById,
  getClassificationNameById,
  addClassification, // New
};

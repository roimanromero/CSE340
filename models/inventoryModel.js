// models/inventoryModel.js
const db = require('../database'); // Assuming you're using a database connection

// Function to get a vehicle by ID
exports.getVehicleById = async (vehicleId) => {
    try {
        const query = 'SELECT * FROM vehicles WHERE id = ?';
        const [rows] = await db.execute(query, [vehicleId]);
        return rows[0]; // Return the first result
    } catch (err) {
        throw err;
    }
};

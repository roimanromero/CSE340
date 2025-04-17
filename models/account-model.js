// models/account-model.js

const db = require("../database");

/* ********************************************
 * Get account data by email address
 * ******************************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await db.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
       FROM account 
       WHERE account_email = $1`,
      [account_email]
    );
    return result.rows[0]; // Return account or undefined if not found
  } catch (error) {
    console.error("Error fetching account by email:", error);
    throw new Error("Database query failed when fetching account by email.");
  }
}

/* ********************************************
 * Get account data by account ID (for updates)
 * ******************************************** */
async function getAccountById(account_id) {
  try {
    const result = await db.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type 
       FROM account 
       WHERE account_id = $1`,
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    throw new Error("Database query failed when fetching account by ID.");
  }
}

/* ********************************************
 * Update account information (first, last name, email)
 * ******************************************** */
async function updateAccount(account_firstname, account_lastname, account_email, account_id) {
  try {
    const result = await db.query(
      `UPDATE account 
       SET account_firstname = $1, account_lastname = $2, account_email = $3 
       WHERE account_id = $4 
       RETURNING *`,
      [account_firstname, account_lastname, account_email, account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating account:", error);
    throw new Error("Database update failed.");
  }
}

/* ********************************************
 * Update account password (hashed)
 * ******************************************** */
async function updatePassword(hashedPassword, account_id) {
  try {
    const result = await db.query(
      `UPDATE account 
       SET account_password = $1 
       WHERE account_id = $2 
       RETURNING account_id`,
      [hashedPassword, account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Password update failed.");
  }
}

module.exports = {
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};

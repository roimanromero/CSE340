const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// ====================
// Auth & Login Routes
// ====================

// Show login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Handle login form
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Logout
router.get("/logout", accountController.logout);

// ===========================
// Account Management (Secure)
// ===========================

// Logged-in users only
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// ===========================
// Account Update Routes
// ===========================

// View account update form
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);

// Handle account info update
router.post(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

// Handle password update
router.post(
  "/update-password",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
);

// ===================================
// Example: Admin / Employee Routes
// ===================================

// Admin + Employee access (Dashboard)
router.get(
  "/admin",
  utilities.checkEmployeeOrAdmin,
  (req, res) => {
    res.send("Welcome to the Admin/Employee Dashboard");
  }
);

// Admin-only route
router.get(
  "/super-secret",
  utilities.checkAdmin,
  (req, res) => {
    res.send("Only Admins can access this page");
  }
);

// ====================
// Error Handler
// ====================
router.use((err, req, res, next) => {
  console.error("Account Route Error:", err);
  res.status(500).send("Server Error in Account Routes");
});
router.get("/update/:account_id", utilities.checkLogin, accController.buildUpdateView)
router.post("/update", validate.updateRules(), validate.checkUpdateData, accController.updateAccount)
router.post("/update-password", validate.passwordRules(), validate.checkPasswordData, accController.updatePassword)
router.get("/logout", (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
})


module.exports = router;

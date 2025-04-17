const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/accountValidation"); // ✅ FIXED name to match typical file

// ====================
// Auth & Login Routes
// ====================

// Show login page
// ====================
// Registration Routes
// ====================

// Show registration form
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Handle registration form submission
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Handle login form submission
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});

// ===========================
// Account Management (Secure)
// ===========================

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// ===========================
// Account Update Routes
// ===========================

router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post(
  "/update",
  validate.updateRules(),
  validate.checkUpdateData,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update-password",
  validate.passwordRules(),
  validate.checkPasswordData,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
);

// ===================================
// Example: Admin / Employee Routes
// ===================================

router.get(
  "/admin",
  utilities.checkEmployeeOrAdmin,
  (req, res) => {
    res.send("Welcome to the Admin/Employee Dashboard");
  }
);

router.get(
  "/super-secret",
  utilities.checkAdmin,
  (req, res) => {
    res.send("Only Admins can access this page");
  }
);

// ====================
// Route Error Handler
// ====================
router.use((err, req, res, next) => {
  console.error("Account Route Error:", err);
  res.status(500).send("Server Error in Account Routes");
});

module.exports = router;

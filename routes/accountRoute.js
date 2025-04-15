// routes/accountRoute.js

const express = require('express');
const router = express.Router();
const utilities = require('../utilities');
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation'); // <-- Import validation middleware

// Route to handle login form submission
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
// Route to serve the account management page
router.get(
  "/",
  utilities.checkLogin, // Middleware to ensure the user is authenticated
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Optional: route to serve the login page (e.g., GET request)
// router.get('/login', accountController.buildLogin);

// Optional: route to serve registration page (to be implemented later)
// router.get('/register', accountController.buildRegister);

// Error handler for account routes
router.use((err, req, res, next) => {
  console.error('Account Route Error:', err);
  res.status(500).send('Server Error in Account Routes');
});

module.exports = router;

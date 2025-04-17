const { body, validationResult } = require("express-validator");

/* ===========================
   Login Validation
=========================== */
const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
  ];
};

const checkLoginData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error_msg", errors.array().map(e => e.msg).join(" "));
    return res.redirect("/account/login");
  }
  next();
};

/* ===========================
   Registration Validation
=========================== */
const registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty().withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isStrongPassword().withMessage("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.")
  ];
};

// This should be below registrationRules()
const checkRegData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error_msg", "Please correct the highlighted errors.");
      return res.render("account/register", {
        title: "Register",
        errors: errors.array(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      });
    }
    next();
  };
  
/* ===========================
   Account Update Validation
=========================== */
const updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty().withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .notEmpty().withMessage("Last name is required."),
    body("account_email")
      .trim()
      .isEmail().withMessage("A valid email is required.")
  ];
};

const checkUpdateData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error_msg", errors.array().map(e => e.msg).join(" "));
    return res.redirect(`/account/update/${req.body.account_id}`);
  }
  next();
};

/* ===========================
   Password Update Validation
=========================== */
const passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .isStrongPassword().withMessage("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a symbol.")
  ];
};

const checkPasswordData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error_msg", errors.array().map(e => e.msg).join(" "));
    return res.redirect(`/account/update/${req.body.account_id}`);
  }
  next();
};

module.exports = {
  loginRules,
  checkLoginData,
  registrationRules,
  checkRegData,
  updateRules,
  checkUpdateData,
  passwordRules,
  checkPasswordData,
};

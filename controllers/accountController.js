// controllers/accountController.js

const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const accountModel = require("../models/accountModel");
const utilities = require("../utilities");

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process login request
 * *************************************** */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;
  const nav = await utilities.getNav();

  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      account_email
    });
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password);
    if (!match) {
      req.flash("notice", "Incorrect password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        account_email
      });
    }

    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600000,
      secure: process.env.NODE_ENV !== "development"
    };

    res.cookie("jwt", accessToken, cookieOptions);
    req.flash("info", "You are now logged in.");
    return res.redirect("/account");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      message: ["Login failed due to server error."]
    });
  }
}

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    messages: req.flash("info"),
    errors: req.flash("error"),
    nav
  });
}

module.exports = {
  buildLogin,
  accountLogin,
  buildAccountManagement,
};

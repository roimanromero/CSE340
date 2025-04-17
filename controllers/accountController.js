const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const accountModel = require("../models/accountmodel");
const utilities = require("../utilities");

/* Deliver login view */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      message: req.flash("notice"),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* Process login */
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
      account_email,
    });
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password);
    if (!match) {
      req.flash("notice", "Incorrect password.");
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        message: req.flash("notice"),
        account_email,
      });
    }

    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const cookieOptions = {
      httpOnly: true,
      maxAge: 3600000,
      secure: process.env.NODE_ENV !== "development",
    };

    res.cookie("jwt", accessToken, cookieOptions);
    req.flash("info", "You are now logged in.");
    return res.redirect("/account");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      message: ["Login failed due to server error."],
    });
  }
}

// Show register page
async function buildRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    errors: null,
  });
}

/* Account Management View */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav();
  const accountData = res.locals.accountData;

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData,
    messages: req.flash("info"),
    errors: req.flash("error"),
  });
}

/* Account Update View */
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav();
  const account_id = parseInt(req.params.account_id);
  const accountData = await accountModel.getAccountById(account_id);

  res.render("account/update", {
    title: "Update Account",
    nav,
    accountData,
    messages: req.flash("info"),
    errors: req.flash("error"),
  });
}

/* Handle account info update */
async function updateAccount(req, res) {
  const nav = await utilities.getNav();
  const { firstname, lastname, email, account_id } = req.body;

  try {
    const result = await accountModel.updateAccount(firstname, lastname, email, account_id);
    if (result) {
      req.flash("info", "Account successfully updated.");
      return res.redirect("/account");
    } else {
      req.flash("error", "Account update failed.");
      return res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("Update error:", error);
    req.flash("error", "An error occurred while updating the account.");
    res.redirect(`/account/update/${account_id}`);
  }
}

/* Handle password update */
async function updatePassword(req, res) {
  const nav = await utilities.getNav();
  const { password, account_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await accountModel.updatePassword(hashedPassword, account_id);

    if (result) {
      req.flash("info", "Password successfully updated.");
      return res.redirect("/account");
    } else {
      req.flash("error", "Password update failed.");
      return res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    console.error("Password update error:", error);
    req.flash("error", "An error occurred while updating the password.");
    res.redirect(`/account/update/${account_id}`);
  }
}

async function buildAdminDashboard(req, res) {
  const nav = await utilities.getNav();
  res.render("account/admin", {
    title: "Admin Dashboard",
    nav,
    accountData: res.locals.accountData,
    messages: req.flash("info"),
    errors: req.flash("error")
  });
}

/* Handle logout */
function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("info", "You have been logged out.");
  res.redirect("/");
}

module.exports = {
  buildLogin,
  accountLogin,
  buildRegister,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout,
  buildAdminDashboard,
};

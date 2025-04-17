const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
require('dotenv').config();

// Show login form
function showLogin(req, res) {
  res.render('auth/login', {
    title: 'Login',
  });
}

// Show registration form
function showRegister(req, res) {
  res.render('auth/register', {
    title: 'Register',
  });
}

// Handle login
async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    req.flash('error_msg', 'Invalid email or password.');
    return res.redirect('/auth/login');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    req.flash('error_msg', 'Invalid email or password.');
    return res.redirect('/auth/login');
  }

  // Create JWT Token
  const payload = {
    userId: user.user_id,
    email: user.email,
    accountType: user.account_type,  // Adding account type to the token
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  // Store token in a cookie (make sure this cookie is set correctly on the frontend)
  const cookieOptions = {
    httpOnly: true,
    maxAge: 3600000,  // 1 hour in milliseconds
    secure: process.env.NODE_ENV !== 'development',
  };

  res.cookie('jwt', token, cookieOptions);
  req.flash('success_msg', 'You are now logged in!');
  res.redirect('/dashboard'); // Update redirect based on your desired landing page
}

// Handle registration
async function registerUser(req, res) {
  const { username, email, password } = req.body;
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    req.flash('error_msg', 'Email is already registered.');
    return res.redirect('/auth/register');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = await createUser(username, email, passwordHash);
  
  // Create JWT Token
  const payload = {
    userId: newUser.user_id,
    email: newUser.email,
    accountType: newUser.account_type,  // Including account type for later use
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  // Store token in a cookie
  const cookieOptions = {
    httpOnly: true,
    maxAge: 3600000,  // 1 hour in milliseconds
    secure: process.env.NODE_ENV !== 'development',
  };

  res.cookie('jwt', token, cookieOptions);
  req.flash('success_msg', 'Registration successful. Welcome!');
  res.redirect('/dashboard'); // Update redirect based on your desired landing page
}

// Handle logout
function logoutUser(req, res) {
  res.clearCookie('jwt');  // Clear JWT cookie on logout
  req.flash('success_msg', 'You have been logged out.');
  res.redirect('/auth/login');
}

module.exports = {
  showLogin,
  showRegister,
  loginUser,
  registerUser,
  logoutUser,
};

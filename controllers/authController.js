const bcrypt = require('bcryptjs');
const { createUser, findUserByEmail } = require('../models/userModel');

// Show login form
function showLogin(req, res) {
  res.render('auth/login', {
    title: 'Login'
  });
}

// Show registration form
function showRegister(req, res) {
  res.render('auth/register', {
    title: 'Register'
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

  req.session.userId = user.user_id;
  req.flash('success_msg', 'You are now logged in!');
  res.redirect('/dashboard'); // Change this if needed
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
  req.session.userId = newUser.user_id;
  req.flash('success_msg', 'Registration successful. Welcome!');
  res.redirect('/dashboard');
}

// Handle logout
function logoutUser(req, res) {
  req.session.destroy(err => {
    if (err) {
      req.flash('error_msg', 'Error logging out.');
      return res.redirect('/dashboard');
    }
    res.clearCookie('sessionId');
    res.redirect('/auth/login');
  });
}

module.exports = {
  showLogin,
  showRegister,
  loginUser,
  registerUser,
  logoutUser
};

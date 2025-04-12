// controllers/accountController.js

const utilities = require('../utilities');

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render('account/login', {
      title: 'Login',
      nav,
      message: req.flash('message'),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildLogin,
};

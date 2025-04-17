function ensureAuthenticated(req, res, next) {
    if (req.session.userId) {
      return next();
    }
    res.redirect('/account/login');
  }
  
  module.exports = { ensureAuthenticated };
  

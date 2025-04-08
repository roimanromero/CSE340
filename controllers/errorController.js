function triggerError(req, res, next) {
  next(new Error("This is an intentional server error for testing."));
}

  module.exports = { triggerError };
  
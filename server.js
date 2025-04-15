const cookieParser = require("cookie-parser")
const session = require("express-session");
const pool = require("./database/");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const app = express();
const utilities = require("./utilities/");
const static = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoutes"); // ✅ Corrected and unified
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute");

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "localhost";

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())
app.use(utilities.checkLogin) // ✅ Middleware to check JWT token validity
app.use(expressLayouts);

// Session config
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Flash messages
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// Routes
app.use("/", static);
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoutes); // ✅ Route is now clearly scoped

// Error routes
app.use("/inventory", errorRoute);

// Favicon fix
app.get('/favicon.ico', (req, res) => res.status(204));

// 404 Handler
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

// Global Error Handler
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav();
  console.error(`Error at "${req.originalUrl}": ${err.message}`);
  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: err.message,
    status: err.status || 500,
    nav
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`App listening on http://${HOST}:${PORT}`);
});

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./database/");
const utilities = require("./utilities/");
const static = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute");

require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "localhost";

// --- Middleware Setup ---

// Static files
app.use(express.static("public"));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cookies
app.use(cookieParser());

// Session setup
app.use(session({
  store: new pgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Set to true if using HTTPS
  name: 'sessionId',
}));

// Flash messages
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // optional, like login error
  next();
});


// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); // Optional: for passport-style errors
  next();
});

// JWT check middleware


// Inject nav into all views
app.use(utilities.injectNav); 
//app.use(utilities.checkLogin);

// View engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// --- Routes ---
app.use("/", static);
app.use("/auth", authRoutes);
app.use("/inv", inventoryRoutes);
app.use("/inventory", errorRoute);

app.get("/", baseController.buildHome);

// Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204));

// 404 Handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
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

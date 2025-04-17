const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./database/");
const utilities = require("./utilities/");
const inventoryRoutes = require("./routes/inventoryRoutes");
const authRoutes = require("./routes/authRoutes");
const accountRoute = require("./routes/accountRoute");
const baseController = require("./controllers/baseController");
const errorRoute = require("./routes/errorRoute");


require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "localhost";

// --- Middleware Setup ---

console.log("Registering static file middleware...");
app.use(express.static("public"));

console.log("Registering body parser middleware...");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("Registering cookie parser middleware...");
app.use(cookieParser());

console.log("Registering session middleware...");
app.use(session({
  store: new pgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "defaultSecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
  name: 'sessionId',
}));

console.log("Registering flash middleware...");
app.use(flash());

console.log("Registering flash message locals middleware...");
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

console.log("Registering navigation injection middleware...");
app.use(utilities.injectNav); // 🔥 double check this function exists and is exported

// app.use(utilities.checkLogin); // Optional

console.log("Setting up EJS view engine...");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// --- Routes ---
console.log("Registering /auth routes...");
app.use("/auth", authRoutes);

console.log("Registering /inv (inventory) routes...");
app.use("/inv", inventoryRoutes);

app.use("/account", accountRoute);

console.log("Registering /errors (error testing) routes...");
app.use("/errors", errorRoute);

console.log("Registering home route...");
app.get("/", baseController.buildHome);

// Favicon fix
app.get("/favicon.ico", (req, res) => res.status(204));

// 404 Handler
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

// Global Error Handler
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav?.() || [];
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
  console.log(`✅ App listening on http://${HOST}:${PORT}`);
});

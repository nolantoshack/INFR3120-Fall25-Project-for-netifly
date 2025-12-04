const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const truckRoutes = require("./routes/TruckRoutes");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");

// Env
dotenv.config();

// DB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Passport config
require("./config/passport")(passport);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User to all EJS templates
app.use((req, res, next) => {
  res.locals.User = req.user || null;
  next();
});

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    req.session.User = req.user;
    res.redirect("/");
  }
);

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// App routes
app.use("/", truckRoutes);

// Home page
app.get(["/", "/index"], (req, res) => {
  res.render("index", {
    title: "Truck Management Home",
    activePage: "home"
  });
});

// Start
app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});

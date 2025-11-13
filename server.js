const express = require("express");
const path = require("path");
const incidentRoutes = require('./incidentRoutes'); // <-- NEW: Import the routes

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");
// Use 'views' folder for EJS templates
app.set("views", path.join(__dirname, "views"));

// Static files (CSS, JS, Images)
// This makes files in the 'public' folder accessible via the root path (e.g., /css/style.css)
app.use(express.static(path.join(__dirname, "public")));

// --- Route Handling ---

// Apply the incident routes (for /create, /incidents)
app.use('/', incidentRoutes); // <-- NEW: Apply routes

// Base Route (Home)
app.get("/", (req, res) => {
  // Assuming you have views/index.ejs for the home page
  res.render("index", {
      title: 'Home',
      activePage: 'home'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Running on http://localhost:${PORT}`);
});
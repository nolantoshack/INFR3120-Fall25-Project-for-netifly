const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`✅ Running on http://localhost:${PORT}`);
});

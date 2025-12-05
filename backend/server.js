const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const truckRoutes = require("./routes/TruckRoutes");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const cors = require("cors"); 

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
      secure: process.env.NODE_ENV === "production" // Set 'secure: true' in production
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


const allowedOrigins = [
    'http://localhost:4200', // Angular Development Server
    // REPLACE THIS PLACEHOLDER WITH YOUR LIVE NETLIFY URL
    'https://your-frontend-domain.netlify.app', 
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allows requests with no origin and allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // for session/cookie-based authentication
};

app.use(cors(corsOptions));
app.use("/api", truckRoutes);


const User = require("./model/User"); 


// Check Email Exists
app.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    // Return JSON error instead of rendering a page
    return res.status(404).json({ error: "No account found with that email." });
  }

  // Return the userId 
  res.status(200).json({ 
    success: true, 
    message: "If an account was found, a reset link/code has been sent.",
    userId: user._id // Returning userId for simple lab project demo only
  });
});

// Reset User Password Route
app.post("/reset-password", async (req, res) => {
  const { userId, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    // Return JSON error instead of rendering a page
    return res.status(400).json({ error: "Passwords do not match." });
  }
  if (newPassword.length < 6) {
    // Return JSON error
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const user = await User.findById(userId);

  if (!user) {
    // Return JSON error
    return res.status(404).json({ error: "User not found." });
  }
  
  // Update password
  user.password = newPassword; // Assumes your User model handles hashing on save() or pre('save')
  await user.save();

  // Success: Return JSON
  res.status(200).json({ success: true, message: "Password updated successfully. You can now log in." });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
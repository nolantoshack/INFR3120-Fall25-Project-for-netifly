const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import the Truck Model and User model
const Truck = require('../model/Truck.js'); 
const User = require('../model/User.js'); 


//Authentication Middleware

function ensureAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Return a 401 Unauthorized JSON response instead of a redirect
    res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Please log in to access this resource.'
    });
}

//  User Login 
router.post('/login', (req, res, next) => {
    // Call the local passport strategy with a custom callback
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: 'Server Error' });
        }
        if (!user) {
            // Return a 401 Unauthorized JSON response
            return res.status(401).json({ error: info.message || 'Invalid Email or Password.' });
        }
        // Establish session and return user data
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create session.' });
            }
            // Return JSON data about the logged-in user
            res.status(200).json({ 
                success: true, 
                message: 'Login successful.',
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role
                }
            });
        });
    })(req, res, next);
});



// This route starts the OAuth process
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email']
}));

// This route is the callback from Google
router.get('/auth/google/callback', 
    passport.authenticate('google', { 
        // If Google login fails, redirect the user's browser to an Angular error page
        failureRedirect: process.env.CLIENT_URL + '/login?error=GoogleAuthFailed' 
    }),
    (req, res) => {
        // Redirect the user's browser back to the Angular app's dashboard route
        //You must set the CLIENT_URL in your .env file
        res.redirect(process.env.CLIENT_URL + '/dashboard'); 
    }
);

// New endpoint to handle failed Google login 
router.get('/login-failure', (req, res) => {
    res.status(401).json({
        success: false,
        error: 'Google authentication failed.'
    });
});



// User Registration
router.post('/signup', async (req, res) => {
    const { email, password, fullName, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            // Return JSON error
            return res.status(400).json({ error: 'User already exists.' });
        }
        if (password.length < 6) {
             // Return JSON error
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        user = new User({ email, password, fullName, role });
        await user.save();

        // Successful registration: Return JSON data
        res.status(201).json({ 
            success: true, 
            message: 'Registration successful. Please log in.',
            user: { fullName, email, role }
        });

    } catch (err) {
        console.error('Error during signup:', err);
        // Return JSON error
        res.status(500).json({ error: 'Server error during registration.' });
    }
});


// User Logout 
router.get('/logout', (req, res) => {
    // Clear session and return JSON
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out.' });
        }
        res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
});


//GET single trip by ID 
router.get('/trucks/:id', ensureAuth, async (req, res) => {
    try {
        const trip = await Truck.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        // Success: return JSON object
        res.status(200).json(trip);
    } catch (err) {
        console.error('Error loading trip:', err);
        res.status(500).json({ error: 'Error loading trip details.' });
    }
});


// Show All Trips 
router.get('/trucks', ensureAuth, async (req, res) => {
    try {
        // Get message/error if any
        const message = req.query.message || null; 
        const error = req.query.error || null;
        
        // Fetch trips
        const trips = await Truck.find({ user: req.user.id }).populate('user').lean();
        
        //Return JSON data instead of rendering EJS
        res.status(200).json({
            success: true,
            trips: trips,
            message: message,
            error: error
        });

    } catch (err) {
        console.error('Error fetching trips:', err);
        res.status(500).json({ error: 'Failed to retrieve trips.' });
    }
});


// Create New Trip 
router.post('/create', ensureAuth, async (req, res) => {
    try {
        // Add the authenticated user's ID to the trip data
        const newTripData = {
            ...req.body,
            user: req.user.id 
        };

        const newTrip = await Truck.create(newTripData);
        
        // Return JSON success response
        res.status(201).json({ 
            success: true, 
            message: 'Trip created successfully.', 
            tripId: newTrip._id 
        });

    } catch (err) {
        console.error('Error creating trip:', err);
        //Return JSON error response 
        const errorMsg = err.message || 'Failed to log new trip. Check your inputs.';
        res.status(400).json({ error: errorMsg });
    }
});



//Save edited trip
router.post('/update-trip/:id', ensureAuth, async (req, res) => {
    try {
        let trip = await Truck.findById(req.params.id);
        
        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        // Return JSON success response
        res.status(200).json({ 
            success: true, 
            message: 'Trip Updated Successfully',
            tripId: req.params.id
        });
    } catch (err) {
        console.error('Error updating trip:', err);
        // Return JSON error response
        const errorMsg = err.message || 'Failed to update trip. Check your inputs.';
        res.status(400).json({ 
            error: errorMsg,
            tripId: req.params.id
        });
    }
});


// Delete trip 
router.post('/delete-trip/:id', ensureAuth, async (req, res) => {
    try {
        let trip = await Truck.findById(req.params.id);

        if (!trip) return res.status(404).json({ error: 'Trip not found' });

        // Ensure the logged-in user owns the trip
        if (trip.user.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this trip.' });
        }

        await Truck.deleteOne({ _id: req.params.id });

        //Return JSON success response
        res.status(200).json({ 
            success: true, 
            message: 'Trip Deleted Successfully' 
        });

    } catch (err) {
        console.error('Error deleting trip:', err);
        res.status(500).json({ error: 'Failed to delete trip.' });
    }
});


module.exports = router;
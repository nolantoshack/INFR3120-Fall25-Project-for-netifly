const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); 

module.exports = function(passport) {
    
    // 1. LOCAL STRATEGY For email/password login form
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email.toLowerCase() });

                if (!user) {
                    return done(null, false, { message: 'That email is not registered.' });
                }

                // Match password
                if (user.password === password) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect.' });
                }
            } catch (err) {
                console.error("Local Strategy Error:", err);
                return done(err);
            }
        })
    );

    // 2. GOOGLE STRATEGY For Google sign-in
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback"
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;
                    let user = await User.findOne({ email });

                    if (!user) {
                        user = await User.create({
                            fullName: profile.displayName,
                            email,
                            password: null, // Google users don't have a local password
                            role: "Driver",
                            googleId: profile.id
                        });
                    }
                    return done(null, user);
                } catch (error) {
                    console.error("Google Strategy Error:", error);
                    done(error, null);
                }
            }
        )
    );

    //Serialization 
    // Save user ID to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Retrieve user from the session using the ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
const fs = require('fs');
const https = require('https');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

const PORT = 3000;

// --- Mock Database (In-Memory User Storage) ---
// In a real application, replace this with MongoDB (Mongoose) or PostgreSQL/MySQL
const users = [];

// SSL options
const options = {
  key: fs.readFileSync('security/cnvmont.key'),
  cert: fs.readFileSync('security/cnvmont.cert')
};

// Body parser to handle form data
app.use(express.urlencoded({ extended: false }));

// 1. Session Middleware: Required for Passport to keep track of logged-in users
app.use(session({
    secret: fs.readFileSync('security/user_secret.key'), // Change this to a secure random string
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false // Set to true if using HTTPS in production
    }
}));

// 2. Passport Middleware: Initializes Passport and restores session
app.use(passport.initialize());
app.use(passport.session());

// --- Passport Configuration ---

// Define the Local Strategy for username/password authentication
passport.use(new LocalStrategy(
    // The field names in your login form
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        try {
            // 1. Find the user by email
            const user = users.find(u => u.email === email);
            if (!user) {
                // User not found
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            // 2. Compare the submitted password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (isMatch) {
                // Password matches, authentication successful
                return done(null, user);
            } else {
                // Password does not match
                return done(null, false, { message: 'Incorrect email or password.' });
            }
        } catch (err) {
            return done(err);
        }
    }
));

// Serialization: What data to store in the session cookie (usually just the user ID)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialization: Retrieve the full user object from the database using the ID stored in the session
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// --- Authentication Check Middleware ---

// Custom middleware to restrict access to authenticated users
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is logged in, continue to the next route handler
    }
    // User is not logged in, redirect them to the login page
    res.redirect('/login');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use("/", require("./routes/home"));
app.use("/3dmodels", require("./routes/models"));
app.use("/skinning", require("./routes/skinning"));
app.use("/editing", require("./routes/editing"));
app.use("/verge3d", require("./routes/verge3d"));

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});
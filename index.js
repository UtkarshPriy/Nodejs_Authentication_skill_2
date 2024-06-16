import './env.js';
import express from "express";
import { urlencoded } from "express";
import path from 'path';
import User from './src/controller/user.controller.js';
import db from './src/config/mongoose.config.js';
import session from 'express-session';
import passport from "./src/config/passport.config.js";
import ensureAuthenticated from './src/middleware/auth.middleware.js';
import passportGoogle from "./src/config/passport.config.js";

const app = express();
app.set('view engine', 'ejs');

app.use(urlencoded({ extended: true }));

// Set up session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'secretKey', // Use environment variable for session secret
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 1000 * 60 * 60 * 1 } // 1 hour
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(path.resolve(), 'src', 'view'));
app.use(express.static(path.join(path.resolve(), 'src', 'public')));

const userCntrl = new User();

// Define routes
app.get('/', userCntrl.signIn);
app.get('/signin', userCntrl.signIn);
app.get('/signup', userCntrl.signUp);
app.post('/signup', userCntrl.addUser);
app.get('/resetpassword',userCntrl.resetPage);
app.post('/resetpassword',userCntrl.resetPassword);

// Local strategy authentication
app.post('/signin',
    passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }),
    function (req, res) {
        res.redirect('/home');
    },
    userCntrl.viewHome
);      

// Google OAuth authentication request
app.get('/auth/google', 
    passport.authenticate('google', { scope: ['email', 'profile'] }) // Initial Google auth request
);

// Google OAuth callback handling
app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/signin', failureMessage: true }), // Google auth callback
    function (req, res) {
        res.redirect('/home');
    },
    userCntrl.viewHome
);

// Route requiring authentication
app.get('/home', ensureAuthenticated, userCntrl.viewHome);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;

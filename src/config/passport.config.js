import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';

import Userlist from '../model/user.model.js'; // Adjust path as necessary

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, (userid, password, done) => {
    console.log("LocalStrategy: started");

    Userlist.findOne({ email: userid })
        .then(user => {
            console.log("LocalStrategy: user found:", user);

            if (!user) {
                console.log('LocalStrategy: incorrect email');
                return done(null, false, { message: 'Incorrect email.' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    console.log('LocalStrategy: password match:', isMatch);

                    if (!isMatch) {
                        console.log('LocalStrategy: incorrect password');
                        return done(null, false, { message: 'Incorrect password.' });
                    }

                    console.log('LocalStrategy: success');
                    return done(null, user);
                })
                .catch(err => {
                    console.log('LocalStrategy: error during password comparison:', err);
                    return done(err);
                });
        })
        .catch(err => {
            console.log('LocalStrategy: error during user lookup:', err);
            return done(err);
        });
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: 'http://localhost:3300/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    // Here we directly pass the profile to the done callback
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;

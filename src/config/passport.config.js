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
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
}, (token, tokenSecret, profile, done) => {
    Userlist.findOne({ googleId: profile.id })
        .then(user => {
            if (!user) {
                return Userlist.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    displayName: profile.displayName
                });
            }
            return user;
        })
        .then(user => done(null, user))
        .catch(err => done(err));
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    Userlist.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
});

export default passport;

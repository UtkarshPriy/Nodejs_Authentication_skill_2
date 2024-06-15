import express from "express";
import { urlencoded } from "express";
import path from 'path';
import User from './src/controller/user.controller.js'
import db from './src/config/mongoose.config.js';
// import passport from 'passport';
import session from 'express-session';
import passport from "./src/config/passport.config.js";



const app = express();
app.set('view engine','ejs');

app.use(urlencoded({extended:true}));
// app.use(bodyParser.urlencoded({ extended: false }));
// console.log(path.join(path.join(path.resolve(),'src','public')));

app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 1000 * 60 * 60 * 1 } // 1 day
}));


app.use(passport.initialize());
app.use(passport.session());


app.set('views',path.join(path.resolve(),'src','view'));
app.use(express.static(path.join(path.resolve(),'src','public')))

const userCntrl = new User();

app.get('/',userCntrl.signIn);
app.get('/signin',userCntrl.signIn);
app.get('/signup',userCntrl.signUp);
app.post('/signup',userCntrl.addUser);
app.post('/signin',
    passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }),
    function(req, res) {
      res.redirect('/home');
    }
    ,userCntrl.viewHome);
app.get('/home',userCntrl.viewHome);



export default app;
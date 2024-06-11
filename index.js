import express from "express";
import { urlencoded } from "express";
import path from 'path';
import User from './src/controller/user.controller.js'
import db from './src/config/mongoose.config.js';




const app = express();
app.set('view engine','ejs');

app.use(urlencoded({extended:true}));
// console.log(path.join(path.join(path.resolve(),'src','public')));
app.set('views',path.join(path.resolve(),'src','view'));
app.use(express.static(path.join(path.resolve(),'src','public')))

const userCntrl = new User();


app.get('/',userCntrl.signIn);
app.get('/signup',userCntrl.signUp);
app.post('/signup',userCntrl.addUser);

export default app;
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';

const {Schema} =  mongoose;

const userSchema = new Schema({
    // username: String,
    email:String,
    password:String
});





const userList =  mongoose.model('userList',userSchema);

export default userList;



import mongoose from 'mongoose';

const {Schema} =  mongoose;

const userSchema = new Schema({
    username: String,
    email:String,
    password:String
});





const userList =  mongoose.model('userList',userSchema);

export default userList;


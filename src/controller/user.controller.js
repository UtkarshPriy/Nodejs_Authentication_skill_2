import bcrypt from 'bcrypt';
import userList from '../model/user.model.js'

export default class User{

    signIn = (req,res)=>{

        res.status(200).render('signIn');
    }
    signUp = (req,res)=>{

        res.status(200).render('signUp');
    }

    addUser = async(req,res)=>{
        const{username,email,password} = req.body;
        const saltround = 11;
        try{
        const hashedPassword = await bcrypt.hash(password,saltround);
        }catch(error){
            console.log(error);
        }
        let newUser = {
            username:username,
            email:email,
            password:hashedPassword
        }
        

    }

}
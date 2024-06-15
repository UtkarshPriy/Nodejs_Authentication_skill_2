import bcrypt from 'bcrypt';
import userList from '../model/user.model.js'

export default class User {

    signIn = (req, res) => {

        res.status(200).render('signIn');
    };
    signUp = (req, res) => {

        res.status(200).render('signUp');
    };

    addUser = async (req, res) => {
        console.log('check');
        const {
            // username,
            email,
            password
        } = req.body;
       

        const saltround = 11;
        let hashedPassword = null;
        try {
             hashedPassword = await bcrypt.hash(password, saltround);
        } catch (error) {
            console.log(error);
        }
        let newUser = {
            // username: username,
            email: email,
            password: hashedPassword
        }

        try {
            await userList.create(newUser);
            res.status(201).render('home',{loggedInUser:newUser});
        } catch (error) {
            console.log(error);
        }
        


    }

    viewHome = async(req,res)=>{
        if (!req.isAuthenticated()) {
            console.log(req.user);
            return res.redirect('/');
        }
        console.log(req.user);
        res.render('home', {loggedInUser:req.user})
    }

}
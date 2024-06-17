import bcrypt from 'bcrypt';
import userList from '../model/user.model.js';

export default class User {

    signIn = (req, res) => {
        res.status(200).render('signIn');
    };
    signUp = (req, res) => {
        res.status(200).render('signUp');
    };

    addUser = async (req, res) => {
        // console.log('check');
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
            
            return res.redirect('/');
        }
        // console.log(req.user);
        res.render('home', {loggedInUser:req.user})
    }
    resetPage = async(req,res)=>{
        res.render('reset');
    };
    resetPassword = async(req,res)=>{
        const{password} = req.body;
        const mailid = req.user.email;
        try{
            const saltround=11;
            const hashedPassword = await bcrypt.hash(password, saltround);
            await userList.findOneAndUpdate({email:mailid},{password:hashedPassword});

        }catch(error){
            console.log(error);
        }
        res.status(200).render("signIn",{msg: 'Password updated successfully'});

    }
    signOut = (req, res) => {
        req.logout((err) => { // Using the callback function
            if (err) {
                return res.status(500).json({ message: 'An error occurred while logging out.' });
            }
            res.status(200).render("signIn", { msg: 'Logged Out' }); // Render the signIn view with a message
        });
    }
    
}






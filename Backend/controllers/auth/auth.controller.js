const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

//register
const registerUser = async (req, res) => {
   const { username,email, password } = req.body;
   try{
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
         username,email, password: hashedPassword 
        });
        await newUser.save();
        res.status(201).json({
            success:true,
            message:'User created successfully'})


   }
    catch(e){
        res.status(500).json({
            success:false,
            message:e.message})
        
    };
}


// login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try{

    }
    catch(e){
        res.status(500).json({
            success:false,
            message:e.message})
        
    };
}
// logout
// auth middleware

module.exports = {
    registerUser,
    loginUser,
};
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { generateToken } = require('../services/authentication');
const saltRounds = 10;
const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    }
},{timestamps : true})

userSchema.statics.checkPasswordAndCreateToken = async function(user){
    const { email, password } = user;
    const existingUser = await this.findOne({ email });
    if(!existingUser){
        return {success: false, text: "User not found.Please Create an Account"};
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if(!isMatch){
        return {success: false, text: "Incorrect Password"};
    }
    const token = await generateToken({
        userName: existingUser.userName,
        userId: existingUser._id,
        email: existingUser.email,
        password: existingUser.password
    })
    return {success: true, text: "Login Successful", token: token};
}


userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')){
            return next();
        }
        const hash = await bcrypt.hash(this.password, saltRounds);
        this.password = hash;
    }catch(err){
        throw err;
    }
});

module.exports = mongoose.model("User", userSchema);
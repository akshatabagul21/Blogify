const express = require('express');
const router = express.Router();
const User = require('../models/user')
const { generateToken } = require('../services/authentication');


router.get("/signup", (req, res) => {
    res.clearCookie("token");
    return res.render("signup",{ message: null,success: false, formData: { userName: null, email: null, password: null }})
})

router.get("/signin", (req, res) => {
    const data = { formData : {email: null, password: null} }
    if(req.query.Acc_created == 'true'){
        data.message = "Account Created Successfully"
        data.success = true
        
    }else{
        data.message = "Please Login"
        data.success = false
    }
    return res.render("signin",data);
})

router.post("/signup",async (req, res) => {
    const { userName, email, password } = req.body;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return res.render("signup", { message: "Email already exists",success: false, formData: { userName: userName, email: email, password: password } })
    }
    await User.create(
        {
            userName,
            email,
            password
        }
    )
    return res.redirect("/users/signin?Acc_created=true");
})

router.post("/signin",async (req, res) => {
    const user = req.body;
    const userStatus = await User.checkPasswordAndCreateToken(user);
    if (!userStatus.success) {
        return res.render("signin", { message: userStatus.text,formData: req.body});
    } else {
        res.cookie("token", userStatus.token,{httpOnly: true});
        return res.redirect('/?loginSuccess=true')
    }

})

router.get("/logout",async (req,res) => {
    return res.clearCookie('token').redirect("/");
})

module.exports = router;
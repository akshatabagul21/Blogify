const express = require('express');
const router = express.Router();
const User = require('../models/user')
const { generateToken } = require('../services/authentication');


router.get("/signup", (req, res) => {
    res.clearCookie("token");
    res.render("signup")
})

router.get("/signin", (req, res) => {
    res.clearCookie("token");
    res.render("signin");
})

router.post("/signup", async (req, res) => {
    const { userName, email, password } = req.body;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return res.render("signup", { message: "Email already exists" })
    }
    await User.create(
        {
            userName,
            email,
            password
        }
    )
    res.redirect("/users/signin");
})

router.post("/signin", async (req, res) => {
    const user = req.body;
    const userStatus = await User.checkPasswordAndCreateToken(user);
    if (!userStatus.success) {
        if (userStatus.text.includes("User not found")) {
            return res.render("signin", { message: userStatus.text,formData: req.body });
        } else {
            return res.render("signin", { message: userStatus.text,formData: req.body });
        }
    } else {
        res.cookie("token", userStatus.token,{httpOnly: true});
        return res.redirect('/')
    }

})

module.exports = router;
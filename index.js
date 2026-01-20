const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const {authenticateAndCheckCookieValue} = require('./middleware/checkToken');

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(() => {
    console.log("Mongodb Connected");
}).catch((err) => {
    console.log("MongoDB connection error:", err);
});



const app = express();
const port = 8000;
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use('/users', userRouter);
app.use(authenticateAndCheckCookieValue('token'));

app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.get("/",(req,res) => {
    console.log("re.user",req.user);
    res.render("home", {
        user : req.user,
        message : "Login Successful",
        success : true
    })
})


app.listen(port, () => {
    console.log("server started at " + port)
})
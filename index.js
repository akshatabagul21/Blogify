const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog')
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
app.use(express.static(path.resolve("./uploads")))
app.use('/users', userRouter);
// app.use(authenticateAndCheckCookieValue('token'));
app.use('/blog',authenticateAndCheckCookieValue('token'), blogRouter)
app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.get("/",authenticateAndCheckCookieValue('token'),(req,res) => {
    const data = {user : req.user}
    if(req.query.loginSuccess === "true"){
        {
        data.message = "Login Successful",
        data.success = true
    }
    }
    res.render("home", data)
})


app.listen(port, () => {
    console.log("server started at " + port)
})
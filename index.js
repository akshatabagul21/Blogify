const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog')
const Blog = require('./models/blogModel')
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
app.use('/uploads', express.static('uploads'));
app.use('/blog/uploads', express.static('uploads'));

app.use('/users', userRouter);
app.use(authenticateAndCheckCookieValue('token'));
app.use('/blog', blogRouter)
app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.get("/",async (req,res) => {
    const allBlogs = await Blog.find().sort({createdAt : -1})
    const data = {user : req.user , allBlogs : allBlogs}
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
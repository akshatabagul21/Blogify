const express = require('express')
const router = express.Router();
const multer = require('multer')
const Blog = require('../models/blogModel')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });



router.get("/" , (req,res) => {
    return res.render("add-Blog" , {
        user : req.user
    })
})

router.post("/" , upload.single('uploadfile') , (req,res) => {
    console.log(req.body);
    console.log(req.file);
    return res.redirect("/")
})


module.exports = router;
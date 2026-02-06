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

router.get("/:id" , async (req,res) => {
  const blog = await Blog.findById(req.params.id);
  console.log("blog" , blog)
  return res.render("blog", {
    user : req.user,
    blog : blog
  })
})

router.post("/" , upload.single('uploadfile') , async (req,res) => {
  console.log("req.user",req.user)
  const title = req.body.title , content = req.body.content 
    await Blog.create(
      {
          title,
          content,
          imageUrl : `uploads/${req.file.filename}`,
          createdBy : req.user.userId
      }
    )
    return res.redirect("/")
})


module.exports = router;
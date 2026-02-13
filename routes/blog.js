const express = require('express')
const router = express.Router();
const multer = require('multer')
const Blog = require('../models/blogModel')
const fs = require("fs")
const comment = require('../models/comment')

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

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('comments').populate('createdBy');
  return res.render("blog", {
    user: req.user,
    blog: blog
  })
})

router.post("/", upload.single('uploadfile'), async (req, res) => {
  const title = req.body.title, content = req.body.content, file = req.file
  if (!title || !content || !file) {
    if(file){
      fs.unlinkSync(file.path)
    }
    return res.render("add-Blog", { user: req.user, message: "Please Fill All The Data", success: false})

  } else {
    await Blog.create(
      {
        title,
        content,
        imageUrl: `uploads/${file.filename}`,
        createdBy: req.user.userId
      }
    )
    return res.redirect("/")
  }
})

router.get("/:id/comment" , (req,res) => {
   return res.render("comment" , {
        user : req.user,
        blogId : req.params.id
    })

})

router.post("/:id/comment" , async (req,res) => {
  const userName = req.body.userName , commentBody = req.body.comment
  if(userName && commentBody){
  const newComment = await comment.create({
      userName,
      commentBody,
      commentBy : req.user.userId
    })
    const blog = await Blog.findById(req.params.id);
    blog.comments.push(newComment._id);
    await blog.save();
    return res.redirect(`/blog/${req.params.id}`)
  }
 

})

module.exports = router;
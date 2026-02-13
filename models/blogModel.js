const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    content :{
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: true
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }]

}, {timestamps : true})

module.exports = mongoose.model("Blog",blogSchema)
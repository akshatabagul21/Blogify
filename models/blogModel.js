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
    image : {
        type: String,
        required: true
    },
    createdBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps : true})

module.exports = mongoose.model("Blog",blogSchema)
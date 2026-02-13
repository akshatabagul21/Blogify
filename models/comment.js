const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true
    },
    commentBody : {
        type: String,
        required: true
    },
    commentBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }

})

module.exports = mongoose.model("Comment",commentSchema);
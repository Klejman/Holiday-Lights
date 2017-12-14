const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    // Author's Name
    author: {
        type: String
    },
    // Comment Content
    content: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }


});

const Comment = mongoose.model("Comment", CommentSchema, "comments");

// Export the Model
module.exports = Comment;
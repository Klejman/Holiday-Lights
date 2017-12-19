const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    content: {
        type: String
    }
});

const Comment = mongoose.model("Comment", CommentSchema, "comments");

// Export the Model
module.exports = Comment;
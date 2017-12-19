const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const CommentSchema = new Schema({
    comment: String
});

const Comment = mongoose.model("Comment", CommentSchema);

// Export the Model
module.exports = Comment;
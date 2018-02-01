const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const CommentSchema = new Schema({

    _HolidayArticleId: {
        type: Schema.Types.ObjectId,
        ref: 'HolidayArticle',

    },
    comment: String

});

const Comment = mongoose.model("Comment", CommentSchema);

// Export the Model
module.exports = Comment;
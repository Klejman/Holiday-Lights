const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const HolidayArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    // img: {
    //     type: String,
    //     data:  Schema.Types.Mixed,
    // },

    link: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

    updated: {
        type: Date,
        default: Date.now
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }]

});

const HolidayArticle = mongoose.model("HolidayArticle", HolidayArticleSchema, "holidayarticles");

// Export the Model
module.exports = HolidayArticle;
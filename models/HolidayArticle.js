const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const HolidayArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    summary: {
        type: String,
        required: true
    },

});

const HolidayArticle = mongoose.model("HolidayArticle", HolidayArticleSchema);

// Export the Model
module.exports = HolidayArticle;
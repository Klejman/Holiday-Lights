const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const HolidayNewsSchema = new Schema({
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

    updated: {
        type: Date,
        default: Date.now
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'SiteVisitorsComments'
    }]

});

const HolidayNews = mongoose.model("HolidayNews", HolidayNewsSchema);

// Export the Model
module.exports = HolidayNews;
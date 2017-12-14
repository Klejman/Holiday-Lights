const mongoose = require('mongoose');


const Schema = mongoose.Schema;


const SiteVisitorsCommentsSchema = new Schema({
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
        ref: 'HolidayNews'
    }]

});

const SiteVisitorsComments = mongoose.model("SiteVisitorsComments", SiteVisitorsCommentsSchema);

// Export the Model
module.exports = SiteVisitorsComments;
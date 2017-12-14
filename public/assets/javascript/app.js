
const express = require('express');
const router = express.Router();
const path = require('path');
const request = require('request'); // for web-scraping
const cheerio = require('cheerio');



// Require all models
const HolidayArticle = require("./models/HolidayArticle.js");
const Comment = require("./models/Comment.js");

// $.getJSON("/holidayarticles", function (data) {
//     // For each one
//     for (var i = 0; i < data.length; i++) {
//         // Display the apropos information on the page
//         $("#holidayarticles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + data[i].summary + data[i].updated + data[i].comments + "</p>");
//     }
// });

router.get('/holidayarticles', function (req, res) {

    HolidayArticle.find().sort({_id: -1})
        .populate('comments')
        // Then, send them to the handlebars template to be rendered
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                var hbsObject = {holidayarticles: doc};
                res.render('index.handlebars', hbsObject);
            }
        });

});



$(document).on("submit", "form", function (event) {
    event.preventDefault();
    console.log($(this).serialize());

    const thisId = $(this).attr("data-id");

    const baseURL = window.location.origin;


    // Get Form Data by Id
    var formName = "form-add-" + thisId;
    var form = $('#' + formName);


    $.ajax({
        url: baseURL + '/add/comment/' + thisId,
        type: 'POST',
        /*
        serialize so don't have to constantly do .val and .trim
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    */
        data: form.serialize()
    })
        .done(function (data) {
            console.log(data);
            location.reload();
        });
    //
    // // Prevent Default
    // return false;

});


$(document).on('click', '.delete-button', function () {
    event.preventDefault();

    // Get _id of comment to be deleted
    var thisId = $(this).attr("data-id");

    var baseURL = window.location.origin;

    $.ajax({
        url: baseURL + '/delete/comment/' + thisId,
        type: 'POST'
    })
        .done(function (data) {
            console.log(data);
            // Refresh the Window after the call is done
            location.reload();
        });

    // Prevent Default
    // return false;

});


// Export Router to Server.js
module.exports = router;
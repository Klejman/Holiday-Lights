const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const moment = require("moment");

const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');

// Require all models
const db = require("./models");

const dotenv = require('dotenv');
dotenv.load();

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Express-Handlebars

//handlebars setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//This will render handlebars files when res.render is called.
app.set('view engine', 'handlebars');


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18Jollyifier", {
    useMongoClient: true
});


// Routes
/*
Project Requirements
Headline (result.title)- the title of the article
Summary (result.summary)- a short summary of the article
URL (result.link) - the url to the original article
 */
// A GET route for scraping the website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request.get("http://www.usnews.com/").then(function(response) {
        const $ = cheerio.load(response.data);

        $("div .flex-media-content").each(function(i, element) {
            // Save an empty result object
            const result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children.children("a")
                .text();
            result.link = $(this)
                .children.children("a")
                .attr("href");
            result.summary = $(this)
                .children.children("p .block-flush")
                .text();

            // Create a new Holiday News "Article" using the `result` object built from scraping
            db.HolidayNews
                .create(result)
                .then(function(dbHolidayNews) {
                    // If we were able to successfully scrape and save an Holiday News Article, send a message to the client
                    res.send("Scrape Complete");
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });
    });
});

// Route for getting all Holiday News Articles from the db
app.get("/holidaynewss", function(req, res) {
    // Grab every document in the Articles collection
    db.HolidayNews
        .find({})
        .then(function(dbHolidayNews) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbHolidayNews);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Holiday News Article by id, populate it with it's note
app.get("/holidaynewss/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.HolidayNews
        .findOne({ _id: req.params.id })
        // ..and populate all of the comments associated with it
        .populate("sitevisitorscomments")
        .then(function(dbHolidayNews) {
            // If we were able to successfully find a Holiday News Article with the given id, send it back to the client
            res.json(dbHolidayNews);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Holiday News Article's associated Site Visitor Comments
app.post("/holidaynewss/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.SiteVisitorsComments
        .create(req.body)
        .then(function(dbSiteVisitorsComments) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.HolidayNews.findOneAndUpdate({ _id: req.params.id }, { note: dbSiteVisitorsComments._id }, { new: true });
        })
        .then(function(dbHolidayNews) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbHolidayNews);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Launch App
app.listen(PORT, function(){
    console.log('Running on port: ' + PORT);
});
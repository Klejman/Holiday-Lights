const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const router = express.Router();

const csp = require('helmet-csp');


const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');

// Require all models
// const db = require("./models");
const HolidayArticle = require("./models/HolidayArticle.js");
const Comment = require("./models/Comment.js");

const dotenv = require('dotenv');
dotenv.load();



// Initialize Express
const app = express();
app.use(router);

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
//CSP font error in terminal
app.use(csp({
    directives: {
        fontSrc: ["'self'", "http://fonts.gstatic.com"],
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
    }
}));



// Express-Handlebars

//handlebars setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//This will render handlebars files when res.render is called.
app.set('view engine', 'handlebars');


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/db", {
    useMongoClient: true
});

app
router.get('/', function (req, res){
    console.log('hello');
    res.redirect('/scrape');
});


// Routes
/*
HW Requirements
Headline (result.title)- the title of the article
Summary (result.summary)- a short summary of the article
URL (result.link) - the url to the original article
 */
// A GET route for scraping the website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request.get("https://www.usnews.com/topics/subjects/holidays/").then(function(response) {
        const $ = cheerio.load(response.data);

        $("div .flex-media-content").each(function(i, element) {
            console.log(i && element);
            const result = {};
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("h3")
                .children("a")
                .text().trim();
            // result.image = $(this).parent("div .flex-media-figure .bar-normal .bar-looser-for-medium-up")
            //     .children("a").children("picture:eq(0)")
            result.link = "https://www.usnews.com/topics/subjects/holidays" + $(this)
                .children("h3")
                .children("a")
                .attr("href").trim();
            result.summary = $(this)
                .children("div .show-for-medium-up").children("p:eq(1)")
                .text().trim();


            // Create a new Holiday News "Article" using the `result` object built from scraping
            db.HolidayArticle
                .create(result)
                .then(function(dbHolidayArticle) {
                    // If we were able to successfully scrape and save an Holiday News Article, send a message to the client
                    console.log(dbHolidayArticle);
                    res.send("Scrape Complete");
                })
                .catch(function(err) {
                    res.send(err);
                });
        });
    });
});

// Route for getting all Holiday News Articles from the db
router.get("/holidayarticles", function(req, res) {
    // Grab every document in the Articles collection
    db.HolidayArticle
        .find({})
        .then(function(dbHolidayArticle) {
            // If we were able to successfully find Article(s), send them back to the client
            res.json(dbHolidayArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Holiday News Article by id, populate it with it's note
router.get("/holidayarticles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.HolidayArticle
        .findOne({ _id: req.params.id })
        // ..and populate all of the comments associated with it
        .populate("comments")
        .then(function(dbHolidayArticle) {
            res.json(dbHolidayArticle);
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Holiday News Article's associated Site Visitor Comments
router.post("/holidayarticles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment
        .create(req.body)
        .then(function(dbComment) {
            return db.HolidayArticle.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
        })
        .then(function(dbHolidayArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbHolidayArticle);
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
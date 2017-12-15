const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const router = express.Router();
const path = require('path');

const csp = require('helmet-csp');

const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');

// Require all models
const db = require("./models");

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
// CSP error resolution
app.use(csp({
    directives: {
        fontSrc: ["'self'", "http://fonts.gstatic.com"],
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ['img.com', 'data:'],
    },
    browserSniff: false
}));



// Express-Handlebars

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//This will render handlebars files when res.render is called.
app.set('view engine', 'handlebars');


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scrapenews", {
    useMongoClient: true
});

// store scraped content
let scrapernews = {};
//Test
// console.log('hello');
// res.redirect('/scrape');

// / Routes
// Includes the articles, headline, summary & URL

// A GET route for scraping the website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request.get("https://www.parents.com/holiday/christmas/traditions/great-holiday-stories-for-the-family", function(err, res, html) {
        const $ = cheerio.load(html);
        console.log(html);
        $(".restOfTheSlide").each( function(i, element) {
            scrapernews.title = $(element).find("h2").text();
            scrapernews.link = $(element).children("div").find("a").attr("href").trim();
            scrapernews.summary = $(element).children("div").find("p").text();

            console.log(scrapernews);

            // Create a new Holiday News "Article" using the `result` object built from scraping
            db.HolidayArticle
                .create(scrapernews)
                .then(function(dbHolidayArticle) {
                    // If we were able to successfully scrape and save an Holiday News Article, send a message to the client
                    console.log(dbHolidayArticle);
                    res.send("active scrape in place");
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });
});


router.get('/', function (req, res) {
    db.HolidayArticle.find({})
        .then(function (holidayarticles) {
            // res.json(articles);
            console.log(holidayarticles);
            res.render("index", {scrapernews: holidayarticles});
        }).catch(function (err) {
        if (err) {
            console.log(err);
        }
    })
});

router.get('/holidayarticles', function (req, res) {

    db.HolidayArticle.find().sort({_id: -1})
        .populate('comments')
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                const hbsObject = {holidayarticles: doc};
                res.render('index', hbsObject);
            }
        });

});

router.get("/holidayarticles/:id", function(req, res) {
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
            return db.HolidayArticle.findOneAndUpdate({ _id: req.params.id }, {$addToSet:{ comment: dbComment._id }}, { new: true });
        })
        .then(function(dbHolidayArticle) {
            res.json(dbHolidayArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Launch App
app.listen(PORT, function(){
    console.log('Running on port: ' + PORT);
});
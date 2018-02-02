const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
// const router = express.Router();
const path = require('path');
const app = express();


// const csp = require('helmet-csp');

const logger = require('morgan');
const request = require('request');
const cheerio = require('cheerio');

// Require all models
const db = require("./models");
app.use(express.static("public"));


// Initialize Express
// app.use(router);

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: false}));
// Use express.static to serve the public folder as a static directory
// CSP error resolution
// app.use(csp({
//     directives: {
//         fontSrc: ["'self'", 'https://fonts.gstatic.com/'],
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         styleSrc: ["'self'"],
//         imgSrc: ["'self'"]
//     },
//     browserSniff: false
// }));


// Express-Handlebars

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//This will render handlebars files when res.render is called.
app.set('view engine', 'handlebars');



// if (process.env.MONGODB_URI) {
//     mongoose.connect(process.env.MONGODB_URI);
// }
// else {
    mongoose.Promise = Promise;
    mongoose.connect("mongodb://localhost/scrapenews", {
        useMongoClient: true
    });
// }


// store scraped content
let scrapernews = {};
//Test
// console.log('hello');
// res.redirect('/scrape');

// / Routes
// Includes the articles, headline, summary & URL
let createArticle = function (scrapernews) {
    db.HolidayArticle
        .create(scrapernews)
        .then(function (dbHolidayArticle) {
            console.log(dbHolidayArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
};

// A GET route for scraping the website
app.get("/scrape", function (req, res) {
    console.log('sccrappe');
    // First, we grab the body of the html with request
    request.get("https://www.parents.com/holiday/christmas/traditions/great-holiday-stories-for-the-family", function (err, res, html) {
        const $ = cheerio.load(html);
        $(".restOfTheSlide").each(function (i, element) {
            console.log(element);
            scrapernews.title = $(element).find("h2").text();
            scrapernews.link = $(element).children("div").find("a").attr("href").trim();
            scrapernews.summary = $(element).children("div").find("p").text();

            let count =  db.HolidayArticle.find({title: scrapernews.title}).count();
            if (count != 0) {
                createArticle(scrapernews);
            }
        });
    });
});


app.get('/', function (req, res) {
    db.HolidayArticle.find({})
        .then(function (holidayarticles) {
            console.log(holidayarticles);
            res.render("index", {scrapernews: holidayarticles});
        }).catch(function (err) {
        if (err) {
            console.log(err);
        }
    })
});

app.get("/holidayarticles/:id", function (req, res) {
    db.Comment.find({_HolidayArticleId: req.params.id})
        // .populate("comment")
        .then(function (holidayarticleComment) {
            console.log(holidayarticleComment);
            res.json(holidayarticleComment)
        }).catch(function (err) {
        if (err) {
            console.log(err);
        }
    });
});

//
// app.get('/holidayarticles/:id', function (req, res) {
//
//     db.HolidayArticle.findOne({_id: req.params.id}).sort({_id: -1})
//         .populate('comments')
//         .then(function (holidayarticleComment) {
//             console.log(holidayarticleComment);
//             res.json(holidayarticleComment)
//         }).catch(function (err) {
//         if (err) {
//             console.log(err);
//         }
//         // .exec(function (err, doc) {
//         //     if (err) {
//         //         console.log(err);
//         //     }
//         //     else {
//         //         const hbsObject = {holidayarticles: doc};
//         //         res.render('index', hbsObject);
//         //     }
//         // });
//
//     });
// });


app.post("/holidayarticles/:id", function (req, res) {
    console.log(req, res);
    db.Comment
        .create(req.body)
        .then(function (dbComment) {
            console.log(dbComment);
            console.log(`${dbComment._id}`);
            res.json(dbComment)
        })
        .catch(function (err) {
            console.log(err);
        });
});

// Launch App
app.listen(PORT, function () {
    console.log('Running on port: ' + PORT);
});
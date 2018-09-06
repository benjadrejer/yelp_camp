//---SETUP---
//EXPRESS is the web framework, the backbone of the app. Set the routes, view engine, and use any dependencies on express.
var express = require('express');
var app = express();

//BODYPARSER parses request bodies (req.body), in this only when the Content-Type of the header is urlencoded.
// returns key/value pairs. Extended enables the value to be any type.  
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

//Mongoose
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

//EJS is the view engine used
app.set("view engine","ejs");

//Use directory for stylesheets etc.
app.use(express.static(__dirname + '/public'));

//Models
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');

//Seeding
seedDB = require('./seeds');
seedDB();

//ROUTES
app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds",function(req,res){
    //Get all campgrounds from the DB
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds})
        }
    })
});

app.get("/campgrounds/new",function(req,res){
   res.render("campgrounds/new"); 
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get('/campgrounds/:id',function(req, res) {
    //find campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            //render template showing campground description
            res.render("campgrounds/show", {campground: foundCamp});
        }
    });
});

app.get('/campgrounds/:id/comments/new', function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', { campground: camp });
        }
    });
});

app.post('/campgrounds/:id/comments', function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect('/campgrounds/' + camp._id);
                }
            })
        }
    });
});

//Set the startup functionality and port to listen to
app.listen(8080,function(){
    console.log("Yelpcamp Server Online");
});
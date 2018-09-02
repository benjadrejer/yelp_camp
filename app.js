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

//Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Granite Hill", 
//     image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!",
// }, function(err, campground) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log("Newly created campground: ");
//         console.log(campground);
//     }
// })

//GLOBAL VARIABLES
    var campgrounds = [
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
    ];

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
            res.render("index", {campgrounds: campgrounds})
        }
    })
});

app.get("/campgrounds/new",function(req,res){
   res.render("new"); 
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
    Campground.findById(req.params.id, function(err, foundCamp) {
        if(err) {
            console.log(err);
        } else {
            //render template showing campground description
            res.render("show", {campground: foundCamp});
        }
    });
})

//Set the startup functionality and port to listen to
app.listen(8080,function(){
    console.log("Yelpcamp Server Online");
});
//---SETUP---
var passport = require('passport');
var localStrategy = require('passport-local');

//Express Routes
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

//Models
var User = require('./models/user');

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

//Configure Passport
app.use(require('express-session')({
    secret: 'thisisthebestsecretintheworld',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for every single route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

//Use express routes, prepend universal route prefixes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

//Seeding
// seedDB = require('./seeds');
// seedDB();

//Set the startup functionality and port to listen to
app.listen(8080,function(){
    console.log("Yelpcamp Server Online");
});
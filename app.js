//---SETUP---
var passport = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var flash = require('connect-flash');

//Express Routes
var commentRoutes = require('./routes/comments');
var campgroundRoutes = require('./routes/campgrounds');
var indexRoutes = require('./routes/index');

//Environment Variables
url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
port = process.env.PORT || 8080;
sessionSecret = process.env.SECRET || 'thisisthebestsecretintheworld';

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
// export DATABASEURL=mongodb://localhost/yelp_camp <- Making Environment Variable
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });

//EJS is the view engine used
app.set("view engine","ejs");

//Use directory for stylesheets etc.
app.use(express.static(__dirname + '/public'));

//Configure Passport
app.use(require('express-session')({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for every single route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
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
app.listen(port,function(){
    console.log("Yelpcamp Server Online");
});
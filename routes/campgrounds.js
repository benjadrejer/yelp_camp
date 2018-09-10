var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.get("/",function(req,res){
  //Get all campgrounds from the DB
  Campground.find({}, function(err, campgrounds) {
      if (err) {
          console.log(err);
      } else {
          res.render("campgrounds/index", {campgrounds: campgrounds})
      }
  })
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req,res){
 res.render("campgrounds/new"); 
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
      id: req.user._id,
      username: req.user.username,
  }
  var newCampground = {name: name, image: image, description: desc, author, price: price};
  //Create a new campground and save to DB
  Campground.create(newCampground, function(err, campground) {
      if (err) {
          console.log(err);
      } else {
          res.redirect("/campgrounds");
      }
  });
});

//SHOW
router.get('/:id',function(req, res) {
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

//EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        res.render("campgrounds/edit", {campground: campground});
    });
});

//UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
        if(err) {
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
});

module.exports = router;
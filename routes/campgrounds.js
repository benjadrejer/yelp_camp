var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

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

router.get("/new",function(req,res){
 res.render("campgrounds/new"); 
});

router.post("/",function(req,res){
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

module.exports = router;
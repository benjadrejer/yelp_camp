var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

//LANDING
router.get("/",function(req,res){
  res.render("landing");
})

//REGISTER FORM
router.get('/register', function(req, res) {
  res.render('register');
});

//SIGN UP LOGIC
router.post('/register', function(req, res) {
  var newUser = new User({ username: req.body.username});
  User.register(newUser, req.body.password, function(err, user) {
      if (err) {
          req.flash("error", err.message);
          return res.redirect('/register');
      }
      passport.authenticate('local')(req, res, function() {
          req.flash("success", "Welcome to YelpCamp " + user.username);
          res.redirect('/campgrounds');
      });
  });
});

//LOGIN FORM
router.get('/login', function(req, res) {
  res.render('login');
});

//LOGIN LOGIC
router.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), function(res, res) {
});

//LOGOUT
router.get('/logout', function(req, res) {
  req.logOut();
  req.flash("success", "Logged you out");
  res.redirect('/campgrounds');
});

module.exports = router;
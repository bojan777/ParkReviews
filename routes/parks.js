var express = require("express");
var router = express.Router();   
var Park = require("../models/park");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder'); //Node library for geocoding and reverse geocoding
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX Show all Parks
router.get('/', function (req, res) {
    Park.find({}, function(err, parks){
    if(err){
        console.log(err);
    } else{
        console.log(parks);
        res.render('parks/index.ejs', {parks:parks, currentUser: req.user});
    }
});
});

//NEW
router.get('/new', middleware.isLoggedIn, function (req, res) {
  res.render('parks/new.ejs');
});


//SHOW - Shows info about 1 Park
router.get('/:id', function (req, res) {
  Park.findById(req.params.id).populate("comments").exec(function(err, foundPark){      //findById finds by id in database 
      if(err){
          console.log(err);
      } else{
        console.log(foundPark);
        res.render('parks/show.ejs', {park:foundPark});
      }
  });
});

//CREATE - add new park to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to park array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var price = req.body.price;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newPark = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
    // Create a new park and save to DB
    Park.create(newPark, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to park page
            console.log(newlyCreated);
            res.redirect("/parks");
        }
    });
  });
});


//EDIT PARK ROUTE
router.get('/:id/edit', middleware.checkParkOwnership, function (req, res) {
    Park.findById(req.params.id, function(err, foundPark){
        res.render('parks/edit',{park: foundPark});
    });
});


// UPDATE PARK ROUTE
router.put("/:id", middleware.checkParkOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.park.lat = data[0].latitude;
    req.body.park.lng = data[0].longitude;
    req.body.park.location = data[0].formattedAddress;
    
    Park.findByIdAndUpdate(req.params.id, req.body.park, function(err, updatedPark){
        if(err){
            req.flash("error", err.message);
            res.redirect("/parks");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/parks/" + req.params.id);
        }
    });
  });
});



//DESTROY PARK ROUTE
router.delete('/:id',middleware.checkParkOwnership, function (req, res) {
    Park.findByIdAndRemove(req.params.id, function(err, foundPark){
        if(err){
            res.redirect("/parks");
        }else{
            res.redirect("/parks");
        }
    });
});




module.exports = router;
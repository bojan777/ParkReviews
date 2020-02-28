var express = require("express");
var router = express.Router();   
var Park = require("../models/park");
var middleware = require("../middleware");


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

//CREATE
router.post('/',middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var url = req.body.imageUrl;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //console.log(req);
    console.log(req.user.username);
    Park.create({
      name:name,
      image:url,
      description:description,
      price:price,
      author: author,
        }, function(err, park){
            if(err){
                console.log(err);
            } else{
        res.redirect("/parks");
      }
  });
});


//EDIT PARK ROUTE
router.get('/:id/edit', middleware.checkParkOwnership, function (req, res) {
    Park.findById(req.params.id, function(err, foundPark){
        res.render('parks/edit',{park: foundPark});
    });
});


//UPDATE PARK ROUTE
router.put('/:id',middleware.checkParkOwnership, function (req, res) {
    //find and update the correct campground
    Park.findByIdAndUpdate(req.params.id, req.body.park,function(err, updatedPark){
        if(err){
            res.redirect("/parks");
        }else{
            res.redirect("/parks/"+req.params.id);
        }
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
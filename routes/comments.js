var express = require("express");
var router = express.Router({mergeParams: true});    //mergeParams will merge params from park and comments
var Park = require("../models/park");
var Comment = require("../models/comment");
var middleware = require("../middleware");



//COMMENTS NEW
router.get('/new', middleware.isLoggedIn, function (req, res) {
    Park.findById(req.params.id, function(err, park){
        if(err){
            console.log(err);
        } else{
            res.render('comments/new', {park:park});
        }
    });
});

//COMMENTS CREATE
router.post('/', middleware.isLoggedIn, function (req, res) {
  //find park using id
  //create new comment
  //connect new comment to park 
  //redirect to park showpage
  Park.findById(req.params.id, function(err, park){
        if(err){
            console.log(err);
            res.redirect("/parks");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);  
                } else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    park.comments.push(comment);
                    park.save();
                    console.log(comment);
                    req.flash("success", "Sucessfully added comment");
                    res.redirect('/parks/' + park._id);
                }
            });
        }
    });
});


//COMMENTS EDIT ROUTE
router.get('/:comment_id/edit',middleware.checkParkOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {park_id:req.params.id, comment: foundComment});
        }
    });
});

//COMMENTS UPDATE ROUTE
router.put('/:comment_id',middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/parks/"+req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete('/:comment_id',middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/parks/" + req.params.id);
        }
    });
});




module.exports = router;


//Middleware
var Park = require("../models/park");
var Comment = require("../models/comment");

var middlewareObj = {};



middlewareObj.checkParkOwnership = function (req,res,next){
    if(req.isAuthenticated()){
        Park.findById(req.params.id, function(err, foundPark){
            if(err){
                req.flash("error", "Park not found");
                res.redirect("back");
            }else{
                if(foundPark.author.id.equals(req.user._id)){    // .equals used because foundPark.author.id is not a string but a mongoose object
                   next();
                } else{
                    req.flash("error", " You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
            
    }
};


middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){    // .equals used because foundPark.author.id is not a string but a mongoose object
                   next();
                } else{
                    req.flash("error", " You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
        }else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back");
    }
};



middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "You need to be logged in to do that"); //this lines needs to be before redirecting 
        res.redirect("/login");
    }
};




module.exports = middlewareObj;
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({   
   username:String,
   password: String,
});

userSchema.plugin(passportLocalMongoose); //takes passportLocalMongoose pckg & adds methods, features

module.exports = mongoose.model("User", userSchema); 
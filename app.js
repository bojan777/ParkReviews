var express = require("express");
var app = express();
var mongoose = require("mongoose");
var flash = require("connect-flash");
//var flash = require("connect-flash-plus");
var bodyParser = require("body-parser");
var passport = require("passport");
var methodOverride = require("method-override");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var Park = require("./models/park");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

//requiring routes
var commentsRoutes = require("./routes/comments");
var parkRoutes = require("./routes/parks");
var indexRoutes = require("./routes/index");


//Mongodb Cloud 9
//mongoose.connect("mongodb://localhost:27017/parks_review", { useNewUrlParser: true, useUnifiedTopology: true }); //This will create database inside mongodb, 2nd args are to solve depracation warnings

//MongoDB Allas 
mongoose.connect("mongodb+srv://bojan:Inuit1000@cluster0-7ii2c.mongodb.net/test?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log("Connected to DB");
}).catch(err => {
    console.log("ERROR:", err.message);
}); 


app.use(bodyParser.urlencoded({extended: true}));  //to parse the req
app.use(express.static(__dirname + "/public")); 
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();   //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Meow Meow",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){     //whatever function we provide here will be called on every route
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next();
});

app.use("/", indexRoutes);
app.use("/parks/:id/comments", commentsRoutes); 
app.use("/parks", parkRoutes);     // "parks" lets us in parks.js use "/" instead of "/parks"


app.listen(process.env.PORT, process.env.IP, function(){    //Env variables amazon has setup                                
   console.log("The ParksReview Server Has Started!");
}); 

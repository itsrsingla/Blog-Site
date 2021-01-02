var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

var User = require("./models/user");
var Comment = require("./models/comment");
var Blog = require("./models/blog");

var indexRoute = require("./routes/index");
var commentRoute = require("./routes/comment");
var blogRoute = require("./routes/blog");

mongoose.connect("mongodb://localhost/blog_app");

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "any sentence here",
    resave : false,
    saveUninitialized : false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
app.use(indexRoute);
app.use(commentRoute);
app.use(blogRoute);


app.get("/",function(req,res){
    res.redirect("/blog");
});


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server is started");
});
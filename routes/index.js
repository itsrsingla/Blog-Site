var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// REGISTER ROUTES
router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var newUser = new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/blog");
        });
    });
});
// LOGIN ROUTES
router.get("/login",function(req, res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect : "/blog",
    failureRedirect : "/login"
}),function(req,res){
});
// LOGOUT ROUTE
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/blog");
});

module.exports = router;
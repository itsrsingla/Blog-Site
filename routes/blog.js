var express = require("express");
var router = express.Router({mergeParams : true});
var middleware = require("../middleware");

var Blog = require("../models/blog");

// INDEX ROUTE

router.get("/blog",function(req,res){
    Blog.find(function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("blogs/index",{blogs:foundBlog});
        }
    });
});

// NEW ROUTE
router.get("/blog/new",middleware.isLoggedIn,function(req,res){
    res.render("blogs/new");
});

// CREATE ROUTE

router.post("/blog",function(req,res){
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var blog = new Blog({
        title : req.body.title,
        content : req.body.content,
        author : author
    })
    blog.save(function(err,savedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blog/" + savedBlog._id);
        }
    });
});

// SHOW BLOG

router.get("/blog/:id",function(req,res){
    Blog.findById(req.params.id).populate("comment").exec(function(err,foundBlog){
    // Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            // console.log(foundBlog);
            res.render("blogs/show",{blog:foundBlog});
        }
    });
});

// EDIT BLOG

router.get("/blog/:id/edit",middleware.checkBlogOwnership,function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("blogs/edit",{blog:foundBlog});
        }
    });
});

// UPDATE BLOG

router.put("/blog/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blog/"+ updatedBlog._id);
        }
    });
});

//DELETE BLOG

router.delete("/blog/:id",middleware.checkBlogOwnership,function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,deletedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blog");
        }
    });
});

module.exports = router;
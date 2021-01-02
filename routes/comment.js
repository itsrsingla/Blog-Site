var express = require("express");
var router = express.Router({mergeParams : true});
var middleware = require("../middleware");

var Comment = require("../models/comment");
var Blog = require("../models/blog");

// COMMENT ROUTES

// NEW ROUTE

router.get("/blog/:id/comment/new",middleware.isLoggedIn,function(req,res){
   Blog.findById(req.params.id,function(err, foundBlog) {
       if(err){
           console.log(err);
       }else{
            res.render("comments/new",{blog:foundBlog});            
       }
   });

});

// CREATE ROUTE
router.post("/blog/:id/comment",function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog) {
        if(err){
            console.log(err);
        }else{
            var author = {
                id : req.user._id,
                username : req.user.username
            };
            var comment = new Comment({
                data : req.body.data,
                author : author
            });
            comment.save(function(err,savedComment){
                if(err){
                    console.log(err);
                }else{
                    foundBlog.comment.push(savedComment);
                    foundBlog.save();
                    res.redirect("/blog/" + foundBlog._id);        
    }
});

        }
    });
    
});
// EDIT ROUTE

router.get("/blog/:id/comment/:commid/edit",middleware.checkCommentOwnership,function(req,res){
    Blog.findById(req.params.id,function(err, foundBlog) {
        if(err){
            console.log(err);
        }else{
            Comment.findById(req.params.commid,function(err,foundComment){
                if(err){
                    console.log(err);
                }else{
                    res.render("comments/edit",{blog:foundBlog,comm:foundComment});
                }
            });
        }
    });
});
// UPDATE ROUTE

router.put("/blog/:id/comment/:commid",function(req,res){
    Comment.findByIdAndUpdate(req.params.commid,req.body.comment,function(err,updatedComment) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/blog/" + req.params.id);
        }
    });
});
// DELETE ROUTE

router.delete("/blog/:id/comment/:commid",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndRemove(req.params.commid,function(err,deletedComment){
       if(err){
           console.log(err);
       }else{
           res.redirect("/blog/" + req.params.id);
       }
   }) ;
});

module.exports = router;

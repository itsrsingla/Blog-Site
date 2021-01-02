var Comment = require("../models/comment");
var Blog = require("../models/blog");

var middlewareObj = {};

middlewareObj.checkBlogOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id,function(err,foundBlog){
            if(err){
                console.log(err);
            }else{
                if(foundBlog.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("/blog/" + foundBlog._id);
                }
            }
        });
    }else{
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commid,function(err,foundComment){
            if(err){
                console.log(err);
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;
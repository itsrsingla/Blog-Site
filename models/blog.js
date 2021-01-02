var mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
    title: String,
    content: String,
    comment : [{  
        type: mongoose.Schema.Types.ObjectId,   
        ref: "Comment"
    }],
    author:{
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    }
    
});

module.exports = mongoose.model("Blog",blogSchema);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the review schema
const reviewSchema = new Schema({
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    comment : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
});

// Create the Review model
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

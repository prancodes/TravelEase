const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const listingSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    image : {
        url : {
            type : String,
            default : "https://media.istockphoto.com/id/1322244844/vector/villa-on-tropical-exotic-island-coast-modern-luxury-cottage-ocean-beach-palms-and-plants.jpg?s=612x612&w=0&k=20&c=uy16sCefpbi4NOnfJggfj7bBfgIEhzM0Ms6kTVLlInE=",
            set : (v) => v === "" ? "https://media.istockphoto.com/id/1322244844/vector/villa-on-tropical-exotic-island-coast-modern-luxury-cottage-ocean-beach-palms-and-plants.jpg?s=612x612&w=0&k=20&c=uy16sCefpbi4NOnfJggfj7bBfgIEhzM0Ms6kTVLlInE=" : v,
        },
        filename : {
            type : String,
            default : "default_Listing.png",
            set : (v) => v === "" ? "default_Listing.png" : v,
        },
    },
    price : {
        type : Number,
        min : [0, "Please enter valid price"],
        required : true
    },
    location : {
        type : String,
        required : true
    },
    country : {
        type : String,
        required : true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry : {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    category: {
        type: String,
        enum: [
            "Beachfront",
            "City",
            "Mountain",
            "Historic",
            "Luxury",
            "Nature",
            "Tropical",
            "Ski",
            "Safari"
        ],
        required: true
    }
});

// Middleware to delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}})
    }
});

const Listings = mongoose.model("Listings", listingSchema);
module.exports = Listings;


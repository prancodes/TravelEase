const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true,
        trim: true,
        lowercase: true,
        index: true
    },
    listings: [{
      type: Schema.Types.ObjectId,
      ref: 'Listings'
    }],
    reviews: [{
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
});

// Plugin for handling user authentication
userSchema.plugin(passportLocalMongoose);

// Middleware to delete user's listings when user is deleted
userSchema.pre('findOneAndDelete', async function(next) {
    try {
      const userId = this.getQuery()["_id"];
      const Listings = mongoose.model('Listings');
      await Listings.deleteMany({ owner: userId });
      next();
    } catch (err) {
      next(err);
    }
});

module.exports = mongoose.model("User", userSchema);

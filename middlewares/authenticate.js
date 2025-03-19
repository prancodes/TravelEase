const Listing = require("../models/listings");
const Review = require("../models/reviews");

// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.params) {
            if (req.params.id) {
                req.session.redirectId = req.params.id;
            }
            if (req.params.reviewId) {
                req.session.redirectReviewId = req.params.reviewId;
            }
        }
        req.session.redirectUrl = req.originalUrl;
        req.flash("warning", "Hi Traveler! Log in to continue exploring your next destination 🏡");
        return res.redirect("/login");
    }
    next();
}

// Middleware to save redirect URL in response locals
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl || req.session.redirectId || req.session.redirectReviewId) {
        res.locals.redirectUrl = req.session.redirectUrl;
        res.locals.redirectId = req.session.redirectId;
        res.locals.redirectReviewId = req.session.redirectReviewId;
    }
    next();
}

// Middleware to check if the user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("warning", "You can only manage your own Listings");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("warning", "You can only manage your own Reviews");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

const Listings = require("../models/listings");
const Review = require("../models/reviews");
const { idValidation } = require("../utils/idValidation");

// Add a new review to a listing
module.exports.addReview = async (req, res, next) => {
  let { id } = req.params;
  idValidation(id);

  let listing = await Listings.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added");
  res.redirect(`/listings/${id}`);
};

// Delete a review from a listing
module.exports.destroyReview = async (req, res, next) => {
  let { id, reviewId } = req.params;
  idValidation(id);

  await Review.findByIdAndDelete(reviewId);
  await Listings.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};

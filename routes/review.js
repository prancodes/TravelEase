const express = require("express");
const router = express.Router({ mergeParams: true });
const { wrapAsync } = require("../utils/wrapAsync");
const { isLoggedIn, isReviewAuthor } = require('../middlewares/authenticate');
const reviewController = require("../controllers/reviews");

// Add review route
router.post(
  "/", isLoggedIn,
  wrapAsync(reviewController.addReview)
);

// Delete review route
router.delete(
  "/:reviewId", isLoggedIn, isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;

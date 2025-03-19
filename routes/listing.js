const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const { isLoggedIn, isOwner } = require("../middlewares/authenticate");
const listingController = require("../controllers/listings");
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.getAllListings))
  .post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createNewListing));

// Route to render add form
router.get("/add", isLoggedIn, listingController.renderAddForm);

// Route to render edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
  .get(wrapAsync(listingController.showListing));

// Category routes
router
  .route("/category/:ctgName")
  .get(wrapAsync(listingController.renderCategory));

module.exports = router;

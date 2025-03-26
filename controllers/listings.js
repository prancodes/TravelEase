const Listings = require("../models/listings");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");
const { idValidation } = require("../utils/idValidation");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const validCategories = [
  "Beachfront",
  "City",
  "Mountain",
  "Historic",
  "Luxury",
  "Nature",
  "Tropical",
  "Ski",
  "Safari",
];

// Display all listings
module.exports.getAllListings = async (req, res, next) => {
  let listings = (await Listings.find()).reverse();
  if (!listings) {
    throw new CustomError(500, "Some error occured");
  }
  res.render("listings/listings.ejs", { listings });
};

// Render add form
module.exports.renderAddForm = (req, res) => {
  res.render("listings/add.ejs");
};

// Create new listing
module.exports.createNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let newList = req.body.listing;
  if (!req.file) {
    let url = "";
    let filename = "";
    newList.image = { url, filename };
  } else {
    let url = req.file.path;
    let filename = req.file.filename;
    newList.image = { url, filename };
  }
  newList.owner = req.user._id;
  newList.geometry = response.body.features[0].geometry;

  if (!newList) {
    throw new CustomError(
      401,
      "Please fill all fields, Image File is (Optional)"
    );
  }

  function toProperCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  const requiredFields = [
    "title",
    "description",
    "price",
    "location",
    "country",
    "owner",
    "category",
  ];
  let missingFields = [];

  for (const field of requiredFields) {
    if (!(field in newList) || !newList[field]) {
      missingFields.push(toProperCase(field));
    }
  }

  if (missingFields.length > 0) {
    throw new CustomError(401, `${missingFields.join(", ")} is required.`);
  }

  if (!("price" in newList) || isNaN(newList.price) || newList.price < 0) {
    throw new CustomError(401, "Price is required and must be valid.");
  }

  if (!validCategories.includes(newList.category)) {
    throw new CustomError(401, "Invalid category selected.");
  }

  await Listings.create(newList).then(() => {
    console.log("One list added");
  });
  req.flash("success", "Listing added successfully");
  res.redirect("/listings");
};

// Render edit form
module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  idValidation(id);
  let show = await Listings.findById(id);
  if (!show) {
    throw new CustomError(404, "Failed to update: ID not found");
  }
  res.render("listings/edit.ejs", { show });
};

// Update listing
module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  idValidation(id);
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let updatedList = req.body.listing;
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedList.image = { url, filename };
  }
  updatedList.geometry = response.body.features[0].geometry;
  if (!updatedList) {
    throw new CustomError(
      401,
      "Please fill all fields, Image File is (Optional)"
    );
  }
  if (isNaN(updatedList.price) || updatedList.price < 0) {
    throw new CustomError(401, "Price should be in Valid format");
  }

  if (!validCategories.includes(updatedList.category)) {
    throw new CustomError(401, "Invalid category selected.");
  }

  const updatedListing = await Listings.findByIdAndUpdate(
    id,
    { ...updatedList },
    { runValidators: true, new: true }
  );
  if (!updatedListing) {
    throw new CustomError(404, "Failed to update: ID not found");
  }

  res.redirect(`/listings/${id}`);
};

// Delete listing
module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  idValidation(id);

  const deletedListing = await Listings.findByIdAndDelete(id);
  if (!deletedListing) {
    throw new CustomError(404, "Failed to Delete: ID not found");
  }

  res.redirect("/listings");
};

// Show listing
module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new CustomError(
      404,
      "Oops! The page you requested cound not be found"
    );
  }

  let show = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!show) {
    throw new CustomError(404, "Failed to Preview: Id not found");
  }
  res.render("listings/show.ejs", { show });
};

// Define the toProperCase function
String.prototype.toProperCase = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

// Render category
module.exports.renderCategory = async (req, res, next) => {
  let { ctgName } = req.params;
  ctgName = ctgName.toProperCase();

  if (!validCategories.includes(ctgName)) {
    throw new CustomError(400, "Invalid category name.");
  }

  let filteredCategory = (await Listings.find({ category: ctgName })).reverse();
  if (!filteredCategory || filteredCategory.length === 0) {
    throw new CustomError(404, "No listings found for this category.");
  }

  res.render("listings/listings.ejs", {
    listings: filteredCategory,
    category: ctgName,
  });
};

// Search Listings
module.exports.searchListings = async (req, res, next) => {
  let { q } = req.query;

  if (!q || q.trim() === "") {
    req.flash("error", "Please enter a valid search term");
    return res.redirect("/listings");
  }

  // Create a case-insensitive search query
  const searchRegex = new RegExp(q.trim(), "i");

  const searchResults = await Listings.find({
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
      { category: searchRegex },
    ],
  }).sort({ _id: -1 });

  res.locals.searchTerm = q.trim();

  // if (searchResults.length === 0) {
  //   req.flash("warning", `No results found for "${q}"`);
  //   return res.redirect("/listings");
  // }

  res.render("listings/listings.ejs", {
    listings: searchResults,
    searchTerm: q.trim(),
  });
}


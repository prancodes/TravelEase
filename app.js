if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listings");
const Review = require("./models/reviews");
const User = require("./models/users");

const MongoStore = require("connect-mongo");

// Import routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("init", path.join(__dirname, "init"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);

const MONGO_URL = process.env.ATLAS_URL;
main()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log(e);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (error) {
  console.log("Error in Mongo Session Store", error);
});

// Session configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set local variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  res.locals.currUser = req.user;
  next();
});

// Home route
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

// Use routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Static pages
app.get("/terms", (req, res) => {
  res.render("pages/terms.ejs");
});

app.get("/privacy", (req, res) => {
  res.render("pages/privacy.ejs");
});

app.get("/about", async (req, res) => {
  try {
    const propertyCount = await Listing.countDocuments();
    const userCount = await User.countDocuments();
    const reviewCount = await Review.countDocuments();

    res.render("pages/about.ejs", {
      propertyCount,
      userCount,
      reviewCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.render("pages/about.ejs", {
      propertyCount: 0,
      userCount: 0,
      reviewCount: 0,
    });
  }
});

// Custom error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occured" } = err;
  console.error(err.message);
  res.status(statusCode).render("./layouts/error.ejs", { message });
});

app.use((req, res, next) => {
  let message = "Oops! The page you requested could not be found";
  res.status(404).render("./layouts/error.ejs", { message });
});

app.listen((port = 3000), () => {
  console.log("Server is listening at port", port);
});


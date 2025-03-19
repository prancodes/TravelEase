const User = require("../models/users");

// Render the sign-up form
module.exports.renderSignUpForm = (req, res) => {
  res.render("../views/users/signup.ejs");
};

// Register a new user
module.exports.registerNewUser = async (req, res, next) => {
  try {
    let { email, username, password } = req.body.user;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (e) => {
      if (e) {
        return next(e);
      }
      req.flash("success", "User registered Successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      req.flash("error", "The given email is already registered.");
    } else {
      req.flash("error", err.message);
    }
    res.redirect("/signup");
  }
};

// Render the login form
module.exports.renderLoginForm = (req, res) => {
  res.render("../views/users/login.ejs");
};

// Verify the user and redirect to the appropriate URL
module.exports.verifyUser = async (req, res, next) => {
  req.flash(
    "success",
    `Welcome back ${req.body.username}, Let's plan your next trip with TravelEase! 🏖️`
  );
  let redirectUrl = res.locals.redirectUrl || "/listings";

  if(redirectUrl === `/listings/${res.locals.redirectId}/reviews/${res.locals.redirectReviewId}?_method=DELETE`){
    redirectUrl = `/listings/${res.locals.redirectId}`;
  } else if (redirectUrl === `/listings/${res.locals.redirectId}?_method=DELETE`){
    redirectUrl = `/listings/${res.locals.redirectId}`;
  }
  delete req.session.redirectId;
  delete req.session.redirectReviewId;
  delete req.session.redirectUrl;

  res.redirect(redirectUrl);
};

// Log out the user
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash(
      "success",
      "Logged out successfully! TravelEase is always here for you. 🏖️"
    );
    res.redirect("/listings");
  });
};


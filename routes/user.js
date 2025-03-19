const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares/authenticate");
const userController = require("../controllers/users");

// Signup routes
router.route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.registerNewUser));

// Login routes
router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl, // Middleware to save the redirected URL into locals
    (req, res, next) => {
      req.body.username = req.body.user.username;
      req.body.password = req.body.user.password;
      next();
    },
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.verifyUser)
  );

// Logout route
router.get("/logout", userController.logoutUser);

module.exports = router;

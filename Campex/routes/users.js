const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../helpers/catchAsync");

// register routes
router.get("/register", (req, res) => {
   res.render("users/register.ejs");
});

router.post(
   "/register",
   catchAsync(async (req, res, next) => {
      try {
         const { email, username, password } = req.body;
         const newUser = new User({ email, username });
         const registeredUser = await User.register(newUser, password);
         // logging in the registered user after the registration
         req.login(registeredUser, (err) => {
            if (err) {
               return next(err);
            }
            req.flash("success", "Welcome to Campex!");
            res.redirect("/campgrounds");
         });
      } catch (e) {
         req.flash("error", e.message);
         res.redirect("register");
      }
   })
);

// login routes
router.get("/login", (req, res) => {
   res.render("users/login");
});

// using passport default middleware here with local strategy and some more features
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
   req.flash("success", "Welcome back!");
   // using returning to requested URL asked before login/register (defined in userMiddleware.js)
   // or '/campgrounds' because what is user didn't asked for any URL before login/register
   const requestedUrl = req.session.returnTo || "/campgrounds";
   // also we need to delete that requested URl that is saved in the db
   delete req.session.returnTo;
   res.redirect(requestedUrl);
});

router.get("/logout", (req, res) => {
   req.logout();
   req.flash("success", "You have been logged out!");
   res.redirect("/campgrounds");
});

module.exports = router;

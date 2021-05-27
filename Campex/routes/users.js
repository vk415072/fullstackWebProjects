const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const userController = require("../controllers/user");

// register routes
router.get("/register", userController.registerPage);

router.post("/register", catchAsync(userController.registerUser));

// login routes
router.get("/login", userController.loginPage);

// using passport default middleware here with local strategy and some more features
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;

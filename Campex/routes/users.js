const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../helpers/catchAsync");
const userController = require("../controllers/user");

router.route("/register").get(userController.registerPage).post(catchAsync(userController.registerUser));
router
   .route("/login")
   .get(userController.loginPage)
   .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), userController.loginUser);

router.get("/logout", userController.logoutUser);

module.exports = router;

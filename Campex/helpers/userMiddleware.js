const { joiCampgroundSchema, reviewSchema } = require("./joiSchema");
const ExpressErrors = require("./expressErrors");
const Campground = require("../models/Campground");

module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      // returning to the requested URL asked before login/register to session
      req.session.returnTo = req.originalUrl;

      req.flash("error", "you must be signed in first!");
      return res.redirect("/login");
   }
   next();
};

module.exports.validateCampground = (req, res, next) => {
   const { error } = joiCampgroundSchema.validate(req.body);
   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressErrors(msg, 400);
   } else {
      next();
   }
};

module.exports.isAuthor = async (req, res, next) => {
   const { id } = req.params;
   const updatedCampground = await Campground.findById(id);
   if (!updatedCampground.author.equals(req.user._id)) {
      req.flash("error", "You do not have permission to do that!");
      return res.redirect(`/campgrounds/${id}`);
   }
   next();
};

module.exports.validateReview = (req, res, next) => {
   const { error } = reviewSchema.validate(req.body);
   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressErrors(msg, 400);
   } else {
      next();
   }
};

const express = require("express");
// 75. adding mergeParams: true
const router = express.Router({ mergeParams: true });

const Review = require("../models/review");
const Campground = require("../models/Campground");

const catchAsync = require("../helpers/catchAsync");
const ExpressErrors = require("../helpers/expressErrors");

const { reviewSchema } = require("../helpers/joiSchema");

// 67. making similar middleware like above for reviews
const validateReview = (req, res, next) => {
   // 68. check for an error
   const { error } = reviewSchema.validate(req.body);
   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressErrors(msg, 400);
   } else {
      next();
   }
};

// 60. adding post route to get campground review
// 69. adding validateReview
router.post(
   "/",
   validateReview,
   catchAsync(async (req, res) => {
      // 61. finding that campground to associate this review with
      //   73. now req.params will not work here as there is no id in params here
      // 74. so have to add mergeParams: true in express.Router up above
      const campground1 = await Campground.findById(req.params.id);
      // 63. making new review
      const review = new Review(req.body.review);
      // 64. pushing review into campground
      campground1.reviews.push(review);

      // 65. saving both
      await review.save();
      await campground1.save();
      // 76. flashing when added a review
      req.flash("success", "Added new review");
      res.redirect(`/campgrounds/${campground1._id}`);
   })
);

// 71. delete route for reviews
router.delete(
   "/:reviewId",
   catchAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      // 72. deleting only one review from that campground  db
      await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      // 73. deleting review from review db
      await Review.findByIdAndDelete(reviewId);
      // 76. flashing when added a review
      req.flash("success", "Deleted review");
      res.redirect(`/campgrounds/${id}`);
   })
);

// 72. exporting...
module.exports = router;

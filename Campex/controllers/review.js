const Review = require("../models/review");
const Campground = require("../models/Campground");

module.exports.createReview = async (req, res) => {
   const campground1 = await Campground.findById(req.params.id);
   const review = new Review(req.body.review);
   review.author = req.user._id;
   campground1.reviews.push(review);
   await review.save();
   await campground1.save();
   req.flash("success", "Added new review");
   res.redirect(`/campgrounds/${campground1._id}`);
};

module.exports.deleteReview = async (req, res) => {
   const { id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Deleted review");
   res.redirect(`/campgrounds/${id}`);
};

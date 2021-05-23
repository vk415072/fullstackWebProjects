// 1. basic boiler plate of express app
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
// 5. requiring our model
const Campground = require("./models/Campground");
// 12. requiring method-override
const methodOverride = require("method-override");
// 17. requiring ejs-mate
const ejsMate = require("ejs-mate");
// 22. adding our custom catchAsync.js
const catchAsync = require("./helpers/catchAsync");
// 32. requiring our custom error class, expressErrors.js
const ExpressErrors = require("./helpers/expressErrors");
// 44. requiring JOI package
// 59. no more need of joi here
// const joi = require("joi");
// 58. requiring custom joi schema
// 66. also requiring reviewSchema while destructuring it
const { joiCampgroundSchema, reviewSchema } = require("./helpers/joiSchema");
// 62. requiring review model
const Review = require("./models/review");
// 77. requiring campgrounds routes
const campgrounds = require("./routes/campground");

// 3. mongoose defaults
mongoose.connect("mongodb://localhost:27017/campex", {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
   console.log("Database connected!");
});

// 1. basic boiler plate of express app
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 10. to parse req.body in app.post, we need to fake it
app.use(express.urlencoded({ extended: true }));
// 13. using method-override
app.use(methodOverride("_method"));
// 18. using ejs-mate
app.engine("ejs", ejsMate);

// 78. moved validateCampground middleware to routes/campground.js
// // 52. defining middleware function for joi validation
// const validateCampground = (req, res, next) => {
//    // 53. pasting the joi code from comment: 40-51
//    // 57. moving this joi schema to its own file
//    //  const joiCampgroundSchema = Joi.object({
//    //     campground: Joi.object({
//    //        title: Joi.string().required(),
//    //        price: Joi.number().required().min(0),
//    //        location: Joi.string().required(),
//    //        image: Joi.string().required(),
//    //        description: Joi.string().required(),
//    //     }).required(),
//    //  });
//    const { error } = joiCampgroundSchema.validate(req.body);
//    //  54. we've to call next() here in else
//    if (error) {
//       const msg = error.details.map((el) => el.message).join(",");
//       throw new ExpressErrors(msg, 400);
//    } else {
//       next();
//    }
// };

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

// 2. listening to homepage req and rendering it.
app.get("/", (req, res) => {
   res.render("home");
});

// 76. moved all /campground routes to routes/campground.js
// 77. using campgrounds routes
app.use("/campgrounds", campgrounds);

// 60. adding post route to get campground review
// 69. adding validateReview
app.post(
   "/campgrounds/:id/reviews",
   validateReview,
   catchAsync(async (req, res) => {
      // 61. finding that campground to associate this review with
      const campground1 = await Campground.findById(req.params.id);
      // 63. making new review
      const review = new Review(req.body.review);
      // 64. pushing review into campground
      campground1.reviews.push(review);

      // 65. saving both
      await review.save();
      await campground1.save();
      res.redirect(`/campgrounds/${campground1._id}`);
   })
);

// 71. delete route for reviews
app.delete(
   "/campgrounds/:id/reviews/:reviewId",
   catchAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      // 72. deleting only one review from that campground  db
      await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      // 73. deleting review from review db
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/campgrounds/${id}`);
   })
);

// 31. adding a middleware which handle all routes excepts those are matched above.
app.all("*", (req, res, next) => {
   // res.send('404 ERROR!!')
   // 33. passing ExpressError to next with message and status code
   next(new ExpressErrors("Page Not Found", 404));
});

// 19. adding basic default express middleware to handle errors
app.use((err, req, res, next) => {
   // res.send("Oh boy! Something went wrong!");
   // 34. destructuring status code and message from err
   // 35. also setting their defaults
   // const { statusCode = 500, message = "Something went wrong" } = err;
   // 38. As i'm passing whole err structure, then default message would not pass as i'm first extracting it nd then setting it's default above.
   const { statusCode = 500 } = err;
   // 39. so, i've to update the err structure with a default message
   if (!err.message) err.message = "Oh No, Something Went Wrong!";
   // 37. rendering error.ejs view and passing entire err structure
   res.status(statusCode).render("error.ejs", { err });
});

// 1. basic boiler plate of express app
app.listen(3000, () => {
   console.log("SERVING ON PORT 3000");
});

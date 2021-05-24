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
// 80. requiring reviews routes
const reviews = require("./routes/review");
// 84. requiring express-session
const session = require("express-session");
// 88. requiring connect-flash
const flash = require("connect-flash");

// 3. mongoose defaults
mongoose.connect("mongodb://localhost:27017/campex", {
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false,
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
// 82. telling express to serve over custom static /public directory.
// 83. so that i can use the files of this directory directly.
app.use(express.static("public"));
// 86. creating session configs
const sessionConfig = {
   secret: "thisisasecret!",
   resave: false,
   saveUninitialized: true,
   cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
   },
};
// 85. using express-session
// 87. passing sessionConfig
app.use(session(sessionConfig));
// 90. using flash
app.use(flash());

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

// 81. moved to /routes/review.js
// // 67. making similar middleware like above for reviews
// const validateReview = (req, res, next) => {
//    // 68. check for an error
//    const { error } = reviewSchema.validate(req.body);
//    if (error) {
//       const msg = error.details.map((el) => el.message).join(",");
//       throw new ExpressErrors(msg, 400);
//    } else {
//       next();
//    }
// };

// 2. listening to homepage req and rendering it.
app.get("/", (req, res) => {
   res.render("home");
});

// 91. adding flash middleware
app.use((req, res, next) => {
   // 92. on every single req, whatever in the 'success' will have access to it under the locals with a key 'success'
   res.locals.success = req.flash("success");
   // 93. also adding for any error
   res.locals.error = req.flash("error");
   next();
});

// 76. moved all /campground routes to routes/campground.js
// 77. using campgrounds routes
app.use("/campgrounds", campgrounds);

// 78. moved all /reviews routes to routes/review.js
// 79. using reviews routes
app.use("/campgrounds/:id/reviews", reviews);

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

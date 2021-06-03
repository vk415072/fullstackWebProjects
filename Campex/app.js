// 106. using dotenv node package to include our .env file to access environment variables if the code is not in production
if (process.env.NODE_ENV != "Production") {
   require("dotenv").config();
}
// 107. logging the environment variables from my .env file
// console.log(process.env.SECRET);

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

const campgroundRoutes = require("./routes/campground");
// 80. requiring reviews routes
const reviewRoutes = require("./routes/review");
// 103. requiring users routes
const userRoutes = require("./routes/users");

// 84. requiring express-session
const session = require("express-session");
// 88. requiring connect-flash
const flash = require("connect-flash");
// 94. requiring passport
const passport = require("passport");
const passportLocal = require("passport-local");
// 96. requiring our user model
const User = require("./models/user");
// 108. adding mongo sanitize to delete some query signs and symbol from user's input
const mongoSanitize = require("express-mongo-sanitize");
// 110. helmet enables all middlewares that it comes with
const helmet = require("helmet");
// 114. getting mongodb atlas
const dbUrl = process.env.MONGODB_URL || "mongodb://localhost:27017/campex";
// 116. including connect-mongo
const ConnectMongo = require("connect-mongo");

// 3. mongoose defaults
// 115. adding db source from localhost to mongo server
// mongoose.connect("mongodb://localhost:27017/campex", {
mongoose.connect(dbUrl, {
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

// 10. to parse req.body in app.post, we need to fake it (we are excepting url encoded form data to look like)
app.use(express.urlencoded({ extended: true }));
// 13. using method-override
app.use(methodOverride("_method"));
// 18. using ejs-mate
app.engine("ejs", ejsMate);
// 82. telling express to serve over custom static /public directory.
// 83. so that i can use the files of this directory directly.
app.use(express.static("public"));

// 116 using connect-mongo package
const secret = process.env.SECRET || "thisismysecret!";
const store = ConnectMongo.create({
   mongoUrl: dbUrl,
   // mongoUrl: "mongodb://localhost:27017/campex",
   secret: secret,
   touchAfter: 24 * 60 * 60,
});
store.on("error", function (e) {
   console.log("SESSION STORE ERROR", e);
});

// 86. creating session configs
// 117 passing store. This will use mongo to store our session info
const sessionConfig = {
   store,
   // sore: store,
   name: "blah",
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
// 111. enabling helmet
// 112. disabling content security policy as it will create problem using third party services.
// 113. pending content security policy setup...
app.use(helmet({ contentSecurityPolicy: false }));
// 95. using passport
app.use(passport.initialize());
app.use(passport.session());
// 109. using mongoSanitize
app.use(mongoSanitize());

// 97. telling passport to use local strategy (passport-local) and for that local strategy, the authentication method is located on our User model and its called authenticate()
passport.use(new passportLocal(User.authenticate()));
// 98. telling passport to serialize (how to store User in the session) the user
passport.serializeUser(User.serializeUser());
// 99. telling to deserialize (how to get User out of the session) the user
passport.deserializeUser(User.deserializeUser());

// // 100. testing passport implementation in pur user schema
// app.get("/fakeuser", async (req, res) => {
//    const user = new User({ email: "vk415072@gmail.com", username: "vivek" });
//    // 101. passing user and password to User.register
//    // 102. here the passport will hash the password using "pbkdf2" hashing tech (not the bcrypt tech)
//    const registeredUser = await User.register(user, "12345");
//    res.send(registeredUser);
// });

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

// 91. adding flash middleware (all these locals can be access in all routes)
app.use((req, res, next) => {
   // 92. on every single req, whatever in the 'success' will have access to it under the locals (tamplets) with a key 'success'
   res.locals.success = req.flash("success");
   // 93. also adding for any error
   res.locals.error = req.flash("error");
   // 105. defining currentUser's local
   res.locals.currentUser = req.user;
   next();
});

// 2. listening to homepage req and rendering it.
app.get("/", (req, res) => {
   res.render("home");
});

// 76. moved all /campground routes to routes/campground.js
// 77. using campgrounds routes
app.use("/campgrounds", campgroundRoutes);
// 78. moved all /reviews routes to routes/review.js
// 79. using reviews routes
app.use("/campgrounds/:id/reviews", reviewRoutes);
// 104. using users routes
app.use("/", userRoutes);

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

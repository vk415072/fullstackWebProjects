const express = require("express");
const router = express.Router();
// 78. adding some data from app.js
const catchAsync = require("../helpers/catchAsync");
// const Campground = require("../models/Campground");
// 98. no more need for this schema in here now but require in userMiddleware.js
// const { joiCampgroundSchema, reviewSchema } = require("../helpers/joiSchema");
// 87. importing user middleware which check if logged in
// 97. also requiring our both moved middleware s.
const { isLoggedIn, isCampgroundAuthor, validateCampground } = require("../helpers/userMiddleware");
// 102. including controllers of our routes
const campgroundController = require("../controllers/campground");
// 109. including cloudinary.js data (only storage) (node automatically looks for index.js)
const { storage } = require("../cloudinary");
// 105. including multer to parse multipart form data (usually used to upload files)
const multer = require("multer");
// 110. now changing local storage destination for multer uploads to cloudinary storage
// const multerUpload = multer({ dest: "uploads/" });
const multerUpload = multer({ storage });

// 104. chaining all routes using router.route in here and commenting whole code
router
   .route("/")
   .get(catchAsync(campgroundController.indexPage))
   // 111 added multer to upload images, also updating the controller for this route
   .post(isLoggedIn, multerUpload.array("image"), validateCampground, catchAsync(campgroundController.createCampground));
// // 106. trying using multer to upload an image
// // 107. we can also use "multerUpload.single("image")" to upload single files
// .post(multerUpload.array("image"), (req, res) => {
//    // 108. have to use "req.files" to access multiple uploaded files
//    console.log(req.body, req.files);
//    res.send("it worked");
// });

router.get("/new", isLoggedIn, catchAsync(campgroundController.newPage));

router
   .route("/:id")
   .get(catchAsync(campgroundController.showCampground))
   .put(isLoggedIn, isCampgroundAuthor, multerUpload.array("image"), validateCampground, catchAsync(campgroundController.updateCampground))
   .delete(isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.deleteCampground));

router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.editPage));

// 96. both middleware moved to userMiddleware.js
// // 79. moved from app.js
// const validateCampground = (req, res, next) => {
//    const { error } = joiCampgroundSchema.validate(req.body);
//    if (error) {
//       const msg = error.details.map((el) => el.message).join(",");
//       throw new ExpressErrors(msg, 400);
//    } else {
//       next();
//    }
// };
// // 94. making middleware to check the authorization
// const isCampgroundAuthor = async (req, res, next) => {
//    const { id } = req.params;
//    const updatedCampground = await Campground.findById(id);
//    if (!updatedCampground.author.equals(req.user._id)) {
//       req.flash("error", "You do not have permission to do that!");
//       return res.redirect(`/campgrounds/${id}`);
//    }
//    next();
// };

// 77. removing "/campground" as i already add it from app.js

// // 4. testing & hard coding
// app.get("/makeCampground", async (req, res) => {
//   const camp = new campground({ title: "My Backyard", description: "Cheap camping" });
//   await camp.save();
//   res.send(camp);
// });

// 100. moving the whole async function to a controller (controllers/campground.js)
// // 6. campgrounds page
// // 25. wrapping around catchAsync()
// router.get(
//    "/",
//    catchAsync(async (req, res) => {
//       const campgrounds = await Campground.find({});
//       res.render("campgrounds/index", {
//          campgrounds,
//       });
//    })
// );
// 101. only using this routes frame (excluding async function and  whole content in it)
// 103. now using the campground controller. (also doing this with all other routes)
// router.get("/", catchAsync(campgroundController.indexPage));

// 8. new campground page
// 26. wrapping around catchAsync()
// 88. using user imported middleware
// router.get(
//    "/new",
//    isLoggedIn,
//    catchAsync(async (req, res) => {
//       //   const campground1 = await campground.findById(req.params.id);
//       // 86. moving this verification to separate file as a middleware
//       // // 85. checking if user is logged in
//       // if (!req.isAuthenticated()) {
//       //    req.flash("error", "you must be signed in");
//       //    return res.redirect("/login");
//       // }
//       res.render("campgrounds/new");
//    })
// );
// router.get("/new", isLoggedIn, catchAsync(campgroundController.newPage));

// // 9. receiving new campground data and adding to db
// // 21. adding next to params
// // 24. wrapping around catchAsync()
// // 55. adding validateCampground middleware to arguments
// // 89. as we've form validation via bootstrap but still using userMiddleware here also.
// router.post(
//    "/",
//    validateCampground,
//    isLoggedIn,
//    catchAsync(async (req, res, next) => {
//       //   console.log(req.body.campground);
//       // 20. wrapping content in try n catch
//       // 23. no longer need to wrap in try n catch
//       // try {
//       // 36.throwing new ExpressError and our catchAsync will catch that error and hand it over to next(), which makes it way to down to default middleware.
//       // if (!req.body.campground) throw new ExpressErrors("Invalid Campground Data", 400);
//       // 40. but i've to do many server side validations like that
//       // 41. more eg: if(!req.body.price) do something...
//       // 42. so installing JOI node package that has a schema to handle such validation errors.
//       // 43. our schema for JOI would be "req.body"
//       // 45. defining JOI schema
//       // const joiCampgroundSchema = Joi.object({
//       //    campground: Joi.object({
//       //       title: Joi.string().required(),
//       //       price: Joi.number().required().min(0),
//       //       location: Joi.string().required(),
//       //       image: Joi.string().required(),
//       //       description: Joi.string().required(),
//       //    }).required(),
//       // });
//       // // 46. passing our data through the JOI schema.
//       // // 47. destructuring error from joi error object
//       // const { error } = joiCampgroundSchema.validate(req.body);
//       // // console.log(result);
//       // // 48. throwing error to ExpressError class and passing error details
//       // if (error) {
//       //    // 49. for each element returning message and joining with a comma.
//       //    const msg = error.details.map((el) => el.message).join(",");
//       //    throw new ExpressErrors(msg, 400);
//       // }
//       // 50.if above condition goes, it would not execute below code as the middleware would execute and it doesn't have a next();
//       // 51. moving this joi thing to a new middleware, to use in all routes.
//       const newCampground = new Campground(req.body.campground);
//       // 91. adding user id into campground author entry
//       newCampground.author = req.user._id;
//       await newCampground.save();
//       // 80. adding flash message after creating a campground
//       req.flash("success", "Successfully added a new Campground");
//       res.redirect(`/campgrounds/${newCampground._id}`);
//       // } catch (e) {
//       // next() to call our default middleware
//       //   next(e);
//       // }
//    })
// );
// router.post("/", validateCampground, isLoggedIn, catchAsync(campgroundController.createCampground));

// // 7. individual campgrounds show page
// // 27. wrapping around catchAsync()
// router.get(
//    "/:id",
//    catchAsync(async (req, res) => {
//       // 70. also populating reviews
//       // 90. also populating user (author) data in campground collection
//       // 99. as we're populating the reviews and author of campground model. But now we've to populate author of review field.
//       const campground1 = await await Campground.findById(req.params.id)
//          .populate({ path: "reviews", populate: { path: "author" } })
//          .populate("author");
//       // 84. flashing error if no campground.
//       if (!campground1) {
//          req.flash("error", "Campground not found");
//          return res.redirect("/campgrounds");
//       }
//       // console.log(campground1);
//       // 81. now also we can pass the flash message like "msg: req.flash("success")"
//       // 82. but i'll make a middleware in app.js for that.
//       res.render("campgrounds/show", { campground1 });
//    })
// );
// 7. individual campgrounds show page
// 27. wrapping around catchAsync()
// router.get("/:id", catchAsync(campgroundController.showCampground));

// // 11. edit route for campgrounds
// // 28. wrapping around catchAsync()
// // 95. adding isCampgroundAuthor check middleware
// router.get("/:id/edit", isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.editPage));

// // 14. app.put after method-override to update the db
// // 29. wrapping around catchAsync()
// // 56. adding validateCampground middleware to arguments
// router.put(
//    "/:id",
//    isLoggedIn,
//    isCampgroundAuthor,
//    validateCampground,
//    catchAsync(async (req, res) => {
//       const { id } = req.params;
//       // 92. breaking the code of // 15. to apply some conditions
//       // 93. moving this logic to a middleware above.
//       // const updatedCampground = await Campground.findById(id);
//       // if (!updatedCampground.author.equals(req.user._id)) {
//       //    req.flash("error", "You do not have permission to do that!");
//       //    return res.redirect(`/campgrounds/${id}`);
//       // }
//       // 15. (...) 3 dots are for spreading the data
//       const updatedCampground = await Campground.findByIdAndUpdate(id, {
//          ...req.body.campground,
//       });

//       // 83. adding flash message for update too
//       req.flash("success", "Successfully updated campground");
//       res.redirect(`/campgrounds/${updatedCampground._id}`);
//    })
// );
// router.put("/:id", isLoggedIn, isCampgroundAuthor, validateCampground, catchAsync(campgroundController.updateCampground));

// // 16. delete req
// // 30. wrapping around catchAsync()
// router.delete(
//    "/:id",
//    isLoggedIn,
//    isCampgroundAuthor,
//    catchAsync(async (req, res) => {
//       const { id } = req.params;
//       await Campground.findByIdAndDelete(id);
//       res.redirect("/campgrounds");
//       // 74. here findByIdAndDelete() of mongoose query triggers a middleware i.e, findOneAndDelete()
//       // 75. so i've added that mongoose middleware in campground.js model to delete the reviews of this particular campground.
//    })
// );
// 16. delete req
// 30. wrapping around catchAsync()
// router.delete("/:id", isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.deleteCampground));

// 76. exporting
module.exports = router;

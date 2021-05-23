const express = require("express");
const router = express.Router();
// 78. adding some data from app.js
const catchAsync = require("../helpers/catchAsync");
const ExpressErrors = require("../helpers/expressErrors");
const Campground = require("../models/Campground");
const { joiCampgroundSchema, reviewSchema } = require("../helpers/joiSchema");

// 79. moved from app.js
const validateCampground = (req, res, next) => {
   const { error } = joiCampgroundSchema.validate(req.body);
   if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressErrors(msg, 400);
   } else {
      next();
   }
};

// 77. removing "/campground" as i already add it from app.js

// // 4. testing & hard coding
// app.get("/makeCampground", async (req, res) => {
//   const camp = new campground({ title: "My Backyard", description: "Cheap camping" });
//   await camp.save();
//   res.send(camp);
// });

// 6. campgrounds page
// 25. wrapping around catchAsync()
router.get(
   "/",
   catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", {
         campgrounds,
      });
   })
);

// 8. new campground page
// 26. wrapping around catchAsync()
router.get(
   "/new",
   catchAsync(async (req, res) => {
      //   const campground1 = await campground.findById(req.params.id);
      res.render("campgrounds/new");
   })
);

// 9. receiving new campground data and adding to db
// 21. adding next to params
// 24. wrapping around catchAsync()
// 55. adding validateCampground middleware to arguments
router.post(
   "/",
   validateCampground,
   catchAsync(async (req, res, next) => {
      //   console.log(req.body.campground);
      // 20. wrapping content in try n catch
      // 23. no longer need to wrap in try n catch
      // try {
      // 36.throwing new ExpressError and our catchAsync will catch that error and hand it over to next(), which makes it way to down to default middleware.
      // if (!req.body.campground) throw new ExpressErrors("Invalid Campground Data", 400);
      // 40. but i've to do many server side validations like that
      // 41. more eg: if(!req.body.price) do something...
      // 42. so installing JOI node package that has a schema to handle such validation errors.
      // 43. our schema for JOI would be "req.body"
      // 45. defining JOI schema
      // const joiCampgroundSchema = Joi.object({
      //    campground: Joi.object({
      //       title: Joi.string().required(),
      //       price: Joi.number().required().min(0),
      //       location: Joi.string().required(),
      //       image: Joi.string().required(),
      //       description: Joi.string().required(),
      //    }).required(),
      // });
      // // 46. passing our data through the JOI schema.
      // // 47. destructuring error from joi error object
      // const { error } = joiCampgroundSchema.validate(req.body);
      // // console.log(result);
      // // 48. throwing error to ExpressError class and passing error details
      // if (error) {
      //    // 49. for each element returning message and joining with a comma.
      //    const msg = error.details.map((el) => el.message).join(",");
      //    throw new ExpressErrors(msg, 400);
      // }
      // 50.if above condition goes, it would not execute below code as the middleware would execute and it doesn't have a next();
      // 51. moving this joi thing to a new middleware, to use in all routes.
      const newCampground = new Campground(req.body.campground);
      await newCampground.save();
      res.redirect(`/campgrounds/${newCampground._id}`);
      // } catch (e) {
      // next() to call our default middleware
      //   next(e);
      // }
   })
);

// 7. individual campgrounds show page
// 27. wrapping around catchAsync()
router.get(
   "/:id",
   catchAsync(async (req, res) => {
      // 70. also populating reviews
      const campground1 = await Campground.findById(req.params.id).populate("reviews");
      // console.log(campground1);
      res.render("campgrounds/show", { campground1 });
   })
);

// 11. edit route for campgrounds
// 28. wrapping around catchAsync()
router.get(
   "/:id/edit",
   catchAsync(async (req, res) => {
      const campground1 = await Campground.findById(req.params.id);
      res.render("campgrounds/edit", {
         campground1,
      });
   })
);

// 14. app.put after method-override to update the db
// 29. wrapping around catchAsync()
// 56. adding validateCampground middleware to arguments
router.put(
   "/:id",
   validateCampground,
   catchAsync(async (req, res) => {
      const { id } = req.params;
      console.log(id);
      // 15. (...) 3 dots are for spreading the data
      const updatedCampground = await Campground.findByIdAndUpdate(id, {
         ...req.body.campground,
      });
      res.redirect(`/campgrounds/${updatedCampground._id}`);
   })
);

// 16. delete req
// 30. wrapping around catchAsync()
router.delete(
   "/:id",
   catchAsync(async (req, res) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      res.redirect("/campgrounds");
      // 74. here findByIdAndDelete() of mongoose query triggers a middleware i.e, findOneAndDelete()
      // 75. so i've added that mongoose middleware in campground.js model to delete the reviews of this particular campground.
   })
);

// 76. exporting
module.exports = router;

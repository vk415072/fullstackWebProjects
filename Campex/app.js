// 1. basic boiler plate of express app
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
// 5. requiring our model
const campground = require("./models/Campground");
// 12. requiring method-override
const methodOverride = require("method-override");
// 17. requiring ejs-mate
const ejsMate = require("ejs-mate");
// 22. adding our custom catchAsync.js
const catchAsync = require("./helpers/catchAsync");
// 32. requiring our custom error class, expressErrors.js
const ExpressErrors = require("./helpers/expressErrors");

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

// 2. listening to homepage req and rendering it.
app.get("/", (req, res) => {
  res.render("home");
});

// // 4. testing & hard coding
// app.get("/makeCampground", async (req, res) => {
//   const camp = new campground({ title: "My Backyard", description: "Cheap camping" });
//   await camp.save();
//   res.send(camp);
// });

// 6. campgrounds page
// 25. wrapping around catchAsync()
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// 8. new campground page
// 26. wrapping around catchAsync()
app.get(
  "/campgrounds/new",
  catchAsync(async (req, res) => {
    //   const campground1 = await campground.findById(req.params.id);
    res.render("campgrounds/new");
  })
);

// 9. receiving new campground data and adding to db
// 21. adding next to params
// 24. wrapping around catchAsync()
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    //   console.log(req.body.campground);
    // 20. wrapping content in try n catch
    // 23. no longer need to wrap in try n catch
    // try {
    // 36.throwing new ExpressError and our catchAsync will catch that error and hand it over to next(), which makes it way to down to default middleware.
    if (!req.body.campground) throw new ExpressErrors("Invalid Campground Data", 400);
    const newCampground = new campground(req.body.campground);
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
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground1 = await campground.findById(req.params.id);
    res.render("campgrounds/show", { campground1 });
  })
);

// 11. edit route for campgrounds
// 28. wrapping around catchAsync()
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground1 = await campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground1 });
  })
);

// 14. app.put after method-override to update the db
// 29. wrapping around catchAsync()
app.put(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // 15. (...) 3 dots are for spreading the data
    const updatedCampground = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${updatedCampground._id}`);
  })
);

// 16. delete req
// 30. wrapping around catchAsync()
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
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
  // 38. As i'm passing whole error structure, then default message would not pass as i'm first extracting it nd then setting it's default above.
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

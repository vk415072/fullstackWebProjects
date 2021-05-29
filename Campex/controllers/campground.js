const Campground = require("../models/Campground");

module.exports.indexPage = async (req, res) => {
   const campgrounds = await Campground.find({});
   res.render("campgrounds/index", {
      campgrounds,
   });
};

module.exports.newPage = async (req, res) => {
   res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
   const newCampground = new Campground(req.body.campground);
   newCampground.author = req.user._id;
   await newCampground.save();
   req.flash("success", "Successfully added a new Campground");
   res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampground = async (req, res) => {
   const campground1 = await await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
   if (!campground1) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
   }
   res.render("campgrounds/show", { campground1 });
};

module.exports.editPage = async (req, res) => {
   const campground1 = await Campground.findById(req.params.id);
   res.render("campgrounds/edit", {
      campground1,
   });
};

module.exports.updateCampground = async (req, res) => {
   const { id } = req.params;
   const updatedCampground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
   });
   req.flash("success", "Successfully updated campground");
   res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   res.redirect("/campgrounds");
};
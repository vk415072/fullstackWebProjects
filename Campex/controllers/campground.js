const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary");
// setup for mapbox.com
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

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
   // using geocoder from mapbox.com
   const geoData = await geocoder
      .forwardGeocode({
         query: req.body.campground.location,
         limit: 1,
      })
      .send();
   // geometry will give geo jason
   // coordinates will give longitude first then latitude.
   // console.log(geoData.body.features[0].geometry.coordinates);
   const newCampground = new Campground(req.body.campground);
   newCampground.geometry = geoData.body.features[0].geometry;
   // mapping and looping to get image's filename and file path/url i.e, stored in cloudinary
   newCampground.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
   newCampground.author = req.user._id;
   await newCampground.save();
   // console.log(newCampground);
   req.flash("success", "Successfully added a new Campground");
   res.redirect(`/campgrounds/${newCampground._id}`);
};

module.exports.showCampground = async (req, res) => {
   const campground1 = await Campground.findById(req.params.id)
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
   const geoData = await geocoder
      .forwardGeocode({
         query: req.body.campground.location,
         limit: 1,
      })
      .send();
   const { id } = req.params;
   const updatedCampground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
   });
   updatedCampground.geometry = geoData.body.features[0].geometry;
   // making imgs array and filling it with already uploaded images then pushing more, not replacing existing images.
   const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
   updatedCampground.images.push(...imgs);
   await updatedCampground.save();
   if (req.body.deleteImages) {
      // deleting from cloudinary
      for (let filename of req.body.deleteImages) {
         await cloudinary.uploader.destroy(filename);
      }
      // pulling out those images data which include deleteImage (filename of images)
      await updatedCampground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
   }
   req.flash("success", "Successfully updated campground");
   res.redirect(`/campgrounds/${updatedCampground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
   const { id } = req.params;
   await Campground.findByIdAndDelete(id);
   res.redirect("/campgrounds");
};

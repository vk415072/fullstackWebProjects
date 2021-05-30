const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 6. requiring review model
const Review = require("./review");

// 1. creating mongoose db Schema
// 3. adding reviews entry
// 8. cloudinary image url for ref:
// 9. https://res.cloudinary.com/campex/image/upload/v1622312490/CAMPEX_Campgrounds/nhwbedpkp8m13vwb6tdw.png
// 10. separating image data to its own schema:
const ImageSchema = new Schema({
   url: String,
   filename: String,
});
// 11. now creating a virtual imageSchema and adding "/w_100,h_100" (this is a cloudinary feature which will return a (100x100)px image) (to use as a thumbnail)
// virtual do not store in our model or db, it just derived from the info we,re already storing
ImageSchema.virtual("thumbnail").get(function () {
   return this.url.replace("/upload", "/upload/w_100,h_100");
});

const campgroundSchema = new mongoose.Schema({
   title: String,
   price: Number,
   description: String,
   location: String,
   images: [ImageSchema],
   author: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",
      },
   ],
});

// 4. delete middleware for deleting reviews id a campground is deleted
campgroundSchema.post("findOneAndDelete", async function (doc) {
   // 5. logging deleted camp db
   // console.log(doc);
   // 7. deleting reviews
   if (doc) {
      await Review.deleteMany({
         _id: { $in: doc.reviews },
      });
   }
});

// 2. exporting Schema
module.exports = mongoose.model("Campground", campgroundSchema);

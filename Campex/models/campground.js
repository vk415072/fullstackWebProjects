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
// 11. now creating a virtual ImageSchema and adding "/w_100,h_100" (this is a cloudinary feature which will return a (100x100)px image) (to use as a thumbnail)
// virtual do not store in our model or db, it just derived from the info we,re already storing
ImageSchema.virtual("thumbnail").get(function () {
   return this.url.replace("/upload", "/upload/w_100,h_100");
});

// 15. lines from mongodb for the previous step
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new mongoose.Schema(
   {
      title: String,
      price: Number,
      description: String,
      // this geometry model is based from mapbox returned data
      // "type": "Point", "coordinates": [23.3232, 24.2444]
      geometry: {
         type: {
            type: String,
            enum: ["Point"],
            required: true,
         },
         coordinates: {
            type: [Number],
            required: true,
         },
      },
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
   },
   opts
);

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

// 12. virtual schema of campgroundSchema for mapbox cluster popup
// 13. we can access "properties.popUpMarkup" in any html, we will be able to print but, by default mongo does not include virtuals when we convert a document into JSON
// 14. including some line from mongodb to make this happen (go to 15.)
campgroundSchema.virtual("properties.popUpMarkup").get(function () {
   return `<strong><h4><a href="/campgrounds/${this._id}">${this.title}</a></strong></h4><p>${this.location}</p>`;
});

// 2. exporting Schema
module.exports = mongoose.model("Campground", campgroundSchema);

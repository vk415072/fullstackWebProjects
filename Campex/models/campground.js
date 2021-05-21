const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// 6. requiring review model
const Review = require("./review");

// 1. creating mongoose db Schema
// 3. adding reviews entry
const campgroundSchema = new mongoose.Schema({
   title: String,
   price: Number,
   description: String,
   location: String,
   image: String,
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

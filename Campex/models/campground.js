const { ref } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      ref: 'Review'
    }
  ]
});

// 2. exporting Schema
module.exports = mongoose.model("Campground", campgroundSchema);

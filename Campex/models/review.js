const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 1. creating mongoose db review Schema
const reviewSchema = new Schema({
   body: String,
   rating: Number,
   author: {
      type: Schema.Types.ObjectId,
      ref: "User",
   },
});

// 2. exporting Schema
module.exports = mongoose.model("Review", reviewSchema);

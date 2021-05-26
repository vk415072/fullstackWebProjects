const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
   },
});

// 1. passing passportLocalMongoose through schema plugin
// 2. this will add username and password filed in our UserSchema 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

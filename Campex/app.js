// 1. basic boiler plate of express app
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// 5. requiring our model
const campground = require("./models/Campground");

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

const app = express();

// 1. basic boiler plate of express app
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. listening to homepage req and rendering it.
app.get("/", (req, res) => {
  res.render("home");
});

// 4. testing & hard coding
app.get("/makeCampground", async (req, res) => {
  const camp = new campground({ title: "My Backyard", description: "Cheap camping" });
  await camp.save();
  res.send(camp);
});

// 1. basic boiler plate of express app
app.listen(3000, () => {
  console.log("SERVING ON PORT 3000");
});

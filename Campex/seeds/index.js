// 1. mongoose and campground files
const mongoose = require("mongoose");
// 2. backing out one folder back
const campground = require("../models/Campground");
// 5. importing the cities.js and seedHelpers.js arrays
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

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

// 3. first remove everything from the db
const seedDB = async () => {
  await campground.deleteMany({});
  // 4. testing hard coded db entry
  // const c = new campground({ title: "Purplefield"});
  // await c.save();

  // 7. random element from array of seedHelpers
  const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // 6. random looping through cities.js
  for (let i = 0; i < 50; i++) {
    const random1k = Math.floor(Math.random() * 100);
    const price = Math.floor(Math.random() * 4000) +10
    // console.log(cities);
    // console.log(`HERE HERE HERE ${sample(descriptors)}`);
    const camp = new campground({
      // 10.hard coding author 
      author: '60ae0c140f1f5f40d44f44cb',
      location: `${cities[random1k].city}, ${cities[random1k].state}`,
      // 8. passing random from simple() function to get desc & places
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis sit ex deleniti commodi minus ipsum. Assumenda molestias a cumque, temporibus tempore ratione facilis repellendus distinctio illo adipisci iste cupiditate blanditiis.",
        // we can leave "price" like that. No need to do "price: price"
        price
    });
    await camp.save();
  }
};
// 9. running seedDB() and then closing connection with mongoose
seedDB().then(() => {
  mongoose.connection.close();
});

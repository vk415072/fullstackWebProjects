const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// creating mongoose db Schema
const campgroundSchema = new mongoose.Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

// exporting Schema
module.exports = mongoose.model('Campground', campgroundSchema);
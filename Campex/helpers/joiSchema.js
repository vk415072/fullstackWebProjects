// 1. requiring Joi
const Joi = require("joi");

// 2. copied schema from app.js comment: 57.
module.exports.joiCampgroundSchema = Joi.object({
   campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      location: Joi.string().required(),
      // image: Joi.string().required(),
      description: Joi.string().required(),
   }).required(),
});

// 3. exporting...
// module.exports = joiCampgroundSchema;

// 4. exporting reviewSchema
module.exports.reviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required(),
   }).required(),
});

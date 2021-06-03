// 1. requiring Joi
const BaseJoi = require("joi");
// 6. requiring sanitize-html
const sanitizeHTML = require("sanitize-html");

// 5. creating a rule with joi to stop any html input form user side
// (from joi docs)
const extension = (joi) => ({
   type: "string",
   base: joi.string(),
   messages: {
      "string.escapeHTML": "{{#label}} must not include HTML!",
   },
   rules: {
      escapeHTML: {
         validate(value, helpers) {
            const clean = sanitizeHtml(value, {
               allowedTags: [],
               allowedAttributes: {},
            });
            if (clean !== value) return helpers.error("string.escapeHTML", { value });
            return clean;
         },
      },
   },
});

// 7. not previous joi is not base joi and this new joi is the extended version of this extension above
const Joi = BaseJoi.extend(extension);

// 8. now using escapeHTML in every input field
// 2. copied schema from app.js comment: 57.
module.exports.joiCampgroundSchema = Joi.object({
   campground: Joi.object({
      title: Joi.string().required().escapeHTML(),
      price: Joi.number().required().min(0),
      location: Joi.string().required().escapeHTML(),
      // image: Joi.string().required(),
      description: Joi.string().required().escapeHTML(),
   }).required(),
   deleteImages: Joi.array(),
});

// 3. exporting...
// module.exports = joiCampgroundSchema;

// 4. exporting reviewSchema
module.exports.reviewSchema = Joi.object({
   review: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required().escapeHTML(),
   }).required(),
});

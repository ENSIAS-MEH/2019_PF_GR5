const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class

var Schema = mongoose.Schema;

const categoriesSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 5000
  },
  urlImage: {
    type: String,
    required: false
  }
});

const Category = mongoose.model("Category", categoriesSchema);

function validateCategory(category) {
  const schema = {
    urlImage: Joi.string().uri(),
    name: Joi.string()
      .min(5)
      .max(200)
      .required(),
    description: Joi.string()
      .min(20)
      .max(5000)
      .required()
  };
  return Joi.validate(category, schema);
}

module.exports.Category = Category;
module.exports.validateCategory = validateCategory;
module.exports.categoriesSchema = categoriesSchema;

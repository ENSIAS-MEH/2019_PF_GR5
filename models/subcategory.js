const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class
const { categorySchema } = require("./category");

var Schema = mongoose.Schema;

const subcategoriesSchema = new Schema({
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
  category: {
    type: categorySchema,
    required: true
  }
});

const SubCategory = mongoose.model("SubCategory", subcategoriesSchema);

function validateSubCategory(subcategory) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(200)
      .required(),
    description: Joi.string()
      .min(20)
      .max(5000)
      .required()
  };
  return Joi.validate(subcategory, schema);
}

module.exports.SubCategory = SubCategory;
module.exports.validateSubCategory = validateSubCategory;
module.exports.subcategoriesSchema = subcategoriesSchema;

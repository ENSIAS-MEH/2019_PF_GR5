const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class

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
    type: new mongoose.Schema({
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
    }),
    required: true
  },
  urlImage: {
    type: String,
    required: false
  }
});

const SubCategory = mongoose.model("SubCategory", subcategoriesSchema);

subcategoriesSchema.statics.lookup = function(categoryId) {
  return this.findOne({
    "category._id": categoryId
  });
};

function validateSubCategory(subcategory) {
  const schema = {
    urlImage: Joi.string().uri(),
    name: Joi.string()
      .min(5)
      .max(200)
      .required(),
    description: Joi.string()
      .min(20)
      .max(5000)
      .required(),
    categoryId: Joi.objectId().required()
  };
  return Joi.validate(subcategory, schema);
}

module.exports.SubCategory = SubCategory;
module.exports.validateSubCategory = validateSubCategory;
module.exports.subcategoriesSchema = subcategoriesSchema;

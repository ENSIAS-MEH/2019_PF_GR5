const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class
const jwt = require("jsonwebtoken");
const config = require("config");

var Schema = mongoose.Schema;

const professionnelSchema = new Schema({
  biographie: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 5000
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    unique: true
  },
  urlImage: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
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
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1000
  },
  review: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  }

  // roles: []
  // operations: []
});

const Professionnel = mongoose.model("Professionnel", professionnelSchema);

professionnelSchema.statics.lookup = function(categoryId) {
  return this.findOne({
    "category._id": categoryId
  });
};

professionnelSchema.methods.genrateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

function validateProfessionnel(professionnel) {
  const schema = {
    address: Joi.string()
      .min(5)
      .max(1000)
      .required(),
    urlImage: Joi.string().uri(),
    phone: Joi.string()
      .min(12)
      .max(20)
      .required(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required(),
    biographie: Joi.string()
      .min(20)
      .max(5000)
      .required(),
    review: Joi.number().required(),
    fee: Joi.number().required(),
    categoryId: Joi.objectId().required()
  };
  return Joi.validate(professionnel, schema);
}

// Role based authorization

module.exports.Professionnel = Professionnel;
module.exports.validateProfessionnel = validateProfessionnel;

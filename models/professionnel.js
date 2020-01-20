const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class
const jwt = require("jsonwebtoken");
const config = require("config");
const { subcategorySchema } = require("./subcategory");

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
  email: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255
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
  subcategory: [
    {
      type: subcategorySchema,
      required: true
    }
  ],
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1000
  }

  // roles: []
  // operations: []
});

userSchema.methods.genrateAuthToken = function() {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};

const Professionnel = mongoose.model("Professionnel", professionnelSchema);

function validateUser(professionnel) {
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
    email: Joi.string()
      .min(5)
      .max(255)
      .email(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required(),
    biographie: Joi.string()
      .min(20)
      .max(5000)
      .required()
  };
  return Joi.validate(professionnel, schema);
}

// Role based authorization

module.exports.Professionnel = Professionnel;
module.exports.validateProfessionnel = validateProfessionnel;

const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class
const jwt = require("jsonwebtoken");
const config = require("config");

var Schema = mongoose.Schema;

const professionnelSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
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
    maxlength: 50
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
    urlImage: Joi.string().uri(),
    phone: Joi.string()
      .min(5)
      .max(50)
      .required(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(professionnel, schema);
}

// Role based authorization

module.exports.Professionnel = Professionnel;
module.exports.validateProfessionnel = validateProfessionnel;

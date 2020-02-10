const mongoose = require("mongoose");
const Joi = require("joi"); // this is a class
const jwt = require("jsonwebtoken");
const config = require("config");

var Schema = mongoose.Schema;

const userSchema = new Schema({
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
  isAdmin: Boolean,
  isProfessionnel: Boolean,
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
  address: {
    type: String,
    required: false,
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

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
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
    address: Joi.string()
      .min(5)
      .max(1000)
  };
  return Joi.validate(user, schema);
}

// Role based authorization

module.exports.User = User;
module.exports.validateUser = validateUser;

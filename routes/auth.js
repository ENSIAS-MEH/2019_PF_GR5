const Joi = require("joi"); // this is a class
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();

// npm i jsonwebtoken

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

  let user = await User.findOne({ phone: req.body.phone }, function(err, user) {
    if (err) {
      return;
    }
    return user;
  });

  if (!user) return res.status(400).send("Invalid phone or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid phone or password.");
  } else {
    // need to return a json web token
    // we genrate a jwt for the client
    // the client send it back too the server
    // header payload(the json object the client sent) digital signature
    // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
    const token = user.genrateAuthToken();
    res.send(token);
  }
});

// the object who has Information Expert Principale

function validateAuth(req) {
  const schema = {
    phone: Joi.string()
      .min(12)
      .max(20)
      .required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;

const {
  Professionnel,
  validateProfessionnel
} = require("../models/professionnel");
const { Category } = require("../models/category");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  Professionnel.find(function(err, professionnels) {
    if (err) {
      return res.status(404).send(err.message);
    }
    res.send(professionnels);
  });
});

router.get("/:id", async (req, res) => {
  Professionnel.findById(req.params.id, function(err, professionnel) {
    if (err) {
      return res
        .status(404)
        .send(`The professional with the id ${req.params.id} was not found`);
    }
    res.send(professionnel);
  });
});

router.post("/", async (req, res) => {
  const { error } = validateProfessionnel(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

  const category = await Category.findById(req.body.categoryId, function(
    err,
    category
  ) {
    if (err) {
      return res
        .status(404)
        .send(`The category with the id ${req.body.categoryId} was not found`);
    }
    return category;
  });

  let professionnel = new Professionnel({
    isProfessionnel: true,
    name: req.body.name,
    description: req.body.description,
    urlImage: req.body.urlImage,
    address: req.body.address,
    biographie: req.body.biographie,
    fee: req.body.fee,
    phone: req.body.phone,
    password: req.body.password,
    review: req.body.review,
    category: {
      _id: category._id,
      name: category.name,
      description: category.description,
      urlImage: category.urlImage
    }
  });
  let user = new User(
    _.pick(professionnel, [
      "name",
      "phone",
      "password",
      "address",
      "isProfessionnel"
    ])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  professionnel.password = user.password;
  professionnel = await professionnel.save();
  res.send(professionnel);
  // const token = jwt.sign({ _id: user._id }, config.get('jwtPrivateKey'));
  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "phone"]));
  // res.send(user);
});

router.put("/:id", async (req, res) => {
  // validate
  // if invalid, return 400 - bad request
  const { error } = validateProfessionnel(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message);

  const category = Category.findById(req.body.categoryId, function(
    err,
    category
  ) {
    if (err) {
      return res
        .status(404)
        .send(`The category with the id ${req.body.categoryId} was not found`);
    }
    return category;
  });

  // look up the professionnel
  // if not existing, return 404 - not found
  // Update professionnel
  await Professionnel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage,
      address: req.body.address,
      biographie: req.body.biographie,
      fee: req.body.fee,
      phone: req.body.phone,
      review: req.body.review,
      category: {
        _id: category._id,
        name: category.name,
        description: category.description,
        urlImage: category.urlImage
      }
    },
    { new: true },
    function(err, professionnel) {
      if (err) {
        if (!professionnel)
          res
            .status(404)
            .send(
              `The professional with the id ${req.params.id} was not found`
            );
      }
      // Return the updated professionnel
      res.send(professionnel);
    }
  );
});

router.delete("/:id", async (req, res) => {
  // look up the professionnel
  // if not existing, return 404 - not found
  await Professionnel.findByIdAndDelete(req.params.id, function(
    err,
    professionnel
  ) {
    if (err) {
      if (!professionnel)
        return res
          .status(404)
          .send(`The professional with the id ${req.params.id} was not found`);
    }
    // return the same professionnel
    res.send(professionnel);
  });
});

module.exports = router;

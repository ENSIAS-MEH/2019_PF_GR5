const { Demand, validateDemand } = require("../models/demand");
const { Professionnel } = require("./models/professionnel");
const { SubCategory } = require("../models/subcategory");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  Demand.find(function(err, demands) {
    if (err) {
      return res.status(404).send(err.message);
    }
    res.send(demands);
  });
});

router.get("/:id", async (req, res) => {
  Demand.findById(req.params.id, function(err, demand) {
    if (err) {
      return res
        .status(404)
        .send(`The professionnel with the id ${req.params.id} was not found`);
    }
    res.send(demand);
  });
});

router.post("/", async (req, res) => {
  const { error } = validateDemand(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

  const subcategory = await SubCategory.findById(
    req.body.subcategoryId,
    function(err, subcategory) {
      if (err) {
        return res
          .status(404)
          .send(
            `The subcategory with the id ${req.body.subcategoryId} was not found`
          );
      }
      return subcategory;
    }
  );

  const user = await User.findById(req.body.userId, function(err, user) {
    if (err) {
      return res
        .status(404)
        .send(`The user with the id ${req.body.userId} was not found`);
    }
    return user;
  });

  const professional = await Professionnel.findById(
    req.body.professionalId,
    function(err, professional) {
      if (err) {
        return res
          .status(404)
          .send(
            `The professional with the id ${req.body.professionalId} was not found`
          );
      }
      return professional;
    }
  );

  let demand = new Demand({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    totalFee: req.body.totalFee,
    totalHours: req.body.totalHours,
    address: req.body.address,
    professional: {
      _id: professional._id,
      name: professional.name,
      phone: professional.phone,
      urlImage: professional.urlImage,
      fee: professional.fee
    },
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone
    },
    subcategory: {
      _id: category._id,
      name: subcategory.name,
      description: subcategory.description,
      urlImage: subcategory.urlImage
    }
  });
  demand = await demand.save();
  res.send(demand);
});

router.put("/:id", async (req, res) => {
  // validate
  // if invalid, return 400 - bad request
  const { error } = validateDemand(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message);

  const subcategory = SubCategory.findById(req.body.subcategoryId, function(
    err,
    subcategory
  ) {
    if (err) {
      return res
        .status(404)
        .send(
          `The subcategory with the id ${req.body.subcategoryId} was not found`
        );
    }
    return subcategory;
  });

  // look up the demand
  // if not existing, return 404 - not found
  // Update demand
  await Demand.findByIdAndUpdate(
    req.params.id,
    {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      totalFee: req.body.totalFee,
      totalHours: req.body.totalHours,
      address: req.body.address,
      professional: {
        _id: professional._id,
        name: professional.name,
        phone: professional.phone,
        urlImage: professional.urlImage
      },
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone
      },
      subcategory: {
        _id: category._id,
        name: subcategory.name,
        description: subcategory.description,
        urlImage: subcategory.urlImage
      }
    },
    { new: true },
    function(err, demand) {
      if (err) {
        if (!demand)
          res
            .status(404)
            .send(`The demand with the id ${req.params.id} was not found`);
      }
      // Return the updated demand
      res.send(demand);
    }
  );
});

router.delete("/:id", async (req, res) => {
  // look up the demand
  // if not existing, return 404 - not found
  await Demand.findByIdAndDelete(req.params.id, function(err, demand) {
    if (err) {
      if (!demand)
        return res
          .status(404)
          .send(`The demand with the id ${req.params.id} was not found`);
    }
    // return the same demand
    res.send(demand);
  });
});

module.exports = router;

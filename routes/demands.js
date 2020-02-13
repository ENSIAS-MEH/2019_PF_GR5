const { Demand, validateDemand } = require("../models/demand");
const { SubCategory } = require("../models/subcategory");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const { Professionnel } = require("../models/professionnel");
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
        .send(`The demand with the id ${req.params.id} was not found`);
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

  const professionnel = await Professionnel.findById(
    req.body.professionnelId,
    function(err, professionnel) {
      if (err) {
        return res
          .status(404)
          .send(
            `The professional with the id ${req.body.professionnelId} was not found`
          );
      }
      return professionnel;
    }
  );

  let demand = new Demand({
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    totalFee: req.body.totalFee,
    totalHours: req.body.totalHours,
    address: req.body.address,
    demandstatus: "In progress",
    professionnel: {
      _id: professionnel._id,
      name: professionnel.name,
      phone: professionnel.phone,
      urlImage: professionnel.urlImage,
      fee: professionnel.fee
    },
    user: {
      _id: user._id,
      name: user.name,
      phone: user.phone
    },
    subcategory: {
      _id: subcategory._id,
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

  const professionnel = await Professionnel.findById(
    req.body.professionnelId,
    function(err, professionnel) {
      if (err) {
        return res
          .status(404)
          .send(
            `The professional with the id ${req.body.professionnelId} was not found`
          );
      }
      return professionnel;
    }
  );

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
      demandstatus: req.body.demandstatus,
      professionnel: {
        _id: professionnel._id,
        name: professionnel.name,
        phone: professionnel.phone,
        urlImage: professionnel.urlImage,
        fee: professionnel.fee
      },
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone
      },
      subcategory: {
        _id: subcategory._id,
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

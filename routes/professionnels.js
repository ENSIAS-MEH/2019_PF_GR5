const {
  Professionnel,
  validateProfessionnel
} = require("../models/professionnel");
const { Category } = require("../models/category");
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
        .send(`The professionnel with the id ${req.params.id} was not found`);
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
  });
  professionnel = await professionnel.save();
  res.send(professionnel);
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
        .send(
          `The professionnel with the id ${req.body.categoryId} was not found`
        );
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
              `The professionnel with the id ${req.params.id} was not found`
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
          .send(`The professionnel with the id ${req.params.id} was not found`);
    }
    // return the same professionnel
    res.send(professionnel);
  });
});

module.exports = router;

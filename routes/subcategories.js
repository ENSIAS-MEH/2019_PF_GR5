const { SubCategory, validateSubCategory } = require("../models/subcategory");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  SubCategory.find(function(err, subcategories) {
    if (err) {
      return res.status(404).send(err.message);
    }
    res.send(subcategories);
  });
});

router.get("/:id", async (req, res) => {
  SubCategory.findById(req.params.id, function(err, subcategory) {
    if (err) {
      return res
        .status(404)
        .send(`The subcategory with the id ${req.params.id} was not found`);
    }
    res.send(subcategory);
  });
});

router.post("/", async (req, res) => {
  const { error } = validateSubCategory(req.body); // ES6 object distructuring feature
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

  let subcategory = new SubCategory({
    name: req.body.name,
    description: req.body.description,
    urlImage: req.body.urlImage,
    category: {
      _id: category._id,
      name: category.name,
      description: category.description,
      urlImage: category.urlImage
    }
  });
  subcategory = await subcategory.save();
  res.send(subcategory);
});

router.put("/:id", async (req, res) => {
  // validate
  // if invalid, return 400 - bad request
  const { error } = validateSubCategory(req.body); // ES6 object distructuring feature
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

  // look up the subcategory
  // if not existing, return 404 - not found
  // Update subcategory
  await SubCategory.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage,
      category: {
        _id: category._id,
        name: category.name,
        description: category.description,
        urlImage: category.urlImage
      }
    },
    { new: true },
    function(err, subcategory) {
      if (err) {
        if (!subcategory)
          res
            .status(404)
            .send(`The subcategory with the id ${req.params.id} was not found`);
      }
      // Return the updated subcategory
      res.send(subcategory);
    }
  );
});

router.delete("/:id", async (req, res) => {
  // look up the subcategory
  // if not existing, return 404 - not found
  await SubCategory.findByIdAndDelete(req.params.id, function(
    err,
    subcategory
  ) {
    if (err) {
      if (!subcategory)
        return res
          .status(404)
          .send(`The subcategory with the id ${req.params.id} was not found`);
    }
    // return the same subcategory
    res.send(subcategory);
  });
});

module.exports = router;

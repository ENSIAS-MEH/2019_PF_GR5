const { Category, validateCategory } = require("../models/category");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res, next) => {
  Category.find(function(err, categories) {
    if (err) {
      // something failed
      // 500 Internal Server Error
      console.log("something failed, 500 Internal Server Error");
      next(err);
    }
    res.send(categories);
  });
});

router.get("/:id", validateObjectId, async (req, res) => {
  // const category = await Category.findById(req.params.id);
  Category.findById(req.params.id, function(err, category) {
    if (err) {
      return res
        .status(404)
        .send(`The category with the id ${req.params.id} was not found`);
    }
    res.send(category);
  });
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCategory(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message); // 400 - bad request

  let category = new Category({
    name: req.body.name,
    description: req.body.description,
    urlImage: req.body.urlImage
  });
  category = await category.save();
  res.send(category);
});

router.put("/:id", validateObjectId, async (req, res) => {
  // validate
  // if invalid, return 400 - bad request
  const { error } = validateCategory(req.body); // ES6 object distructuring feature
  if (error) return res.status(400).send(error.details[0].message);

  // look up the category
  // if not existing, return 404 - not found
  // Update category
  await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      urlImage: req.body.urlImage
    },
    { new: true },
    function(err, category) {
      if (err) {
        if (!category)
          res
            .status()
            .send(`The category with the id ${req.params.id} was not found`);
      }
      // Return the updated category
      res.send(category);
    }
  );
});

// [auth, admin] authentification and authorization middlewares
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  // look up the category
  // if not existing, return 404 - not found
  await Category.findByIdAndDelete(req.params.id, function(err, category) {
    if (err) {
      if (!category)
        return res
          .status(404)
          .send(`The category with the id ${req.params.id} was not found`);
    }
    // return the same category
    res.send(category);
  });
});

module.exports = router;

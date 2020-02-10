const express = require("express");
const categories = require("../routes/categories");
const subcategories = require("../routes/subcategories");
const demands = require("../routes/demands");
const home = require("../routes/home");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const professionals = require("../routes/professionnels");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/categories", categories);
  app.use("/api/subcategories", subcategories);
  app.use("/api/professionals", professionals);
  app.use("/api/demands", demands);
  app.use("/", home);
  app.use(error);
};

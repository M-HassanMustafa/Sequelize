const exjwt = require("express-jwt");
const express = require("express");
const jwt = require("jsonwebtoken");
const process = require("process");

const keys = {
  jwtsecret: process.env.jwtsecret,
};
const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

const router = express.Router();

const product = require("../../controllers/product.controller");

router.post("/products/addProduct", ejwtauth, product.addProduct);
router.get("/products/getProduct/:id", ejwtauth, product.getProductsById);

module.exports = router;

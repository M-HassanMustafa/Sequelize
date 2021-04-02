const db = require("./../db/database");
const process = require("process");
const products = db.product;
const users = db.checkuser;
const { processValidationErrors, APIError } = require("./../helpers/error");
const logger = require("../helpers/logger");
const keys = {
  jwtsecret: process.env.jwtsecret,
};

const addProduct = async (req, res, next) => {
  if ((await products.findOne({ where: { title: req.body.title } })) != null) {
    throw new APIError(400, "Already a product in database with same title");
  }

  const product = {
    title: req.body.title,
    userId: req.body.userId,
    description: req.body.description,
  };

  await products
    .create(product)
    .then((data) => {
      res.sendStatus(data ? 200 : 400);
    })
    .catch((err) => {
      throw new APIError(400, "Some error occurred while creating the user");
    });
};

const getProductsById = async (req, res, next) => {
  const result = await products.findOne({
    include: [{ model: users, attributes: { exclude: ["password"] } }],
  });
  res.send(result);
};

const product = {
  addProduct: addProduct,
  getProductsById: getProductsById,
};

module.exports = product;

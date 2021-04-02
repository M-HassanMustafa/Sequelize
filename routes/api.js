const express = require("express");
const router = express.Router();
const usersRouter = require("./routers/users");
const productsRouter = require("./routers/product");
router.use([usersRouter, productsRouter]);

module.exports = router;

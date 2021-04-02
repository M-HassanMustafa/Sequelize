const logger = require("../helpers/logger");
const process = require("process");
const Sequelize = require("sequelize");

const host = process.env.host;
const user = process.env.user;
const password = process.env.password;
const database = process.env.database;
const dialect = process.env.dialect;
const sequelize = new Sequelize(database, user, password, {
  host: host,
  dialect: dialect,
  operatorsAliases: 0,
  // logging: true,
  define: {
    freezeTableName: true,
  },
});

_connect = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection successful");
  } catch (error) {
    logger.error(err);
    logger.info("Database connection error", error);
  }
};

_connect();
const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  checkuser: require("./../models/Users")(sequelize, Sequelize),
  product: require("./../models/products")(sequelize, Sequelize),
  profile: require("./../models/Profile")(sequelize, Sequelize),
  user_profile: require("./../models/user_profile")(sequelize, Sequelize),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

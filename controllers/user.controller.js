const db = require("./../db/database");
const exjwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const process = require("process");
const seralize_user = db.checkuser;
const profile = db.profile;
const products = db.product;

const { processValidationErrors, APIError } = require("./../helpers/error");
const bcrypt = require("bcrypt");
const logger = require("../helpers/logger");
const keys = {
  jwtsecret: process.env.jwtsecret,
};
const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

var admin = require("firebase-admin");

var serviceAccount = require("./../pushnotification-7e94f-firebase-adminsdk-62t5n-904c164585.json");
// const { product } = require("./../db/database");
// const { profile } = require("./../db/database");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const createUser = async (req, res, next) => {
  if (!req.body.email) {
    throw new APIError("400", "Email cant be empty");
  }

  //check if email already present in database
  if (
    (await seralize_user.findOne({ where: { email: req.body.email } })) != null
  ) {
    logger.error("Already a user with this email");
    throw new APIError(409, "already a user with this email");
  }

  //   Save new User in database in the database
  let created_user = await seralize_user.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    email: req.body.email,
  });

  let created_profile = await profile.create({
    title: req.body.title,
    description: req.body.description,
  });

  await created_user
    .addProfile(created_profile)
    .then((resu) => {
      res.sendStatus(resu ? 200 : 400);
    })
    .catch((err) => {
      console.log(err);
    });
};

const addProfilePictureInDb = async (req, res, next) => {
  if (
    (await seralize_user.findOne({ where: { email: req.body.email } })) == null
  ) {
    logger.error(
      "there is no user with this email call from addprofilePicture"
    );
    res.send("there is no user with this email");
    return;
  }
  seralize_user
    .update(
      { url: req.file.filename },
      {
        where: { email: req.body.email },
      }
    )
    .then((data) => {
      res.sendStatus(data ? 200 : 400);
    })
    .catch((err) => {
      logger.error(
        "Some error occurred while updating the url of profile picture"
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

const login = async (req, res, next) => {
  const user = await seralize_user.findOne({
    where: { email: req.body.email },
  });

  if (user == null) {
    throw new APIError(400, "Invalid Email and password");
  }

  if (bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      keys.jwtsecret
    );
    res.send(token);
  } else {
    throw new APIError(400, "Invalid Email or password");
  }
};

const getAllUsers = async (req, res, next) => {
  const user = await seralize_user.findAll({});

  res.send(user);
};
const generateNotification = async (req, res, next) => {
  var payload = {
    notification: {
      title: req.body.title,
      body: req.body.description,
    },
  };

  var options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(process.env.fcm_token, payload, options)
    .then(function (response) {
      console.log("Successfully sent message:", response);
      res.send(response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
};

const getAllUsersWithProfiles = async (req, res, next) => {
  const result = await seralize_user.findAll({
    attributes: { exclude: ["password"] },
    include: [{ model: profile, as: "profile" }],
  });
  res.send(result);
};

const addNewProfile = async (req, res, next) => {
  const requested_user = await seralize_user.findOne({ email: req.body.email });
  const new_profile = await profile.create({
    title: req.body.title,
    description: req.body.description,
  });

  await requested_user
    .addProfile(new_profile)
    .then((resu) => {
      res.sendStatus(resu ? 200 : 400);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getUserProfileById = async (req, res, next) => {
  const result = await seralize_user.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["password"] },
    include: [
      { model: profile, as: "profile", where: { id: req.params.profileId } },
    ],
  });
  res.send(result);
};

const getUserInfoByUserId = async (req, res, next) => {
  const result = await seralize_user.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["password"] },
    include: [{ model: profile, as: "profile" }],
  });

  res.send(result);
};

const getUserProductsById = async (req, res, next) => {
  const result = await seralize_user.findOne({
    where: { id: req.params.id },
    attributes: { exclude: ["password"] },
    include: [{ model: products, as: "userProducts" }],
  });
  res.send(result);
};
const user = {
  create: createUser,
  addProfilePictureInDb: addProfilePictureInDb,
  login: login,
  getAllUsers: getAllUsers,
  generateNotification: generateNotification,
  getAllUsersWithProfiles: getAllUsersWithProfiles,
  addNewProfile: addNewProfile,
  getUserProfileById: getUserProfileById,
  getUserInfoByUserId: getUserInfoByUserId,
  getUserProductsById: getUserProductsById,
};

module.exports = user;

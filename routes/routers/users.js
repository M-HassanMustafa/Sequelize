const exjwt = require("express-jwt");
const express = require("express");
const jwt = require("jsonwebtoken");
const process = require("process");
const keys = {
  jwtsecret: process.env.jwtsecret,
};
const ejwtauth = exjwt({ secret: keys.jwtsecret, algorithms: ["HS256"] });

const router = express.Router();
const { param, body } = require("express-validator");
const user = require("../../controllers/user.controller");
const fs = require("fs");
const multer = require("multer");
const uuid = require("uuid").v4;
storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/Images/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuid() + "-" + fileName);
  },
});

upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post(
  "/user/register",
  body(
    "username",
    "Username is required and only alpha numeric characters are allowed"
  ).isAlphanumeric(),
  body("email", "Email is required").isEmail().normalizeEmail(),
  body(
    "pswd",
    "Password is required, must contain atleast 6 characters, and must be a string."
  )
    .isLength({ min: 6 })
    .isString(),
  user.create
);

router.post(
  "/user/addProfilePicture",
  upload.single("uploaded_image"),
  user.addProfilePictureInDb
);

router.post("/user/login", user.login);

router.get(
  "/user/getAllUsers",
  ejwtauth, // added middleware
  user.getAllUsers
);

router.get("/user/getAllUsersProfiles", ejwtauth, user.getAllUsersWithProfiles);

router.post("/users/sendNotification", ejwtauth, user.generateNotification);

router.post("/user/addNewProfile", ejwtauth, user.addNewProfile);
router.get(
  "/user/getUserProfileById/:id/:profileId",
  ejwtauth,
  user.getUserProfileById
);

router.get("/user/info/:id", ejwtauth, user.getUserInfoByUserId);
router.get("/user/getAllProducts/:id", ejwtauth, user.getUserProductsById);

module.exports = router;

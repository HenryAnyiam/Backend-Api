const express = require("express");
const userController = require("../controllers/user.controller");
const upload = require("../middleware/storage.middleware");
const verifyToken = require("../middleware/auth.middleware");

const route = express.Router();

route.get("/all", userController.getUsers);
route.get("/", userController.getUser);
route.post("/new", upload.single("picture"), userController.createUser);
route.post("/login", userController.loginUser);

module.exports = route;

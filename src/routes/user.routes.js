const express = require("express");
const userController = require("../controllers/user.controller");

const route = express.Router();

route.get("/all", userController.getUser);

module.exports = route;

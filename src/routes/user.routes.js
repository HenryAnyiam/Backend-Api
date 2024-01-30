const express = require("express");
const userController = require("../controllers/user.controller");

const route = express.Router();

route.get("/", userController.getUser);
route.post("/new", userController.createUser);
route.post("/login", userController.loginUser);

module.exports = route;

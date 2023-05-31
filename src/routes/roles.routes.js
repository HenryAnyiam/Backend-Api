const express = require("express");
const rolesController = require("../controllers/roles.controller");

const route = express.Router();

route.get("/", rolesController.getRoles);

module.exports = route;

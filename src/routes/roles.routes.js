const express = require("express");
const rolesController = require("../controllers/roles.controller");

const route = express.Router();

route.get("/", rolesController.getRoles);
route.post("/new", rolesController.createRole);

module.exports = route;

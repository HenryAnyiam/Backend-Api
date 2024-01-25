const express = require("express");
const parishController = require("../controllers/parish.controler");

const route = express.Router();

route.get("/", parishController.getParishes);
route.get("/:parishId/users", parishController.getUsers)
route.post("/new", parishController.createParish);

module.exports = route;

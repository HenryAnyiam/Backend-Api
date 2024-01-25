const express = require("express");
const parishController = require("../controllers/parish.controler");

const route = express.Router();

route.get("/", parishController.getParishes);
route.post("/new", parishController.createParish);

module.exports = route;

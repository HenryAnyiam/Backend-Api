const express = require("express");
const deaneryController = require("../controllers/deanery.controller");

const route = express.Router();

route.get("/", deaneryController.getDeaneries);
route.get("/:deaneryId/parishes", deaneryController.getParishes);
route.get("/:deaneryId/users", deaneryController.getUsers)
route.post("/new", deaneryController.createDeanery);

module.exports = route;

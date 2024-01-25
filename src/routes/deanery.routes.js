const express = require("express");
const deaneryController = require("../controllers/deanery.controller");

const route = express.Router();

route.get("/", deaneryController.getDeaneries);
route.post("/new", deaneryController.createDeanery);

module.exports = route;

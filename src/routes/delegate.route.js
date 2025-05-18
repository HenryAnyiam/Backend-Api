const express = require("express");
const delegateController = require("../controllers/delegate.controller");

const route = express.Router();

route.get("/", delegateController.getDelegates);
route.post("/new", delegateController.createDelegate);

module.exports = route;

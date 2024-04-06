const express = require("express");
const parishController = require("../controllers/parish.controller");

const route = express.Router();

route.get("/", parishController.getParishes);
route.get("/:parishId", parishController.getParish);
route.get("/paid-parishes", parishController.getPaidParishes);
route.put("/switch-paid", parishController.switchPaid);
route.put("/:parishId", parishController.updateParish)
route.get("/:parishId/users", parishController.getUsers);
route.post("/new", parishController.createParish);

module.exports = route;

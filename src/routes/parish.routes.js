const express = require("express");
const parishController = require("../controllers/parish.controller");
const verifyToken = require("../middleware/auth.middleware");

const route = express.Router();

route.get("/", parishController.getParishes);
route.get("/:parishId", parishController.getParish);
route.get("/paid-parishes", parishController.getPaidParishes);
route.put("/switch-paid", verifyToken, parishController.switchPaid);
route.put("/:parishId", verifyToken, parishController.updateParish)
route.get("/:parishId/users", parishController.getUsers);
route.post("/new", verifyToken, parishController.createParish);

module.exports = route;

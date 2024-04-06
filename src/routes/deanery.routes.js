const express = require("express");
const deaneryController = require("../controllers/deanery.controller");
const upload = require("../middleware/storage.middleware");

const route = express.Router();

route.get("/", deaneryController.getDeaneries);
route.get("/:deaneryId", deaneryController.getDeanery);
route.put("/:deaneryId", upload.single('banner'), deaneryController.updateDeanery);
route.get("/:deaneryId/parishes", deaneryController.getParishes);
route.get("/:deaneryId/paid-parishes", deaneryController.getPaidParishes);
route.get("/:deaneryId/users", deaneryController.getUsers)
route.post("/new", upload.single('banner'), deaneryController.createDeanery);
route.get("/:deaneryId/events", deaneryController.getEvents);
route.get("/:deaneryId/executives", deaneryController.getExecutives);

module.exports = route;

const express = require("express");
const eventController = require("../controllers/event.controller");
const upload = require("../middleware/storage.middleware");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();


router.get("/all", eventController.getEvents);
router.post("/new", upload.single("bannerImage"), verifyToken, eventController.createEvent);
router.get("/adcEvents", eventController.getAdcEvents);
router.put("/:eventId", upload.single("bannerImage"), verifyToken, eventController.updateEvent);

module.exports = router;

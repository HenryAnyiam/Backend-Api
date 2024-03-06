const express = require("express");
const eventController = require("../controllers/event.controller");
const upload = require("../middleware/storage.middleware");

const router = express.Router();


router.get("/all", eventController.getEvents);
router.post("/new", upload.single("bannerImage"), eventController.createEvent);
router.get("/adcEvents", eventController.getAdcEvents);

module.exports = router;

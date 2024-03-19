const express = require("express");
const executiveController = require("../controllers/executive.controller");
const upload = require("../middleware/storage.middleware");

const router = express.Router();


router.get("/all", executiveController.getExecutives);
router.post("/new", upload.single("picture"), executiveController.createExecutive);
router.get("/adcExecutives", executiveController.getAdcExecutives);

module.exports = router;

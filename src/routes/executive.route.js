const express = require("express");
const executiveController = require("../controllers/executive.controller");
const upload = require("../middleware/storage.middleware");
const verifyToken = require("../middleware/auth.middleware");

const router = express.Router();


router.get("/all", executiveController.getExecutives);
router.post("/new", upload.single("picture"), verifyToken, executiveController.createExecutive);
router.get("/adcExecutives", executiveController.getAdcExecutives);
router.put("/:executiveId", upload.single("picture"), verifyToken, executiveController.updateExecutive);

module.exports = router;

const express = require("express");
const aydController = require("../controllers/ayd.controller");
const upload = require("../middleware/storage.middleware");
const verifyToken = require("../middleware/auth.middleware");

const route = express.Router();

route.get("/", aydController.getAyds);
route.post("/new", upload.single("bannerImage"), aydController.createAyd);
route.get("/currentAyd", aydController.getCurrentAyd);
route.get("/:aydId", aydController.getAyd);
route.put(
  "/:aydId",
  upload.single("bannerImage"),
  verifyToken,
  aydController.updateAyd
);

module.exports = route;

const express = require("express");
const userController = require("../controllers/user.controller");
const upload = require("../middleware/storage.middleware");

const route = express.Router();

route.get("/", userController.getUsers);
// route.get("/:userId",);
// route.put("/:userId",);
// route.delete(":/userId");
route.post("/new", upload.single('image'), userController.createUser);
route.post("/login", userController.loginUser);

module.exports = route;

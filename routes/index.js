const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

const users = require("./users");

console.log("Router Loaded!");

router.get("/", homeController.home);
router.use("/users", users);

module.exports = router;

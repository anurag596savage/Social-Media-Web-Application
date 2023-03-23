const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

const users = require("./users");
const posts = require("./posts");
const comments = require("./comments");

console.log("Router Loaded!");

router.get("/", homeController.home);
router.use("/users", users);
router.use("/posts", posts);
router.use("/comments", comments);

module.exports = router;

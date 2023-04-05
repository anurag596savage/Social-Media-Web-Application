const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home_controller");

const users = require("./users");
const posts = require("./posts");
const comments = require("./comments");
const likes = require("./likes");
const friends = require("./friends");
const api = require("./api");

console.log("Router Loaded!");

router.get("/", homeController.home);
router.use("/users", users);
router.use("/posts", posts);
router.use("/comments", comments);
router.use("/likes", likes);
router.use("/friends", friends);
router.use("/api", api);

module.exports = router;

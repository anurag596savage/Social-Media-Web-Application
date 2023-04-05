const express = require("express");
const router = express.Router();
const posts = require("./posts");
const users = require("./users");

router.use("/posts", posts);
router.use("/users", users);

module.exports = router;

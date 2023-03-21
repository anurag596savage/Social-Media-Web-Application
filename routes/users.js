const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocal = require("../config/passport-local-strategy");

const usersController = require("../controllers/users_controller");

router.get("/profile", passport.checkAuthentication, usersController.profile);

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

router.post("/create", usersController.create);

// use passport to authenticate as a middleware
router.post(
  "/create-session",
  passport.authenticate("local", {
    failureRedirect: "/users/sign-in",
  }),
  usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

module.exports = router;

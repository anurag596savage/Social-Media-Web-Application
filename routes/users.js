const { response } = require("express");
const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportLocal = require("../config/passport-local-strategy");

const usersController = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);

router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);
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

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/reset-password", usersController.resetPassword);

router.get("/reset-password/:token", usersController.newPassword);

router.post("/reset-password/:token", usersController.changePassword);

module.exports = router;

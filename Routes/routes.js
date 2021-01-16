const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send(req.user);
});

module.exports = router;

require("express-async-errors");
const express = require("express");
const winston = require("winston");
const cors = require("cors");
const mongoose = require("mongoose");
const cookie = require("cookie-session");
const passport = require("passport");

const app = express();

const keys = require("./Config/keys");
const routes = require("./Routes/routes");
const passportSetup = require("./Config/passport");

app.get("/", async (req, res) => {
  res.send("Welcome to my OAuth");
});

mongoose
  .connect(keys.mongoURI)
  .then(() => console.log("Connected to OAuth DB"))
  .catch(err => console.log("Error while connecting DB", err));

const port = process.env.PORT || 1000;

const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}`);
});

app.use(express.json());
app.use(cors());
app.use(
  cookie({
    maxAge: 24 * 60 * 60 * 1000,
    keys: keys.session.cookie
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/OAuth", routes);

module.exports = server;

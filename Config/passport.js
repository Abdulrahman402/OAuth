const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");

const User = require("../Models/model");
const keys = require("./keys");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ _id: id }).then(user => {
    done(null, user);
  });
});

passport.use(
  new googleStrategy(
    {
      callbackURL: "/OAuth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          console.log("user is: " + currentUser);
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id
          })
            .save()
            .then(newUser => {
              console.log("new User created: " + newUser);
              done(null, newUser);
            });
        }
      });

      console.log("callback fired");
    }
  )
);

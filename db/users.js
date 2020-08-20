require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

const nuggets = require("./nuggets")

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// const GoogleStrategy = require("passport-google-oauth20").Strategy;

const findOrCreate = require("mongoose-findorcreate");

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
  nuggets: nuggets.myNuggetSchema
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});





const userRouter = express.Router();

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/secrets");
  }
);

userRouter.get("/userNuggets/:id", function(req, res) {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      return res.status(200).json({ success: true, data: user.nuggets });
    }
  }).catch(err => console.log(err));
});

userRouter.post("/userNuggets/:id", function(req, res) {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Nugget"
    });
  }
  const nugget = new Nugget(body);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getDate() +
    " " +
    months[current_datetime.getMonth()] +
    " " +
    current_datetime.getFullYear();
  nugget.date = formatted_date;
  if (!nugget) {
    return res.status(400).json({ success: false, error: err });
  }
  User.findOne({ _id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "User not found!"
      });
    }
    user.nuggets.push(nugget);
    user
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: nugget._id,
          date: nugget.date,
          message: "User's nuggets updated!"
        });
      })
      .catch(error => {
        return res.status(404).json({
          error,
          message: "User's nuggets not updated!"
        });
      });
  });
});

userRouter.put("/userNuggets/:id", function(req, res) {
  const { title, content, _id } = req.body;
  userId = req.params.id;
  User.findOneAndUpdate(
    { _id: req.params.id, "nuggets._id": _id },
    { $set: { "nuggets.$.title": title, "nuggets.$.content": content } },
    function(err, user) {
      user
        .save()
        .then(() => {
          return res.status(200).json({
            success: true,
            message: "User nugget updated!"
          });
        })
        .catch(error => {
          return res.status(404).json({
            error,
            message: "User nugget not updated!"
          });
        });
    }
  );
});

userRouter.post("/deleteUserNugget/:id", function(req, res) {
  const nuggetId = req.body.nuggetId;
  User.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { nuggets: { _id: nuggetId } } },
    function(err, foundNuggets) {
      if (err) {
        console.log(err);
      }
    }
  );
});

userRouter.post("/register", function(req, res) {
  User.register({ username: req.body.username }, req.body.password, function(
    err,
    user
  ) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log("success with id: " + req.user._id);
        res.json({ id: req.user._id });
      });
    }
  });
});

userRouter.post("/login", function(req, res) {
  const body = req.body;
  const user = new User(body);
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        console.log("authenticated");
        res.json({ id: req.user._id });
      });
    }
  });
});

userRouter.get("/logout", function(req, res) {
  req.logout();
  return res.status(200).json({ success: true });
});

userRouter.get("/checkAuthentication", function(req, res) {
  const authenticated = req.isAuthenticated();
  res.status(200).json({ authenticated });
  console.log(authenticated);
});



module.exports = userRouter;

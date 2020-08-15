require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3001;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { db, router, myNuggetSchema, Nugget } = require("./db/nuggets");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const findOrCreate = require("mongoose-findorcreate");

const app = express();
app.use(express.static(__dirname + "/build"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

db.on("error", console.error.bind(console, "Mongo DB connection error: "));
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  nuggets: [myNuggetSchema]
});

const options = {
  errorMessages: {
    MissingPasswordError: "No password was given",
    AttemptTooSoonError: "This account is currently locked. Please try again later",
    TooManyAttemptsError:
      "This account was locked due to too many failed login attempts",
    NoSaltValueStoredError: "Authentication was not possible. No salt value stored",
    IncorrectPasswordError: "The username or password is incorrect :(",
    IncorrectUsernameError: "The username or password is incorrect :(",
    MissingUsernameError: "No username was given",
    UserExistsError: "A user with the given username is already registered"
  }
};

userSchema.plugin(passportLocalMongoose, options);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3001/user/auth/google/nugget",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);

const userRouter = express.Router();

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

userRouter.get(
  "/auth/google/nugget",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login"
  }),
  function(req, res) {
    res.redirect("http://localhost:3000/");
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
  const { title, color, content, _id } = req.body;
  userId = req.params.id;
  User.findOneAndUpdate(
    { _id: req.params.id, "nuggets._id": _id },
    { $set: { "nuggets.$.title": title, "nuggets.$.content": content, "nuggets.$.color": color } },
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
      console.log("error message is: " + err);
      res.json({ error: err });
    } else {
      passport.authenticate("local")(req, res, function() {
        res.json({ id: req.user._id });
      });
    }
  });
});

userRouter.post("/login", function(req, res, next) {
  const body = req.body;
  const user = new User(body);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.login(user, err => {
        if (err) {
          return next(err);
        }
        res.json({ id: req.user._id });
      });
    } else {
      console.log("Error logging in");
      res.json({ error: info.message });
    }
  })(req, res, next);
});

userRouter.get("/logout", function(req, res) {
  req.logout();
  return res.status(200).json({ success: true });
});

userRouter.get("/checkAuthentication", function(req, res) {
  const authenticated = req.isAuthenticated();
  if (authenticated === true) {
    res.status(200).json({ authenticated, id: req.user._id });
  } else {
    res.status(200).json({ authenticated });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.use("/api", router);

app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

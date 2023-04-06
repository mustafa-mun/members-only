const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { body, validationResult } = require("express-validator");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        // passwords match! log user in
        return done(null, user);
      } else {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

exports.get_sign_up = (req, res, next) => {
  res.render("signup", { title: "Sign Up" });
};
exports.post_sign_up = [
  // Validate fields
  body("username", "Username needs to be between 4 and 16 characters!")
    .isLength({ min: 4, max: 16 })
    .escape(),
  body("password", "Password needs to be at least 5 characters!").isLength({
    min: 4,
  }),
  body("confirm-password", "Passwords do not match!").custom(
    (value, { req }) => value === req.body.password
  ),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Render signup form again
      res.render("signup", { title: "Sign Up", errors: errors.array() });
    } else {
      // Form data is valid
      try {
        const user = new User({
          username: req.body.username,
          password: req.body.password,
        });
        bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
          if (err) return next(err);
          const hashedUser = new User({
            username: req.body.username,
            password: hashedPassword,
          });
          await hashedUser.save();
          res.redirect("/");
        });
      } catch (error) {
        return next(error);
      }
    }
  },
];

exports.get_login = (req, res, next) => {
  res.render("login", { title: "Log In" });
};

exports.post_login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render("login", { title: "Log In", error: "Username or Password is wrong!" });
      return;
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.get_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

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
    min: 5,
  }),
  body("confirm-password", "Passwords do not match!").custom(
    (value, { req }) => value === req.body.password
  ),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render signup form again
      res.render("signup", { title: "Sign Up", errors: errors.array() });
    } else {
      // Form data is valid
      try {
        // Hash the password and save user on database
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) return next(err);
          const hashedUser = new User({
            username: req.body.username,
            password: hashedPassword,
          });
          try {
            // Save the server on database and redirect the user to log-in page
            await hashedUser.save();
            res.redirect("/home/log-in");
          } catch (error) {
            // Handle the existing username error
            if (error.code === 11000 && error.keyValue.username) {
              // redirect to the signup page with an error message
              const errors = ["Username already exists!"];
              res.render("signup", { title: "Sign Up", errors });
            } else {
              return next(error);
            }
          }
        });
      } catch (error) {
        return next(error);
      }
    }
  },
];

exports.get_login = (req, res) => {
  res.render("login", { title: "Log In" });
};

exports.post_login = (req, res, next) => {
  // Authenticate the user
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // User is not found
      res.render("login", {
        title: "Log In",
        error: "Username or Password is wrong!",
      });
      return;
    }
    req.logIn(user, (err) => {
      // Log in and redirect user to home page
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

// Log out
exports.get_logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

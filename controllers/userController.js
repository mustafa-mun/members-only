const User = require("../models/user");
const { body, validationResult } = require("express-validator");

exports.get_become_member = (req, res) => {
  // Check if user logged in
  if (req.user) {
    res.render("member", { title: "Enter member passcode", user: req.user });
  } else {
    // User is not logged in yet, redirect to log in page
    res.redirect("/home/log-in");
  }
};

exports.post_become_member = [
  body("password", "Member password is not correct!").equals(
    process.env.MEMBER_PASSCODE
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors render the page again
      res.render("member", {
        title: "Enter member passcode",
        user: req.user,
        errors: errors.array(),
      });
    } else {
      // Passcode is true, make user a member and redirect
      async function updateField() {
        try {
          await User.findByIdAndUpdate(
            req.user._id,
            { is_member: true },
            { new: true }
          );
        } catch (error) {
          return next(error);
        }
      }
      updateField().then(() => res.redirect("/"));
    }
  },
];

exports.get_become_admin = (req, res) => {
  // Check if user logged in
  if (req.user) {
    res.render("admin", { title: "Enter admin passcode", user: req.user });
  } else {
    // User is not logged in yet, redirect to log in page
    res.redirect("/home/log-in");
  }
};

exports.post_become_admin = [
  body("password", "Admin passcode is not correct!").equals(
    process.env.ADMIN_PASSCODE
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render the page again with errors
      res.render("admin", {
        title: "Enter admin passcode",
        user: req.user,
        errors: errors.array(),
      });
    } else {
      // Passcode is correct, check if user is a member
      if (req.user.is_member) {
        // User is member, make user admin and redirect
        async function updateField() {
          try {
            await User.findByIdAndUpdate(
              req.user._id,
              { is_admin: true },
              { new: true }
            );
          } catch (error) {
            return next(error);
          }
        }
        updateField().then(() => res.redirect("/"));
      } else {
        // User is not a member, render the becoming member page again
        const errors = ["You are not a member you can't be an admin!"];
        res.render("member", {
          title: "Become member first!",
          user: req.user,
          errors: errors,
        });
      }
    }
  },
];

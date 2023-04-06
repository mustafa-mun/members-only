const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");

exports.get_become_member = (req, res, next) => {
  res.render("member", { title: "Enter member passcode", user: req.user });
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

exports.get_become_admin = (req, res, next) => {
  res.send("become admin get");
};

exports.post_become_admin = (req, res, next) => {
  res.send("become admin post");
};

exports.get_create_message = (req, res, next) => {
  res.send("become create message get");
};

exports.post_create_message = (req, res, next) => {
  res.send("become create message post");
};

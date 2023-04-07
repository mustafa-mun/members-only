const User = require("../models/user");
const Message = require("../models/messages");
const crudFunction = require("../controllers/crudFunctions");
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

exports.get_create_message = (req, res) => {
  // Check if user is logged in
  if (req.user) {
    res.render("message", { title: "Create Message", user: req.user });
  } else {
    // User is not logged in yet, redirect to log in page
    res.redirect("/home/log-in");
  }
};

exports.post_create_message = [
  body("title", "Title needs to be minimum 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("message_body", "Message needs to be minimum 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors
      res.render("message", {
        title: "Create Message",
        user: req.user,
        errors: errors.array(),
      });
      return;
    }
    // Data is valid

    // Create new message with the data
    const message = new Message({
      author: req.user._id,
      title: req.body.title,
      message_body: req.body.message_body,
      timestamp: Date.now(),
    });

    try {
      // Save message on database
      const result = await message.save();
      const user = await User.findOne({ _id: req.user._id });
      // Push message to users messages field
      user.messages.push(result);
      await user.save();
      res.redirect("/home");
    } catch (error) {
      return next(error);
    }
  },
];

exports.delete_message_get = (req, res, next) => {
  // Check if user is logged in
  if (req.user) {
    // User is logged in, check if user is an admin
    if (req.user.is_admin) {
      // User is admin, render the delete post page
      res.render("delete", { title: "Delete Post", user: req.user });
    } else {
      // User is not an admin, redirect to become admin page
      res.redirect("/home/become-admin");
    }
  } else {
    // User is not logged in, redirect to login page
    res.redirect("/home/log-in");
  }
};

exports.delete_message_post = [
  body("confirm-action", "To confirm your action, type DELETE").equals(
    "DELETE"
  ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors, render the page again with errors
      res.render("delete", {
        title: "Delete  Post",
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      // Action confirmed, delete the post and redirect the user
      crudFunction
        .deleteDocument(Message, req.params.id, next)
        .then(() => res.redirect("/home"));
    }
  },
];

const User = require("../models/user");
const Message = require("../models/message");

/* HOME PAGE */
exports.index = (req, res, next) => {
  res.render("index", { title: "Members Only", user: req.user });
};

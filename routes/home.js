const express = require("express");
const router = express.Router();

const userContoller = require("../controllers/userController");
const messageContoller = require("../controllers/messageController");
const authController = require("../controllers/authController");

/* HOME PAGE */
router.get("/", (req, res) => {
  res.render("index", { title: "Members Only", user: req.user });
});

// SIGN UP REQUESTS
router.get("/sign-up", authController.get_sign_up);
router.post("/sign-up", authController.post_sign_up);

// LOG IN REQUESTS
router.get("/log-in", authController.get_login);
router.post("/log-in", authController.post_login);

router.get("/log-out", authController.get_logout);

module.exports = router;

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

// LOG IN/OUT REQUESTS
router.get("/log-in", authController.get_login);
router.post("/log-in", authController.post_login);

router.get("/log-out", authController.get_logout);

// USER PERMISSON REQUESTS
router.get("/become-member", userContoller.get_become_member);
router.post("/become-member", userContoller.post_become_member);

router.get("/become-admin", userContoller.get_become_admin);
router.post("/become-admin", userContoller.post_become_admin);

// USER MESSAGE REQUESTS
router.get("/create-message", userContoller.get_create_message);
router.post("/create-message", userContoller.post_create_message);

module.exports = router;

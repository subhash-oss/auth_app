const express = require("express");
const router = express.Router();
const {login, profile } = require("../controllers/authController");
const authController = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", login);
router.get("/profile", auth, profile);

module.exports = router;